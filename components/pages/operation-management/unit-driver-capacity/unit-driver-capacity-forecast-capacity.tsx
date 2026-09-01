import Table from "@sera-components/table";
import { useAppSelector } from "@sera-redux";
import { DriverForecast } from "@sera-types/unit-driver-capacity.type";
import dayjs from "dayjs";
import { lowerCase } from "lodash";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import {
  ColumnForecastCapacity,
  INDICATOR_FORECAST_DRIVER,
  INDICATOR_FORECAST_UNIT,
} from "./unit-driver-capacity-props-table";

interface UnitDriverForecastProps {
  type: "unit" | "driver";
}

const UnitDriverForecastCapacity = ({ type }: UnitDriverForecastProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "unitDriverCapacity.forecast",
  });

  const DRIVER_FORECAST_KEYS = INDICATOR_FORECAST_DRIVER.map((v) => ({
    key: lowerCase(v),
    name: v,
  }));

  const UNIT_FORECAST_KEYS = INDICATOR_FORECAST_UNIT.map((v) => ({
    key: lowerCase(v),
    name: v,
  }));

  const {
    unitCapacity: {
      forecast: { data: forecastUnitData },
    },
    driverCapacity: {
      forecast: { data: forecastDriverData },
    },
  } = useAppSelector((state) => state.unitDriverCapacity);

  const FORECAST_DATES = useMemo(() => {
    return Array.from({ length: 32 }, (_, i) => dayjs().add(i, "days"));
  }, []);

  const forecastDataSource = useMemo(() => {
    const INDICATOR =
      type === "driver" ? DRIVER_FORECAST_KEYS : UNIT_FORECAST_KEYS;

    const FORECAST_DATA =
      type === "driver" ? forecastDriverData : { days: FORECAST_DATES };
    //forecastUnitData;

    return INDICATOR.map((v) => ({
      key: v.key,
      indicator: v.name,
      ...Object.fromEntries(
        FORECAST_DATA.days.map((capacity: unknown) => {
          if (type === "driver") {
            const value = capacity as DriverForecast;
            return [
              dayjs(value.date, "YYYY-MM-DD").format("DD-MM-YYYY"),
              value.driver[v.key as keyof DriverForecast["driver"]].available,
            ];
          } else {
            const value = capacity as dayjs.Dayjs; //UnitForecast;
            return [
              value.format("DD-MM-YYYY"),
              Math.floor(Math.random() * 20),
              // value.unit[v.key as keyof DriverForecast["driver"]].available,
            ];
          }
        }),
      ),
    }));
  }, [
    type,
    forecastUnitData,
    forecastDriverData,
    DRIVER_FORECAST_KEYS,
    UNIT_FORECAST_KEYS,
  ]);

  return (
    <Table
      title={t("table.title")}
      columns={ColumnForecastCapacity()}
      dataSource={forecastDataSource}
      rowKey="indicator"
      loading={false}
      scroll={{ x: "max-content" }}
    />
  );
};

export default UnitDriverForecastCapacity;
