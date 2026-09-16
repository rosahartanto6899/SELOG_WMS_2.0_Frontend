import { IncomingReportState } from "@sera-types/incoming-report.type";

const initialState: IncomingReportState = {
  isLoading: false,
  error: null,
  data: [],
  options: { page: 1, limit: 10 },
  recordsTotal: 0,
};

export default initialState;
