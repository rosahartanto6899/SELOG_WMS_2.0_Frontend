/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import UnitDriverCapacityApi from "@sera-libraries/api/unit-driver-capacity";
import { unitDriverCapacityActions } from "@sera-redux/slices/unit-driver-capacity.slice";
import { BaseType } from "@sera-types/base.type";
import {
  DriverCapacityForecastPayload,
  GetCapacityStatusResponse,
  GetDriverCapacityDetailResponse,
  GetDriverCapacityForecastResponse,
  GetDriverCapacityResponse,
  GetDriverCapacitySummaryResponse,
  GetEmployeeStatusResponse,
  GetUnitCapacityDetailResponse,
  GetUnitCapacityForecastResponse,
  GetUnitCapacityResponse,
  GetUnitCapacitySummaryResponse,
  UnitCapacityForecastPayload,
  UnitDriverCapacityState,
  unitDriverCapacityTypes,
  UnitDriverSummaryPayload,
} from "@sera-types/unit-driver-capacity.type";
import { captureErrorAxios } from "@sera-utils/error-handler";
import { AxiosResponse } from "axios";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

function* getUnitCapacitySaga(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetUnitCapacityResponse> & UnitDriverCapacityState
> {
  try {
    const result = yield call(UnitDriverCapacityApi().retrieveUnitCapacity, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(unitDriverCapacityActions.getUnitCapacitySuccess(result.data));
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(
      unitDriverCapacityActions.getUnitCapacityFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data?.code,
      }),
    );
  }
}

function* getUnitCapacityAutoCompleteSaga(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetUnitCapacityResponse> & UnitDriverCapacityState
> {
  try {
    const result = yield call(UnitDriverCapacityApi().retrieveUnitCapacity, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(
        unitDriverCapacityActions.getUnitCapacityAutoCompleteSuccess(
          result.data,
        ),
      );
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(
      unitDriverCapacityActions.getUnitCapacityAutoCompleteFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data?.code,
      }),
    );
  }
}

function* getDriverCapacitySaga(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetDriverCapacityResponse> & UnitDriverCapacityState
> {
  try {
    const result = yield call(UnitDriverCapacityApi().retrieveDriverCapacity, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(
        unitDriverCapacityActions.getDriverCapacitySuccess(result.data),
      );
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(
      unitDriverCapacityActions.getDriverCapacityFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data?.code,
      }),
    );
  }
}

function* getDriverCapacityAutoCompleteSaga(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetDriverCapacityResponse> & UnitDriverCapacityState
> {
  try {
    const result = yield call(UnitDriverCapacityApi().retrieveDriverCapacity, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(
        unitDriverCapacityActions.getDriverCapacityAutoCompleteSuccess(
          result.data,
        ),
      );
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(
      unitDriverCapacityActions.getDriverCapacityAutoCompleteFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data?.code,
      }),
    );
  }
}

function* getUnitCapacitySummarySaga(
  params: PayloadAction<UnitDriverSummaryPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetUnitCapacitySummaryResponse> & UnitDriverCapacityState
> {
  try {
    const result = yield call(UnitDriverCapacityApi().getUnitCapacitySummary, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(
        unitDriverCapacityActions.getUnitCapacitySummarySuccess(result.data),
      );
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(
      unitDriverCapacityActions.getUnitCapacitySummaryFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data?.code,
      }),
    );
  }
}

function* getDriverCapacitySummarySaga(
  params: PayloadAction<UnitDriverSummaryPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetDriverCapacitySummaryResponse> & UnitDriverCapacityState
> {
  try {
    const result = yield call(
      UnitDriverCapacityApi().getDriverCapacitySummary,
      {
        ...params.payload,
      },
    );

    if (result?.status === 200) {
      yield put(
        unitDriverCapacityActions.getDriverCapacitySummarySuccess(result.data),
      );
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(
      unitDriverCapacityActions.getDriverCapacitySummaryFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data?.code,
      }),
    );
  }
}

function* getUnitCapacityForecastSaga(
  params: PayloadAction<UnitCapacityForecastPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetUnitCapacityForecastResponse> & UnitDriverCapacityState
> {
  try {
    const result = yield call(UnitDriverCapacityApi().getUnitCapacityForecast, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(
        unitDriverCapacityActions.getUnitCapacityForecastSuccess(result.data),
      );
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(
      unitDriverCapacityActions.getUnitCapacityForecastFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data?.code,
      }),
    );
  }
}

function* getDriverCapacityForecastSaga(
  params: PayloadAction<DriverCapacityForecastPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetDriverCapacityForecastResponse> & UnitDriverCapacityState
> {
  try {
    const result = yield call(
      UnitDriverCapacityApi().getDriverCapacityForecast,
      {
        ...params.payload,
      },
    );

    if (result?.status === 200) {
      yield put(
        unitDriverCapacityActions.getDriverCapacityForecastSuccess(result.data),
      );
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(
      unitDriverCapacityActions.getDriverCapacityForecastFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data?.code,
      }),
    );
  }
}

