/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Table from "@sera-components/table";
import { RootState } from "@sera-redux";
import { LoadingState } from "@sera-types/loading.type";
import {
  SummaryForecast,
  UnitActivityState,
  unitActivityTypes,
} from "@sera-types/unit-activity";
import {
  MONTH_NAMES,
  NUMBER_FORMAT,
  WEEKS,
} from "@sera-utils/constants/common";
import moment from "moment";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import { ColumnsForecastUnit } from "./unit-activities-props-table";

interface TableForecastUnitProps {
  loading: LoadingState;
  unitActivity: UnitActivityState;
}

const TableForecastUnit = ({
  loading,
  unitActivity,
}: TableForecastUnitProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "unitActivities.table.forecastUnit",
  });

  const DATA_COLUMNS = useMemo(() => {
    const _data = unitActivity?.getSummary?.data?.forcastUnit ?? {};

    const getDataSummary = (_forecast: keyof SummaryForecast) =>
      MONTH_NAMES?.flatMap((_month) => {
        return WEEKS?.map((_week) => [_month, _week]);
      })?.reduce((_prev: any, _item) => {
        const _month = _item[0];
        const _week = _item[1];
        const _key = _item[0] + _item[1];

        _prev[_key as string] = NUMBER_FORMAT(
          _data?.[_month]?.[_week]?.[_forecast],
        );

        return _prev;
      }, {});

    const getDataCurrent = (_forecast: keyof SummaryForecast) => {
      const _currMonth = moment().month();
      const _currWeek = Math.ceil(moment().date() / 7);

      return NUMBER_FORMAT(
        _data?.[MONTH_NAMES[_currMonth]]?.[`W${_currWeek}`]?.[_forecast],
      );
    };

    return [
      {
        forecastUnit: t("column.period.forecastUnit.estPlanMaintenance"),
        ...getDataSummary("estPlanMaintenance"),
        current: getDataCurrent("estPlanMaintenance"),
      },
      {
        forecastUnit: t("column.period.forecastUnit.estUnitReadiness"),
        ...getDataSummary("estUnitReadiness"),
        current: getDataCurrent("estUnitReadiness"),
      },
      {
        forecastUnit: t("column.period.forecastUnit.estUnitAvailability"),
        ...getDataSummary("estUnitAvailability"),
        current: getDataCurrent("estUnitAvailability"),
      },
    ];
  }, [unitActivity?.getSummary?.data?.forcastUnit]);

  return (
    <Table
      title={t("title", { year: moment().format("YYYY") })}
      columns={ColumnsForecastUnit()}
      dataSource={DATA_COLUMNS}
      rowKey={(row: { forecastUnit?: string }) => `${row.forecastUnit}`}
      scroll={{ x: "max-content" }}
      loading={loading[unitActivityTypes.GET_SUMMARY]}
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  unitActivity: state.unitActivity,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TableForecastUnit);
