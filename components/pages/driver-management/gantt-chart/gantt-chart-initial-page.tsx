/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Card from "@sera-components/card";
import CardSummary, {
  CardSummaryDataProps,
} from "@sera-components/card/card-summary";
import DriverGanttChart from "@sera-components/gantt-chart/gantt-chart/driver";
import { LogisUserMultiple } from "@sera-components/icons";
import Typography from "@sera-components/typography";
import { businessAreaActions, RootState } from "@sera-redux";
import { driverGanttChartActions } from "@sera-redux/slices/driver-gantt-chart.slice";
import { driverStatusActions } from "@sera-redux/slices/driver-status.slice";
import { driverStockActions } from "@sera-redux/slices/driver-stock.slice";
import { employeeStatusActions } from "@sera-redux/slices/employee-status.slice";
import { shipmentTypesActions } from "@sera-redux/slices/shipment-types.slice";
import { BaseType } from "@sera-types/base.type";
import {
  driverGanttChartTypes,
  GanttChartParams,
  IDriverGanttChartState,
} from "@sera-types/driver-gantt-chart.type";
import { LoadingState } from "@sera-types/loading.type";
import { NUMBER_FORMAT } from "@sera-utils/constants/common";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Col, Flex, Row } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";

import GanttChartFilters from "./gantt-chart-filters";
interface DriverGanttChartProps {
  loading: LoadingState;
  driverGanttCharts: IDriverGanttChartState;
  driver: any;
  getDriverGanttCharts: typeof driverGanttChartActions.getDriverGanttChartFetch;
  getDriverGanttChartSummary: typeof driverGanttChartActions.getDriverGanttChartSummaryFetch;
  getShipmentTypes: typeof shipmentTypesActions.getShipmentTypesFetch;
  getEmployeeStatus: typeof employeeStatusActions.getEmployeeStatusFetch;
  getDriverStatus: typeof driverStatusActions.getDriverStatusFetch;
  getDropdownBusinessAreas: typeof businessAreaActions.getDropdownBusinessAreasFetch;
  getDriverDetail: typeof driverStockActions.getByIdFetch;
}

