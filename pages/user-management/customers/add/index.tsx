/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LayoutUserManagement } from "@sera-components/pages/user-management";
import MessageHandler from "@sera-libraries/message-handler";
import { customerActions, RootState } from "@sera-redux";
import { CustomerState } from "@sera-types/customer.type";
import { LoadingState } from "@sera-types/loading.type";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Form } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import CustomerForm from "../../../../components/pages/user-management/customers/customer-form";

const CustomerAdd = ({
  loading,
  createCustomer,
  customers,
}: {
  loading: LoadingState;
  createCustomer: typeof customerActions.createCustomerFetch;
  customers: CustomerState;
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation(undefined, { keyPrefix: "customerManagement" });
  const { sendErrorHandlerApi, sendErrorHandler } = useErrorHandler(
    "/pages/user-management/customers/add/index",
  );

  const LOCATION_BREADCRUMBS = [
    { title: t("breadcrumb.0.title") },
    { title: t("breadcrumb.1.title") },
  ];

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        try {
          createCustomer(values);
        } catch (error: any) {
          if (error?.status !== undefined)
            sendErrorHandlerApi("handleSubmit", 1, error);
          else sendErrorHandler("handleSubmit", 1, error?.data?.message);
        }
      })
      .catch(() => undefined);
  };

  useEffect(() => {
    if ((customers.error as any)?.data?.errors) {
      MessageHandler().error(t("notification.addFailed"));
    }
  }, [customers.error]);

  return (
    <LayoutUserManagement
      titlePage={t("form.title")}
      locationUrlList={LOCATION_BREADCRUMBS}
    >
      <CustomerForm
        form={form}
        loading={!!loading.isLoading}
        onSubmit={handleSubmit}
      />
    </LayoutUserManagement>
  );
};

const mapStateToProps = (state: RootState) => ({
  customers: state.customers,
  loading: state.loading,
});
const mapDispatchToProps = {
  createCustomer: customerActions.createCustomerFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerAdd);
