import { OutgoingReportState } from "@sera-types/outgoing-report.type";

const initialState: OutgoingReportState = {
  isLoading: false,
  error: null,
  data: [],
  options: { page: 1, limit: 10 },
  recordsTotal: 0,
};

export default initialState;
