import { PayloadAction } from "@reduxjs/toolkit";
import { UploadImageApi } from "@sera-libraries/api/upload-img";
import {
  getImageFailure,
  getImageSuccess,
  uploadImageFailure,
  uploadImageSuccess,
} from "@sera-redux/slices/upload-img.slice";
import {
  IGetImageResponse,
  IGetKeyResponse,
  IUploadImgState,
  UploadImagePayload,
  uploadImgTypes,
} from "@sera-types/upload-img.type";
import { encryptData } from "@sera-utils/encryptor";
import { AxiosResponse } from "axios";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

function* getImages(): Generator<
  unknown,
  void,
  AxiosResponse<IGetImageResponse & IGetKeyResponse> & IUploadImgState
> {
  try {
    const resultKey = yield call(UploadImageApi().retrieveKeyEncrypt);
    const result = yield call(
      UploadImageApi().getImage,
      resultKey?.data?.data?.key,
    );
    if (result?.status === 200)
      yield put(
        getImageSuccess({ ...result.data, key: resultKey?.data?.data?.key }),
      );
  } catch (error: any) {
    yield put(
      getImageFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data,
      }),
    );
  }
}

function* uploadImage(
  params: PayloadAction<UploadImagePayload>,
): Generator<
  unknown,
  any,
  AxiosResponse<IGetImageResponse & IGetKeyResponse> & IUploadImgState
> {
  try {
    const resultKey = yield call(UploadImageApi().retrieveKeyEncrypt);
    const resKey = resultKey.data.data.key;
    const splitKey = resKey.split(resKey.slice(-2));

    let key: string = "";
    let keyIV: string = "";
    splitKey.forEach((item: string) => {
      if (item !== "") {
        if (item.length < 33) keyIV = item;
        else key = item;
      }
    });

    const encrypt: string = encryptData(params.payload, key, keyIV);

    const result = yield call(
      UploadImageApi().postImage,
      { data: encrypt },
      resKey,
    );
    if (result?.status === 200)
      yield put(uploadImageSuccess({ data: encrypt, key, keyIV }));
  } catch (error: any) {
    yield put(
      uploadImageFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data,
      }),
    );
  }
}

function* watchRolesRequest() {
  yield takeEvery(uploadImgTypes.UPLOAD_IMAGE_FETCH, uploadImage);
  yield takeEvery(uploadImgTypes.GET_IMAGE_FETCH, getImages);
}

export default function* uploadImageSaga() {
  yield all([fork(watchRolesRequest)]);
}
