import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { theme } from "antd";
import type { ColDef } from "../../../../gzd-table";
import App from "../../../../components/app";
import Empty from "../../../../components/empty";
import Radio from "../../../../components/radio";
import Spin from "../../../../components/spin";
import Table from "../../../../components/table";
import type { ValuationChartTheme } from "../chartOption";
import ValuationLineChart from "./ValuationLineChart";
import type {
  ValuationLogAdapter,
  ValuationLogDataChartProps,
  ValuationLogItem,
  ValuationLogMetric,
} from "../types";
import {
  formatCurrency,
  formatValuationLogEndTime,
  isNegativeValue,
  mapFinancialData,
  sortValuationLogs,
} from "../utils";
import styles from "../style.module.less";

type LoadingStatus = "loading" | "success" | "empty" | "error";

interface ValuationLoadState {
  adapter: ValuationLogAdapter;
  allVarCodeSnum: string;
  status: LoadingStatus;
  data: readonly ValuationLogItem[];
}

interface ValuationTableRow extends ValuationLogItem {
  rowId: string;
}

const LOAD_ERROR_MESSAGE = "数据加载失败，请稍后重试";
const EMPTY_DATA: readonly ValuationLogItem[] = [];
const DEFAULT_CURRENCY = "CNY";
const DEFAULT_LOCALE = "zh-CN";
const EMPTY_STYLES = {
  root: { margin: 0 },
  image: { width: 56, height: 35, marginBottom: 8 },
};

interface ValuationEmptyStateProps {
  ariaLabel: string;
  className?: string;
}

function ValuationEmptyState({
  ariaLabel,
  className,
}: ValuationEmptyStateProps) {
  return (
    <div className={className} role="status" aria-label={ariaLabel}>
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="暂无数据"
        styles={EMPTY_STYLES}
      />
    </div>
  );
}

function ValuationTableEmptyState() {
  return <ValuationEmptyState ariaLabel="暂无估值日志数据" />;
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

export default function ValuationLogDataChart({
  adapter,
  allVarCodeSnum,
  className,
  style,
}: ValuationLogDataChartProps) {
  const { message } = App.useApp();
  const { token } = theme.useToken();
  const [loadState, setLoadState] = useState<ValuationLoadState>(() => ({
    adapter,
    allVarCodeSnum,
    status: "loading",
    data: EMPTY_DATA,
  }));
  const [metric, setMetric] = useState<ValuationLogMetric>("price");

  // 查询条件变化后立即派生 Loading，避免旧请求数据在新请求完成前继续展示。
  const stateMatchesRequest =
    loadState.adapter === adapter &&
    loadState.allVarCodeSnum === allVarCodeSnum;
  const status = stateMatchesRequest ? loadState.status : "loading";
  const data = stateMatchesRequest ? loadState.data : EMPTY_DATA;

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const params = {
      allVarCodeSnum,
      endTime: formatValuationLogEndTime(new Date()),
      size: "30",
    } as const;

    void adapter
      .getValuationLogs(params, { signal: controller.signal })
      .then((financialData) => {
        if (!active) return;
        const nextData = mapFinancialData(financialData);
        setLoadState({
          adapter,
          allVarCodeSnum,
          status: nextData.length === 0 ? "empty" : "success",
          data: nextData,
        });
      })
      .catch((error: unknown) => {
        if (!active || controller.signal.aborted || isAbortError(error)) return;
        setLoadState({
          adapter,
          allVarCodeSnum,
          status: "error",
          data: EMPTY_DATA,
        });
        void message.error(LOAD_ERROR_MESSAGE);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [adapter, allVarCodeSnum, message]);

  const tableRows = useMemo<ValuationTableRow[]>(
    () =>
      sortValuationLogs(data, "descending").map((item, index) => ({
        ...item,
        rowId: `${item.date}-${index}`,
      })),
    [data],
  );

  const resolvedCurrency = data[0]?.currency || DEFAULT_CURRENCY;

  const columnDefs = useMemo<ColDef<ValuationTableRow>[]>(
    () => [
      {
        headerName: "日期",
        field: "date",
        width: 120,
        minWidth: 120,
        sortable: false,
      },
      {
        headerName: "价格",
        field: "price",
        flex: 1,
        minWidth: 140,
        sortable: false,
        type: "rightAligned",
        cellClassRules: {
          [styles.negativeValue]: ({ value }) => isNegativeValue(value),
        },
        valueFormatter: ({ value }) =>
          formatCurrency(value, resolvedCurrency, DEFAULT_LOCALE),
      },
      {
        headerName: "NPV",
        field: "npv",
        flex: 1,
        minWidth: 140,
        sortable: false,
        type: "rightAligned",
        cellClassRules: {
          [styles.negativeValue]: ({ value }) => isNegativeValue(value),
        },
        valueFormatter: ({ value }) =>
          formatCurrency(value, resolvedCurrency, DEFAULT_LOCALE),
      },
    ],
    [resolvedCurrency],
  );

  const chartTheme = useMemo<ValuationChartTheme>(
    () => ({
      primary: token.colorPrimary,
      baseline: token.colorBorder,
      backgroundElevated: token.colorBgElevated,
      text: token.colorText,
      textSecondary: token.colorTextSecondary,
      split: token.colorSplit,
      fontFamily: token.fontFamily,
      fontSize: token.fontSize,
    }),
    [
      token.colorBgElevated,
      token.colorBorder,
      token.colorPrimary,
      token.colorSplit,
      token.colorText,
      token.colorTextSecondary,
      token.fontFamily,
      token.fontSize,
    ],
  );

  const showChart = status === "success";

  return (
    <section
      className={clsx(styles.root, className)}
      style={style}
      aria-label="估值日志数据图表"
      aria-busy={status === "loading"}
      data-status={status}
    >
      <h2 className={styles.title}>估值日志（最大展示30条日志数据）</h2>
      <Spin
        className={styles.loading}
        spinning={status === "loading"}
        description="估值日志加载中"
      >
        <div className={styles.content}>
          <div className={styles.tablePanel} aria-label="估值日志表格">
            <Table<ValuationTableRow>
              className={styles.table}
              rowData={tableRows}
              columnDefs={columnDefs}
              getRowId={({ data: row }) => row.rowId}
              headerHeight={32}
              rowHeight={28}
              pagination={false}
              noRowsOverlayComponent={ValuationTableEmptyState}
              suppressMovableColumns
              suppressCellFocus
              suppressContextMenu
              alwaysShowVerticalScroll={tableRows.length > 10}
            />
          </div>
          <section className={styles.chartPanel} aria-label="估值日志图形展示">
            <div className={styles.chartHeader}>
              <h3 className={styles.chartTitle}>结果图形展示</h3>
              <Radio.Group
                size="small"
                optionType="button"
                buttonStyle="solid"
                aria-label="估值指标"
                value={metric}
                options={[
                  { label: "价格", value: "price" },
                  { label: "NPV", value: "npv" },
                ]}
                onChange={({ target }) =>
                  setMetric(target.value as ValuationLogMetric)
                }
              />
            </div>
            {showChart ? (
              <ValuationLineChart
                className={styles.chart}
                data={data}
                metric={metric}
                currency={resolvedCurrency}
                locale={DEFAULT_LOCALE}
                theme={chartTheme}
              />
            ) : status === "empty" ? (
              <ValuationEmptyState
                className={styles.chartEmpty}
                ariaLabel="暂无估值曲线数据"
              />
            ) : (
              <div
                className={styles.chartEmpty}
                aria-label="暂无估值曲线数据"
              />
            )}
          </section>
        </div>
      </Spin>
    </section>
  );
}
