import Error404 from "@sera-components/error-boundary/Error404";
import PageLayout from "@sera-components/layout/page-layout";
import DriverManagementComponent from "@sera-components/pages/driver-management";
import useGetPermission from "@sera-components/pages/driver-management/hooks/useGetPermission";
import { RootState } from "@sera-redux";
import { ROUTE } from "@sera-utils/constants/routes";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

const DriverStockDetailPage = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "driverStock" });
  const router = useRouter();
  const { id } = router.query;

  const { isRead } = useGetPermission("driver-stock");

  if (!isRead || !id) return <Error404 />;

  return (
    <PageLayout
      title={t("breadcrumb.2.detail")}
      breadcrumb={[
        { title: t("breadcrumb.0") },
        {
          title: t("breadcrumb.1"),
          url: ROUTE.DRIVER_MANAGEMENT.DRIVER_STOCK,
        },
        { title: t("breadcrumb.2.detail") },
      ]}
      backUrl={ROUTE.DRIVER_MANAGEMENT.DRIVER_STOCK}
      isDirectToURL
      withTab={false}
      content={
        <DriverManagementComponent.DriverStockDetailPage id={id as string} />
      }
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DriverStockDetailPage);
