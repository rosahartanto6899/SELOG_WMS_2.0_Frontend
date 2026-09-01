/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LayoutUserManagement } from "@sera-components/pages/user-management";
import UserManagementComponent from "@sera-components/pages/user-management/users";
import MessageHandler from "@sera-libraries/message-handler";
import { RootState, userActions } from "@sera-redux";
import { LoadingState } from "@sera-types/loading.type";
import { userTypes } from "@sera-types/user.type";
import { ROUTE } from "@sera-utils/constants/routes";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Form } from "antd";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface UserManagementAddProps {
  loading: LoadingState;
  createNewUser: typeof userActions.createNewUserFetch;
}

const UserManagementAdd = ({
  loading,
  createNewUser,
}: UserManagementAddProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: "userManagement" });
  const [form] = Form.useForm();
  const LOCATION_BREADCRUMBS: {
    title: string;
    href?: string;
  }[] = [
    {
      title: t("breadcrumb.0"),
    },
    {
      title: t("breadcrumb.1"),
      href: "/user-management/users",
    },
    {
      title: t("breadcrumb.2.add"),
    },
  ];

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/user-management/users/add/index");

  const toRolesPayload = (rows: any[]) => {
    const byRole = new Map<string, any>();
    (rows || []).forEach((row) => {
      (row?.roles || []).forEach((r: any) => {
        if (!r?.roleId) return;
        if (!byRole.has(r.roleId))
          byRole.set(r.roleId, { id: r.roleId, accesses: [] });
        byRole.get(r.roleId).accesses.push({
          customerId: row.customerId,
          warehouses: r.warehouses || [],
        });
      });
    });
    return Array.from(byRole.values());
  };

  const handleCreateUser = () => {
    form
      .validateFields()
      .then((values) => {
        const formData = {
          name: values.newName,
          nrp: values.nrp,
          email: values.newEmail,
          ...(values.phoneNumber ? { phone: values.phoneNumber } : {}),
          isActive: values.isActive,
          roles: toRolesPayload(values.accessRows),
        };

        try {
          createNewUser(formData);
        } catch (error: any) {
          if (isApiResponse(error))
            sendErrorHandlerApi("handleCreateUser", 28, error);
          else sendErrorHandler("handleCreateUser", 28, error?.data?.message);
        }
      })
      .catch((error: any) => {
        const messageHandler = MessageHandler();
        // const errorHandler = messageHandler.error({
        //   content: t("form.nonNullable.message"),
        // });

        if (isApiResponse(error))
          sendErrorHandlerApi(
            "handleCreateUser",
            28,
            error,
            messageHandler.error,
          );
      });
  };

  return (
    <LayoutUserManagement
      titlePage={t("breadcrumb.2.add")}
      locationUrlList={LOCATION_BREADCRUMBS}
      backUrl={ROUTE.USER_MANAGEMENT.USERS}
    >
      <UserManagementComponent.Form
        form={form}
        loading={loading[userTypes.CREATE_USER]}
        onSubmit={handleCreateUser}
      />
    </LayoutUserManagement>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
});

const mapDispatchToProps = {
  createNewUser: userActions.createNewUserFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManagementAdd);
