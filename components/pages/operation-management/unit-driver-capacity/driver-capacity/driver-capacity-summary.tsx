import Table from "@sera-components/table";
import { useAppDispatch, useAppSelector } from "@sera-redux";
import { unitDriverCapacityActions } from "@sera-redux/slices/unit-driver-capacity.slice";
import { unitDriverCapacityTypes } from "@sera-types/unit-driver-capacity.type";
import { AREA_KEY_ORDER } from "@sera-utils/constants/common";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { UnitDriverCapacityFilterProps } from "../unit-driver-capacity-initial-page";
import { ColumDriverCapacitySummary } from "../unit-driver-capacity-props-table";

interface DriverCapacitySummaryProps {
  filter: UnitDriverCapacityFilterProps;
}

const DriverCapacitySummary = ({ filter }: DriverCapacitySummaryProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "unitDriverCapacity.driver",
  });

  const dispatch = useAppDispatch();

  const {
    driverCapacity: {
      summary: {
        data: { areas, rows, totals },
      },
    },
  } = useAppSelector((state) => state.unitDriverCapacity);

  const loading = useAppSelector((state) => state.loading);

  const DATA_SUMMARY = useMemo(() => {
    if (!rows?.length) return [];

    const _DATA = [
      ...rows,
      {
        status: "Total",
        ...totals,
      },
    ];
    return _DATA;
  }, [rows, totals]);

  useEffect(() => {
    dispatch(unitDriverCapacityActions.getDriverCapacitySummaryFetch(filter));
  }, [filter]);

  return (
    <>
      <Table
        title={t("table.titleSummary")}
        columns={ColumDriverCapacitySummary({
          area: AREA_KEY_ORDER?.map((_areaName) =>
            areas?.find((_item) => _item === _areaName),
          )?.filter((_item) => _item !== undefined),
        })}
        bordered
        dataSource={DATA_SUMMARY}
        rowKey="status"
        loading={loading[unitDriverCapacityTypes.GET_DRIVER_CAPACITY_SUMMARY]}
        scroll={{ x: "max-content" }}
      />
    </>
  );
};

export default DriverCapacitySummary;
