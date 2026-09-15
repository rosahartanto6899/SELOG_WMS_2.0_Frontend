import { UploadStockAdjustmentState } from "@sera-types/upload-stock-adjustment.type";

const initialState: UploadStockAdjustmentState = {
  isLoading: false,
  error: null,
  activeUpsert: -1,
  summary: null,
  lastResult: null,
};

export default initialState;
