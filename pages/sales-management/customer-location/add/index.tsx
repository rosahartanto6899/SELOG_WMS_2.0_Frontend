/* eslint-disable @typescript-eslint/no-explicit-any */
import Error404 from "@sera-components/error-boundary/Error404";
import PageHeader from "@sera-components/page-header";
import SalesManagementComponent from "@sera-components/pages/sales-management";
import MessageHandler from "@sera-libraries/message-handler";
import { customerLocationActions, useAppDispatch } from "@sera-redux";
import { ROUTE } from "@sera-utils/constants/routes";
import useCheckPermission from "@sera-utils/hooks/useCheckPermission";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Form } from "antd";
import { useTranslation } from "react-i18next";

const CustomerLocationAddPage = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "customerLocation" });
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { isCreate } = useCheckPermission({
    menuLink: ROUTE.SALES_MANAGEMENT.CUSTOMER_LOCATION,
  });
  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/sales-management/customer-locations/add/index");

  const handleCreateLocation = () => {
    form
      .validateFields()
      .then((values) => {
        const payload = {
          ...values,
          area: undefined,
          operationDays: values.operationDays.map((d: any) => ({
            ...d,
            isOpened: d.isOpened ? 1 : 0,
          })),
        };
        try {
          dispatch(
            customerLocationActions.createNewCustomerLocationFetch(payload),
          );
        } catch (_error: any) {
          sendErrorHandlerApi(
            "handleCreateLocation",
            23,
            isApiResponse(_error) ? _error : _error?.data?.message,
          );
        }
      })
      .catch((_error: any) => {
        const messageHandler = MessageHandler();
        const errorHandler = messageHandler.error({ content: t("message") });

        sendErrorHandler(
          "handleCreateLocation",
          23,
          isApiResponse(_error) ? _error : "Validation form not pass",
          errorHandler,
        );
      });
  };

  if (!isCreate) return <Error404 />;
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
          { title: t("breadcrumb.2.add") },
        ]}
        backUrl={ROUTE.SALES_MANAGEMENT.CUSTOMER_LOCATION}
        isDirectToURL
      />
      <SalesManagementComponent.CustomerLocationForm
        onSubmit={handleCreateLocation}
        type="create"
        form={form}
      />
    </>
  );
};

export default CustomerLocationAddPage;
