/* eslint-disable react-hooks/exhaustive-deps */
import PageLayout from "@sera-components/layout/page-layout";
import RoleMenus from "@sera-components/pages/user-management/role-permissions";
import Select from "@sera-components/select";
import MessageHandler from "@sera-libraries/message-handler";
import { roleMenuActions, RootState } from "@sera-redux";
import { roleActions } from "@sera-redux/slices/role.slice";
import { LoadingState } from "@sera-types/loading.type";
import { Role, RoleState, roleTypes } from "@sera-types/role.type";
import { RoleMenuState } from "@sera-types/role-menu.type";
import { Col, Form, Row } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface RolesPermissionsPageProps {
  roleMenus: RoleMenuState;
  roles: RoleState;
  loading: LoadingState;
  getRoleMenus: typeof roleMenuActions.getRoleMenusFetch;
  getRoleMenusAutoComplete: typeof roleMenuActions.getRoleMenusAutoCompleteFetch;
  clearRoleMenusAutoComplete: typeof roleMenuActions.clearRoleMenusAutoComplete;
  deleteRole: typeof roleMenuActions.deleteRoleMenuFetch;
  getDropdownRoles: typeof roleActions.getDropdownRolesFetch;
  onSetRoleId: typeof roleMenuActions.setRoleIdOnRoleMenu;
  postCreateNewRoleMenuClear: typeof roleMenuActions.postCreateNewRoleMenuClear;
  postUpdateNewRoleMenuClear: typeof roleMenuActions.postUpdateNewRoleMenuClear;
  postDeleteNewRoleMenuClear: typeof roleMenuActions.postDeleteNewRoleMenuClear;
}

const RolesPermissionsPage = ({
  roleMenus,
  roles,
  loading,
  getRoleMenus,
  getRoleMenusAutoComplete,
  clearRoleMenusAutoComplete,
  deleteRole,
  getDropdownRoles,
  onSetRoleId,
  postCreateNewRoleMenuClear,
  postUpdateNewRoleMenuClear,
  postDeleteNewRoleMenuClear,
}: RolesPermissionsPageProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: "rolePermission" });

  const [form] = Form.useForm();
  const [dataDropdownRole, setDataDropdownRole] = useState<Role[]>([]);

  const onSelectionRoleChange = (value: string) => {
    onSetRoleId(value);
  };

  const searchRole = (keyword?: string) => {
    if (keyword) {
      const filteredRoles = roles.dropdownRoles.data.filter(
        (dataRole) =>
          dataRole &&
          dataRole.roleName &&
          dataRole.roleName.toLowerCase().indexOf(keyword.toLowerCase()) > -1,
      );
      setDataDropdownRole(filteredRoles);
    } else {
      setDataDropdownRole(roles.dropdownRoles.data);
    }
  };

  useEffect(() => {
    const fetchAllApi = async () => {
      await Promise.all([getDropdownRoles()]);
    };
    fetchAllApi();
  }, [getDropdownRoles]);

  useEffect(() => {
    setDataDropdownRole(roles.dropdownRoles.data);
    if (roles.dropdownRoles.data.length > 0) {
      form.setFieldValue(
        "roleId",
        roleMenus.roleId ?? roles.dropdownRoles.data[0].id,
      );
      onSetRoleId(roleMenus.roleId ?? roles.dropdownRoles.data[0].id);
    }
  }, [roles.dropdownRoles.data]);

  // NOTIFICATION - CREATE NEW ROLE PERMISSON
  useEffect(() => {
    const { success } = roleMenus.postCreateNewRoleMenus;
    if (success === true) {
      MessageHandler().success(`${t("title")} ${t("notification.add")}`);
      postCreateNewRoleMenuClear();
    }
  }, [roleMenus.postCreateNewRoleMenus.success]);

  // NOTIFICATION - UPDATE ROLE PERMISSION
  useEffect(() => {
    const { success } = roleMenus.postUpdateRoleMenus;
    if (success === true) {
      MessageHandler().success(`${t("title")} ${t("notification.edit")}`);
      postUpdateNewRoleMenuClear();
    }
  }, [roleMenus.postUpdateRoleMenus.success]);

  // NOTIFICATION - DELETE ROLE PERMISSION
  useEffect(() => {
    const { success, menuName } = roleMenus.postDeleteRoleMenus;
    if (success === true) {
      MessageHandler().success(`“${menuName}” ${t("notification.delete")}`);
      postDeleteNewRoleMenuClear();
    }
  }, [roleMenus.postDeleteRoleMenus.success]);

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[
        { title: t("breadcrumb.0.title") },
        { title: t("breadcrumb.1.title") },
      ]}
      Action={
        <Form form={form} layout="horizontal">
          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item name="roleId">
                {!loading[roleTypes.GET_DROPDOWN_ROLES] && (
                  <Select
                    id="roleId"
                    onChange={(e) => onSelectionRoleChange(e)}
                    placeholder="Select Role"
                    loading={loading[roleTypes.GET_DROPDOWN_ROLES]}
                    // onClear={() => {
                    //   searchRole();
                    // }}
                    allowClear={false}
                    filterOption={false}
                    onSearch={(search) => {
                      searchRole(search);
                    }}
                  >
                    {dataDropdownRole.map(({ id, roleName }) => (
                      <Select.Option value={id} key={id}>
                        {roleName}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      }
      content={
        <RoleMenus
          // permissions={null}
          dataSource={roleMenus.data}
          autoComplete={roleMenus.autoComplete?.data}
          roleMenuOptions={roleMenus.options}
          loading={loading}
          onFetchRoleMenus={getRoleMenus}
          onFetchAutoComplete={getRoleMenusAutoComplete}
          onClearAutoComplete={clearRoleMenusAutoComplete}
          onDeleteRoleMenu={deleteRole}
        />
      }
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  roleMenus: state.roleMenus,
  roles: state.roles,
  loading: state.loading,
});

const mapDispatchToProps = {
  getRoleMenus: roleMenuActions.getRoleMenusFetch,
  getRoleMenusAutoComplete: roleMenuActions.getRoleMenusAutoCompleteFetch,
  clearRoleMenusAutoComplete: roleMenuActions.clearRoleMenusAutoComplete,
  deleteRole: roleMenuActions.deleteRoleMenuFetch,
  onSetRoleId: roleMenuActions.setRoleIdOnRoleMenu,
  getDropdownRoles: roleActions.getDropdownRolesFetch,
  postCreateNewRoleMenuClear: roleMenuActions.postCreateNewRoleMenuClear,
  postUpdateNewRoleMenuClear: roleMenuActions.postUpdateNewRoleMenuClear,
  postDeleteNewRoleMenuClear: roleMenuActions.postDeleteNewRoleMenuClear,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RolesPermissionsPage);
