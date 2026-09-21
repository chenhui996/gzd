import { useCallback, useEffect, useMemo, useRef } from "react";
import type {
  AutoSizeStrategy,
  ColDef,
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
  IsFullWidthRow,
} from "ag-grid-community";
import Alert from "../../../../components/alert";
import Table from "../../../../components/table";
import { EMPTY_TABLE_CELL_PLACEHOLDER, MULTIPLE_GRID_ROWS } from "../constants";
import type { ContractCalculationState, IndicativePricingContract } from "../types";
import styles from "../style.module.less";
import {
  ContractValue,
  ResultValue,
} from "./grid-shared";
import { contractFieldValue, formatResultValue } from "./grid-utils";

interface FixedRow {
  id: "contract" | "error";
  kind: "contract" | "error";
  instrumentCode?: string;
  scrtyCode?: string;
  fwdMaturityDate?: string;
  settleDate?: string;
  physicalDelivery?: string;
  direction?: string;
  fwdDlvPrice?: string;
  npv?: string;
  forwardPrice?: string;
  discountFactor?: string;
}

const RESULT_KEYS = ["npv", "forwardPrice", "discountFactor"] as const;
// 表头参与内容测量，宽容器下优先完整展示；最大宽度用于限制异常长内容并触发省略 Tooltip。
const FIXED_GRID_AUTO_SIZE_STRATEGY: AutoSizeStrategy = {
  type: "fitCellContents",
  skipHeader: false,
  scaleUpToFitGridWidth: true,
  defaultMinWidth: 112,
  defaultMaxWidth: 240,
  columnLimits: [
    { colId: "npv", minWidth: 190, maxWidth: 220 },
    { colId: "forwardPrice", minWidth: 220, maxWidth: 260 },
    { colId: "discountFactor", minWidth: 150, maxWidth: 190 },
  ],
};

// Full-width 行不会生成各列单元格，避免错误文案被归入首列参与内容自动测宽。
const isErrorFullWidthRow: IsFullWidthRow<FixedRow> = ({ rowNode }) =>
  rowNode.data?.kind === "error";

function ErrorFullWidthRenderer({ data }: ICellRendererParams<FixedRow>) {
  const errorMessage = String(data?.instrumentCode ?? "定价计算失败");
  return (
    <Alert
      className={styles.gridErrorAlert}
      classNames={{
        icon: styles.gridErrorIcon,
        section: styles.gridErrorSection,
      }}
      type="error"
      showIcon
      title={
        <span className={styles.gridErrorMessage} title={errorMessage}>
          计算失败，失败原因：{errorMessage}
        </span>
      }
    />
  );
}

export interface FixedSingleResultGridProps {
  contract: IndicativePricingContract;
  calculation: ContractCalculationState | undefined;
  loading: boolean;
}

