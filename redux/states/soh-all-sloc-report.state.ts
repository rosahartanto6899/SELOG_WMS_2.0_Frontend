import { SohAllSlocReportState } from "@sera-types/soh-all-sloc-report.type";

const initialState: SohAllSlocReportState = {
  isLoading: false,
  error: null,
  data: [],
  warehouses: [],
  options: { page: 1, limit: 10 },
  recordsTotal: 0,
};

export default initialState;
