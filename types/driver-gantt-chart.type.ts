import { BaseState, BaseType, PaginationType } from "./base.type";

export interface IDriverUtilization {
  startDate: string;
  endDate: string;
  status?: string;
  progress?: number;
  startJourneyDate?: string;
  endJourneyDate?: string;
}

export interface IDriverGanttChartData {
  no?: number;
  id?: string;
  contractStatus?: string;
  branchId?: string;
  branchName?: string;
  shipmentType?: string;
  employeeId?: string;
  vkvd?: string;
  driverName?: string;
  employeeStatus?: string;
  resignDate?: string;
  endDate?: string;
  startJourneyDate?: string;
  endJourneyDate?: string;
  utilizations?: IDriverUtilization[];
}

export interface IDriverGanttChartListResponse extends BaseType {
  status?: boolean;
  message?: string;
  data?: IDriverGanttChartData[];
  code?: string;
  eTag?: string;
  pagination?: PaginationType;
}

export interface IDriverGanttChartSummaryResponse extends BaseType {
  status?: boolean;
  message?: string;
  data?: {
    summary: {
      [key: string]: number;
    };
  };
  code?: string;
  eTag?: string;
}

export interface IDriverGanttChartPayload {
  page?: number;
  limit?: number;
  start?: string;
  end?: string;
  "branchId[]"?: string[];
  "shipmentType[]"?: string[];
  "employeeStatus[]"?: string[];
  "driverStatus[]"?: string[];
}

export interface IDriverGanttChartState extends BaseState {
  data: IDriverGanttChartData[];
  summary: {
    [key: string]: number;
  };
  saveState?: boolean;
  options: Omit<IDriverGanttChartPayload, "page" | "limit"> & {
    page: number;
    limit: number;
    totalData?: number;
    totalPage?: number;
  };
}

export interface GanttChartParams {
  branchId?: string[];
  shipmentType?: string[];
  employeeStatus?: string[];
  driverStatus?: string[];
}

export const driverGanttChartTypes = {
  GET_DRIVER_GANTT_CHART: "driverGanttChart/getDriverGanttChart",
  GET_DRIVER_GANTT_CHART_FETCH: "driverGanttChart/getDriverGanttChartFetch",
  GET_DRIVER_GANTT_CHART_SUCCESS: "driverGanttChart/getDriverGanttChartSuccess",
  GET_DRIVER_GANTT_CHART_FAILURE: "driverGanttChart/getDriverGanttChartFailure",

  GET_DRIVER_GANTT_CHART_SUMMARY: "driverGanttChart/getDriverGanttChartSummary",
  GET_DRIVER_GANTT_CHART_SUMMARY_FETCH:
    "driverGanttChart/getDriverGanttChartSummaryFetch",
  GET_DRIVER_GANTT_CHART_SUMMARY_SUCCESS:
    "driverGanttChart/getDriverGanttChartSummarySuccess",
  GET_DRIVER_GANTT_CHART_SUMMARY_FAILURE:
    "driverGanttChart/getDriverGanttChartSummaryFailure",

  RESET_DRIVER_GANTT_CHART_STATE: "driverGanttChart/resetDriverGanttChartState",
};
