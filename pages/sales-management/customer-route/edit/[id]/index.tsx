/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import Error404 from "@sera-components/error-boundary/Error404";
import PageHeader from "@sera-components/page-header";
import SalesManagementComponent from "@sera-components/pages/sales-management";
import { actionCustomerRoute } from "@sera-components/pages/sales-management/customer-route/customer-route-props-table";
import MessageHandler from "@sera-libraries/message-handler";
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

interface CustomerRouteEditPageProps {
  loading: LoadingState;
  getDetailCustomerRoute: typeof customerRouteActions.getDetailCustomerRouteFetch;
  updateCustomerRoute: typeof customerRouteActions.updateCustomerRouteFetch;
}

const CustomerRouteEditPage = ({
  loading,
  getDetailCustomerRoute,
  updateCustomerRoute,
}: CustomerRouteEditPageProps) => {
  const router = useRouter();
  const { t } = useTranslation(undefined, { keyPrefix: "customerRoute" });

  const [form] = Form.useForm();
  const { id } = router.query;

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/sales-management/customer-route/detail");

  const onHandleUpdateCustomerRoute = () => {
    form
      .validateFields()
      .then((_values) => {
        try {
          updateCustomerRoute({
            id: id as string,
            contractId: _values?.contractNo,
            vehicleTypeId: _values?.vehicleTypeId,
            quotationURL: _values?.quotationURL,
            routes: _values?.routes?.map((_route: any) => ({
              revenue: +_route?.revenue,
              leadtimeValue: +_route?.leadtimeValue,
              leadtimeType: _route?.leadtimeType ? "Days" : "Hours",
              qtyDriver: +_route?.qtyDriver,
              tollUsage: _route?.tollUsage,
              details: _route?.details?.map((_detail: any, _index: number) => ({
                id: _detail?.id,
                routeActivityType: _detail?.routeActivityType
                  ? "Unloading"
                  : "Loading",
                customerLocationId: _detail?.customerLocation,
                order: _index + 1,
              })),
            })),
          });
        } catch (_error: any) {
          sendErrorHandlerApi(
            "onHandleUpdateCustomerRoute",
            34,
            isApiResponse(_error) ? _error : _error?.data?.message,
          );
        }
      })
      .catch((_error: any) => {
        const messageHandler = MessageHandler();
        const errorHandler = messageHandler.error({ content: t("message") });

        sendErrorHandler(
          "onHandleUpdateCustomerRoute",
          34,
          isApiResponse(_error) ? _error : "Validation form not pass",
          errorHandler,
        );
      });
  };

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

  if (!actionCustomerRoute.isUpdate) return <Error404 />;

  return (
    <>
      <PageHeader
        title={t("title")}
        breadcrumb={[
          { title: t("breadcrumb.0") },
          {
            title: t("breadcrumb.1"),
            url: ROUTE.SALES_MANAGEMENT.CUSTOMER_ROUTE,
          },
          { title: t("breadcrumb.2.edit") },
        ]}
        backUrl={ROUTE.SALES_MANAGEMENT.CUSTOMER_ROUTE}
        isDirectToURL
      />
      <SalesManagementComponent.CustomerRouteForm
        type="update"
        form={form}
        onSubmit={onHandleUpdateCustomerRoute}
        loading={
          loading[customerRouteTypes.GET_DETAIL_CUSTOMER_ROUTE] ||
          loading[customerRouteTypes.UPDATE_CUSTOMER_ROUTE]
        }
      />
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
});

const mapDispatchToProps = {
  getDetailCustomerRoute: customerRouteActions.getDetailCustomerRouteFetch,
  updateCustomerRoute: customerRouteActions.updateCustomerRouteFetch,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CustomerRouteEditPage);
