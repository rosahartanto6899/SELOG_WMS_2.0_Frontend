import PageHeader from "@sera-components/page-header";
import SalesManagementComponent from "@sera-components/pages/sales-management";
import { ROUTE } from "@sera-utils/constants/routes";
import { Form } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

const OrderStatusDetailPage = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "orderStatus" });
  const [form] = Form.useForm();
  return (
    <>
      <PageHeader
        title={t("title")}
        breadcrumb={[
          { title: t("breadcrumb.0") },
          {
            title: t("breadcrumb.1"),
            url: ROUTE.SALES_MANAGEMENT.SHIPMENT_STATUS,
          },
          { title: t("breadcrumb.2.detail") },
        ]}
        backUrl={ROUTE.SALES_MANAGEMENT.SHIPMENT_STATUS}
        isDirectToURL
      />
      <SalesManagementComponent.OrderStatusForm form={form} />
    </>
  );
};

export default OrderStatusDetailPage;
