import PageHeader from "@sera-components/page-header";
import OperationManagement from "@sera-components/pages/operation-management";
import { ROUTE } from "@sera-utils/constants/routes";
import React from "react";
import { useTranslation } from "react-i18next";

const ExpensesUpsertPage = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "expenses" });
  return (
    <>
      <PageHeader
        title={t("form.title.addUpsert")}
        breadcrumb={[
          { title: t("breadcrumb.0") },
          {
            title: t("breadcrumb.1"),
            url: ROUTE.OPERATION_MANAGEMENT.EXPENSES,
          },
          { title: t("breadcrumb.2.addUpsert") },
        ]}
        backUrl={ROUTE.OPERATION_MANAGEMENT.EXPENSES}
        isDirectToURL
      />
      <OperationManagement.ExpensesUpsert />
    </>
  );
};

export default ExpensesUpsertPage;
