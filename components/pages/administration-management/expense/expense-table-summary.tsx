/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import Table from "@sera-components/table";
import { RootState } from "@sera-redux";
import { expenseActions } from "@sera-redux/slices/expense-monitoring.slice";
import {
  ExpenseState,
  expenseTypes,
  FilterParams,
  SummaryExpenses,
} from "@sera-types/expense-monitoring";
import { LoadingState } from "@sera-types/loading.type";
import { BRANCH_ORDER } from "@sera-utils/constants/common";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import { ColumnsSummary } from "./expense-props-table";

interface TableShipmentProps {
  params: FilterParams;
  loading: LoadingState;
  expenseMonitoring: ExpenseState;
  getSummaryExpenses: typeof expenseActions.getSummaryExpensesFetch;
}

const TableShipment = ({
  params,
  loading,
  expenseMonitoring,
  getSummaryExpenses,
}: TableShipmentProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "admExpense.table.summary",
  });

  useEffect(() => {
    getSummaryExpenses({ ...params });
  }, [params]);

  return (
    <Table
      title={t("title")}
      columns={ColumnsSummary()}
      dataSource={BRANCH_ORDER.map((_branchName) =>
        expenseMonitoring?.getSummaryExpenses?.data?.find(
          (_item) => _item?.branchName === _branchName,
        ),
      )?.filter((_item) => _item! !== undefined)}
      rowKey={(row: SummaryExpenses) => `${row.branchId}`}
      scroll={{ x: "max-content" }}
      loading={loading[expenseTypes.GET_SUMMARY_EXPENSES]}
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  expenseMonitoring: state.expenseMonitoring,
});

const mapDispatchToProps = {
  getSummaryExpenses: expenseActions.getSummaryExpensesFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(TableShipment);
