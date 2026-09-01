import { AutoCompleteType, BaseType, PaginationType } from "./base.type";

export interface UserLog {
  no?: number;
  id?: string;
  userId?: string;
  platform?: string;
  activityName?: string;
  activityDetail?: string;
  ipAddress?: string;
  channel?: string;
  createdAt?: string;
  createdBy?: string;
  isInternal?: string;
  name?: string;
  email?: string;
}

export interface DataUserLog {
  data?: UserLog[] | [];
  pagination?: PaginationType;
}

export interface GetUserLogsResponse extends BaseType {
  status?: boolean;
  message?: string;
  data?: DataUserLog;
  code?: string;
  eTag?: string;
}

export interface UserLogsAutoComplete {
  options: BaseType;
  data: AutoCompleteType[] | [];
}

export interface ExportUserLogsPayload {
  searchBy: string | null;
  search: string | null;
}
export interface UserLogState {
  data?: UserLog[];
  isLoading?: boolean;
  saveState?: boolean;
  error?: Error | string | null;
  autoComplete: UserLogsAutoComplete;
  options?: BaseType;
  dropdownUserLogs: {
    data: UserLog[];
  };
  userLogDetail: {
    data: UserLog;
  };
  exportUserLogs: {
    options?: ExportUserLogsPayload;
  };
}

export const userLogTypes = {
  GET_USER_LOGS: "userLogs/getUserLogs",
  GET_USER_LOGS_FETCH: "userLogs/getUserLogsFetch",
  GET_USER_LOGS_SUCCESS: "userLogs/getUserLogsSuccess",
  GET_USER_LOGS_FAILURE: "userLogs/getUserLogsFailure",

  GET_USER_LOG_DETAIL: "userLogs/getUserLogDetail",
  GET_USER_LOG_DETAIL_FETCH: "userLogs/getUserLogDetailFetch",
  GET_USER_LOG_DETAIL_SUCCESS: "userLogs/getUserLogDetailSuccess",
  GET_USER_LOG_DETAIL_FAILURE: "userLogs/getUserLogDetailFailure",

  GET_USER_LOGS_AUTOCOMPLETE_FETCH: "userLogs/getUserLogsAutoCompleteFetch",
  GET_USER_LOGS_AUTOCOMPLETE_SUCCESS: "userLogs/getUserLogsAutoCompleteSuccess",
  GET_USER_LOGS_AUTOCOMPLETE_FAILURE: "userLogs/getUserLogsAutoCompleteFailure",

  GET_DROPDOWN_USER_LOGS: "userLogs/getDropdownUserLogs",
  GET_DROPDOWN_USER_LOGS_FETCH: "userLogs/getDropdownUserLogsFetch",
  GET_DROPDOWN_USER_LOGS_SUCCESS: "userLogs/getDropdownUserLogsSuccess",
  GET_DROPDOWN_USER_LOGS_FAILURE: "userLogs/getDropdownUserLogsFailure",

  EXPORT_USER_LOG: "userLogs/exportUserLogs",
  EXPORT_USER_LOG_FETCH: "userLogs/exportUserLogsFetch",
  EXPORT_USER_LOG_SUCCESS: "userLogs/exportUserLogsSuccess",
  EXPORT_USER_LOG_FAILURE: "userLogs/exportUserLogsFailure",
};
