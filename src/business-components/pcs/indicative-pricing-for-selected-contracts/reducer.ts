import { EMPTY_CONTEXT } from "./constants";
import type {
  ContractCalculationState,
  CurveCatalogItem,
  IndicativePricingContextValues,
  PricingEnvironment,
} from "./types";
import type { PricingContextErrors } from "./utils/validation";

export type ResourceStatus = "idle" | "loading" | "success" | "empty" | "error";
export type ResourceKey =
  | "environments"
  | "discountDefinitions"
  | "customDiscountCurves"
  | "carbonDefinitions"
  | "customCarbonCurves";

export interface ResourceState<T> {
  status: ResourceStatus;
  data: T;
  error: string | null;
  attempts: number;
}

export interface PricingResources {
  environments: ResourceState<readonly PricingEnvironment[]>;
  discountDefinitions: ResourceState<readonly CurveCatalogItem[]>;
  customDiscountCurves: ResourceState<readonly CurveCatalogItem[]>;
  carbonDefinitions: ResourceState<readonly CurveCatalogItem[]>;
  customCarbonCurves: ResourceState<readonly CurveCatalogItem[]>;
}

export interface IndicativePricingState {
  context: IndicativePricingContextValues;
  contextErrors: PricingContextErrors;
  resources: PricingResources;
  environmentCurvesStatus: ResourceStatus;
  environmentCurvesError: string | null;
  environmentCurvesAttempts: number;
  resultByContractId: Record<string, ContractCalculationState>;
  inputVersion: number;
  submitting: boolean;
}

type ResourceData = readonly PricingEnvironment[] | readonly CurveCatalogItem[];

export type IndicativePricingAction =
  | { type: "resource/loading"; key: ResourceKey }
  | { type: "resource/success"; key: ResourceKey; data: ResourceData }
  | { type: "resource/error"; key: ResourceKey; error: string }
  | {
      type: "context/set";
      field: keyof IndicativePricingContextValues;
      value: IndicativePricingContextValues[keyof IndicativePricingContextValues];
    }
  | { type: "context/errors"; errors: PricingContextErrors }
  | { type: "environment-curves/loading" }
  | { type: "environment-curves/error"; error: string }
  | {
      type: "environment-curves/success";
      discountCurve: CurveCatalogItem | null;
      carbonForwardCurve: CurveCatalogItem | null;
    }
  | { type: "calculation/submitting"; contractIds: readonly string[] }
  | {
      type: "calculation/settled";
      results: Record<string, ContractCalculationState>;
    }
  | { type: "reset" };

function resource<T>(data: T): ResourceState<T> {
  return { status: "idle", data, error: null, attempts: 0 };
}

export function createInitialState(
  contractIds: readonly string[],
  initialContext: Partial<IndicativePricingContextValues> = {},
): IndicativePricingState {
  return {
    context: { ...EMPTY_CONTEXT, ...initialContext },
    contextErrors: {},
    resources: {
      environments: resource<readonly PricingEnvironment[]>([]),
      discountDefinitions: resource<readonly CurveCatalogItem[]>([]),
      customDiscountCurves: resource<readonly CurveCatalogItem[]>([]),
      carbonDefinitions: resource<readonly CurveCatalogItem[]>([]),
      customCarbonCurves: resource<readonly CurveCatalogItem[]>([]),
    },
    environmentCurvesStatus: "idle",
    environmentCurvesError: null,
    environmentCurvesAttempts: 0,
    resultByContractId: Object.fromEntries(
      contractIds.map((contractId) => [
        contractId,
        {
          contractId,
          status: "idle",
          result: null,
          message: null,
          resultInputVersion: null,
        },
      ]),
    ),
    inputVersion: 0,
    submitting: false,
  };
}

function clearResults(state: IndicativePricingState) {
  return Object.fromEntries(
    Object.keys(state.resultByContractId).map((contractId) => [
      contractId,
      {
        contractId,
        status: "idle" as const,
        result: null,
        message: null,
        resultInputVersion: null,
      },
    ]),
  );
}

export function indicativePricingReducer(
  state: IndicativePricingState,
  action: IndicativePricingAction,
): IndicativePricingState {
  switch (action.type) {
    case "resource/loading": {
      const current = state.resources[action.key];
      return {
        ...state,
        resources: {
          ...state.resources,
          [action.key]: {
            ...current,
            status: "loading",
            error: null,
            attempts: current.attempts + 1,
          },
        },
      };
    }
    case "resource/success":
      return {
        ...state,
        resources: {
          ...state.resources,
          [action.key]: {
            ...state.resources[action.key],
            status: action.data.length === 0 ? "empty" : "success",
            data: action.data,
            error: null,
          },
        } as PricingResources,
      };
    case "resource/error":
      return {
        ...state,
        resources: {
          ...state.resources,
          [action.key]: {
            ...state.resources[action.key],
            status: "error",
            error: action.error,
          },
        },
      };
    case "context/set": {
      const isEnvironment = action.field === "pricingEnvironment";
      const context = {
        ...state.context,
        [action.field]: action.value,
        ...(isEnvironment
          ? { discountCurve: null, carbonForwardCurve: null }
          : undefined),
      };
      const contextErrors = { ...state.contextErrors };
      delete contextErrors[action.field];
      if (isEnvironment) {
        delete contextErrors.discountCurve;
        delete contextErrors.carbonForwardCurve;
      }
      return {
        ...state,
        context,
        contextErrors,
        environmentCurvesStatus: isEnvironment ? "idle" : state.environmentCurvesStatus,
        environmentCurvesError: isEnvironment ? null : state.environmentCurvesError,
        environmentCurvesAttempts: isEnvironment ? 0 : state.environmentCurvesAttempts,
        resultByContractId: clearResults(state),
        inputVersion: state.inputVersion + 1,
        submitting: false,
      };
    }
    case "context/errors":
      return { ...state, contextErrors: action.errors };
    case "environment-curves/loading":
      return {
        ...state,
        environmentCurvesStatus: "loading",
        environmentCurvesError: null,
        environmentCurvesAttempts: state.environmentCurvesAttempts + 1,
      };
    case "environment-curves/error":
      return {
        ...state,
        environmentCurvesStatus: "error",
        environmentCurvesError: action.error,
      };
    case "environment-curves/success":
      return {
        ...state,
        context: {
          ...state.context,
          discountCurve: action.discountCurve,
          carbonForwardCurve: action.carbonForwardCurve,
        },
        environmentCurvesStatus:
          action.discountCurve && action.carbonForwardCurve ? "success" : "empty",
        environmentCurvesError: null,
        environmentCurvesAttempts: 0,
      };
    case "calculation/submitting":
      return {
        ...state,
        submitting: true,
        resultByContractId: Object.fromEntries(
          action.contractIds.map((contractId) => [
            contractId,
            {
              contractId,
              status: "submitting",
              result: null,
              message: null,
              resultInputVersion: null,
            },
          ]),
        ),
      };
    case "calculation/settled":
      return {
        ...state,
        submitting: false,
        resultByContractId: action.results,
      };
    case "reset":
      return {
        ...state,
        context: { ...EMPTY_CONTEXT },
        contextErrors: {},
        environmentCurvesStatus: "idle",
        environmentCurvesError: null,
        environmentCurvesAttempts: 0,
        resultByContractId: clearResults(state),
        inputVersion: state.inputVersion + 1,
        submitting: false,
      };
  }
}
