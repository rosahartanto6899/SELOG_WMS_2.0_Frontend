/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import Error404 from "@sera-components/error-boundary/Error404";
import PageHeader from "@sera-components/page-header";
import SalesManagementComponent from "@sera-components/pages/sales-management";
import { actionCustomer } from "@sera-components/pages/sales-management/customer/customer-props-table";
import MessageHandler from "@sera-libraries/message-handler";
import { customerActions, RootState } from "@sera-redux";
import { CustomerState, customerTypes } from "@sera-types/customer.type";
import { LoadingState } from "@sera-types/loading.type";
import { ROUTE } from "@sera-utils/constants/routes";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Form } from "antd";
import { cloneDeep, isEmpty } from "lodash";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface CustomerDataEditProps {
  loading: LoadingState;
  customers: CustomerState;
  getDetailCustomer: typeof customerActions.getDetailCustomerFetch;
  getDetailCustomerClear: typeof customerActions.getDetailCustomerClear;
  updateCustomer: typeof customerActions.updateCustomerFetch;
  getCustomerSales: typeof customerActions.getCustomerSalesFetch;
  getCustomerContacts: typeof customerActions.getCustomerContactsFetch;
  createSalesClear: typeof customerActions.createSalesClear;
  deleteSalesClear: typeof customerActions.deleteSalesClear;
}
const CustomerDataEditPage = ({
  loading,
  customers,
  getDetailCustomer,
  getDetailCustomerClear,
  updateCustomer,
  getCustomerSales,
  getCustomerContacts,
  createSalesClear,
  deleteSalesClear,
}: CustomerDataEditProps) => {
  const router = useRouter();
  const { t } = useTranslation(undefined, { keyPrefix: "customer" });

  const [form] = Form.useForm();
  const { id } = router.query;

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/sales-management/customer-data/edit/[id]");

  const onHandleUpdateCustomer = () => {
    form
      .validateFields()
      .then((_values) => {
        try {
          const _payload = cloneDeep(_values);

          updateCustomer({
            id: id as string,
            isPhysicalPOD: _payload?.isPhysicalPOD?.includes("physical-pod"),
            isEPOD: _payload?.isPhysicalPOD?.includes("e-pod"),
            additionalRequests: _payload?.additionalRequests,
          });
        } catch (_error: any) {
          sendErrorHandlerApi(
            "onHandleUpdateCustomer",
            49,
            isApiResponse(_error) ? _error : _error?.data?.message,
          );
        }
      })
      .catch((_error: any) => {
        const messageHandler = MessageHandler();
        const errorHandler = messageHandler.error({ content: t("message") });

        sendErrorHandler(
          "onHandleUpdateCustomer",
          49,
          isApiResponse(_error) ? _error : "Validation form not pass",
          errorHandler,
        );
      });
  };

  useEffect(() => {
    getDetailCustomerClear();
  }, []);

  useEffect(() => {
    if (!id || typeof id !== "string") return;

    try {
      getDetailCustomer({ id });
      getCustomerSales({ customerId: id });
      getCustomerContacts({ customerId: id });
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 39, error);
      else sendErrorHandler("useEffect", 39, error?.data?.message);
    }

    return () => form.resetFields();
  }, [id]);

  useEffect(() => {
    if (isEmpty(customers?.createSales?.data)) return;

    MessageHandler().success(t("toast.sales.create"));
    getCustomerSales({ customerId: id as string });
    createSalesClear();
  }, [customers?.createSales?.data]);

  useEffect(() => {
    if (isEmpty(customers?.deleteSales?.data)) return;

    MessageHandler().success(t("toast.sales.delete"));
    getCustomerSales({ customerId: id as string });
    deleteSalesClear();
  }, [customers?.deleteSales?.data]);

  if (!actionCustomer.isUpdate) return <Error404 />;

  return (
    <>
      <PageHeader
        title={t("breadcrumb.2.edit")}
        breadcrumb={[
          { title: t("breadcrumb.0") },
          { title: t("breadcrumb.1"), url: ROUTE.SALES_MANAGEMENT.CUSTOMER },
          { title: t("breadcrumb.2.edit") },
        ]}
        backUrl={ROUTE.SALES_MANAGEMENT.CUSTOMER}
        isDirectToURL
      />
      <SalesManagementComponent.CustomerForm
        type="update"
        form={form}
        loading={
          loading[customerTypes.GET_DETAIL_CUSTOMER] ||
          loading[customerTypes.UPDATE_CUSTOMER]
        }
        onSubmit={onHandleUpdateCustomer}
      />
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  customers: state.customers,
});

const mapDispatchToProps = {
  getDetailCustomer: customerActions.getDetailCustomerFetch,
  getDetailCustomerClear: customerActions.getDetailCustomerClear,
  updateCustomer: customerActions.updateCustomerFetch,
  getCustomerSales: customerActions.getCustomerSalesFetch,
  getCustomerContacts: customerActions.getCustomerContactsFetch,
  createSalesClear: customerActions.createSalesClear,
  deleteSalesClear: customerActions.deleteSalesClear,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CustomerDataEditPage);
