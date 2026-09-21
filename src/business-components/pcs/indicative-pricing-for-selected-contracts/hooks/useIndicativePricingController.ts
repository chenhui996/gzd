import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { MAX_RESOURCE_ATTEMPTS } from "../constants";
import {
  createInitialState,
  indicativePricingReducer,
  type ResourceKey,
} from "../reducer";
import type {
  CurveCatalogItem,
  CurveSelectionReference,
  EnvironmentCurveSelection,
  IndicativePricingContextValues,
  IndicativePricingContract,
  IndicativePricingDataSource,
  PricingEnvironment,
} from "../types";
import {
  normalizeCarbonForwardCurveDefinitions,
  normalizeCustomCarbonForwardCurves,
  normalizeCustomDiscountCurves,
  normalizeDiscountCurveDefinitions,
  normalizeEnvironmentCurveSelection,
  normalizePricingEnvironments,
} from "../utils/data-source-normalizer";
import { mapIndicativePricingRequest } from "../utils/request-mapper";
import { classifyCalculationBatch } from "../utils/result-classifier";
import {
  validatePricingContext,
  validateValuationDateAgainstLatestSettlement,
} from "../utils/validation";

type CalculateOutcome =
  | { kind: "empty" }
  | { kind: "invalid" }
  | { kind: "success"; hasErrors: boolean; hasExtraItems: boolean }
  | { kind: "requestError" };

const RESOURCE_ERROR_MESSAGES: Record<ResourceKey, string> = {
  environments: "定价环境加载失败",
  discountDefinitions: "无风险利率曲线利率曲线定义加载失败",
  customDiscountCurves: "自定义无风险利率曲线利率曲线加载失败",
  carbonDefinitions: "碳金融远期价格曲线定义加载失败",
  customCarbonCurves: "自定义碳金融远期价格曲线加载失败",
};

// dataSource 不限定请求库；请求失败时不区分具体 HTTP 状态码，统一读取后端业务错误信息。
function getCalculationErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "response" in error) {
    const response = error.response;
    if (response && typeof response === "object" && "data" in response) {
      const responseData = response.data;
      if (
        responseData &&
        typeof responseData === "object" &&
        "msg" in responseData &&
        typeof responseData.msg === "string" &&
        responseData.msg.trim()
      ) {
        return responseData.msg;
      }
    }
  }

  return error instanceof Error && error.message
    ? error.message
    : "定价服务请求失败";
}

function logDataSourceResponse<T>(
  methodName: keyof IndicativePricingDataSource,
  response: T,
): T {
  console.log(
    `[IndicativePricingforSelectedContracts] dataSource.${methodName} response:`,
    response,
  );
  return response;
}

