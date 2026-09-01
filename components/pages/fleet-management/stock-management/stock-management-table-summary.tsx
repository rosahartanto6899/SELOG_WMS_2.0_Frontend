/* eslint-disable @typescript-eslint/no-explicit-any */
import Table from "@sera-components/table";
import { RootState } from "@sera-redux";
import { LoadingState } from "@sera-types/loading.type";
import {
  StockManagementState,
  stockManagementTypes,
  UnitBranches,
  UnitDesc,
} from "@sera-types/stock-management.type";
import { BRANCH_ORDER, NUMBER_FORMAT } from "@sera-utils/constants/common";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import { ColumnsSummary } from "./stock-management-props-table";

interface TableSummaryProps {
  loading: LoadingState;
  stockManagement?: StockManagementState;
}

const TableSummary = ({ loading, stockManagement }: TableSummaryProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "stockManagement.tableSummary",
  });

  const DATA_COLUMNS = useMemo(() => {
    const _data = stockManagement?.getSummary?.data?.branchUnitData ?? {};
    const _branches = _data?.unitBranches ?? [];
    const _total = _data?.unitTotal ?? {};

    return [
      { key: "uio", indicator: "UIO" },
      { key: "usp", indicator: "USP" },
      { key: "utsp", indicator: "UTSP" },
      { key: "ratioUtsp", indicator: "Ratio UTSP" },
    ]?.map((_item) => ({
      indicator: _item?.indicator,
      ..._branches.reduce(
        (_prev: { [_key: string]: string }, _branch: UnitBranches) => {
          if (_branch?.branchName) {
            _prev[_branch.branchName] =
              _item?.key === "ratioUtsp"
                ? `${Math.round(_branch?.ratioUtsp || 0)}%`
                : NUMBER_FORMAT(_branch?.[_item?.key as keyof UnitDesc]);
          }

          return _prev;
        },
        {},
      ),
      total:
        _item?.key === "ratioUtsp"
          ? `${Math.round(_total?.ratioUtsp || 0)}%`
          : NUMBER_FORMAT(_total?.[_item?.key as keyof UnitDesc]),
    }));
  }, [stockManagement?.getSummary?.data?.branchUnitData]);

  return (
    <Table
      title={t("title")}
      columns={ColumnsSummary({
        branches: BRANCH_ORDER?.map((_branchName) =>
          stockManagement?.getSummary?.data?.branchUnitData?.unitBranches?.find(
            (_item) => _item?.branchName === _branchName,
          ),
        )?.filter((_item) => _item !== undefined),
      })}
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

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TableSummary);
