import {
  AutoCompleteType,
  BaseResponseData,
  BaseState,
  PaginationType,
} from "./base.type";

export interface JourneyHistoryState {
  getSummary: BaseState<Summary, FilterParams>;
  getJourneyList: BaseState<JourneyList[], FilterParams>;
  getACJourneyList: BaseState<AutoCompleteType[], FilterParams>;
  getJourneyDetail: BaseState<JourneyDetail, JourneyDetailParams>;
}

export interface FilterParams {
  branchId?: string[];
  shipmentType?: string[];
  month?: string[];
}

export interface Summary {
  totalShipment?: number;
  delayed?: number;
  ontime?: number;
  early?: number;
}

export interface JourneyList {
  no?: number;
  actualTimeArrival?: string;
  bookingOrderNo?: string;
  createdAt?: string;
  customerName?: string;
  destination?: string;
  drivers?: string[];
  licensePlate?: string;
  origin?: string;
  salesDealing?: string;
  salesServicing?: string;
  serviceType?: string;
  shipmentNo?: string;
  shipmentType?: string;
  status?: string;
  unitType?: string;
}

export interface JourneyDetail {
  status?: string;
  createdDate?: string;
  finishedDate?: string;
  salesDealing?: string;
  salesServicing?: string;
  bookingNumber?: string;
  shipmentNumber?: string;
  shipmentType?: string;
  customerName?: string;
  serviceType?: string;
  branchName?: string;
  unitType?: string;
  origin?: string;
  destination?: string;
  licensePlate?: string;
  driver1?: string;
  driver1PhoneNumber?: string;
  driver2?: string;
  driver2PhoneNumber?: string;
  activities?: JourneyDetailActivity[];
}

export interface JourneyDetailActivity extends BaseResponseData {
  id?: string;
  shipmentId?: string;
  activity?: string;
  locationId?: string;
  locationCode?: string;
  locationName?: string;
  plannedDate?: string;
  activityType?: string;
  obdActualDate?: string;
  obdCoordinate?: string;
  obdAddress?: string;
  opsActualDate?: string;
  opsCoordinate?: string;
  opsAddress?: string;
}

export interface JourneyDetailParams {
  id?: string;
}

export interface GetSummaryResponse {
  status?: boolean;
  message?: string;
  data?: Summary;
  code?: string;
  eTag?: string;
}

export interface GetJourneyListResponse {
  status?: boolean;
  message?: string;
  data?: JourneyList[];
  pagination?: PaginationType;
  code?: string;
  eTag?: string;
}

export interface GetJourneyDetailResponse {
  status?: boolean;
  message?: string;
  data?: JourneyDetail;
  code?: string;
  eTag?: string;
}

export const journeyHistoryType = {
  GET_SUMMARY: "journeyHistory/getSummary",
  GET_SUMMARY_FETCH: "journeyHistory/getSummaryFetch",
  GET_SUMMARY_SUCCESS: "journeyHistory/getSummarySuccess",
  GET_SUMMARY_FAILURE: "journeyHistory/getSummaryFailure",

  GET_JOURNEY_LIST: "journeyHistory/getJourneyList",
  GET_JOURNEY_LIST_FETCH: "journeyHistory/getJourneyListFetch",
  GET_JOURNEY_LIST_SUCCESS: "journeyHistory/getJourneyListSuccess",
  GET_JOURNEY_LIST_FAILURE: "journeyHistory/getJourneyListFailure",

  GET_AC_JOURNEY_LIST: "journeyHistory/getACJourneyList",
  GET_AC_JOURNEY_LIST_FETCH: "journeyHistory/getACJourneyListFetch",
  GET_AC_JOURNEY_LIST_SUCCESS: "journeyHistory/getACJourneyListSuccess",
  GET_AC_JOURNEY_LIST_FAILURE: "journeyHistory/getACJourneyListFailure",

  GET_JOURNEY_DETAIL: "journeyHistory/getJourneyDetail",
  GET_JOURNEY_DETAIL_FETCH: "journeyHistory/getJourneyDetailFetch",
  GET_JOURNEY_DETAIL_SUCCESS: "journeyHistory/getJourneyDetailSuccess",
  GET_JOURNEY_DETAIL_FAILURE: "journeyHistory/getJourneyDetailFailure",
};
