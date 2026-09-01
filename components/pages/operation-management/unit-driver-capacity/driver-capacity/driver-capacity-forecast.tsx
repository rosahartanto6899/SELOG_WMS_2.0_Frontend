import Table from "@sera-components/table";
import { useAppDispatch, useAppSelector } from "@sera-redux";
import { unitDriverCapacityActions } from "@sera-redux/slices/unit-driver-capacity.slice";
import {
  DriverForecast,
  unitDriverCapacityTypes,
} from "@sera-types/unit-driver-capacity.type";
import dayjs from "dayjs";
import { lowerCase } from "lodash";
import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { UnitDriverCapacityFilterProps } from "../unit-driver-capacity-initial-page";
import {
  ColumnForecastCapacity,
  INDICATOR_FORECAST_DRIVER,
} from "../unit-driver-capacity-props-table";

interface DriverCapacityForecastProps {
  filter: UnitDriverCapacityFilterProps;
}

const DriverCapacityForecast = ({ filter }: DriverCapacityForecastProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "unitDriverCapacity.forecast",
  });
  const dispatch = useAppDispatch();

  const DRIVER_FORECAST_KEYS = INDICATOR_FORECAST_DRIVER.map((v) => ({
    key: lowerCase(v),
    name: v,
  }));

  const {
    driverCapacity: {
      forecast: { data: forecastDriverData },
    },
  } = useAppSelector((state) => state.unitDriverCapacity);

  const loading = useAppSelector((state) => state.loading);

  const forecastDataSource = useMemo(() => {
    if (!forecastDriverData?.days) return [];

    return DRIVER_FORECAST_KEYS.map((v) => ({
      key: v.key,
      indicator: v.name,
      ...Object.fromEntries(
        forecastDriverData.days.map((value: DriverForecast) => [
          dayjs(value.date).format("DD-MM-YYYY"),
          value.driver?.[v.key as keyof DriverForecast["driver"]]?.available ??
            0,
        ]),
      ),
    }));
  }, [forecastDriverData, DRIVER_FORECAST_KEYS]);

  useEffect(() => {
    dispatch(
      unitDriverCapacityActions.getDriverCapacityForecastFetch({
        dateFrom: dayjs().format("YYYY-MM-DD"),
        dateTo: dayjs().add(29, "days").format("YYYY-MM-DD"),
        branchIds: filter.branchId || [],
        shipmentTypes: filter.shipmentType || [],
        serviceGroupIds: [],
        customerIds: [],
        employeeStatuses: ["PKWT", "MITRA"],
        excludeAllotment: false,
      }),
    );
  }, [filter]);

  return (
    <Table
      title={t("table.title")}
      columns={ColumnForecastCapacity()}
      dataSource={forecastDataSource}
      rowKey="indicator"
      loading={loading[unitDriverCapacityTypes.GET_DRIVER_CAPACITY_FORECAST]}
      scroll={{ x: "max-content" }}
    />
  );
};

export default DriverCapacityForecast;
