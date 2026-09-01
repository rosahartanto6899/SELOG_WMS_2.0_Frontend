import Table from "@sera-components/table";
import { useAppDispatch, useAppSelector } from "@sera-redux";
import { unitDriverCapacityActions } from "@sera-redux/slices/unit-driver-capacity.slice";
import {
  unitDriverCapacityTypes,
  UnitForecast,
} from "@sera-types/unit-driver-capacity.type";
import dayjs from "dayjs";
import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { UnitDriverCapacityFilterProps } from "../unit-driver-capacity-initial-page";
import { ColumnForecastCapacity } from "../unit-driver-capacity-props-table";

interface UnitCapacityForecastProps {
  filter: UnitDriverCapacityFilterProps;
}

const UnitCapacityForecast = ({ filter }: UnitCapacityForecastProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "unitDriverCapacity.forecast",
  });
  const dispatch = useAppDispatch();

  const {
    unitCapacity: {
      forecast: { data: forecastUnitData },
    },
  } = useAppSelector((state) => state.unitDriverCapacity);

  const loading = useAppSelector((state) => state.loading);

  const forecastDataSource = useMemo(() => {
    if (!forecastUnitData?.days) return [];
    const INDICATOR = forecastUnitData.days[0]?.unit?.byType || [];
    const FORECAST_DAYS = forecastUnitData.days;

    const DATA = INDICATOR.map((v) => ({
      key: v.name,
      indicator: v.name,
      ...Object.fromEntries(
        forecastUnitData.days.map((capacity: unknown) => {
          const value = capacity as UnitForecast;

          const indicatorByDay = value.unit?.byType?.find(
            (i) => i.name === v.name,
          );
          return [
            dayjs(value.date, "YYYY-MM-DD").format("DD-MM-YYYY"),
            indicatorByDay?.available ?? 0,
          ];
        }),
      ),
    }));

    const TOTAL_DATA = {
      key: "Total",
      indicator: "Total",
      ...Object.fromEntries(
        FORECAST_DAYS.map((day) => [
          dayjs(day.date).format("DD-MM-YYYY"),
          day.unit?.total?.available ?? 0,
        ]),
      ),
    };

    return [...DATA, TOTAL_DATA];
  }, [forecastUnitData]);

  useEffect(() => {
    dispatch(
      unitDriverCapacityActions.getUnitCapacityForecastFetch({
        dateFrom: dayjs().format("YYYY-MM-DD"),
        dateTo: dayjs().add(29, "days").format("YYYY-MM-DD"),
        branchIds: filter.branchId || [],
        shipmentTypes: filter.shipmentType || [],
      }),
    );
  }, [filter]);

  return (
    <Table
      title={t("table.title")}
      columns={ColumnForecastCapacity()}
      dataSource={forecastDataSource}
      rowKey="indicator"
      loading={loading[unitDriverCapacityTypes.GET_UNIT_CAPACITY_FORECAST]}
      scroll={{ x: "max-content", y: 55 * 5 }}
    />
  );
};

export default UnitCapacityForecast;
