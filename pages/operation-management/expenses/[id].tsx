import PageHeader from "@sera-components/page-header";
import OperationManagement from "@sera-components/pages/operation-management";
import { useAppDispatch } from "@sera-redux";
import { expensesActions } from "@sera-redux/slices/expenses.slice";
import { ROUTE } from "@sera-utils/constants/routes";
import { Form } from "antd";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

const ExpensesDetailPage = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "expenses" });
  const [form] = Form.useForm();
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id) {
      dispatch(expensesActions.getExpensesDetailFetch({ id: id as string }));
    }

    return () => {
      dispatch(expensesActions.getExpensesDetailClear());
    };
  }, [id, form]);

  return (
    <>
      <PageHeader
        title={t("form.title.detail")}
        breadcrumb={[
          { title: t("breadcrumb.0") },
          {
            title: t("breadcrumb.1"),
            url: ROUTE.OPERATION_MANAGEMENT.EXPENSES,
          },
          { title: t("breadcrumb.2.detail") },
        ]}
        backUrl={ROUTE.OPERATION_MANAGEMENT.EXPENSES}
        isDirectToURL
      />
      <OperationManagement.ExpensesForm form={form} type="detail" />
    </>
  );
};

export default ExpensesDetailPage;
