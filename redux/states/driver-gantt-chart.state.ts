import { IDriverGanttChartState } from "@sera-types/driver-gantt-chart.type";

const initialState: IDriverGanttChartState = {
  data: [],
  isLoading: false,
  saveState: false,
  error: null,
  options: {
    page: 1,
    limit: 10,
    totalData: 0,
    totalPage: 0,
  },
  summary: {},
};

export default initialState;
