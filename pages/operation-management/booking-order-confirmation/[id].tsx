import Card from "@sera-components/card";
import PageHeader from "@sera-components/page-header";
import OperationManagement from "@sera-components/pages/operation-management";
import { ROUTE } from "@sera-utils/constants/routes";
import React from "react";
import { useTranslation } from "react-i18next";

const ApprovalBookingOrderDetail = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "approvalBookingOrder",
  });
  return (
    <>
      <PageHeader
        title={t("title")}
        breadcrumb={[
          { title: t("breadcrumb.0") },
          {
            title: t("breadcrumb.1"),
            url: ROUTE.OPERATION_MANAGEMENT.APPROVAL_BOOKING_ORDER,
          },
          { title: t("breadcrumb.2.detail") },
        ]}
        backUrl={ROUTE.OPERATION_MANAGEMENT.APPROVAL_BOOKING_ORDER}
        isDirectToURL
      />
      <Card title={t("breadcrumb.2.detail")}>
        <OperationManagement.FormApproval />
      </Card>
    </>
  );
};

export default ApprovalBookingOrderDetail;
