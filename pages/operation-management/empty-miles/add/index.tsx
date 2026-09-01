import PageLayout from "@sera-components/layout/page-layout";
import OperationManagement from "@sera-components/pages/operation-management";
import { ROUTE } from "@sera-utils/constants/routes";
import React from "react";
import { useTranslation } from "react-i18next";

const AddEmptyMiles = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "emptyMiles",
  });
  return (
    <PageLayout
      title={t("breadcrumb.2.add")}
      breadcrumb={[
        { title: t("breadcrumb.0") },
        {
          title: t("breadcrumb.1"),
          url: ROUTE.OPERATION_MANAGEMENT.EMPTY_MILES,
        },
        { title: t("breadcrumb.2.add") },
      ]}
      backUrl={ROUTE.OPERATION_MANAGEMENT.EMPTY_MILES}
      isDirectToURL
      withTab={false}
      content={<OperationManagement.EmptyMilesForm type="create" />}
    />
  );
};

export default AddEmptyMiles;
