import { IUploadImgState } from "@sera-types/upload-img.type";

export const initialState: IUploadImgState = {
  data: null,
  isLoading: false,
  isSuccess: false,
  error: null,
  options: {
    page: 1,
    limit: 10,
    totalData: 0,
    totalPage: 0,
    order: null,
    sort: null,
    searchBy: null,
    search: null,
  },
  getImage: {
    isLoading: false,
    isSuccess: false,
    error: null,
    data: null,
  },
};
