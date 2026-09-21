import type { EChartsCoreOption } from "echarts/core";
import type { ValuationLogItem, ValuationLogMetric } from "./types";
import {
  formatChartDate,
  formatCurrency,
  sortValuationLogs,
  toChartNumber,
} from "./utils";

export interface ValuationChartTheme {
  primary: string;
  baseline: string;
  backgroundElevated: string;
  text: string;
  textSecondary: string;
  split: string;
  fontFamily: string;
  fontSize: number;
}

interface BuildChartOptionParams {
  data: readonly ValuationLogItem[];
  metric: ValuationLogMetric;
  currency: string;
  locale: string;
  theme: ValuationChartTheme;
}

interface YAxisRange {
  min?: number;
  max?: number;
}

interface BaselineAxisConfig {
  position: "top" | "bottom";
  onZero: boolean;
}

const Y_AXIS_PADDING_RATIO = 0.05;
const Y_AXIS_SPLIT_NUMBER = 7;
const GRID_LINE_DASH = [8, 8];

function getFiniteYAxisValues(
  values: readonly (number | null)[],
): number[] {
  return values.filter(
    (value): value is number =>
      typeof value === "number" && Number.isFinite(value),
  );
}

function getYAxisRange(values: readonly (number | null)[]): YAxisRange {
  const finiteValues = getFiniteYAxisValues(values);
  if (finiteValues.length === 0) return {};

  const minValue = Math.min(...finiteValues);
  const maxValue = Math.max(...finiteValues);
  const valueSpan = maxValue - minValue;
  // 等值数据没有跨度：按数值绝对值保留 5% 留白，全零时提供最小可视范围。
  const padding =
    valueSpan > 0
      ? valueSpan * Y_AXIS_PADDING_RATIO
      : maxValue !== 0
        ? Math.abs(maxValue) * Y_AXIS_PADDING_RATIO
        : 1;
  const paddedMin = minValue - padding;
  const paddedMax = maxValue + padding;

  // 同号数据的纵轴不跨过 0；跨零数据则保留完整的上下留白。
  if (minValue >= 0) {
    return {
      min: Math.max(0, paddedMin),
      max: paddedMax,
    };
  }

  if (maxValue <= 0) {
    return {
      min: paddedMin,
      max: Math.min(0, paddedMax),
    };
  }

  return {
    min: paddedMin,
    max: paddedMax,
  };
}

function getBaselineAxisConfig(
  values: readonly (number | null)[],
): BaselineAxisConfig {
  const finiteValues = getFiniteYAxisValues(values);
  if (finiteValues.length === 0) {
    return { position: "bottom", onZero: false };
  }

  const minValue = Math.min(...finiteValues);
  const maxValue = Math.max(...finiteValues);
  // 全负或负数与 0 的组合从顶部向下阅读；其余场景保持日期标签常见的底部方向。
  const position = maxValue <= 0 && minValue < 0 ? "top" : "bottom";
  // 只有纵轴实际包含 0 时才吸附零点，避免同号数据为了基准线被迫扩展到 0。
  const onZero = minValue <= 0 && maxValue >= 0;

  return { position, onZero };
}

function roundYAxisTick(value: number, precision: number): number {
  return Number(value.toFixed(Math.min(Math.max(precision, 0), 20)));
}

function getNiceYAxisInterval(min: number, max: number): number {
  const roughInterval = (max - min) / Y_AXIS_SPLIT_NUMBER;
  const exponent = Math.floor(Math.log10(roughInterval));
  const magnitude = 10 ** exponent;
  const fraction = roughInterval / magnitude;
  const niceFraction =
    fraction < 1.5 ? 1 : fraction < 2.5 ? 2 : fraction < 4 ? 3 : fraction < 7 ? 5 : 10;

  return roundYAxisTick(niceFraction * magnitude, -exponent);
}

