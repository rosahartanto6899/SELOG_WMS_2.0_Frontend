/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import OutstandingOutgoingApi from "@sera-libraries/api/outstanding-outgoing";
import { outstandingOutgoingActions } from "@sera-redux/slices/outstanding-outgoing.slice";
import {
  InputOutgoingPayload,
  UpdateOutgoingPayload,
} from "@sera-types/outstanding-outgoing.type";
import { AxiosResponse } from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";

function* submitOutgoing(
  params: PayloadAction<InputOutgoingPayload | UpdateOutgoingPayload>,
): Generator<unknown, void, AxiosResponse> {
  const payload = params.payload;
  const isUpdate = "id" in payload && !!payload.id;
  try {
    if (isUpdate) {
      const p = payload as UpdateOutgoingPayload;
      // urutan parity submit() input-incoming-form: header dulu, lalu detail
      const { id, updateDetails, details, ...header } = p;
      yield call(OutstandingOutgoingApi().updateOutgoingHeader, id, header);
      for (const row of updateDetails ?? []) {
        yield call(
          OutstandingOutgoingApi().updateOutgoingDetail,
          row.detailId,
          {
            qty: row.qty,
            additionalInformation: row.additionalInformation,
          },
        );
      }
      const newRows = (details ?? []).filter((d) => d.materialCode && d.qty);
      if (newRows.length) {
        yield call(OutstandingOutgoingApi().addDetails, id, newRows);
      }
    } else {
      yield call(
        OutstandingOutgoingApi().createOutgoing,
        payload as InputOutgoingPayload,
      );
    }
    yield put(outstandingOutgoingActions.submitOutgoingSuccess(null));
  } catch (error: any) {
    yield put(
      outstandingOutgoingActions.submitOutgoingFailure(
        error?.response?.data ?? { message: error?.message },
      ),
    );
  }
}

function* getOutgoingEdit(
  params: PayloadAction<{ id: string }>,
): Generator<unknown, void, AxiosResponse> {
  try {
    const result = yield call(
      OutstandingOutgoingApi().retrieveEdit,
      params.payload.id,
    );
    const body = (result as any)?.data;
    yield put(
      outstandingOutgoingActions.getOutgoingEditSuccess({
        data: body?.data ?? null,
      }),
    );
  } catch (error: any) {
    yield put(
      outstandingOutgoingActions.getOutgoingEditFailure(
        error?.response?.data ?? { message: error?.message },
      ),
    );
  }
}

// ================= spec 004 Fase 1 — worklist =================

function* getOutgoingList(
  params: PayloadAction<any>,
): Generator<unknown, void, AxiosResponse> {
  try {
    const result = yield call(
      OutstandingOutgoingApi().retrieveList,
      params.payload,
    );
    const body = (result as any)?.data;
    yield put(
      outstandingOutgoingActions.getOutgoingListSuccess({
        data: body?.data ?? [],
        pagination: body?.pagination,
        recordsTotal:
          body?.pagination?.recordsTotal ?? body?.pagination?.totalData ?? 0,
      }),
    );
  } catch (error: any) {
    yield put(
      outstandingOutgoingActions.getOutgoingListFailure(
        error?.response?.data ?? { message: error?.message },
      ),
    );
  }
}

function* fetchTab(
  apiFn: (p: any) => any,
  successFn: (body: any) => any,
  payload: { customerCode: string; warehouseCode: string },
): Generator<unknown, void, any> {
  const result = yield call(apiFn, payload);
  yield put(successFn({ data: (result as any)?.data?.data ?? [] }));
}

function* getOutgoingItems(
  params: PayloadAction<{ customerCode: string; warehouseCode: string }>,
): Generator<unknown, void, AxiosResponse> {
  try {
    yield* fetchTab(
      OutstandingOutgoingApi().retrieveItems as any,
      outstandingOutgoingActions.getOutgoingItemsSuccess as any,
      params.payload,
    );
  } catch (error: any) {
    yield put(
      outstandingOutgoingActions.getOutgoingItemsFailure(
        error?.response?.data ?? { message: error?.message },
      ),
    );
  }
}

