/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "@sera-components/button";
import Card from "@sera-components/card";
import { Plus } from "@sera-components/icons";
import Table from "@sera-components/table";
import MessageHandler from "@sera-libraries/message-handler";
import { RootState } from "@sera-redux";
import { expenseActions } from "@sera-redux/slices/expense-monitoring.slice";
import { BaseType } from "@sera-types/base.type";
import {
  AdditionalExpenses,
  ExpenseState,
  expenseTypes,
} from "@sera-types/expense-monitoring";
import { LoadingState } from "@sera-types/loading.type";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import SharedUtils from "@sera-utils/shared-utils";
import { Col, Row } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import useGetPermission from "../../hooks/useGetPermission";
import { ColumnsAdditionalExpense } from "./detail-props-table";
import FormAdditionalExpense from "./form-additional-expense";

interface SectionAdditionalExpenseProps {
  loading: LoadingState;
  expenseMonitoring: ExpenseState;
  getAddExpenses: typeof expenseActions.getAddExpensesFetch;
  createAddExpensesClear: typeof expenseActions.createAddExpensesClear;
}

const SectionAdditionalExpense = ({
  loading,
  expenseMonitoring,
  getAddExpenses,
  createAddExpensesClear,
}: SectionAdditionalExpenseProps) => {
  const router = useRouter();
  const { t } = useTranslation(undefined, {
    keyPrefix: "admExpense.detail.additionalExpense.table",
  });

  const { id, activeSection } = router.query;
  const { isCreate } = useGetPermission("expense-monitoring");

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/expense-monitoring/additional-expense");

  const [options, setOptions] = useState<BaseType>({ page: 1, limit: 10 });

  const onHandleToForm = () => {
    SharedUtils().changeActiveSectionKey("add-new-expense", router);
  };

  const onHandleBackForm = () => {
    SharedUtils().changeActiveSectionKey("", router);
  };

  const onChangePagination = (_current: number, _limit: number) => {
    setOptions((_prev) => ({ ..._prev, page: _current, limit: _limit }));
  };

  useEffect(() => {
    if (activeSection === "add-new-expense") return;
    if (!id || typeof id !== "string") return;

    try {
      getAddExpenses({ id, ...options });
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 69, error);
      else sendErrorHandler("useEffect", 69, error?.data?.message);
    }
  }, [id, options]);

  useEffect(() => {
    const { shipmentNo } = expenseMonitoring.createAddExpenses.data || {};
    if (shipmentNo) {
      MessageHandler().success(
        `${t("toast.create.prevText")} “${shipmentNo}” ${t("toast.create.postText")}`,
      );
      createAddExpensesClear();
    }
  }, [expenseMonitoring.createAddExpenses]);

  if (activeSection === "add-new-expense") {
    return <FormAdditionalExpense toggle={() => onHandleBackForm()} />;
  }

  return (
    <Card title={t("subtitle")}>
      <Table
        title={t("title")}
        columns={ColumnsAdditionalExpense()}
        dataSource={expenseMonitoring?.getAddExpenses?.data ?? []}
        total={expenseMonitoring?.getAddExpenses?.options?.totalData ?? 0}
        current={expenseMonitoring?.getAddExpenses?.options?.page ?? 1}
        pageSize={expenseMonitoring?.getAddExpenses?.options?.limit ?? 10}
        rowKey={(row: AdditionalExpenses) => `${row.no}`}
        onPageChange={onChangePagination}
        scroll={{ x: "max-content" }}
        loading={loading[expenseTypes.GET_ADD_EXPENSES]}
        actions={
          <Row gutter={[16, 4]}>
            {isCreate ? (
              <Col>
                <Button
                  id="action-add"
                  type="primary"
                  icon={<Plus />}
                  onClick={onHandleToForm}
                >
                  {t("button.add")}
                </Button>
              </Col>
            ) : null}
          </Row>
        }
      />
    </Card>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  expenseMonitoring: state.expenseMonitoring,
});

const mapDispatchToProps = {
  getAddExpenses: expenseActions.getAddExpensesFetch,
  createAddExpensesClear: expenseActions.createAddExpensesClear,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SectionAdditionalExpense);