function getYAxisSplitLineValues({ min, max }: YAxisRange) {
  if (min == null || max == null || min >= max) return undefined;

  const interval = getNiceYAxisInterval(min, max);
  const precision = Math.max(0, -Math.floor(Math.log10(interval))) + 2;
  const niceMin = roundYAxisTick(Math.ceil(min / interval) * interval, precision);
  const niceMax = roundYAxisTick(Math.floor(max / interval) * interval, precision);
  const ticks: number[] = min < niceMin ? [min] : [];

  for (
    let tick = niceMin;
    tick <= niceMax;
    tick = roundYAxisTick(tick + interval, precision)
  ) {
    ticks.push(tick);
  }
  if (max > niceMax) ticks.push(max);

  // 仅移除范围内部的 0，避免与跨零时的实线基准线重叠；边界 0 交给
  // showMinLine/showMaxLine 隐藏，否则相邻的首条或末条有效虚线也会被误隐藏。
  return min < 0 && max > 0 ? ticks.filter((tick) => tick !== 0) : ticks;
}

export function buildValuationChartOption({
  data,
  metric,
  currency,
  locale,
  theme,
}: BuildChartOptionParams): EChartsCoreOption {
  // 图表按日期升序绘制，使折线从较早日期延伸到较晚日期。
  const chartData = sortValuationLogs(data, "ascending");
  // 当前指标名称作为折线系列名称，供提示框等组件识别。
  const metricLabel = metric === "price" ? "价格" : "NPV";
  // 将接口金额统一转换为 ECharts 可识别的有限数值、0 或空点。
  const seriesData = chartData.map((item) => toChartNumber(item[metric]));
  // 基于最终绘图值计算范围，局部空值转换成的 0 也会参与纵轴自适应。
  const yAxisRange = getYAxisRange(seriesData);
  const baselineAxis = getBaselineAxisConfig(seriesData);
  // ECharts 的 splitLine 复用 axisTick 自定义刻度；排除 0 后仍保留完整的轴标签。
  const yAxisSplitLineValues = getYAxisSplitLineValues(yAxisRange);
  const xAxisData = chartData.map(({ date }) => formatChartDate(date));

  return {
    // 数据或指标切换时使用 300ms 过渡动画。
    animationDuration: 300,
    // 透出宿主面板背景，避免图表画布覆盖组件主题色。
    backgroundColor: "transparent",
    // 统一图表内文字的主题颜色、字体和字号。
    textStyle: {
      // 默认文字使用主题主文字色。
      color: theme.text,
      // 字体与当前 gzd 主题保持一致。
      fontFamily: theme.fontFamily,
      // 字号与当前 gzd 主题保持一致。
      fontSize: theme.fontSize,
    },
    // 通过四周留白为坐标轴标签和旋转后的日期文本预留空间。
    grid: {
      // 顶部为纵轴最大刻度和折线预留空间。
      top: 16,
      // 右侧避免最后一个数据点贴近画布边缘。
      right: 24,
      // 底部容纳旋转 45 度后的日期标签。
      bottom: 58,
      // 左侧为纵轴刻度标签预留显示空间。
      left: 64,
    },
    // 鼠标悬停时展示当前日期对应的指标金额。
    tooltip: {
      // 按横轴类目触发，指向日期时展示该日期的数据。
      trigger: "axis",
      // 将浮层限制在图表区域内，避免被外层滚动容器裁切。
      confine: true,
      // 对齐 gzd 浮层背景，避免 ECharts 默认的白色 Tooltip。
      backgroundColor: theme.backgroundElevated,
      // Figma 浮层没有描边，关闭 ECharts 默认边框。
      borderWidth: 0,
      borderRadius: 4,
      padding: 12,
      textStyle: {
        color: theme.text,
        fontFamily: theme.fontFamily,
        fontSize: theme.fontSize,
      },
      // 按当前币种和区域格式化提示框中的金额。
      valueFormatter: (value: unknown) =>
        formatCurrency(
          typeof value === "number" || typeof value === "string" ? value : null,
          currency,
          locale,
        ),
    },
    // 日期标签轴与符号基准线分离，避免全负数据把日期标签一起移动到顶部。
    xAxis: [
      {
        // 日期是离散类目，而非连续时间刻度。
        type: "category",
        position: "bottom",
        // 在首尾类目两侧保留半个类目间距，防止端点贴边。
        boundaryGap: true,
        // 将日期转换为 YY-MM-DD 后写入横轴。
        data: xAxisData,
        // 横轴仅保留标签，不显示刻度短线。
        axisTick: {
          // 隐藏每个日期下方的刻度短线。
          show: false,
        },
        // 标签轴不绘制实线，也不参与零点吸附。
        axisLine: {
          show: false,
          onZero: false,
        },
        // 配置横轴日期标签的颜色、密度、角度和间距。
        axisLabel: {
          // 日期标签使用主题次级文字色。
          color: theme.textSecondary,
          // 强制展示每一个日期标签，不让 ECharts 自动抽稀。
          interval: 0,
          // 日期旋转 45 度以降低相邻标签重叠概率。
          rotate: 45,
          // 标签与绘图区底边保持 12px 间距。
          margin: 12,
        },
      },
      {
        type: "category",
        position: baselineAxis.position,
        boundaryGap: true,
        data: xAxisData,
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        // 实线仅表达符号方向：全负在顶部、全正在底部、跨零时吸附 0。
        axisLine: {
          show: true,
          onZero: baselineAxis.onZero,
          lineStyle: {
            color: theme.baseline,
            type: "solid",
          },
        },
      },
    ],
    // 纵轴以连续数值刻度展示当前价格或 NPV。
    yAxis: {
      // 使用连续数值轴，支持正数、负数和小数。
      type: "value",
      // 应用根据绘图值及 5% 留白计算出的固定上下限。
      ...yAxisRange,
      // 期望约分为 7 段，实际刻度数和间隔仍由 ECharts 取易读值。
      splitNumber: Y_AXIS_SPLIT_NUMBER,
      // 纵轴通过网格线表达刻度，不额外显示刻度短线。
      axisTick: {
        // 隐藏纵轴刻度短线。
        show: false,
        customValues: yAxisSplitLineValues,
      },
      // 隐藏纵轴自身的竖直轴线，减少视觉干扰。
      axisLine: {
        // 不绘制纵轴轴线。
        show: false,
      },
      // 配置纵轴刻度标签的主题颜色和数值精度。
      axisLabel: {
        // 纵轴标签使用主题次级文字色。
        color: theme.textSecondary,
        // 刻度最多展示两位小数，并按当前区域添加数字分组格式。
        formatter: (value: number) =>
          new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value),
      },
      // 为每个纵轴主刻度绘制水平辅助线。
      splitLine: {
        // 边界只保留符号基准线，避免最大、最小端点虚线与实线重叠。
        showMinLine: false,
        showMaxLine: false,
        // 网格线使用主题分割色和自定义虚线节奏。
        lineStyle: {
          // 颜色读取当前 gzd 主题的分割线 Token。
          color: theme.split,
          // 使用统一的线段与间隔长度绘制虚线。
          type: GRID_LINE_DASH,
        },
      },
    },
    // 当前图表只绘制一个价格或 NPV 折线系列。
    series: [
      {
        // 系列名称随当前选中的指标切换。
        name: metricLabel,
        // 数据系列使用第一个横轴；第二个横轴只负责绘制符号基准线。
        xAxisIndex: 0,
        // 使用折线图连接相邻日期的数据点。
        type: "line",
        // 传入已转换的数值、0 或空点序列。
        data: seriesData,
        // 每个有效数据点使用圆形标记。
        symbol: "circle",
        // 数据点直径固定为 5px。
        symbolSize: 5,
        // 常态下始终展示数据点标记。
        showSymbol: true,
        // 遇到无法转换的空点时断开折线，不跨点连接。
        connectNulls: false,
        // 配置折线本身的主题颜色和宽度。
        lineStyle: {
          // 折线颜色使用当前主题主色。
          color: theme.primary,
          // 折线宽度固定为 2px。
          width: 2,
        },
        // 配置数据点标记的填充色。
        itemStyle: {
          // 数据点与折线统一使用主题主色。
          color: theme.primary,
        },
        // 鼠标悬停数据点时提供轻微放大反馈。
        emphasis: {
          // 高亮数据点放大到默认尺寸的 1.3 倍。
          scale: 1.3,
        },
      },
    ],
  };
}