function* getOutgoingPackagings(
  params: PayloadAction<{ customerCode: string; warehouseCode: string }>,
): Generator<unknown, void, AxiosResponse> {
  try {
    yield* fetchTab(
      OutstandingOutgoingApi().retrievePackagings as any,
      outstandingOutgoingActions.getOutgoingPackagingsSuccess as any,
      params.payload,
    );
  } catch (error: any) {
    yield put(
      outstandingOutgoingActions.getOutgoingPackagingsFailure(
        error?.response?.data ?? { message: error?.message },
      ),
    );
  }
}

function* getOutgoingShipments(
  params: PayloadAction<{ customerCode: string; warehouseCode: string }>,
): Generator<unknown, void, AxiosResponse> {
  try {
    yield* fetchTab(
      OutstandingOutgoingApi().retrieveShipments as any,
      outstandingOutgoingActions.getOutgoingShipmentsSuccess as any,
      params.payload,
    );
  } catch (error: any) {
    yield put(
      outstandingOutgoingActions.getOutgoingShipmentsFailure(
        error?.response?.data ?? { message: error?.message },
      ),
    );
  }
}

function* getOutgoingTotals(
  params: PayloadAction<{ warehouseCodes?: string[] | null }>,
): Generator<unknown, void, AxiosResponse> {
  try {
    const warehouseCodes = params.payload?.warehouseCodes ?? [];
    const [total, byWarehouse] = (yield all([
      call(OutstandingOutgoingApi().retrieveTotals, { warehouseCodes }),
      call(OutstandingOutgoingApi().retrieveTotalsByWarehouse, {
        warehouseCodes,
      }),
    ])) as unknown as any[];
    yield put(
      outstandingOutgoingActions.getOutgoingTotalsSuccess({
        total: total?.data?.data?.totalDataOutstanding ?? 0,
        byWarehouse: byWarehouse?.data?.data ?? [],
      }),
    );
  } catch (error: any) {
    yield put(
      outstandingOutgoingActions.getOutgoingTotalsFailure(
        error?.response?.data ?? { message: error?.message },
      ),
    );
  }
}

function* getOutgoingDetail(
  params: PayloadAction<{ id: string }>,
): Generator<unknown, void, AxiosResponse> {
  try {
    const [detail, history] = (yield all([
      call(OutstandingOutgoingApi().retrieveDetails, params.payload.id),
      call(OutstandingOutgoingApi().retrieveHistory, params.payload.id),
    ])) as unknown as any[];
    yield put(
      outstandingOutgoingActions.getOutgoingDetailSuccess({
        data: detail?.data?.data ?? null,
        history: history?.data?.data ?? [],
      }),
    );
  } catch (error: any) {
    yield put(
      outstandingOutgoingActions.getOutgoingDetailFailure(
        error?.response?.data ?? { message: error?.message },
      ),
    );
  }
}

export default function* outstandingOutgoingSaga() {
  yield all([
    takeEvery(outstandingOutgoingActions.submitOutgoingFetch, submitOutgoing),
    takeEvery(outstandingOutgoingActions.getOutgoingEditFetch, getOutgoingEdit),
    takeEvery(outstandingOutgoingActions.getOutgoingListFetch, getOutgoingList),
    takeEvery(
      outstandingOutgoingActions.getOutgoingItemsFetch,
      getOutgoingItems,
    ),
    takeEvery(
      outstandingOutgoingActions.getOutgoingPackagingsFetch,
      getOutgoingPackagings,
    ),
    takeEvery(
      outstandingOutgoingActions.getOutgoingShipmentsFetch,
      getOutgoingShipments,
    ),
    takeEvery(
      outstandingOutgoingActions.getOutgoingTotalsFetch,
      getOutgoingTotals,
    ),
    takeEvery(
      outstandingOutgoingActions.getOutgoingDetailFetch,
      getOutgoingDetail,
    ),
  ]);
}
