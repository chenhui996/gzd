import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import clsx from "clsx";
import * as echarts from "echarts/core";
import { LineChart } from "echarts/charts";
import { GridComponent, TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { buildValuationChartOption } from "../chartOption";
import type { ValuationChartTheme } from "../chartOption";
import type { ValuationLogItem, ValuationLogMetric } from "../types";
import styles from "../style.module.less";

echarts.use([LineChart, GridComponent, TooltipComponent, CanvasRenderer]);

const MAX_VISIBLE_POINTS = 10;
const SCROLLBAR_HIDE_DELAY = 800;

interface ValuationLineChartProps {
  data: readonly ValuationLogItem[];
  metric: ValuationLogMetric;
  currency: string;
  locale: string;
  theme: ValuationChartTheme;
  className?: string;
}

export default function ValuationLineChart({
  data,
  metric,
  currency,
  locale,
  theme,
  className,
}: ValuationLineChartProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReturnType<typeof echarts.init> | null>(null);
  const enableHorizontalScroll = data.length > MAX_VISIBLE_POINTS;
  const chartWidth = `${Math.max(data.length / MAX_VISIBLE_POINTS, 1) * 100}%`;
  const option = useMemo(
    () => buildValuationChartOption({ data, metric, currency, locale, theme }),
    [currency, data, locale, metric, theme],
  );

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const chart = echarts.init(container, undefined, { renderer: "canvas" });
    chartRef.current = chart;
    const handleResize = () => chart.resize();
    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(handleResize);

    if (resizeObserver) {
      resizeObserver.observe(container);
    } else {
      window.addEventListener("resize", handleResize);
    }

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", handleResize);
      chart.dispose();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    chartRef.current?.setOption(option, { notMerge: true });
  }, [option]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || !enableHorizontalScroll) return undefined;

    let hideTimer: number | undefined;
    const handleScroll = () => {
      scrollContainer.dataset.scrolling = "true";
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => {
        delete scrollContainer.dataset.scrolling;
      }, SCROLLBAR_HIDE_DELAY);
    };

    // Windows 的原生滚动条不会像 macOS 一样自动淡出，通过滚动状态统一可见时机。
    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
      window.clearTimeout(hideTimer);
      delete scrollContainer.dataset.scrolling;
    };
  }, [enableHorizontalScroll]);

  useLayoutEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || !enableHorizontalScroll) return;

    // 数据更新后默认定位至最新日期，用户仍可通过底部滚动条查看较早数据。
    scrollContainer.scrollLeft =
      scrollContainer.scrollWidth - scrollContainer.clientWidth;
  }, [data, enableHorizontalScroll]);

  const metricLabel = metric === "price" ? "价格" : "NPV";

  return (
    <div
      ref={scrollRef}
      className={clsx(className, {
        [styles.chartScrollable]: enableHorizontalScroll,
      })}
      role="img"
      aria-label={`按日期展示的${metricLabel}折线图`}
      data-scrollable={enableHorizontalScroll}
    >
      <div
        ref={containerRef}
        className={styles.chartCanvas}
        style={{ width: chartWidth }}
      />
    </div>
  );
}