export function useIndicativePricingController(params: {
  contracts: readonly IndicativePricingContract[];
  productType: string;
  dataSource: IndicativePricingDataSource;
  initialContext?: Partial<IndicativePricingContextValues>;
}) {
  const { contracts, productType, dataSource, initialContext } = params;
  const [state, dispatch] = useReducer(
    indicativePricingReducer,
    undefined,
    () =>
      createInitialState(
        contracts.map((contract) => contract.contractId),
        initialContext,
      ),
  );
  const mountedRef = useRef(true);
  const environmentRequestRef = useRef(0);
  const calculationRequestRef = useRef(0);
  const calculationAbortRef = useRef<AbortController | null>(null);
  const environmentAbortRef = useRef<AbortController | null>(null);
  const resourceAbortRef = useRef(new Map<ResourceKey, AbortController>());
  const [environmentRetryToken, setEnvironmentRetryToken] = useState(0);
  const environmentCacheRef = useRef(
    new Map<string, Promise<EnvironmentCurveSelection | null>>(),
  );

  useEffect(
    () => () => {
      mountedRef.current = false;
      calculationAbortRef.current?.abort();
      environmentAbortRef.current?.abort();
      resourceAbortRef.current.forEach((controller) => controller.abort());
    },
    [],
  );

  const loadResource = useCallback(
    async (key: ResourceKey) => {
      if (state.resources[key].attempts >= MAX_RESOURCE_ATTEMPTS) return;
      dispatch({ type: "resource/loading", key });
      resourceAbortRef.current.get(key)?.abort();
      const controller = new AbortController();
      resourceAbortRef.current.set(key, controller);
      try {
        let data: readonly PricingEnvironment[] | readonly CurveCatalogItem[];
        switch (key) {
          case "environments": {
            const response = await dataSource.listPricingEnvironments(
              { status: true },
              { signal: controller.signal },
            );
            data = normalizePricingEnvironments(
              logDataSourceResponse("listPricingEnvironments", response),
            );
            break;
          }
          case "discountDefinitions": {
            const response = await dataSource.listDiscountCurveDefinitions(
              { type: "3", status: true },
              { signal: controller.signal },
            );
            data = normalizeDiscountCurveDefinitions(
              logDataSourceResponse("listDiscountCurveDefinitions", response),
            );
            break;
          }
          case "customDiscountCurves": {
            const response = await dataSource.listCustomDiscountCurves(
              { type: "3", isCustom: true },
              { signal: controller.signal },
            );
            data = normalizeCustomDiscountCurves(
              logDataSourceResponse("listCustomDiscountCurves", response),
            );
            break;
          }
          case "carbonDefinitions": {
            const response = await dataSource.listCarbonForwardCurveDefinitions(
              { type: "11", status: true },
              { signal: controller.signal },
            );
            data = normalizeCarbonForwardCurveDefinitions(
              logDataSourceResponse("listCarbonForwardCurveDefinitions", response),
            );
            break;
          }
          case "customCarbonCurves": {
            const response = await dataSource.listCustomCarbonForwardCurves(
              { type: "11", isCustom: true },
              { signal: controller.signal },
            );
            data = normalizeCustomCarbonForwardCurves(
              logDataSourceResponse("listCustomCarbonForwardCurves", response),
            );
            break;
          }
        }
        if (mountedRef.current) {
          dispatch({ type: "resource/success", key, data });
        }
      } catch (error) {
        if (mountedRef.current && !controller.signal.aborted) {
          dispatch({
            type: "resource/error",
            key,
            error: error instanceof Error ? error.message : RESOURCE_ERROR_MESSAGES[key],
          });
        }
      }
    },
    [dataSource, state.resources],
  );

  const initialLoadStarted = useRef(false);
  useEffect(() => {
    if (initialLoadStarted.current) return;
    initialLoadStarted.current = true;
    void Promise.allSettled(
      (Object.keys(RESOURCE_ERROR_MESSAGES) as ResourceKey[]).map((key) =>
        loadResource(key),
      ),
    );
  }, [loadResource]);

  const allCurves = useMemo(
    () => [
      ...state.resources.discountDefinitions.data,
      ...state.resources.customDiscountCurves.data,
      ...state.resources.carbonDefinitions.data,
      ...state.resources.customCarbonCurves.data,
    ],
    [state.resources],
  );
  const discountCurves = useMemo(
    () => allCurves.filter((curve) => curve.kind === "discount"),
    [allCurves],
  );
  const carbonForwardCurves = useMemo(
    () => allCurves.filter((curve) => curve.kind === "carbonForward"),
    [allCurves],
  );

  const allCurvesRef = useRef(allCurves);
  useEffect(() => {
    allCurvesRef.current = allCurves;
  }, [allCurves]);
  const resolveCurve = useCallback(
    (
      reference: CurveSelectionReference,
      currency: string,
    ): CurveCatalogItem =>
      allCurvesRef.current.find(
        (curve) =>
          curve.kind === reference.kind &&
          (curve.id === reference.id || curve.key === reference.id),
      ) ?? {
        ...reference,
        key: `${reference.kind}:${reference.source}:${reference.id}`,
        currency,
      },
    [],
  );

  const selectedEnvironment = state.context.pricingEnvironment;
  useEffect(() => {
    if (!selectedEnvironment || !productType) return;
    environmentAbortRef.current?.abort();
    const controller = new AbortController();
    environmentAbortRef.current = controller;
    const requestId = ++environmentRequestRef.current;
    const cacheKey = JSON.stringify([selectedEnvironment.id, productType]);
    dispatch({ type: "environment-curves/loading" });
    let request = environmentCacheRef.current.get(cacheKey);
    if (!request) {
      console.info("511: selectedEnvironment.id", selectedEnvironment.id);
      console.info("511: productType", productType);
      request = dataSource
        .getEnvironmentCurveSelection(
          {
            pricingEnvId: selectedEnvironment.id,
            productType,
          },
          { signal: controller.signal },
        )
        .then((response) =>
          normalizeEnvironmentCurveSelection(
            logDataSourceResponse("getEnvironmentCurveSelection", response),
          ),
        );
      environmentCacheRef.current.set(cacheKey, request);
    }
    void request
      .then((selection) => {
        if (!mountedRef.current || requestId !== environmentRequestRef.current) return;
        dispatch({
          type: "environment-curves/success",
          discountCurve: selection
            ? resolveCurve(selection.discountCurve, selectedEnvironment.currency)
            : null,
          carbonForwardCurve: selection
            ? resolveCurve(selection.carbonForwardCurve, selectedEnvironment.currency)
            : null,
        });
      })
      .catch((error: unknown) => {
        environmentCacheRef.current.delete(cacheKey);
        if (controller.signal.aborted) return;
        if (!mountedRef.current || requestId !== environmentRequestRef.current) return;
        dispatch({
          type: "environment-curves/error",
          error: error instanceof Error ? error.message : "环境关联曲线加载失败",
        });
      });
    return () => controller.abort();
  }, [dataSource, environmentRetryToken, productType, resolveCurve, selectedEnvironment]);

  const previousProductTypeRef = useRef(productType);
  useEffect(() => {
    if (previousProductTypeRef.current === productType) return;
    previousProductTypeRef.current = productType;
    if (state.context.pricingEnvironment) {
      dispatch({
        type: "context/set",
        field: "pricingEnvironment",
        value: state.context.pricingEnvironment,
      });
    }
  }, [productType, state.context.pricingEnvironment]);

  const contextRef = useRef(state.context);
  useEffect(() => {
    contextRef.current = state.context;
  }, [state.context]);

  const setContext = useCallback(
    <K extends keyof IndicativePricingContextValues>(
      field: K,
      value: IndicativePricingContextValues[K],
    ) => {
      const currentValue = contextRef.current[field];
      const isSameValue =
        currentValue === value ||
        (currentValue != null &&
          value != null &&
          typeof currentValue === "object" &&
          typeof value === "object" &&
          (("key" in currentValue &&
            "key" in value &&
            currentValue.key === value.key) ||
            ("id" in currentValue && "id" in value && currentValue.id === value.id)));
      if (isSameValue) return;
      if (field === "pricingEnvironment" && value) {
        const selectedEnvironment = value as PricingEnvironment;
        console.log(
          "[IndicativePricingforSelectedContracts] selected pricing environment id:",
          selectedEnvironment.id,
        );
      }
      contextRef.current = { ...contextRef.current, [field]: value };
      calculationRequestRef.current += 1;
      calculationAbortRef.current?.abort();
      dispatch({ type: "context/set", field, value });
    },
    [],
  );

  const defaultEnvironmentInitializedRef = useRef(false);
  useEffect(() => {
    const environmentResource = state.resources.environments;
    if (
      defaultEnvironmentInitializedRef.current ||
      (environmentResource.status !== "success" &&
        environmentResource.status !== "empty")
    ) {
      return;
    }

    // 默认环境只在目录首次成功加载后应用一次，避免用户手动清空后被再次选中。
    defaultEnvironmentInitializedRef.current = true;
    if (state.context.pricingEnvironment) return;

    const defaultEnvironment = environmentResource.data.find(
      (environment) => environment.isDefault === true,
    );
    if (defaultEnvironment) {
      setContext("pricingEnvironment", defaultEnvironment);
    }
  }, [setContext, state.context.pricingEnvironment, state.resources.environments]);

  const calculate = useCallback(async (): Promise<CalculateOutcome> => {
    if (contracts.length === 0) return { kind: "empty" };

    const currentContext = contextRef.current;
    console.info("511: 计算--表单要素", currentContext);
    const contextErrors = validatePricingContext(currentContext);

    console.info("511: contextErrors", contextErrors);
    const latestSettlement = validateValuationDateAgainstLatestSettlement(
      currentContext.valuationDate,
      contracts,
    );
    if (!latestSettlement.valid && latestSettlement.message) {
      contextErrors.valuationDate = [latestSettlement.message];
    }
    dispatch({ type: "context/errors", errors: contextErrors });

    if (Object.keys(contextErrors).length > 0) {
      return { kind: "invalid" };
    }

    const payload = mapIndicativePricingRequest(contracts, currentContext);
    console.info("511: 计算--请求参数", payload);
    const inputVersion = state.inputVersion;
    const requestId = ++calculationRequestRef.current;
    calculationAbortRef.current?.abort();
    const controller = new AbortController();
    calculationAbortRef.current = controller;
    dispatch({
      type: "calculation/submitting",
      contractIds: contracts.map((contract) => contract.contractId),
    });
    try {
      const rawResponse = logDataSourceResponse(
        "calculate",
        await dataSource.calculate(payload, {
          signal: controller.signal,
        }),
      );
      if (!mountedRef.current || requestId !== calculationRequestRef.current) {
        return { kind: "requestError" };
      }
      const response = Array.isArray(rawResponse) ? rawResponse : [];
      const results = classifyCalculationBatch(
        contracts.map((contract) => contract.contractId),
        response,
        inputVersion,
      );
      dispatch({ type: "calculation/settled", results });
      return {
        kind: "success",
        hasErrors: Object.values(results).some((result) => result.status === "error"),
        hasExtraItems: response.length > contracts.length,
      };
    } catch (error) {
      if (!mountedRef.current || requestId !== calculationRequestRef.current) {
        return { kind: "requestError" };
      }
      const message = getCalculationErrorMessage(error);
      const results = Object.fromEntries(
        contracts.map((contract) => [
          contract.contractId,
          {
            contractId: contract.contractId,
            status: "error" as const,
            result: null,
            message,
            resultInputVersion: inputVersion,
          },
        ]),
      );
      dispatch({ type: "calculation/settled", results });
      return { kind: "requestError" };
    }
  }, [contracts, dataSource, state.inputVersion]);

  const initialized = (Object.keys(state.resources) as ResourceKey[]).every(
    (key) => state.resources[key].status !== "idle" && state.resources[key].status !== "loading",
  );

  return {
    state,
    initialized,
    discountCurves,
    carbonForwardCurves,
    setContext,
    retryResource: loadResource,
    retryEnvironmentCurves: () => {
      if (
        !selectedEnvironment ||
        state.environmentCurvesAttempts >= MAX_RESOURCE_ATTEMPTS
      ) {
        return;
      }
      const cacheKey = JSON.stringify([selectedEnvironment.id, productType]);
      environmentCacheRef.current.delete(cacheKey);
      setEnvironmentRetryToken((value) => value + 1);
    },
    calculate,
    reset: () => {
      calculationRequestRef.current += 1;
      calculationAbortRef.current?.abort();
      environmentRequestRef.current += 1;
      environmentAbortRef.current?.abort();
      dispatch({ type: "reset" });
    },
  };
}
