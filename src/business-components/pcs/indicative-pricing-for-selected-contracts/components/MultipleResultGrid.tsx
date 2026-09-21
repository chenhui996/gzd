import { useCallback, useEffect, useMemo, useRef } from "react";
import type { ColDef, GridApi, GridReadyEvent, ICellRendererParams } from "ag-grid-community";
import Table from "../../../../components/table";
import Tooltip from "../../../../components/tooltip";
import {
  EMPTY_TABLE_CELL_PLACEHOLDER,
  MULTIPLE_GRID_ROWS,
  type MultipleGridRowKey,
} from "../constants";
import type { ContractCalculationState, IndicativePricingContract } from "../types";
import styles from "../style.module.less";
import {
  ContractValue,
  ResultValue,
} from "./grid-shared";
import { contractFieldValue, formatResultValue } from "./grid-utils";

interface ResultCellValue {
  kind: "empty" | "value" | "error";
  display: string;
  rawValue?: string | null;
}

interface MultipleRow {
  id: MultipleGridRowKey;
  label: string;
  kind: "contract" | "result";
  [contractId: string]: string | ResultCellValue;
}

const RESULT_KEYS = ["npv", "forwardPrice", "discountFactor"] as const;
const EMPTY_RESULT: ResultCellValue = {
  kind: "empty",
  display: EMPTY_TABLE_CELL_PLACEHOLDER,
};

function isResultCell(value: unknown): value is ResultCellValue {
  return Boolean(value && typeof value === "object" && "kind" in value);
}

export interface MultipleResultGridProps {
  contracts: readonly IndicativePricingContract[];
  results: Record<string, ContractCalculationState>;
  loading: boolean;
}

export default function MultipleResultGrid({ contracts, results, loading }: MultipleResultGridProps) {
  const apiRef = useRef<GridApi<MultipleRow> | null>(null);
  const rowData = useMemo<MultipleRow[]>(
    () =>
      MULTIPLE_GRID_ROWS.map((field) => ({
        id: field.key,
        label: field.label,
        kind: field.kind,
        ...Object.fromEntries(
          contracts.map((contract) => [
            contract.contractId,
            field.kind === "contract" ? contractFieldValue(contract, field.key) : EMPTY_RESULT,
          ]),
        ),
      })),
    [contracts],
  );

  const columnDefs = useMemo<ColDef<MultipleRow>[]>(
    () => [
      {
        field: "label",
        colId: "field",
        headerName: "字段",
        pinned: "left",
        lockPinned: true,
        width: 180,
        minWidth: 180,
        sortable: false,
        resizable: false,
        suppressMovable: true,
        cellClass: styles.fieldCell,
      },
      ...contracts.map<ColDef<MultipleRow>>((contract, index) => ({
        field: contract.contractId,
        colId: contract.contractId,
        headerName: String(index + 1).padStart(3, "0"),
        flex: 1,
        width: 180,
        minWidth: 180,
        sortable: false,
        resizable: false,
        suppressMovable: true,
        spanRows: (params) => {
          const valueA = params.valueA;
          const valueB = params.valueB;
          return (
            isResultCell(valueA) &&
            isResultCell(valueB) &&
            valueA.kind === "error" &&
            valueB.kind === "error" &&
            valueA.display === valueB.display
          );
        },
        cellClass: (params) =>
          isResultCell(params.value) && params.value.kind === "error"
            ? styles.mergedErrorGridCell
            : undefined,
        cellRenderer: (params: ICellRendererParams<MultipleRow>) => {
          const field = params.data?.id;
          const value = params.value;
          if (isResultCell(value)) {
            if (value.kind === "error") {
              const errorMessage = `计算失败，失败原因：${value.display}`;
              return (
                <Tooltip title={errorMessage}>
                  <div className={styles.mergedErrorCell}>
                    <span className={styles.mergedErrorText}>{errorMessage}</span>
                  </div>
                </Tooltip>
              );
            }
            return <ResultValue value={value.display} rawValue={value.rawValue} />;
          }
          return field ? (
            <ContractValue
              field={field}
              value={String(value ?? EMPTY_TABLE_CELL_PLACEHOLDER)}
            />
          ) : null;
        },
      })),
    ],
    [contracts],
  );

  const applyResults = useCallback(
    (api: GridApi<MultipleRow>) => {
      RESULT_KEYS.forEach((key) => {
        const node = api.getRowNode(key);
        if (!node?.data) return;
        const nextRow = { ...node.data };
        contracts.forEach((contract) => {
          const calculation = results[contract.contractId];
          let value = EMPTY_RESULT;
          if (calculation?.status === "success") {
            value = {
              kind: "value",
              display: formatResultValue(calculation.result, key, contract.currency),
              rawValue: calculation.result?.[key],
            };
          } else if (calculation?.status === "error") {
            value = {
              kind: "error",
              display: calculation.message ?? "定价计算失败",
            };
          }
          node.setDataValue(contract.contractId, value);
          nextRow[contract.contractId] = value;
        });
        node.setData(nextRow);
      });
      api.refreshCells({ force: true });
      api.resetRowHeights();
    },
    [contracts, results],
  );

  useEffect(() => {
    if (apiRef.current) applyResults(apiRef.current);
  }, [applyResults]);

  const onGridReady = (event: GridReadyEvent<MultipleRow>) => {
    apiRef.current = event.api;
    applyResults(event.api);
  };

  return (
    <div className={styles.multipleGrid} aria-label="多笔合约定价结果">
      <Table<MultipleRow>
        /* 表格的数据源；每一行对应一个合约字段或定价结果字段。 */
        rowData={rowData}
        /* 定义左侧字段列和各合约动态列的展示、宽度及渲染方式。 */
        columnDefs={columnDefs}
        /* Grid 初始化完成后保存 API，并同步所有合约的当前计算结果。 */
        onGridReady={onGridReady}
        /* 使用字段 key 作为稳定行 ID，便于按字段更新结果。 */
        getRowId={(params) => params.data.id}
        /* 表头高度固定为 32px。 */
        headerHeight={32}
        /* 每条字段数据行的默认高度为 28px。 */
        rowHeight={28}
        /* 表格总高度随实际行数自动撑开，不依赖固定容器高度。 */
        domLayout="autoHeight"
        /* 多合约结果不分页，直接展示全部字段行。 */
        pagination={false}
        /* 计算过程中显示表格加载状态。 */
        loading={loading}
        /* 启用纵向单元格合并，合并同一合约中连续且相同的错误结果。 */
        enableCellSpan
        /* 禁止单元格获得焦点，避免出现无实际用途的焦点框。 */
        suppressCellFocus
        /* 拖动列离开表格时不隐藏该列。 */
        suppressDragLeaveHidesColumns
      />
    </div>
  );
}
