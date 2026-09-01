/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import Error404 from "@sera-components/error-boundary/Error404";
import PageHeader from "@sera-components/page-header";
import SalesManagementComponent from "@sera-components/pages/sales-management";
import { actionCustomerRoute } from "@sera-components/pages/sales-management/customer-route/customer-route-props-table";
import { customerRouteActions, RootState } from "@sera-redux";
import { customerRouteTypes } from "@sera-types/customer-route.type";
import { LoadingState } from "@sera-types/loading.type";
import { ROUTE } from "@sera-utils/constants/routes";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Form } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface CustomerRouteDetailPageProps {
  loading: LoadingState;
  getDetailCustomerRoute: typeof customerRouteActions.getDetailCustomerRouteFetch;
}

const CustomerRouteDetailPage = ({
  loading,
  getDetailCustomerRoute,
}: CustomerRouteDetailPageProps) => {
  const router = useRouter();
  const { t } = useTranslation(undefined, { keyPrefix: "customerRoute" });

  const [form] = Form.useForm();
  const { id } = router.query;

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/sales-management/customer-route/detail");

  useEffect(() => {
    if (!id || typeof id !== "string") return;

    try {
      getDetailCustomerRoute({ id });
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 69, error);
      else sendErrorHandler("useEffect", 69, error?.data?.message);
    }

    return () => form.resetFields();
  }, [id]);

  if (!actionCustomerRoute.isRead) return <Error404 />;

  return (
    <>
      <PageHeader
        title={t("breadcrumb.2.read")}
        breadcrumb={[
          { title: t("breadcrumb.0") },
          {
            title: t("breadcrumb.1"),
            url: ROUTE.SALES_MANAGEMENT.CUSTOMER_ROUTE,
          },
          { title: t("breadcrumb.2.read") },
        ]}
        backUrl={ROUTE.SALES_MANAGEMENT.CUSTOMER_ROUTE}
        isDirectToURL
      />
      <SalesManagementComponent.CustomerRouteForm
        type="detail"
        form={form}
        loading={loading[customerRouteTypes.GET_DETAIL_CUSTOMER_ROUTE]}
      />
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
});

const mapDispatchToProps = {
  getDetailCustomerRoute: customerRouteActions.getDetailCustomerRouteFetch,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CustomerRouteDetailPage);
