import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import { IDriverGanttChartPayload } from "@sera-types/driver-gantt-chart.type";

const DriverGanttChartApi = () => {
  async function retrieveDriverGanttChart(payload: IDriverGanttChartPayload) {
    return httpService
      .get(`${apiUrl.driver}/gantt-charts`, { params: payload })
      .then((resp) => resp);
  }

  async function retrieveDriverGanttChartSummary(
    payload: IDriverGanttChartPayload,
  ) {
    return httpService
      .get(`${apiUrl.driver}/gantt-charts/summary`, { params: payload })
      .then((resp) => resp);
  }

  return {
    retrieveDriverGanttChart,
    retrieveDriverGanttChartSummary,
  };
};

export default DriverGanttChartApi;
