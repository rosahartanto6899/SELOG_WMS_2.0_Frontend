/* eslint-disable @typescript-eslint/no-explicit-any */
import Table from "@sera-components/table";
import { RootState } from "@sera-redux";
import { LoadingState } from "@sera-types/loading.type";
import {
  StockManagementState,
  stockManagementTypes,
  UnitInOut,
} from "@sera-types/stock-management.type";
import { MONTH_NAMES, NUMBER_FORMAT } from "@sera-utils/constants/common";
import moment from "moment";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import { ColumnsInOut } from "./stock-management-props-table";

interface TableInOutProps {
  loading: LoadingState;
  stockManagement: StockManagementState;
}

const TableInOut = ({ loading, stockManagement }: TableInOutProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "stockManagement.tableInOut",
  });

  const DATA_COLUMNS = useMemo(() => {
    const _data = stockManagement?.getSummary?.data?.unitInOutData ?? [];

    return [
      { key: "unitIn", indicator: "Unit In" },
      { key: "unitOut", indicator: "Unit Out" },
      { key: "inOutTotal", indicator: "Total" },
    ]?.map((_item) => ({
      indicator: _item?.indicator,
      ...MONTH_NAMES.reduce(
        (
          _prev: { [_key: string]: string },
          _monthName: string,
          _index: number,
        ) => {
          const _unit = _data.find(
            (_item: UnitInOut) => _item?.month === _index + 1,
          );

          _prev[_monthName] = NUMBER_FORMAT(
            _unit?.[_item?.key as keyof UnitInOut],
          );

          return _prev;
        },
        {},
      ),
    }));
  }, [stockManagement?.getSummary?.data?.unitInOutData]);

  return (
    <Table
      title={t("title", { year: moment().format("YYYY") })}
      columns={ColumnsInOut()}
      dataSource={DATA_COLUMNS}
      rowKey={(record: any) => record.indicator}
      scroll={{ x: "max-content" }}
      loading={loading[stockManagementTypes.GET_SUMMARY]}
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  stockManagement: state.stockManagement,
});

export default connect(mapStateToProps)(TableInOut);
