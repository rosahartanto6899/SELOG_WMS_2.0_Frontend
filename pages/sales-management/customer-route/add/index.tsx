/* eslint-disable @typescript-eslint/no-explicit-any */
import PageHeader from "@sera-components/page-header";
import SalesManagementComponent from "@sera-components/pages/sales-management";
import MessageHandler from "@sera-libraries/message-handler";
import { customerRouteActions, RootState } from "@sera-redux";
import { customerRouteTypes } from "@sera-types/customer-route.type";
import { LoadingState } from "@sera-types/loading.type";
import { ROUTE } from "@sera-utils/constants/routes";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Form } from "antd";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface CustomerRouteAddPageProps {
  loading: LoadingState;
  createCustomerRoute: typeof customerRouteActions.createCustomerRouteFetch;
}

const CustomerRouteAddPage = ({
  loading,
  createCustomerRoute,
}: CustomerRouteAddPageProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: "customerRoute" });
  const [form] = Form.useForm();

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/sales-management/customer-route/detail");

  const onHandleCreateCustomerRoute = () => {
    form
      .validateFields()
      .then((_values) => {
        try {
          createCustomerRoute({
            customerId: _values?.customerId,
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
            "onHandleCreateCustomerRoute",
            34,
            isApiResponse(_error) ? _error : _error?.data?.message,
          );
        }
      })
      .catch((_error: any) => {
        const messageHandler = MessageHandler();
        const errorHandler = messageHandler.error({ content: t("message") });

        sendErrorHandler(
          "onHandleCreateCustomerRoute",
          34,
          isApiResponse(_error) ? _error : "Validation form not pass",
          errorHandler,
        );
      });
  };

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
          { title: t("breadcrumb.2.add") },
        ]}
        backUrl={ROUTE.SALES_MANAGEMENT.CUSTOMER_ROUTE}
        isDirectToURL
      />
      <SalesManagementComponent.CustomerRouteForm
        type="create"
        form={form}
        onSubmit={onHandleCreateCustomerRoute}
        loading={loading[customerRouteTypes.CREATE_CUSTOMER_ROUTE]}
      />
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
});

const mapDispatchToProps = {
  createCustomerRoute: customerRouteActions.createCustomerRouteFetch,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CustomerRouteAddPage);