function* getUnitCapacityStatusesSaga(): Generator<
  unknown,
  void,
  AxiosResponse<GetCapacityStatusResponse> & UnitDriverCapacityState
> {
  try {
    const result = yield call(UnitDriverCapacityApi().getUnitCapacityStatuses);

    if (result?.status === 200) {
      yield put(
        unitDriverCapacityActions.getUnitCapacityStatusesSuccess(result.data),
      );
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(
      unitDriverCapacityActions.getUnitCapacityStatusesFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data?.code,
      }),
    );
  }
}

function* getDriverCapacityStatusesSaga(): Generator<
  unknown,
  void,
  AxiosResponse<GetCapacityStatusResponse> & UnitDriverCapacityState
> {
  try {
    const result = yield call(
      UnitDriverCapacityApi().getDriverCapacityStatuses,
    );

    if (result?.status === 200) {
      yield put(
        unitDriverCapacityActions.getDriverCapacityStatusesSuccess(result.data),
      );
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(
      unitDriverCapacityActions.getDriverCapacityStatusesFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data?.code,
      }),
    );
  }
}

function* getUnitCapacityDetailSaga(
  params: PayloadAction<{ id: string }>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetUnitCapacityDetailResponse> & UnitDriverCapacityState
> {
  try {
    const result = yield call(UnitDriverCapacityApi().getUnitCapacityDetail, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(
        unitDriverCapacityActions.getUnitCapacityDetailSuccess(result.data),
      );
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(
      unitDriverCapacityActions.getUnitCapacityDetailFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data?.code,
      }),
    );
  }
}

function* getDriverCapacityDetailSaga(
  params: PayloadAction<{ id: string }>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetDriverCapacityDetailResponse> & UnitDriverCapacityState
> {
  try {
    const result = yield call(UnitDriverCapacityApi().getDriverCapacityDetail, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(
        unitDriverCapacityActions.getDriverCapacityDetailSuccess(result.data),
      );
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(
      unitDriverCapacityActions.getDriverCapacityDetailFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data?.code,
      }),
    );
  }
}

function* getEmployeeStatusesSaga(): Generator<
  unknown,
  void,
  AxiosResponse<GetEmployeeStatusResponse> & UnitDriverCapacityState
> {
  try {
    const result = yield call(UnitDriverCapacityApi().getEmployeeStatuses);

    if (result?.status === 200) {
      yield put(
        unitDriverCapacityActions.getEmployeeStatusesSuccess(result.data),
      );
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(
      unitDriverCapacityActions.getEmployeeStatusesFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data?.code,
      }),
    );
  }
}

function* watchUnitDriverCapacityRequest() {
  yield takeEvery(
    unitDriverCapacityTypes.GET_UNIT_CAPACITY_FETCH,
    getUnitCapacitySaga,
  );

  yield takeEvery(
    unitDriverCapacityTypes.GET_UNIT_CAPACITY_AUTOCOMPLETE_FETCH,
    getUnitCapacityAutoCompleteSaga,
  );

  yield takeEvery(
    unitDriverCapacityTypes.GET_DRIVER_CAPACITY_FETCH,
    getDriverCapacitySaga,
  );

  yield takeEvery(
    unitDriverCapacityTypes.GET_DRIVER_CAPACITY_AUTOCOMPLETE_FETCH,
    getDriverCapacityAutoCompleteSaga,
  );

  yield takeEvery(
    unitDriverCapacityTypes.GET_UNIT_CAPACITY_SUMMARY_FETCH,
    getUnitCapacitySummarySaga,
  );

  yield takeEvery(
    unitDriverCapacityTypes.GET_DRIVER_CAPACITY_SUMMARY_FETCH,
    getDriverCapacitySummarySaga,
  );

  yield takeEvery(
    unitDriverCapacityTypes.GET_UNIT_CAPACITY_FORECAST_FETCH,
    getUnitCapacityForecastSaga,
  );

  yield takeEvery(
    unitDriverCapacityTypes.GET_DRIVER_CAPACITY_FORECAST_FETCH,
    getDriverCapacityForecastSaga,
  );

  yield takeEvery(
    unitDriverCapacityTypes.GET_UNIT_CAPACITY_STATUSES_FETCH,
    getUnitCapacityStatusesSaga,
  );

  yield takeEvery(
    unitDriverCapacityTypes.GET_DRIVER_CAPACITY_STATUSES_FETCH,
    getDriverCapacityStatusesSaga,
  );

  yield takeEvery(
    unitDriverCapacityTypes.GET_UNIT_CAPACITY_DETAIL_FETCH,
    getUnitCapacityDetailSaga,
  );

  yield takeEvery(
    unitDriverCapacityTypes.GET_DRIVER_CAPACITY_DETAIL_FETCH,
    getDriverCapacityDetailSaga,
  );

  yield takeEvery(
    unitDriverCapacityTypes.GET_EMPLOYEE_STATUSES_FETCH,
    getEmployeeStatusesSaga,
  );
}

export default function* unitDriverCapacitySaga() {
  yield all([fork(watchUnitDriverCapacityRequest)]);
}
