import PageLayout from "@sera-components/layout/page-layout";
import SalesManagementComponent from "@sera-components/pages/sales-management";
import { useTranslation } from "react-i18next";

const BookingPage = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "bookingOrder" });

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[{ title: t("breadcrumb.0") }, { title: t("breadcrumb.1") }]}
      content={<SalesManagementComponent.BookingInitialPage />}
    />
  );
};

export default BookingPage;
