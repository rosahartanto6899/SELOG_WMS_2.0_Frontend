import Error404 from "@sera-components/error-boundary/Error404";
import PageLayout from "@sera-components/layout/page-layout";
import DetailPageComponent from "@sera-components/pages/administration-management/expense-refund/detail-page";
import useGetPermission from "@sera-components/pages/administration-management/hooks/useGetPermission";
import { ROUTE } from "@sera-utils/constants/routes";
import router from "next/router";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

const DetailPage = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "expenseRefund",
  });

  const { isRead } = useGetPermission("expense-refund");
  const { id, shipmentExpenseId } = router.query;

  if (!isRead || !id || !shipmentExpenseId) return <Error404 />;

  return (
    <PageLayout
      title={t("breadcrumb.2.detail")}
      breadcrumb={[
        { title: t("breadcrumb.0") },
        {
          title: t("breadcrumb.1"),
          url: ROUTE.ADMINISTRATION_MANAGEMENT.EXPENSE_REFUND,
        },
        { title: t("breadcrumb.2.detail") },
      ]}
      backUrl={ROUTE.ADMINISTRATION_MANAGEMENT.EXPENSE_REFUND}
      isDirectToURL
      withTab={false}
      content={
        <DetailPageComponent
          id={id as string}
          shipmentExpenseId={shipmentExpenseId as string}
        />
      }
    />
  );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DetailPage);
