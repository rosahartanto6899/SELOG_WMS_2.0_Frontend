/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import Error404 from "@sera-components/error-boundary/Error404";
import PageLayout from "@sera-components/layout/page-layout";
import SalesManagementComponent from "@sera-components/pages/sales-management";
import { actionCustomerContract } from "@sera-components/pages/sales-management/customer-contract/customer-contract-props-table";
import { customerContractActions, RootState } from "@sera-redux";
import { customerContractTypes } from "@sera-types/customer-contract.type";
import { LoadingState } from "@sera-types/loading.type";
import { ROUTE } from "@sera-utils/constants/routes";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Form } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface CustomerContractDetailPageProps {
  loading: LoadingState;
  getDetailContract: typeof customerContractActions.getDetailContractFetch;
}

const CustomerContractDetailPage = ({
  loading,
  getDetailContract,
}: CustomerContractDetailPageProps) => {
  const router = useRouter();
  const { t } = useTranslation(undefined, { keyPrefix: "customerContract" });

  const [form] = Form.useForm();
  const { id } = router.query;

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/sales-management/customer-contract/detail");

  useEffect(() => {
    if (!id || typeof id !== "string") return;

    try {
      getDetailContract({ id });
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 69, error);
      else sendErrorHandler("useEffect", 69, error?.data?.message);
    }

    return () => form.resetFields();
  }, [id]);

  if (!actionCustomerContract.isRead) return <Error404 />;

  return (
    <PageLayout
      title={t("breadcrumb.2.detail")}
      breadcrumb={[
        { title: t("breadcrumb.0") },
        {
          title: t("breadcrumb.1"),
          url: ROUTE.SALES_MANAGEMENT.CUSTOMER_CONTRACT,
        },
        { title: t("breadcrumb.2.detail") },
      ]}
      backUrl={ROUTE.SALES_MANAGEMENT.CUSTOMER_CONTRACT}
      isDirectToURL
      withTab={false}
      content={
        <SalesManagementComponent.CustomerContractForm
          type="detail"
          form={form}
          loading={loading[customerContractTypes.GET_DETAIL_CONTRACT]}
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
  getDetailContract: customerContractActions.getDetailContractFetch,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CustomerContractDetailPage);
