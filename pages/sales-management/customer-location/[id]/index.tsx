/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import Error404 from "@sera-components/error-boundary/Error404";
import PageHeader from "@sera-components/page-header";
import SalesManagementComponent from "@sera-components/pages/sales-management";
import { customerLocationActions, useAppDispatch } from "@sera-redux";
import { ROUTE } from "@sera-utils/constants/routes";
import useCheckPermission from "@sera-utils/hooks/useCheckPermission";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Form } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const CustomerLocationDetailPage = () => {
  const router = useRouter();
  const { t } = useTranslation(undefined, { keyPrefix: "customerLocation" });
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { id } = router.query;
  const { isRead } = useCheckPermission({
    menuLink: ROUTE.SALES_MANAGEMENT.CUSTOMER_LOCATION,
  });
  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/sales-management/customer-location/[id]");

  useEffect(() => {
    if (id) {
      try {
        dispatch(
          customerLocationActions.getCustomerLocationDetailFetch({ id }),
        );
      } catch (error: any) {
        if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 91, error);
        else sendErrorHandler("useEffect", 92, error?.data?.message);
      }
    }
    return () => form.resetFields();
  }, [id]);

  if (!isRead) return <Error404 />;

  return (
    <>
      <PageHeader
        title={t("title")}
        breadcrumb={[
          { title: t("breadcrumb.0") },
          {
            title: t("breadcrumb.1"),
            url: ROUTE.SALES_MANAGEMENT.CUSTOMER_LOCATION,
          },
          { title: t("breadcrumb.2.read") },
        ]}
        backUrl={ROUTE.SALES_MANAGEMENT.CUSTOMER_LOCATION}
        isDirectToURL
      />
      <SalesManagementComponent.CustomerLocationForm
        type="detail"
        form={form}
        isRead
      />
    </>
  );
};

export default CustomerLocationDetailPage;
