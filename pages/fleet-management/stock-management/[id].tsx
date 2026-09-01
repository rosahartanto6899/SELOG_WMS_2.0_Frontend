/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Error404 from "@sera-components/error-boundary/Error404";
import PageLayout from "@sera-components/layout/page-layout";
import useGetPermissionFleetManagement from "@sera-components/pages/fleet-management/hooks/useGetPermission";
import StockManagementComponent from "@sera-components/pages/fleet-management/stock-management";
import { RootState, stockManagementActions } from "@sera-redux";
import { LoadingState } from "@sera-types/loading.type";
import { stockManagementTypes } from "@sera-types/stock-management.type";
import { ROUTE } from "@sera-utils/constants/routes";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Form } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface StockManagementDetailPageProps {
  loading: LoadingState;
  detailVehicle: typeof stockManagementActions.detailVehicleFetch;
}

const StockManagementDetailPage = ({
  loading,
  detailVehicle,
}: StockManagementDetailPageProps) => {
  const router = useRouter();
  const { t } = useTranslation(undefined, { keyPrefix: "stockManagement" });

  const [form] = Form.useForm();
  const { id } = router.query;

  const { isRead } = useGetPermissionFleetManagement("stock-management");

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/fleet-management/stock-management/detail");

  useEffect(() => {
    if (!id || typeof id !== "string") return;

    try {
      detailVehicle({ id });
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 69, error);
      else sendErrorHandler("useEffect", 69, error?.data?.message);
    }

    return () => form.resetFields();
  }, [id]);

  if (!isRead) return <Error404 />;

  return (
    <PageLayout
      title={t("breadcrumb.2.detail")}
      breadcrumb={[
        { title: t("breadcrumb.0") },
        {
          title: t("breadcrumb.1"),
          url: ROUTE.FLEET_MANAGEMENT.STOCK_MANAGEMENT,
        },
        { title: t("breadcrumb.2.detail") },
      ]}
      backUrl={ROUTE.FLEET_MANAGEMENT.STOCK_MANAGEMENT}
      isDirectToURL
      withTab={false}
      content={
        <StockManagementComponent.Form
          type="detail"
          form={form}
          loading={loading[stockManagementTypes.DETAIL_VEHICLE]}
          onSubmit={() => {}}
        />
      }
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
});

const mapDispatchToProps = {
  detailVehicle: stockManagementActions.detailVehicleFetch,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StockManagementDetailPage);
