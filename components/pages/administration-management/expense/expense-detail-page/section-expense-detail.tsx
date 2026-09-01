/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Card from "@sera-components/card";
import Table from "@sera-components/table";
import MessageHandler from "@sera-libraries/message-handler";
import { RootState } from "@sera-redux";
import { expenseActions } from "@sera-redux/slices/expense-monitoring.slice";
import {
  DetailExpensesDetail,
  ExpenseState,
  expenseTypes,
} from "@sera-types/expense-monitoring";
import { LoadingState } from "@sera-types/loading.type";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Flex } from "antd";
import { isEmpty, isNull } from "lodash";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import { ColumnsExpenseDetail } from "./detail-props-table";
import FormExpenseDetail from "./form-expense-detail";

interface SectionExpenseDetailProps {
  loading: LoadingState;
  expenseMonitoring: ExpenseState;
  getDetailExpenses: typeof expenseActions.getDetailExpensesFetch;
  updateDetailExpenseClear: typeof expenseActions.updateDetailExpenseClear;
}

const SectionExpenseDetail = ({
  loading,
  expenseMonitoring,
  getDetailExpenses,
  updateDetailExpenseClear,
}: SectionExpenseDetailProps) => {
  const router = useRouter();
  const { t } = useTranslation(undefined, {
    keyPrefix: "admExpense.detail.expenseDetail.table",
  });

  const [selectedData, setSelectedData] = useState<DetailExpensesDetail | null>(
    null,
  );

  const { id } = router.query;

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler(
      "/pages/administration-management/expense-monitoring/expense-detail",
    );

  useEffect(() => {
    if (!id || typeof id !== "string") return;

    try {
      getDetailExpenses({ id });
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 69, error);
      else sendErrorHandler("useEffect", 69, error?.data?.message);
    }
  }, [id]);

  const DATA = useCallback(
    (_driverType: string) => {
      const _data = expenseMonitoring?.getDetailExpenses?.data?.flatMap(
        (_item) => _item?.details ?? [],
      );

      return _data
        ?.filter((_item) => _item?.driverType === _driverType)
        ?.map((_item, _index) => ({ ..._item, no: _index + 1 }));
    },
    [expenseMonitoring?.getDetailExpenses?.data],
  );

  useEffect(() => {
    if (!id || typeof id !== "string") return;

    const _data = expenseMonitoring?.updateDetailExpense?.data;
    if (isEmpty(_data)) return;

    setSelectedData(null);
    MessageHandler().success(t("toast.update"));
    updateDetailExpenseClear();

    try {
      getDetailExpenses({ id });
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 69, error);
      else sendErrorHandler("useEffect", 69, error?.data?.message);
    }
  }, [id, expenseMonitoring?.updateDetailExpense?.data]);

  const colExpenseDetail = ColumnsExpenseDetail({
    onUpdate(_record) {
      setSelectedData(_record);
    },
  });

  return (
    <Flex vertical gap={24}>
      <Card title={t("subtitle.0")}>
        <Table
          title={t("title")}
          columns={colExpenseDetail}
          dataSource={DATA("driver1") ?? []}
          rowKey={(row: any) => `${row.no}`}
          scroll={{ x: "max-content" }}
          loading={loading[expenseTypes.GET_DETAIL_EXPENSES]}
        />
      </Card>

      {DATA("driver2")?.length > 0 ? (
        <Card title={t("subtitle.1")}>
          <Table
            title={t("title")}
            columns={colExpenseDetail}
            dataSource={DATA("driver2") ?? []}
            rowKey={(row: any) => `${row.no}`}
            scroll={{ x: "max-content" }}
            loading={loading[expenseTypes.GET_DETAIL_EXPENSES]}
          />
        </Card>
      ) : null}

      <FormExpenseDetail
        open={!isNull(selectedData)}
        data={selectedData}
        toggle={() => setSelectedData(null)}
      />
    </Flex>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  expenseMonitoring: state.expenseMonitoring,
});

const mapDispatchToProps = {
  getDetailExpenses: expenseActions.getDetailExpensesFetch,
  updateDetailExpenseClear: expenseActions.updateDetailExpenseClear,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SectionExpenseDetail);