const GantCharts = ({
  loading,
  driverGanttCharts,
  driver,
  getDriverGanttCharts,
  getDriverGanttChartSummary,
  getShipmentTypes,
  getEmployeeStatus,
  getDriverStatus,
  getDropdownBusinessAreas,
  getDriverDetail,
}: DriverGanttChartProps) => {
  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/driver-management/gantt-chart/index");
  const DATA_SUMMARY = useMemo(() => {
    const _data = driverGanttCharts?.summary ?? {};
    return [
      {
        label: "Total",
        value: NUMBER_FORMAT(_data.total || 0),
        variant: "sub-info",
      },
      {
        label: "Stand By",
        value: NUMBER_FORMAT(_data.standby || 0),
        variant: "success",
      },
      {
        label: "On Journey",
        value: NUMBER_FORMAT(_data.onJourney || 0),
        variant: "info",
      },
      {
        label: "Coaching",
        value: NUMBER_FORMAT(_data.coaching || 0),
        variant: "warning",
      },
      {
        label: "Absence",
        value: NUMBER_FORMAT(_data.absence || 0),
        variant: "error",
      },
    ]?.map((_item) => ({
      ..._item,
      icon: <LogisUserMultiple />,
    })) as CardSummaryDataProps[];
  }, [driverGanttCharts?.summary]);

  const calculateDateRange = useCallback(
    (viewType: "biweek" | "week" | "day" | "custom", date: Dayjs) => {
      let startDate: string;
      let endDate: string;

      switch (viewType) {
        case "biweek":
          // Batasi max 14 hari dari tanggal yang dipilih
          startDate = date.format("YYYY-MM-DD");
          endDate = date.add(13, "day").format("YYYY-MM-DD"); // 14 hari total (termasuk hari pertama)
          break;
        case "week":
          startDate = date.startOf("week").format("YYYY-MM-DD");
          endDate = date.endOf("week").format("YYYY-MM-DD");
          break;
        case "day":
          startDate = date.format("YYYY-MM-DD");
          endDate = date.format("YYYY-MM-DD");
          break;
        case "custom":
          // For custom range, return the provided date as both start and end
          // The actual range will be handled by the caller
          startDate = date.format("YYYY-MM-DD");
          endDate = date.format("YYYY-MM-DD");
          break;
        default:
          startDate = date.format("YYYY-MM-DD");
          endDate = date.add(13, "day").format("YYYY-MM-DD");
      }

      return { startDate, endDate };
    },
    [],
  );

  const [params, setParams] = useState<GanttChartParams>({
    branchId: [],
    shipmentType: [],
    employeeStatus: [],
    driverStatus: [],
  });
  const [searchValue, setSearchValue] = useState<string>("");
  const [viewType, setViewType] = useState<
    "biweek" | "week" | "day" | "custom" | undefined
  >(undefined);
  const [selectedDate, setSelectedDate] = useState<Dayjs | undefined>(
    undefined,
  );
  const [selectedRange, setSelectedRange] = useState<
    [Dayjs, Dayjs] | undefined
  >(undefined);

  const [driverGanttChartsListOptions, setDriverGanttChartsListOptions] =
    useState<BaseType>({
      page: 1,
      limit: driverGanttCharts.options?.limit ?? 10,
    });

  const [driverGanttChartsSummaryOptions, setDriverGanttChartsSummaryOptions] =
    useState<any>({});

  const onPageChangeListener = (current: number, limit: number) => {
    setDriverGanttChartsListOptions((prevState) => ({
      ...prevState,
      page: current,
      limit,
    }));
  };

  const onDateChangeListener = useCallback(
    (
      newViewType: "biweek" | "week" | "day" | "custom",
      startDate: Dayjs,
      endDate?: Dayjs,
      newSelectedDate?: Dayjs,
      newSelectedRange?: [Dayjs, Dayjs],
    ) => {
      // Update local states
      setViewType(newViewType);
      if (newSelectedDate) setSelectedDate(newSelectedDate);
      if (newSelectedRange) setSelectedRange(newSelectedRange);

      let start: string;
      let end: string;

      if ((newViewType === "biweek" || newViewType === "custom") && endDate) {
        // Use provided range for biweek and custom views
        start = startDate.format("YYYY-MM-DD");
        end = endDate.format("YYYY-MM-DD");
      } else {
        // Calculate range for week/day views
        const { startDate: calcStart, endDate: calcEnd } = calculateDateRange(
          newViewType,
          startDate,
        );
        start = calcStart;
        end = calcEnd;
      }

      setDriverGanttChartsListOptions((prevState) => ({
        ...prevState,
        page: 1,
        start,
        end,
      }));

      setDriverGanttChartsSummaryOptions({
        start,
        end,
      });
    },
    [calculateDateRange],
  );

  const onChangeFilter = (_val: GanttChartParams) => {
    setParams((_prev) => ({
      branchId: _val?.branchId ?? _prev?.branchId,
      shipmentType: _val?.shipmentType ?? _prev?.shipmentType,
      employeeStatus: _val?.employeeStatus ?? _prev?.employeeStatus,
      driverStatus: _val?.driverStatus ?? _prev?.driverStatus,
    }));
  };

  const onSearchListener = (value: string) => {
    setSearchValue(value);
    setDriverGanttChartsListOptions((prevState) => ({
      ...prevState,
      page: 1,
      searchBy: value ? "employeeName" : undefined,
      search: value || undefined,
    }));
  };

  const onDriverSelectListener = (driver: any) => {
    getDriverDetail({ id: driver.id });
  };

  useEffect(() => {
    try {
      getDriverGanttCharts({ ...driverGanttChartsListOptions, ...params });
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 154, error);
      else sendErrorHandler("useEffect", 155, error?.data?.message);
    }
  }, [driverGanttChartsListOptions, params]);

  useEffect(() => {
    try {
      getDriverGanttChartSummary({
        ...driverGanttChartsSummaryOptions,
        ...params,
      });
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 154, error);
      else sendErrorHandler("useEffect", 155, error?.data?.message);
    }
  }, [driverGanttChartsSummaryOptions, params]);

  useEffect(() => {
    getShipmentTypes();
    getEmployeeStatus();
    getDriverStatus();
    getDropdownBusinessAreas({});
  }, []);

  return (
    <Flex gap={24} vertical>
      <Row
        gutter={[16, 16]}
        justify={"space-between"}
        style={{ alignItems: "center" }}
      >
        <Col>
          <Card.Filter>
            <GanttChartFilters data={params} onChangeFilter={onChangeFilter} />
          </Card.Filter>
        </Col>
        <Col>
          <Typography.Title level={5}>
            <span style={{ fontWeight: "normal" }}>Period</span>
            {` : ${dayjs().format("DD MMMM YYYY")}`}
          </Typography.Title>
        </Col>
      </Row>
      <CardSummary data={DATA_SUMMARY} />
      <DriverGanttChart
        loading={loading[driverGanttChartTypes.GET_DRIVER_GANTT_CHART]}
        driverGanttCharts={driverGanttCharts}
        driver={driver}
        onPageChange={onPageChangeListener}
        onDateChange={onDateChangeListener}
        onSearch={onSearchListener}
        onDriverSelect={onDriverSelectListener}
        searchValue={searchValue}
        viewType={viewType}
        selectedDate={selectedDate}
        selectedRange={selectedRange}
      />
    </Flex>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  driverGanttCharts: state.driverGanttChart,
  driver: state.driverStock,
  shipmentTypes: state.shipmentTypes,
  employeeStatus: state.employeeStatus,
  driverStatus: state.driverStatus,
});

const mapDispatchToProps = {
  getDriverGanttCharts: driverGanttChartActions.getDriverGanttChartFetch,
  getDriverGanttChartSummary:
    driverGanttChartActions.getDriverGanttChartSummaryFetch,
  getShipmentTypes: shipmentTypesActions.getShipmentTypesFetch,
  getEmployeeStatus: employeeStatusActions.getEmployeeStatusFetch,
  getDriverStatus: driverStatusActions.getDriverStatusFetch,
  getDropdownBusinessAreas: businessAreaActions.getDropdownBusinessAreasFetch,
  getDriverDetail: driverStockActions.getByIdFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(GantCharts);
