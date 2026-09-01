import {
  AutoCompleteType,
  BaseState,
  BaseType,
  PaginationType,
} from "./base.type";

export interface JourneySupportRecord {
  no?: number;
  id?: string;
  capacityStatus?: string;
  shipmentNumber?: string;
  shipmentType?: string;
  customerName?: string;
  unitType?: string;
  origin?: string;
  destination?: string;
  licensePlate?: string;
  driver1Name?: string;
  driver2Name?: string;
  lastPosition?: string;
  lastUpdate?: string;
  statusOBD?: string;
}

export interface ActivityLogRecord {
  no?: number;
  status: string;
  locationName: string;
  updatedDateGPS: string;
  coordinateGPS: string;
  addressGPS: string;
  updatedDateOPS: string;
  coordinateOPS: string;
  addressOPS: string;
}

export interface JourneySupportSummary {
  total: number;
  loading: number;
  onJourney: number;
  unloading: number;
}

export interface JourneySupportDriver {
  driverName: string;
  phoneNumber: string;
}

export interface JourneySupportActivity {
  id?: string;
  no?: number;
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
  ordinal?: number;
  opsActualDate?: string;
  opsCoordinate?: string;
  opsAddress?: string;
  createdAt?: string;
  createdBy?: string;
  createdByName?: string;
  status?: string;
}

export interface JourneySupportDetail {
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
  lastUpdate?: string;
  lastPosition?: string;
  statusOBD?: string;
  activities?: JourneySupportActivity[];
}

export interface JourneySupportState extends BaseState<JourneySupportRecord[]> {
  detail: BaseState<JourneySupportDetail, JourneySupportDetailPayload>;
  summary: BaseState<JourneySupportSummary, JourneySupportSummaryPayload>;
  autoComplete: BaseState<AutoCompleteType[]>;
  updateActivity: BaseState<any, UpdateJourneySupportActivtyPayload>;
  updateActivitySkyward: BaseState<
    JourneySupportActivity,
    UpdateJourneyActivitySkywardPayload
  >;
}

export interface BaseResponse<T = unknown> {
  status?: boolean;
  message?: string;
  data?: T;
  code?: string;
  eTag?: string;
}

export interface GetJourneySupportListResponse extends BaseType {
  status?: boolean;
  message?: string;
  data: JourneySupportRecord[];
  pagination?: PaginationType;
  code?: string;
}

export interface JourneySupportDetailPayload {
  id: string;
}

export interface UpdateJourneySupportActivtyPayload
  extends JourneySupportDetailPayload {
  opsActualDate: string;
  opsCoordinate: string;
  opsAddress: string;
  locationId?: string;
  callback?: () => void;
}

export interface UpdateJourneyActivitySkywardPayload {
  id: string;
  callback?: (record: JourneySupportActivity) => void;
}

export interface JourneySupportSummaryPayload {
  branch?: string[];
  shipmentType?: string[];
}

export type GetUpdateActivitySkywardResponse =
  BaseResponse<JourneySupportActivity>;

export type GetJourneySupportSummaryResponse =
  BaseResponse<JourneySupportSummary>;

export type GetJourneySupportDetailResponse =
  BaseResponse<JourneySupportDetail>;

export const journeySupportTypes = {
  GET_JOURNEY_SUPPORT: "journeySupport/getJourneySupport",
  GET_JOURNEY_SUPPORT_FETCH: "journeySupport/getJourneySupportFetch",
  GET_JOURNEY_SUPPORT_SUCCESS: "journeySupport/getJourneySupportSuccess",
  GET_JOURNEY_SUPPORT_FAILURE: "journeySupport/getJourneySupportFailure",
  GET_JOURNEY_SUPPORT_CLEAR: "journeySupport/getJourneySupportClear",

  GET_JOURNEY_SUPPORT_AUTOCOMPLETE:
    "journeySupport/getJourneySupportAutoComplete",
  GET_JOURNEY_SUPPORT_AUTOCOMPLETE_FETCH:
    "journeySupport/getJourneySupportAutoCompleteFetch",
  GET_JOURNEY_SUPPORT_AUTOCOMPLETE_SUCCESS:
    "journeySupport/getJourneySupportAutoCompleteSuccess",
  GET_JOURNEY_SUPPORT_AUTOCOMPLETE_FAILURE:
    "journeySupport/getJourneySupportAutoCompleteFailure",
  GET_JOURNEY_SUPPORT_AUTOCOMPLETE_CLEAR:
    "journeySupport/getJourneySupportAutoCompleteClear",

  GET_SUMMARY_JOURNEY_SUPPORT: "journeySupport/getSummaryJourneySupport",
  GET_SUMMARY_JOURNEY_SUPPORT_FETCH:
    "journeySupport/getSummaryJourneySupportFetch",
  GET_SUMMARY_JOURNEY_SUPPORT_SUCCESS:
    "journeySupport/getSummaryJourneySupportSuccess",
  GET_SUMMARY_JOURNEY_SUPPORT_FAILURE:
    "journeySupport/getSummaryJourneySupportFailure",
  GET_SUMMARY_JOURNEY_SUPPORT_CLEAR:
    "journeySupport/getSummaryJourneySupportClear",

  GET_DETAIL_JOURNEY_SUPPORT: "journeySupport/getDetailJourneySupport",
  GET_DETAIL_JOURNEY_SUPPORT_FETCH:
    "journeySupport/getDetailJourneySupportFetch",
  GET_DETAIL_JOURNEY_SUPPORT_SUCCESS:
    "journeySupport/getDetailJourneySupportSuccess",
  GET_DETAIL_JOURNEY_SUPPORT_FAILURE:
    "journeySupport/getDetailJourneySupportFailure",
  GET_DETAIL_JOURNEY_SUPPORT_CLEAR:
    "journeySupport/getDetailJourneySupportClear",

  UPDATE_ACTIVITY: "journeySupport/updateActivity",
  UPDATE_ACTIVITY_FETCH: "journeySupport/updateActivityFetch",
  UPDATE_ACTIVITY_SUCCESS: "journeySupport/updateActivitySuccess",
  UPDATE_ACTIVITY_FAILURE: "journeySupport/updateActivityFailure",
  UPDATE_ACTIVITY_CLEAR: "journeySupport/updateActivityClear",

  UPDATE_ACTIVITY_SKYWARD: "journeySupport/updateActivitySkyward",
  UPDATE_ACTIVITY_SKYWARD_FETCH: "journeySupport/updateActivitySkywardFetch",
  UPDATE_ACTIVITY_SKYWARD_SUCCESS:
    "journeySupport/updateActivitySkywardSuccess",
  UPDATE_ACTIVITY_SKYWARD_FAILURE:
    "journeySupport/updateActivitySkywardFailure",
  UPDATE_ACTIVITY_SKYWARD_CLEAR: "journeySupport/updateActivitySkywardClear",
};
