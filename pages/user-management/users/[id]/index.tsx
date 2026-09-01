/* eslint-disable react-hooks/exhaustive-deps */
import { LayoutUserManagement } from "@sera-components/pages/user-management";
import UserManagementComponent from "@sera-components/pages/user-management/users";
import { RootState, userActions } from "@sera-redux";
import { LoadingState } from "@sera-types/loading.type";
import { userTypes } from "@sera-types/user.type";
import { ROUTE } from "@sera-utils/constants/routes";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Form } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface UserDetailProps {
  loading: LoadingState;
  getUserDetail: typeof userActions.getUserDetailFetch;
  getUserDetailClear: typeof userActions.getUserDetailClear;
}

const UserDetail = ({
  loading,
  getUserDetail,
  getUserDetailClear,
}: UserDetailProps) => {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation(undefined, { keyPrefix: "userManagement" });
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
      title: t("breadcrumb.2.detail"),
    },
  ];
  const [form] = Form.useForm();
  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/user-management/users/[id]");

  useEffect(() => {
    if (id) {
      try {
        getUserDetail({ id });
      } catch (error: unknown) {
        const errorMessage = error as { data?: { message?: string } };
        if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 71, error);
        else
          sendErrorHandler("useEffect", 71, errorMessage?.data?.message ?? "");
      }
    }
    return () => {
      form.resetFields();
      getUserDetailClear();
    };
  }, [id]);

  return (
    <LayoutUserManagement
      titlePage={t("breadcrumb.2.detail")}
      locationUrlList={LOCATION_BREADCRUMBS}
      backUrl={ROUTE.USER_MANAGEMENT.USERS}
    >
      <UserManagementComponent.Form
        form={form}
        loading={loading[userTypes.UPDATE_USER]}
        onSubmit={() => {}}
        isDetail
      />
    </LayoutUserManagement>
  );
};
const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
});

const mapDispatchToProps = {
  getUserDetail: userActions.getUserDetailFetch,
  getUserDetailClear: userActions.getUserDetailClear,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserDetail);
