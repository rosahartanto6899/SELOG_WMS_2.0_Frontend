/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import BookingOrderApi from "@sera-libraries/api/booking-order";
import { bookingOrderActions } from "@sera-redux/slices/booking-order.slice";
import { BaseType } from "@sera-types/base.type";
import {
  BookingOrderAdditionalRequestResposne,
  BookingOrderDetailPayload,
  BookingOrderDetailResponse,
  BookingOrderState,
  BookingOrderSummaryPayload,
  BookingOrderSummaryResponse,
  bookingOrderTypes,
  CreateBookingOrderPayload,
  CreateBookingOrderResponse,
  GetBookingOrderResponse,
  UpdateBookingOrderPayload,
  UpdateBookingOrderResponse,
  UpdateStatusBookingOrderPayload,
} from "@sera-types/booking-order.type";
import { captureErrorAxios } from "@sera-utils/error-handler";
import { AxiosResponse } from "axios";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

function* getBookingOrderSaga(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetBookingOrderResponse> & BookingOrderState
> {
  try {
    const result = yield call(BookingOrderApi().retrieveBookingOrder, {
      ...params.payload,
    });
    if (result?.status === 200)
      yield put(bookingOrderActions.getBookingOrderSuccess(result.data));
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(
      bookingOrderActions.getBookingOrderFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data?.code,
      }),
    );
  }
}
function* getBookingOrderAutoCompleteSaga(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetBookingOrderResponse> & BookingOrderState
> {
  try {
    const result = yield call(BookingOrderApi().retrieveBookingOrder, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(
        bookingOrderActions.getBookingOrderAutoCompleteSuccess(result.data),
      );
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(bookingOrderActions.getBookingOrderAutoCompleteFailure(error));
  }
}

function* getBookingOrderSummarySaga(
  params: PayloadAction<BookingOrderSummaryPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<BookingOrderSummaryResponse> & BookingOrderState
> {
  try {
    const result = yield call(BookingOrderApi().getBookingOrderSummary, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(bookingOrderActions.getBookingOrderSummarySuccess(result.data));
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(bookingOrderActions.getBookingOrderSummaryFailure(error));
  }
}

function* getBookingOrderDetailSaga(
  params: PayloadAction<BookingOrderDetailPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<BookingOrderDetailResponse> & BookingOrderState
> {
  try {
    let result;

    if (params.payload?.serviceType === "Drop Base") {
      result = yield call(BookingOrderApi().getBookingOrderDropBaseById, {
        ...params.payload,
      });
    } else {
      result = yield call(BookingOrderApi().getBookingOrderById, {
        ...params.payload,
      });
    }

    if (result?.status === 200) {
      yield put(bookingOrderActions.getBookingOrderDetailSuccess(result.data));
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(bookingOrderActions.getBookingOrderDetailFailure(error));
  }
}

function* createBookingOrderSaga(
  params: PayloadAction<CreateBookingOrderPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<{ data: CreateBookingOrderResponse }> & BookingOrderState
> {
  try {
    const isDropBase = !!params.payload.isDropBase;
    let result;
    if (isDropBase) {
      result = yield call(BookingOrderApi().createBookingOrderDropBase, {
        ...params.payload,
      });
    } else {
      result = yield call(BookingOrderApi().createBookingOrder, {
        ...params.payload,
      });
    }

    if (result?.status >= 200 && result?.status < 300) {
      yield put(
        bookingOrderActions.createBookingOrderSuccess(result.data.data),
      );
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(bookingOrderActions.createBookingOrderFailure(error));
  }
}

function* updateBookingOrderSaga(
  params: PayloadAction<UpdateBookingOrderPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<UpdateBookingOrderResponse> & BookingOrderState
> {
  try {
    const isDropBase = !!params.payload.isDropBase;
    let result;
    if (isDropBase) {
      result = yield call(BookingOrderApi().updateBookingOrderDropBase, {
        ...params.payload,
      });
    } else {
      result = yield call(BookingOrderApi().updateBookingOrder, {
        ...params.payload,
      });
    }

    if (result?.status >= 200 && result?.status < 300) {
      yield put(bookingOrderActions.updateBookingOrderSuccess(result.data));
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(bookingOrderActions.updateBookingOrderFailure(error));
  }
}

function* updateBookingOrderStatusSaga(
  params: PayloadAction<UpdateStatusBookingOrderPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<UpdateStatusBookingOrderPayload> & BookingOrderState
> {
  try {
    const result = yield call(BookingOrderApi().updateStatusBookingOrder, {
      ...params.payload,
    });

    if (result?.status >= 200 && result?.status < 300) {
      yield put(
        bookingOrderActions.updateBookingOrderStatusSuccess(params.payload),
      );
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(bookingOrderActions.updateBookingOrderStatusFailure(error));
  }
}

function* getDropdownAdditionalRequestSaga(): Generator<
  unknown,
  void,
  AxiosResponse<BookingOrderAdditionalRequestResposne> & BookingOrderState
> {
  try {
    const result = yield call(BookingOrderApi().getDropdownAdditionalRequest);

    if (result?.status === 200) {
      yield put(
        bookingOrderActions.getDropdownAdditionalRequestItemsSuccess(
          result.data,
        ),
      );
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(
      bookingOrderActions.getDropdownAdditionalRequestItemsFailure(error),
    );
  }
}

function* watchBookingOrderRequest() {
  yield takeEvery(
    bookingOrderTypes.GET_BOOKING_ORDER_FETCH,
    getBookingOrderSaga,
  );

  yield takeEvery(
    bookingOrderTypes.GET_BOOKING_ORDER_AUTOCOMPLETE_FETCH,
    getBookingOrderAutoCompleteSaga,
  );

  yield takeEvery(
    bookingOrderTypes.GET_BOOKING_ORDER_SUMMARY_FETCH,
    getBookingOrderSummarySaga,
  );

  yield takeEvery(
    bookingOrderTypes.GET_BOOKING_ORDER_DETAIL_FETCH,
    getBookingOrderDetailSaga,
  );

  yield takeEvery(
    bookingOrderTypes.CREATE_BOOKING_ORDER_FETCH,
    createBookingOrderSaga,
  );

  yield takeEvery(
    bookingOrderTypes.UPDATE_BOOKING_ORDER_FETCH,
    updateBookingOrderSaga,
  );

  yield takeEvery(
    bookingOrderTypes.UPDATE_BOOKING_ORDER_STATUS_FETCH,
    updateBookingOrderStatusSaga,
  );

  yield takeEvery(
    bookingOrderTypes.GET_DROPDOWN_ADDITIONAL_REQUEST_ITEMS_FETCH,
    getDropdownAdditionalRequestSaga,
  );
}

export default function* bookingOrderSaga() {
  yield all([fork(watchBookingOrderRequest)]);
}
