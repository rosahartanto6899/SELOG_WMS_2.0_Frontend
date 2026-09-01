/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import Error404 from "@sera-components/error-boundary/Error404";
import PageHeader from "@sera-components/page-header";
import SalesManagementComponent from "@sera-components/pages/sales-management";
import { actionCustomer } from "@sera-components/pages/sales-management/customer/customer-props-table";
import { customerActions, RootState } from "@sera-redux";
import { customerTypes } from "@sera-types/customer.type";
import { LoadingState } from "@sera-types/loading.type";
import { ROUTE } from "@sera-utils/constants/routes";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Form } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface CustomerDataDetailProps {
  loading: LoadingState;
  getDetailCustomer: typeof customerActions.getDetailCustomerFetch;
  getCustomerSales: typeof customerActions.getCustomerSalesFetch;
  getCustomerContacts: typeof customerActions.getCustomerContactsFetch;
}
const CustomerDataEditPage = ({
  loading,
  getDetailCustomer,
  getCustomerSales,
  getCustomerContacts,
}: CustomerDataDetailProps) => {
  const router = useRouter();
  const { t } = useTranslation(undefined, { keyPrefix: "customer" });

  const [form] = Form.useForm();
  const { id } = router.query;

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/sales-management/customer-data/edit/[id]");

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

  if (!actionCustomer.isRead) return <Error404 />;

  return (
    <>
      <PageHeader
        title={t("breadcrumb.2.read")}
        breadcrumb={[
          { title: t("breadcrumb.0") },
          { title: t("breadcrumb.1"), url: ROUTE.SALES_MANAGEMENT.CUSTOMER },
          { title: t("breadcrumb.2.read") },
        ]}
        backUrl={ROUTE.SALES_MANAGEMENT.CUSTOMER}
        isDirectToURL
      />

      <SalesManagementComponent.CustomerForm
        type="detail"
        form={form}
        loading={loading[customerTypes.GET_DETAIL_CUSTOMER]}
        onSubmit={() => {}}
      />
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
});

const mapDispatchToProps = {
  getDetailCustomer: customerActions.getDetailCustomerFetch,
  getCustomerSales: customerActions.getCustomerSalesFetch,
  getCustomerContacts: customerActions.getCustomerContactsFetch,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CustomerDataEditPage);
