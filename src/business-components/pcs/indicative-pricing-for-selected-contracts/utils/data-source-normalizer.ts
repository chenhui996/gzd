import type {
  CarbonForwardCurveDefinitionInput,
  CurveCatalogItem,
  CurveKind,
  CurveRequestMapping,
  CurveSelectionReference,
  CurveSource,
  CustomCarbonForwardCurveInput,
  CustomDiscountCurveInput,
  DiscountCurveDefinitionInput,
  EnvironmentCurveReferenceInput,
  EnvironmentCurveSelection,
  EnvironmentCurveSelectionInput,
  PricingEnvironment,
  PricingEnvironmentInput,
} from "../types";
import { formatCurveDate } from "./date";

const DISCOUNT_CURVE_TYPE = "3";
const CARBON_FORWARD_CURVE_TYPE = "11";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isCurveCatalogItem(value: unknown): value is CurveCatalogItem {
  return (
    isRecord(value) &&
    typeof value.key === "string" &&
    typeof value.id === "string" &&
    typeof value.label === "string" &&
    (value.kind === "discount" || value.kind === "carbonForward") &&
    (value.source === "definition" || value.source === "custom") &&
    isRecord(value.requestMapping)
  );
}

function isEnvironmentCurveSelection(
  value: EnvironmentCurveSelectionInput,
): value is EnvironmentCurveSelection {
  return (
    !Array.isArray(value) &&
    isRecord(value) &&
    isRecord(value.discountCurve) &&
    isRecord(value.carbonForwardCurve)
  );
}

function buildCurveLabel(
  code: string,
  name: string,
  executeDay?: string,
): string {
  const label = code && name ? `${name}（${code}）` : name || code;
  return executeDay ? `${label}-${formatCurveDate(executeDay)}` : label;
}

function normalizeCurveCatalog(
  response: unknown,
  config: {
    idField: "disCurveDefId" | "disCurveId" | "comCurveDefId" | "comCurveId";
    kind: CurveKind;
    source: CurveSource;
  },
): readonly CurveCatalogItem[] {
  if (!Array.isArray(response)) return [];

  return response.flatMap((item) => {
    if (isCurveCatalogItem(item)) return [item];
    if (!isRecord(item)) return [];

    const rawId = item[config.idField];
    if (rawId === undefined || rawId === null || rawId === "") return [];

    const id = String(rawId);
    const code = String(item.code ?? "");
    const name = String(item.name ?? "");
    const currency = String(item.currency ?? "");
    const createDate =
      config.source === "custom" && typeof item.createDate === "string"
        ? item.createDate
        : undefined;
    const executeDay =
      config.source === "custom" && typeof item.executeDay === "string"
        ? item.executeDay
        : undefined;
    const requestMapping = { [config.idField]: id } as CurveRequestMapping;

    return [
      {
        key: `${config.kind}:${config.source}:${id}`,
        id,
        label: buildCurveLabel(code, name, executeDay),
        code,
        name,
        kind: config.kind,
        source: config.source,
        currency,
        createDate,
        executeDay,
        requestMapping,
      },
    ];
  });
}

export function normalizePricingEnvironments(
  response: unknown,
): readonly PricingEnvironment[] {
  if (!Array.isArray(response)) return [];

  return response.flatMap((environment) => {
    if (!isRecord(environment)) return [];
    const source = environment as PricingEnvironmentInput;
    const sourceId =
      source.id ?? ("pricingEnvId" in source ? source.pricingEnvId : "");
    if (sourceId === "" || sourceId === null || sourceId === undefined) return [];

    return [
      {
        ...source,
        // 真实接口使用 pricingEnvId，组件内部统一使用字符串 id 维护 Select 值和联动请求。
        id: String(sourceId),
      } as PricingEnvironment,
    ];
  });
}

export function normalizeDiscountCurveDefinitions(
  response: readonly (DiscountCurveDefinitionInput | CurveCatalogItem)[],
): readonly CurveCatalogItem[] {
  return normalizeCurveCatalog(response, {
    idField: "disCurveDefId",
    kind: "discount",
    source: "definition",
  });
}

export function normalizeCustomDiscountCurves(
  response: readonly (CustomDiscountCurveInput | CurveCatalogItem)[],
): readonly CurveCatalogItem[] {
  return normalizeCurveCatalog(response, {
    idField: "disCurveId",
    kind: "discount",
    source: "custom",
  });
}

export function normalizeCarbonForwardCurveDefinitions(
  response: readonly (CarbonForwardCurveDefinitionInput | CurveCatalogItem)[],
): readonly CurveCatalogItem[] {
  return normalizeCurveCatalog(response, {
    idField: "comCurveDefId",
    kind: "carbonForward",
    source: "definition",
  });
}

export function normalizeCustomCarbonForwardCurves(
  response: readonly (CustomCarbonForwardCurveInput | CurveCatalogItem)[],
): readonly CurveCatalogItem[] {
  return normalizeCurveCatalog(response, {
    idField: "comCurveId",
    kind: "carbonForward",
    source: "custom",
  });
}

function buildEnvironmentCurveReference(
  curve: EnvironmentCurveReferenceInput,
  config: {
    kind: CurveKind;
    requestMapping: (id: string) => CurveRequestMapping;
  },
): CurveSelectionReference {
  const id = String(curve.curveId);
  return {
    id,
    label: buildCurveLabel(String(curve.curveCode ?? ""), String(curve.curveName ?? "")),
    code: String(curve.curveCode ?? ""),
    name: String(curve.curveName ?? ""),
    kind: config.kind,
    source: "definition",
    requestMapping: config.requestMapping(id),
  };
}

export function normalizeEnvironmentCurveSelection(
  response: EnvironmentCurveSelectionInput,
): EnvironmentCurveSelection | null {
  if (response === null) return null;
  if (isEnvironmentCurveSelection(response)) return response;
  if (!Array.isArray(response)) return null;

  const discountCurve = response.find(
    (curve) => String(curve.curveType) === DISCOUNT_CURVE_TYPE,
  );
  const carbonForwardCurve = response.find(
    (curve) => String(curve.curveType) === CARBON_FORWARD_CURVE_TYPE,
  );
  if (!discountCurve?.curveId || !carbonForwardCurve?.curveId) return null;

  return {
    discountCurve: buildEnvironmentCurveReference(discountCurve, {
      kind: "discount",
      requestMapping: (id) => ({ disCurveDefId: id }),
    }),
    carbonForwardCurve: buildEnvironmentCurveReference(carbonForwardCurve, {
      kind: "carbonForward",
      requestMapping: (id) => ({ comCurveDefId: id }),
    }),
  };
}
