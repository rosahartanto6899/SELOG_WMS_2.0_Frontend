import {
  AutoCompleteType,
  BaseState,
  BaseType,
  PaginationType,
} from "./base.type";

export interface ExpensesFilterStateProps {
  branchId?: string[];
  shipmentType?: string[];
  unitTypeId?: string[];
}

export interface SummaryExpenses {
  summary: {
    total: number;
    completed: number;
    incompleted: number;
  };
}

export interface SummaryExpensesPayload {
  branchId?: string[];
  shipmentType?: string[];
  unitType?: string[];
}

export interface ExpensesRecord {
  no?: number;
  id?: string;
  shipmentType?: string;
  branch?: string;
  routeCode?: string;
  jmpCode?: string;
  cmdId?: string;
  customerName?: string;
  unitType?: string;
  origin?: string;
  destination?: string;
  leadtime?: number;
  tollUsage?: number;
  tollUsageName?: string;
  totalDriver?: number;
  revenue?: number;
  totalExpense?: number;
  expenseRatio?: number;
  totalDistance?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExpensesDetail {
  id?: string;
  customerRouteId?: string;
  jmpCode?: string;
  customerId?: string;
  tollUsage?: number;
  origin?: string;
  destination?: string;
  unitType?: string;
  qtyDriver?: number;
  leadtimeValue?: number;
  branchId?: string;
  shipmentType?: string;
  driverType?: string;
  status?: string;
  distanceFuelCalculation?: {
    distanceWithCargo?: number;
    toleranceWithCargo?: number;
    distanceWithoutCargo?: number;
    toleranceWithoutCargo?: number;
    fuelCargo?: number;
    totalFuel?: number;
  };
  operationalCosts?: {
    fuel?: number;
    fuelEmpty?: number;
    toll?: number;
    mell?: number;
    loadingUnloading?: number;
    harborCrossing?: number;
    workerContributions?: number;
    security?: number;
    totalCost?: number;
  };
  incentive?: {
    incentiveKM?: number;
    incentiveDaily?: number;
    incentiveSIO?: number;
    totalIncentive?: number;
  };
  totalExpenses?: {
    totalExpense?: number;
    totalExpenseRatio?: number;
  };
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
}

export interface ExpensesUpsertProps {
  no?: string;
  branch?: string;
  routeCode?: string;
  shipmentType?: string;
  driverType?: string;
  distanceCargo?: string;
  toleranceCargo?: string;
  totalDistanceCargo?: string;
  distanceEmpty?: string;
  toleranceEmpty?: string;
  totalDistanceEmpty?: string;
  totalDistance?: string;
  fuelCargo?: string;
  fuelEmpty?: string;
  totalFuel?: string;
  fuel?: string;
  toll?: string;
  mell?: string;
  loadingUnloading?: string;
  harborCrossing?: string;
  workerContributions?: string;
  security?: string;
  totalCost?: string;
  incentiveKm?: string;
  incentiveDaily?: string;
  incentiveSio?: string;
  totalIncentive?: string;
  revenue?: string;
  totalExpense?: string;
  expenseRatio?: string;
  upsertStatus?: string;
  upsertReason?: string;
  documentShippingFee?: number;
  termin1?: number;
  termin2?: number;
  termin3?: number;
  termin4?: number;
  termin5?: number;
  termin6?: number;
}

export interface ExpensesTemplatePayload {
  customerId: string;
  contractId: string;
  customerRouteIds: string[];
  branchIds: string[];
}

export interface ExpensesPayload {
  customerRouteId: string;
  branchId: string;
  shipmentType: string; // Ritase or Dedicated
  driverType: string; // MITRA or PKWT
  distanceWithCargo: number;
  toleranceWithCargo: number;
  distanceWithoutCargo: number;
  toleranceWithoutCargo: number;
  fuelCargo: number;
  fuelEmpty: number;
  fuel: number;
  toll: number;
  mell: number;
  loadingUnloading: number;
  harborCrossing: number;
  workerContributions: number;
  security: number;
  incentiveKM: number;
  incentiveDaily: number;
  incentiveSIO: number;
  documentShippingFee: number;
  termin1: number;
  termin2: number;
  termin3: number;
  termin4: number;
  termin5: number;
  termin6: number;
}

export interface ExpensesState extends BaseState<ExpensesRecord[]> {
  autoComplete: BaseState<AutoCompleteType[]>;
  detailExpenses: BaseState<ExpensesDetail, { id?: string }>;
  updateExpenses: BaseState<{ id?: string }, UpdateExpensesActionPayload>;
  createExpenses: BaseState<{ id?: string }, CreateExpensesActionPayload>;
  summaryExpenses: BaseState<SummaryExpenses>;
  downloadExpensesTemplate: BaseState<null>;
}

export interface UpdateExpensesActionPayload {
  id: string;
  payload: ExpensesPayload;
  callback?: () => void;
}

export interface CreateExpensesActionPayload {
  payload: ExpensesPayload;
  callback?: () => void;
  isUpsert?: boolean;
}

export interface GetExpensesListResponse extends BaseType {
  status?: boolean;
  message?: string;
  data: ExpensesRecord[];
  pagination?: PaginationType;
  code?: string;
}

export interface BaseResponse<T = unknown> {
  status?: boolean;
  message?: string;
  data?: T;
  code?: string;
  eTag?: string;
}

export type GetExpensesDetailResponse = BaseResponse<ExpensesDetail>;
export type UpdateExpensesResponse = BaseResponse<{ id?: string }>;
export type CreateExpensesResponse = BaseResponse<{ id?: string }>;
export type GetSummaryExpensesResponse = BaseResponse<SummaryExpenses>;

export const expensesTypes = {
  GET_EXPENSES: "expenses/getExpenses",
  GET_EXPENSES_FETCH: "expenses/getExpensesFetch",
  GET_EXPENSES_SUCCESS: "expenses/getExpensesSuccess",
  GET_EXPENSES_FAILURE: "expenses/getExpensesFailure",
  GET_EXPENSES_CLEAR: "expenses/getExpensesClear",

  GET_EXPENSES_AUTOCOMPLETE: "expenses/getExpensesAutoComplete",
  GET_EXPENSES_AUTOCOMPLETE_FETCH: "expenses/getExpensesAutoCompleteFetch",
  GET_EXPENSES_AUTOCOMPLETE_SUCCESS: "expenses/getExpensesAutoCompleteSuccess",
  GET_EXPENSES_AUTOCOMPLETE_FAILURE: "expenses/getExpensesAutoCompleteFailure",
  GET_EXPENSES_AUTOCOMPLETE_CLEAR: "expenses/getExpensesAutoCompleteClear",

  GET_EXPENSES_DETAIL: "expenses/getExpensesDetail",
  GET_EXPENSES_DETAIL_FETCH: "expenses/getExpensesDetailFetch",
  GET_EXPENSES_DETAIL_SUCCESS: "expenses/getExpensesDetailSuccess",
  GET_EXPENSES_DETAIL_FAILURE: "expenses/getExpensesDetailFailure",
  GET_EXPENSES_DETAIL_CLEAR: "expenses/getExpensesDetailClear",

  UPDATE_EXPENSES: "expenses/updateExpenses",
  UPDATE_EXPENSES_FETCH: "expenses/updateExpensesFetch",
  UPDATE_EXPENSES_SUCCESS: "expenses/updateExpensesSuccess",
  UPDATE_EXPENSES_FAILURE: "expenses/updateExpensesFailure",
  UPDATE_EXPENSES_CLEAR: "expenses/updateExpensesClear",

  CREATE_EXPENSES: "expenses/createExpenses",
  CREATE_EXPENSES_FETCH: "expenses/createExpensesFetch",
  CREATE_EXPENSES_SUCCESS: "expenses/createExpensesSuccess",
  CREATE_EXPENSES_FAILURE: "expenses/createExpensesFailure",
  CREATE_EXPENSES_CLEAR: "expenses/createExpensesClear",

  GET_SUMMARY_EXPENSES: "expenses/getSummaryExpenses",
  GET_SUMMARY_EXPENSES_FETCH: "expenses/getSummaryExpensesFetch",
  GET_SUMMARY_EXPENSES_SUCCESS: "expenses/getSummaryExpensesSuccess",
  GET_SUMMARY_EXPENSES_FAILURE: "expenses/getSummaryExpensesFailure",
  GET_SUMMARY_EXPENSES_CLEAR: "expenses/getSummaryExpensesClear",

  DOWNLOAD_EXPENSES_TEMPLATE: "expenses/downloadExpensesTemplate",
  DOWNLOAD_EXPENSES_TEMPLATE_FETCH: "expenses/downloadExpensesTemplateFetch",
  DOWNLOAD_EXPENSES_TEMPLATE_SUCCESS:
    "expenses/downloadExpensesTemplateSuccess",
  DOWNLOAD_EXPENSES_TEMPLATE_FAILURE:
    "expenses/downloadExpensesTemplateFailure",
  DOWNLOAD_EXPENSES_TEMPLATE_CLEAR: "expenses/downloadExpensesTemplateClear",
};
