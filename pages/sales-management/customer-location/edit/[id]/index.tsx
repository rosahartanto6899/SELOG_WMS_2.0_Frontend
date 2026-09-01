/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import Error404 from "@sera-components/error-boundary/Error404";
import PageHeader from "@sera-components/page-header";
import SalesManagementComponent from "@sera-components/pages/sales-management";
import MessageHandler from "@sera-libraries/message-handler";
import {
  customerLocationActions,
  useAppDispatch,
  useAppSelector,
} from "@sera-redux";
import { ROUTE } from "@sera-utils/constants/routes";
import useCheckPermission from "@sera-utils/hooks/useCheckPermission";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import Utils from "@sera-utils/utils";
import { Form } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const CustomerLocationEditPage = () => {
  const router = useRouter();
  const { t } = useTranslation(undefined, { keyPrefix: "customerLocation" });
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { id } = router.query;
  const { isUpdate } = useCheckPermission({
    menuLink: ROUTE.SALES_MANAGEMENT.CUSTOMER_LOCATION,
  });
  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/sales-management/customer-location/edit/[id]");

  const { customerLocations } = useAppSelector((state) => state);

  const handleUpdateLocation = () => {
    if (form.isFieldsTouched()) {
      form
        .validateFields()
        .then((values) => {
          const _detail = customerLocations?.customerLocationDetail?.data;

          const payload = {
            id,
            ...values,
            area: undefined,
            customerId:
              _detail?.customerName === values?.customerId
                ? _detail?.customerId
                : values?.customerId,
            operationDays: values.operationDays.map((d: any) => ({
              ...d,
              isOpened: d.isOpened ? 1 : 0,
            })),
          };

          try {
            dispatch(
              customerLocationActions.updateCustomerLocationFetch(payload),
            );
          } catch (_error: any) {
            sendErrorHandlerApi(
              "handleUpdateLocation",
              23,
              isApiResponse(_error) ? _error : _error?.data?.message,
            );
          }
        })
        .catch((_error) => {
          const messageHandler = MessageHandler();
          const errorHandler = messageHandler.error({ content: t("message") });

          sendErrorHandler(
            "handleUpdateLocation",
            23,
            isApiResponse(_error) ? _error : "Validation form not pass",
            errorHandler,
          );
        });
    } else {
      Utils().onGoBack(router, "/sales-management/customer-location");
    }
  };

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

  if (!isUpdate) return <Error404 />;
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
          { title: t("breadcrumb.2.edit") },
        ]}
        backUrl={ROUTE.SALES_MANAGEMENT.CUSTOMER_LOCATION}
        isDirectToURL
      />
      <SalesManagementComponent.CustomerLocationForm
        onSubmit={handleUpdateLocation}
        type="update"
        form={form}
      />
    </>
  );
};

export default CustomerLocationEditPage;
