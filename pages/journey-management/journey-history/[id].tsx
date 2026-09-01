import Error404 from "@sera-components/error-boundary/Error404";
import PageLayout from "@sera-components/layout/page-layout";
import useGetPermission from "@sera-components/pages/journey-management/hooks/useGetPermission";
import JourneyHistoryComponent from "@sera-components/pages/journey-management/journey-history";
import { ROUTE } from "@sera-utils/constants/routes";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

const StockManagementDetailPage = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "journeyHistory",
  });

  const { isRead } = useGetPermission("journey-history");

  if (!isRead) return <Error404 />;

  return (
    <PageLayout
      title={t("breadcrumb.2.detail")}
      breadcrumb={[
        { title: t("breadcrumb.0") },
        {
          title: t("breadcrumb.1"),
          url: ROUTE.JOURNEY_MANAGEMENT.JOURNEY_HISTORY,
        },
        { title: t("breadcrumb.2.detail") },
      ]}
      backUrl={ROUTE.JOURNEY_MANAGEMENT.JOURNEY_HISTORY}
      isDirectToURL
      withTab={false}
      content={<JourneyHistoryComponent.DetailPage />}
    />
  );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StockManagementDetailPage);
