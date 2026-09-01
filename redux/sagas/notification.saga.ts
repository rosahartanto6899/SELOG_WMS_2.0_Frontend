// import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosResponse } from "axios";
import { all, /* call, */ fork, put, takeEvery } from "redux-saga/effects";

import {
  NotificationDailyResponse,
  NotificationState,
  notificationTypes,
  // PayloadNotificationDaily,
} from "../../types/notification.type";
import {
  getNotificationDailyFailure,
  getNotificationDailySuccess,
  getNotificationFleetGroupFailure,
  getNotificationFleetGroupSuccess,
} from "../slices/notification.slice";

function* retrieveNotificationDaily(): Generator<
  // params: PayloadAction<PayloadNotificationDaily>
  unknown,
  void,
  AxiosResponse<NotificationDailyResponse> & NotificationState
> {
  try {
    // const result = yield call(VehicleApi().retrieveNotificationDaily, { ...params.payload });
    const result = {
      status: 404,
      data: {
        data: [],
        count: 0,
      },
      code: "",
      message: "",
      eTag: "",
      page: 1,
      limit: 10,
      totalData: null,
      totalPage: null,
      sort: null,
      order: null,
      search: null,
      searchBy: null,
    };

    if (result?.status === 200) {
      yield put(getNotificationDailySuccess(result));
    }
  } catch (error) {
    yield put(getNotificationDailyFailure(error));
  }
}

function* retrieveFleetGroupNotification(): Generator<
  // params: PayloadAction<{ businessAreaId?: string }>
  unknown,
  void,
  AxiosResponse<NotificationDailyResponse> & NotificationState
> {
  try {
    // const result = yield call(FleetGroupApi().retrieveDropdownDashboardFleetGroups, { ...params.payload });
    const result = {
      status: 404,
      data: {
        status: 404,
        data: null,
      },
    };

    if (result?.status === 200) {
      yield put(getNotificationFleetGroupSuccess(result.data));
    }
  } catch (error) {
    yield put(getNotificationFleetGroupFailure(error));
  }
}

function* watchNotification() {
  yield takeEvery(
    notificationTypes.GET_NOTIFICATION_DAILY_FETCH,
    retrieveNotificationDaily,
  );
  yield takeEvery(
    notificationTypes.GET_FLEETGROUP_NOTIFICATION_FETCH,
    retrieveFleetGroupNotification,
  );
}

export default function* menuSaga() {
  yield all([fork(watchNotification)]);
}