export default function FixedSingleResultGrid({ contract, calculation, loading }: FixedSingleResultGridProps) {
  const apiRef = useRef<GridApi<FixedRow> | null>(null);
  const errorRowRef = useRef<FixedRow | null>(null);
  const rowData = useMemo<FixedRow[]>(
    () => [
      {
        id: "contract",
        kind: "contract",
        ...Object.fromEntries(
          MULTIPLE_GRID_ROWS.map((field) => [
            field.key,
            field.kind === "contract"
              ? contractFieldValue(contract, field.key)
              : EMPTY_TABLE_CELL_PLACEHOLDER,
          ]),
        ),
      },
    ],
    [contract],
  );

  const columnDefs = useMemo<ColDef<FixedRow>[]>(
    () =>
      MULTIPLE_GRID_ROWS.map((field) => ({
        field: field.key,
        colId: field.key,
        headerName: field.label,
        headerTooltip: field.label,
        width: field.kind === "result" ? 148 : 128,
        minWidth: field.kind === "result" ? 148 : 112,
        sortable: false,
        resizable: false,
        suppressMovable: true,
        cellRenderer: (params: ICellRendererParams<FixedRow>) => {
          if (field.kind === "result") {
            return <ResultValue value={String(params.value ?? EMPTY_TABLE_CELL_PLACEHOLDER)} />;
          }
          return (
            <ContractValue
              field={field.key}
              value={String(params.value ?? EMPTY_TABLE_CELL_PLACEHOLDER)}
            />
          );
        },
      })),
    [],
  );

  const applyCalculation = useCallback(
    (api: GridApi<FixedRow>) => {
      const node = api.getRowNode("contract");
      const nextRow = node?.data ? { ...node.data } : null;
      RESULT_KEYS.forEach((key) => {
        const value = calculation?.status === "success"
            ? formatResultValue(calculation.result, key, contract.currency)
            : EMPTY_TABLE_CELL_PLACEHOLDER;
        node?.setDataValue(key, value);
        if (nextRow) nextRow[key] = value;
      });
      if (node && nextRow) node.setData(nextRow);
      if (errorRowRef.current) {
        api.applyTransaction({ remove: [errorRowRef.current] });
        errorRowRef.current = null;
      }
      if (calculation?.status === "error") {
        const errorRow: FixedRow = {
          id: "error",
          kind: "error",
          instrumentCode: calculation.message ?? "定价计算失败",
        };
        api.applyTransaction({ add: [errorRow] });
        errorRowRef.current = errorRow;
      }
      api.resetRowHeights();
    },
    [calculation, contract.currency],
  );

  useEffect(() => {
    if (apiRef.current) applyCalculation(apiRef.current);
  }, [applyCalculation]);

  const onGridReady = (event: GridReadyEvent<FixedRow>) => {
    apiRef.current = event.api;
    applyCalculation(event.api);
  };

  return (
    <div className={styles.fixedGrid} aria-label="单笔合约定价结果">
      <Table<FixedRow>
        /* 表格的数据源；单合约模式默认包含一条合约结果行。 */
        rowData={rowData}
        /* 定义字段、列宽和单元格渲染方式。 */
        columnDefs={columnDefs}
        /* Grid 初始化完成后保存 API，并同步当前计算结果。 */
        onGridReady={onGridReady}
        /* 使用业务行 ID 保证结果更新和错误行增删时能稳定定位行。 */
        getRowId={(params) => params.data.id}
        /* 将错误数据行识别为跨越全部列的 full-width 行。 */
        isFullWidthRow={isErrorFullWidthRow}
        /* 使用错误提示组件渲染 full-width 错误行。 */
        fullWidthCellRenderer={ErrorFullWidthRenderer}
        /* 错误提示行使用 28px，其余数据行使用 32px。 */
        getRowHeight={(params) =>
          params.data?.kind === "error" ? 28 : 32
        }
        /* 表头高度固定为 32px。 */
        headerHeight={32}
        /* 未被 getRowHeight 特别处理时，数据行默认高 32px。 */
        rowHeight={32}
        /* 根据表头和单元格内容自动计算列宽，并限制各列宽度范围。 */
        autoSizeStrategy={FIXED_GRID_AUTO_SIZE_STRATEGY}
        /* 自动测量列宽时，为单元格内容额外预留 16px 水平空间。 */
        autoSizePadding={16}
        /* 关闭列虚拟化，确保所有列都参与内容宽度测量。 */
        suppressColumnVirtualisation
        /* 仅在内容被截断时展示单元格 Tooltip。 */
        tooltipShowMode="whenTruncated"
        /* Tooltip 无延迟显示。 */
        tooltipShowDelay={0}
        /* 表格总高度随表头和实际行高自动撑开，不依赖固定容器高度。 */
        domLayout="autoHeight"
        /* 单合约结果不分页，直接展示全部行。 */
        pagination={false}
        /* 计算过程中显示表格加载状态。 */
        loading={loading}
        /* 禁止单元格获得焦点，避免出现无实际用途的焦点框。 */
        suppressCellFocus
        /* 拖动列离开表格时不隐藏该列。 */
        suppressDragLeaveHidesColumns
      />
    </div>
  );
}
