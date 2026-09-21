import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export function isStrictDate(value: string | null | undefined): value is string {
  return Boolean(value && dayjs(value, "YYYY-MM-DD", true).isValid());
}

export function isStrictCompactDate(
  value: string | null | undefined,
): value is string {
  return Boolean(value && dayjs(value, "YYYYMMDD", true).isValid());
}

export function toCompactDate(value: string): string {
  return value.replaceAll("-", "");
}

export function formatCompactDate(value: string): string {
  return isStrictCompactDate(value)
    ? dayjs(value, "YYYYMMDD", true).format("YYYY-MM-DD")
    : value;
}

export function formatCurveDate(value: string): string {
  const normalizedValue = value.trim();
  const compactDate = normalizedValue.slice(0, 8);

  return isStrictCompactDate(compactDate)
    ? formatCompactDate(compactDate)
    : normalizedValue.slice(0, 10);
}
