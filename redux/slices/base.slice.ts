import { errorReducer } from "./error.slice";
import { loadingReducer } from "./loading.slice";

export const baseReducers = {
  loading: loadingReducer,
  error: errorReducer,
};
