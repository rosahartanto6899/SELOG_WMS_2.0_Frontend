/* eslint-disable react-hooks/exhaustive-deps */
import PageLayout from "@sera-components/layout/page-layout";
import Roles from "@sera-components/pages/user-management/roles";
import MessageHandler from "@sera-libraries/message-handler";
import { RootState } from "@sera-redux";
import { roleActions } from "@sera-redux/slices/role.slice";
import { LoadingState } from "@sera-types/loading.type";
import { RoleState } from "@sera-types/role.type";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface RolePageProps {
  roles: RoleState;
  loading: LoadingState;
  getRoles: typeof roleActions.getRolesFetch;
  getRolesAutoComplete: typeof roleActions.getRolesAutoCompleteFetch;
  deleteRole: typeof roleActions.deleteRoleFetch;
  postCreateNewRoleClear: typeof roleActions.postCreateNewRoleClear;
  postDeleteRoleClear: typeof roleActions.postDeleteRoleClear;
  postUpdateRoleClear: typeof roleActions.postUpdateRoleClear;
}

const RolesPage = (props: RolePageProps) => {
  const {
    deleteRole,
    getRoles,
    getRolesAutoComplete,
    loading,
    roles,
    postCreateNewRoleClear,
    postDeleteRoleClear,
    postUpdateRoleClear,
  } = props;

  const { t } = useTranslation(undefined, { keyPrefix: "roles" });

  // NOTIFICATION - CREATE NEW ROLE
  useEffect(() => {
    const { roleName } = roles.postCreateNewRole;
    if (roleName !== "") {
      MessageHandler().success(
        `${t("title")} “${roleName}” ${t("notification.add")}`,
      );
      postCreateNewRoleClear();
    }
  }, [roles.postCreateNewRole.roleName]);

  // NOTIFICATION - UPDATE ROLE
  useEffect(() => {
    const { roleName } = roles.postUpdateRole;
    if (roleName !== "") {
      MessageHandler().success(
        `${t("title")} “${roleName}” ${t("notification.edit")}`,
      );
      postUpdateRoleClear();
    }
  }, [roles.postUpdateRole.roleName]);

  // NOTIFICATION - DELETE ROLE
  useEffect(() => {
    const { roleName } = roles.postDeleteRole;
    if (roleName !== "") {
      MessageHandler().success(
        `${t("title")} “${roleName}” ${t("notification.delete")}`,
      );
      postDeleteRoleClear();
    }
  }, [roles.postDeleteRole.roleName]);

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[
        { title: t("breadcrumb.0.title") },
        { title: t("breadcrumb.1.title") },
      ]}
      content={
        <Roles
          // permissions={null}
          dataSource={roles.data}
          autoComplete={roles.autoComplete?.data}
          roleOptions={roles.options}
          loading={loading}
          onFetchRoles={getRoles}
          onFetchAutoComplete={getRolesAutoComplete}
          onDeleteRole={deleteRole}
        />
      }
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  roles: state.roles,
  loading: state.loading,
});

const mapDispatchToProps = {
  getRoles: roleActions.getRolesFetch,
  getRolesAutoComplete: roleActions.getRolesAutoCompleteFetch,
  deleteRole: roleActions.deleteRoleFetch,
  postCreateNewRoleClear: roleActions.postCreateNewRoleClear,
  postDeleteRoleClear: roleActions.postDeleteRoleClear,
  postUpdateRoleClear: roleActions.postUpdateRoleClear,
};

export default connect(mapStateToProps, mapDispatchToProps)(RolesPage);
