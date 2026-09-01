/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { LayoutUserManagement } from "@sera-components/pages/user-management";
import UserManagementComponent from "@sera-components/pages/user-management/users";
import MessageHandler from "@sera-libraries/message-handler";
import { RootState, userActions } from "@sera-redux";
import { LoadingState } from "@sera-types/loading.type";
import { UserState, userTypes } from "@sera-types/user.type";
import { ROUTE } from "@sera-utils/constants/routes";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import Utils from "@sera-utils/utils";
import { Form } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface UserManagementAddProps {
  loading: LoadingState;
  getUserDetail: typeof userActions.getUserDetailFetch;
  updateUser: typeof userActions.updateUserFetch;
  users: UserState;
}

const UserManagementAdd = ({
  loading,
  getUserDetail,
  updateUser,
  users,
}: UserManagementAddProps) => {
  const router = useRouter();
  const { t } = useTranslation(undefined, { keyPrefix: "userManagement" });
  const [form] = Form.useForm();
  const { id } = router.query;

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
      title: t("breadcrumb.2.edit"),
    },
  ];

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/user-management/users/edit/[id]");

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

  const handleUpdateUser = () => {
    if (form.isFieldsTouched()) {
      form
        .validateFields()
        .then((values) => {
          const formData = {
            id,
            name: values.newName,
            nrp: values.nrp,
            email: values.newEmail,
            ...(values.phoneNumber ? { phone: values.phoneNumber } : {}),
            isActive: values.isActive,
            roles: toRolesPayload(values.accessRows),
          };

          try {
            updateUser(formData);
          } catch (err: any) {
            if (isApiResponse(err))
              sendErrorHandlerApi("handleUpdateUser", 35, err);
            else sendErrorHandler("handleUpdateUser", 35, err?.data?.message);
          }
        })
        .catch((error) => {
          const messageHandler = MessageHandler();
          // const errorHandler = messageHandler.error({
          //   content: t("form.nonNullable.message"),
          // });

          if (isApiResponse(error))
            sendErrorHandlerApi(
              "handleUpdateUser",
              35,
              error,
              messageHandler.error,
            );
        });
    } else {
      Utils().onGoBack(router, "/user-management/users");
    }
  };

  useEffect(() => {
    if ((users.error as any)?.data?.errors) {
      const errorData = (users.error as any).data.errors;

      const mapFieldName = (field: string): string => {
        if (field === "email") {
          return "newEmail";
        } else if (field === "password") {
          return "newPassword";
        } else {
          return field;
        }
      };
      const errors = errorData.map((err: { field: any; message: any }) => ({
        name: mapFieldName(err.field),
        errors: err.message,
      }));
      form.setFields(errors);
    }
  }, [users.error]);

  useEffect(() => {
    if (id) {
      try {
        getUserDetail({ id });
      } catch (error: any) {
        if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 71, error);
        else sendErrorHandler("useEffect", 71, error?.data?.message);
      }
    }
    return () => form.resetFields();
  }, [id]);

  return (
    <LayoutUserManagement
      titlePage={t("breadcrumb.2.edit")}
      locationUrlList={LOCATION_BREADCRUMBS}
      backUrl={ROUTE.USER_MANAGEMENT.USERS}
    >
      <UserManagementComponent.Form
        form={form}
        loading={loading[userTypes.UPDATE_USER]}
        onSubmit={handleUpdateUser}
      />
    </LayoutUserManagement>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  users: state.users,
});

const mapDispatchToProps = {
  getUserDetail: userActions.getUserDetailFetch,
  updateUser: userActions.updateUserFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManagementAdd);
