import { BaseResponseType, BaseType } from "./base.type";

export interface ImagePayload {
  type?: string;
  key?: string;
}

export interface GetImagePayload {
  id?: string;
  userid?: string;
  type?: string;
  path?: string;
  createdAt?: string;
  updatedAt?: string;
  url?: string;
}

export interface ImageFormat {
  type?: string;
  image?: string;
}

export interface UploadImagePayload {
  images: ImageFormat[];
}

export interface IUploadImageResponse extends BaseResponseType {
  data?: {
    images: ImagePayload[];
  };
}

export interface IGetImageResponse extends BaseResponseType {
  data: {
    images: GetImagePayload[];
  };
  key: string;
}

export interface IGetKeyResponse extends BaseResponseType {
  data: {
    key: string;
  };
}

export interface IGetImage {
  isLoading?: boolean;
  isSuccess?: boolean;
  error?: Error | string | null;
  data: IGetImageResponse | null;
}

export interface IUploadImgState {
  data?: IUploadImageResponse | null; // TODO: SESUAIKAN DENGAN RESPONSE
  isLoading?: boolean;
  isSuccess?: boolean;
  saveState?: boolean;
  error?: Error | string | null;
  options?: BaseType;
  getImage: IGetImage;
}

export const uploadImgTypes = {
  UPLOAD_IMAGE: "upload-img/uploadImage",
  UPLOAD_IMAGE_FETCH: "upload-img/uploadImageFetch",
  UPLOAD_IMAGE_SUCCESS: "upload-img/uploadImageSuccess",
  UPLOAD_IMAGE_FAILURE: "upload-img/uploadImageFailure",
  GET_IMAGE: "upload-img/getImage",
  GET_IMAGE_FETCH: "upload-img/getImageFetch",
  GET_IMAGE_SUCCESS: "upload-img/getImageSuccess",
  GET_IMAGE_FAILURE: "upload-img/getImageFailure",
};
