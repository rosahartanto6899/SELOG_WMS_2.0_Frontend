import PageHeader from "@sera-components/page-header";
import SalesManagementComponent from "@sera-components/pages/sales-management";
import { ROUTE } from "@sera-utils/constants/routes";
import { Form } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

const BookingOrderDetailPage = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "bookingOrder" });
  const [form] = Form.useForm();
  return (
    <>
      <PageHeader
        title={t("title")}
        breadcrumb={[
          { title: t("breadcrumb.0") },
          {
            title: t("breadcrumb.1"),
            url: ROUTE.SALES_MANAGEMENT.BOOKING_ORDER,
          },
          { title: t("breadcrumb.2.detail") },
        ]}
        backUrl={ROUTE.SALES_MANAGEMENT.BOOKING_ORDER}
        isDirectToURL
      />
      <SalesManagementComponent.BookingForm form={form} type="detail" />
    </>
  );
};

export default BookingOrderDetailPage;
