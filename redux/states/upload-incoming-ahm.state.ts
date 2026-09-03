import { UploadIncomingAhmState } from "@sera-types/upload-incoming-ahm.type";

const initialState: UploadIncomingAhmState = {
  isLoading: false,
  error: null,
  activeUpsert: -1,
  summary: null,
  lastResult: null,
};

export default initialState;
