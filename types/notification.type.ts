import { BaseType } from "./base.type";

export interface Level {
  id: number;
  description: string;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface AlertConfigurationMappingAttribute {
  fleetGroupId?: string;
  alertConfigurationId?: string;
  treshold?: number;
}

export interface FleetGroup {
  no?: number;
  id?: string;
  fleetGroupName?: string;
  fleetGroupNameOld?: string;
  fleetGroupCode?: string;
  level?: Level;
  levels?: number;
  parentId?: string;
  isSoundNotif?: boolean;
  isFuelConsumption?: boolean;
  utilization?: number;
  alertConfigurationMapping?: AlertConfigurationMappingAttribute[];
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface PayloadNotificationDaily {
  fleetGroupId?: string;
}

export interface NotificationDailyWaktu {
  _seconds?: number;
  _nanoseconds?: number;
}

export interface NotificationDaily {
  licensePlate?: string;
  _id?: string;
  deviceTime?: string;
  eventType?: string;
  eventName?: string;
  alertCategoryName?: string;
  isSoundNotif?: string;
  fleetGroupId?: string;
}

export interface NotificationDailyData {
  title?: string;
  body?: NotificationDaily;
}

export interface DataNotificationDaily {
  data: NotificationDaily[] | [];
  count: number;
  // pagination: PaginationType;
}

export interface NotificationDailyResponse extends BaseType {
  status: number;
  data: DataNotificationDaily;
  code: string;
  message: string;
  eTag: string;
}

export interface Options extends BaseType {
  hasMore: boolean;
}

export interface NotificationState {
  data: NotificationDaily[] | [];
  count: number;
  saveState: boolean;
  autoComplete: null;
  options: Options;
  error: Error | string | null;
  fleetGroups: {
    data: FleetGroup[];
  };
  isLoading: boolean;
}

export const notificationTypes = {
  GET_NOTIFICATION_DAILY: "notification/retrieveNotificationDaily",
  GET_NOTIFICATION_DAILY_FETCH: "notification/getNotificationDailyFetch",
  GET_NOTIFICATION_DAILY_SUCCESS: "notification/getNotificationDailySuccess",
  GET_NOTIFICATION_DAILY_FAILURE: "notification/getNotificationDailyFailure",

  GET_FLEETGROUP_NOTIFICATION: "notification/getNotificationFleetGroup",
  GET_FLEETGROUP_NOTIFICATION_FETCH:
    "notification/getNotificationFleetGroupFetch",
  GET_FLEETGROUP_NOTIFICATION_SUCCESS:
    "notification/getNotificationFleetGroupSuccess",
  GET_FLEETGROUP_NOTIFICATION_FAILURE:
    "notification/getNotificationFleetGroupFailure",
};
