export interface ExportLog {
  no?: number;
  id: string;
  createdAt?: string;
  exportedAt?: string;
  expiredAt?: string;
  url?: string;
}

export interface ExportLogPayload {
  type: string;
}

export interface GetExportLogResponse {
  status?: boolean;
  message?: string;
  data?: ExportLog[] | [];
  code?: string;
  eTag?: string;
}

export interface ExportLogState {
  data: ExportLog[];
  options?: ExportLogPayload;
  isLoading?: boolean;
  error?: Error | string | null;
}

export const exportLogTypes = {
  GET_EXPORT_LOG: "exportLogs/getExportLogs",
  GET_EXPORT_LOG_FETCH: "exportLogs/getExportLogsFetch",
  GET_EXPORT_LOG_SUCCESS: "exportLogs/getExportLogsSuccess",
  GET_EXPORT_LOG_FAILURE: "exportLogs/getExportLogsFailure",
};
