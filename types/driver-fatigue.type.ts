import { BaseState, BaseType, PaginationType } from "./base.type";

export interface IFatigueListResponseData {
  id: string;
  branchId: string;
  branchName: string;
  shipmentType: string;
  driverID: string;
  driverName: string;
  employeeStatus: string;
  period: string;
  lastShipment: string;
  numberOfTrip: number;
  hoursDriven: number;
  healthResult: string;
  fatigueLevel: string;
  recommendation: string;
  updatedFrom: string;
  updatedBy: string;
  updatedDate: string;
}

export interface IFatigueData {
  list?: IFatigueListResponseData[];
}

export interface IFatigueListResponse extends BaseType {
  status?: boolean;
  message?: string;
  data?: IFatigueData;
  code?: string;
  eTag?: string;
  pagination?: PaginationType;
}

export interface ISummaryPayload {
  "branchId[]"?: string[];
  "shipmentType[]"?: string[];
  "employeeStatus[]"?: string[];
}

export interface ISummaryResponseData {
  totalDrivers?: number;
  fatigueSummary?: {
    low: number;
    medium: number;
    high: number;
  };
}

export interface ISummaryResponse {
  status?: boolean;
  message?: string;
  data?: ISummaryResponseData;
  code?: string;
  eTag?: string;
  pagination?: PaginationType;
}

// export interface IFatigueDetailResponse {}

// export interface IFatigueUpdatePayload {}

export interface IFatigueListPayload extends BaseType {
  "branchId[]"?: string | string[];
  "employeeStatus[]"?: string | string[];
  "shipmentType[]"?: string | string[];
  driverName?: string;
  fatigueLevel?: string;
  healthResult?: string;
  recommendation?: string;
}

export interface IFatigueUpdate {
  id: string;
  //TODO type
  payload: any;
}

export interface IDriverFilterDataOption {
  label: string;
  value: string;
}
export interface IDriverFilterData {
  label: string;
  value: string;
  options: IDriverFilterDataOption[];
}

export interface IDriverFilterResponse {
  transactionId: string;
  code: string;
  message: string;
  eTag: string;
  data: IDriverFilterResponseData[];
}
export interface IDriverFilterResponseData {
  id: string;
  name: string;
}

export interface IFatigueDetailsResponse {
  data: IFatigueDetailsResponseData;
}

export interface IFatigueDetailsResponseData {
  driverId: string;
  driverName: string;
  shipmentDriverId?: any;
  healthResult: string;
  note: string;
  declaration: IFatigueDetailsResponseDeclaration;
  healthCheck: IFatigueDetailsResponseHealthCheck;
  questions: IFatigueDetailsResponseQuestion[];
}
export interface IFatigueDetailsResponseQuestion {
  id: string;
  category: string;
  question: string;
  answer?: boolean;
}
export interface IFatigueDetailsResponseHealthCheck {
  id: string;
  filledAt: string;
  healthResult: string;
  answers: IFatigueDetailsResponseAnswer[];
}
export interface IFatigueDetailsResponseAnswer {
  questionId: string;
  value: boolean;
  note?: string;
}
export interface IFatigueDetailsResponseDeclaration {
  id?: any;
  filledAt?: any;
  healthResult?: any;
  answers: any[];
}
export interface IDriverFatigueState
  extends BaseState<IFatigueListResponseData[], BaseType> {
  getSummary: BaseState<ISummaryResponseData, ISummaryPayload>;
  getFilterOption: BaseState<IDriverFilterData[]>;
  getDetails: BaseState<IFatigueDetailsResponseData | null>;
}

export interface IFatiguePayloadHealthCheck {
  driverId: string;
  healthResult: string;
  note: string;
  details: IFatiguePayloadHealthCheckDetail[];
}
export interface IFatiguePayloadHealthCheckDetail {
  healthAssessmentQuestionId: string;
  answer: boolean;
  note?: string;
}

export const driverFatigueTypes = {
  GET_SUMMARY: "driverFatigue/getSummaryFetch",
  GET_FATIGUE_LIST_FETCH: "driverFatigue/getFatigueListFetch",
  GET_FATIGUE_FILTER_FETCH: "driverFatigue/getFatigueFilterFetch",
  GET_FATIGUE_DETAIL_FETCH: "driverFatigue/getFatigueDetailsFetch",
  POST_FATIGUE_DETAIL_FETCH: "driverFatigue/postFatigueDetailsFetch",
};
