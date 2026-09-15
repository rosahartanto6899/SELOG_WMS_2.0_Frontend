import { StockAvailabilityState } from "@sera-types/stock-availability.type";

const initialState: StockAvailabilityState = {
  isLoading: false,
  error: null,
  data: [],
  options: { page: 1, limit: 10 },
  recordsTotal: 0,
};

export default initialState;
