/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import Button from "@sera-components/button";
import FormActions from "@sera-components/hocs/form-actions";
import { LayoutUserManagement } from "@sera-components/pages/user-management";
import Select from "@sera-components/select";
import Skeleton from "@sera-components/skeleton";
import MessageHandler from "@sera-libraries/message-handler";
import { menuActions, roleMenuActions, RootState } from "@sera-redux";
import { roleActions } from "@sera-redux/slices/role.slice";
import { LoadingState } from "@sera-types/loading.type";
import { MenuDropdown, MenuState, menuTypes } from "@sera-types/menu.type";
import { Role, RoleState, roleTypes } from "@sera-types/role.type";
import { RoleMenuState, roleMenuTypes } from "@sera-types/role-menu.type";
import { ROUTE } from "@sera-utils/constants/routes";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { NextAppPage } from "@sera-utils/types";
import Utils from "@sera-utils/utils";
import { Card, Checkbox, Col, Form, Row } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import styles from "./edit-role-permission.module.scss";

interface EditRoleMenuProps {
  loading: LoadingState;
  menus: MenuState;
  roles: RoleState;
  roleMenus: RoleMenuState;
  updateRoleMenu: typeof roleMenuActions.updateRoleMenuFetch;
  getDropdownMenus: typeof menuActions.getDropdownMenusFetch;
  getDropdownRoles: typeof roleActions.getDropdownRolesFetch;
  getAllRoleMenus: typeof roleMenuActions.getAllRoleMenusFetch;
  getRoleMenuDetail: typeof roleMenuActions.getRoleMenuDetailFetch;
  clearAllRoleMenu: typeof roleMenuActions.clearAllRoleMenus;
}

const EditRoleMenu: NextAppPage<EditRoleMenuProps> = (
  props: EditRoleMenuProps,
) => {
  const {
    loading,
    menus,
    roles,
    roleMenus,
    updateRoleMenu,
    getDropdownMenus,
    getDropdownRoles,
    getAllRoleMenus,
    getRoleMenuDetail,
    clearAllRoleMenu,
  } = props;

  const { t: tEdit } = useTranslation(undefined, {
    keyPrefix: "rolePermission.edit",
  });

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/user-management/role-permissions/edit/[id]");

  const LOCATION_BREADCRUMBS: {
    title: string;
    href?: string;
  }[] = [
    {
      title: tEdit("breadcrumb.0.title"),
    },
    {
      title: tEdit("breadcrumb.1.title"),
      href: "/user-management/role-permissions",
    },
    {
      title: tEdit("breadcrumb.2.title"),
    },
  ];

  const [form] = Form.useForm();
  const router = useRouter();
  const { roleId, id } = router.query;

  const [dataDropdownMenu, setDataDropdownMenu] = useState<MenuDropdown[]>([]);
  const [dataDropdownRoles, setDropdownRoles] = useState<Role[]>([]);

  useEffect(() => {
    const fetchAllApi = async () => {
      try {
        await Promise.all([
          getDropdownMenus(),
          getAllRoleMenus({
            page: 1,
            limit: 1000,
            roleId: roleId as string,
          }),
        ]);
        getRoleMenuDetail({ id });
        getDropdownRoles();
      } catch (error: any) {
        if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 93, error);
        else sendErrorHandler("useEffect", 94, error?.data?.message);
      }
    };

    fetchAllApi();

    return () => {
      form.resetFields();
      clearAllRoleMenu();
    };
  }, [getDropdownMenus, roleId, getAllRoleMenus, getRoleMenuDetail, id]);

  useEffect(() => {
    const { data } = menus.dropdownMenus;
    if (data.length) {
      setDataDropdownMenu(data);
    }
  }, [menus.dropdownMenus.data]);

  useEffect(() => {
    setTimeout(() => {
      form.setFieldValue("roleId", roleId);
    }, 100);
  }, [roles.roleDetail.data]);

  useEffect(() => {
    const { data } = roles.dropdownRoles;
    if (data.length) {
      setDropdownRoles(data);
    }
  }, [roles.dropdownRoles.data]);

  useEffect(() => {
    const { data } = roleMenus.roleMenuDetail;
    if (data) {
      form.setFieldValue("menuId", data.menuId);
      form.setFieldValue("isRead", data.isRead);
      form.setFieldValue("isCreate", data.isCreate);
      form.setFieldValue("isUpdate", data.isUpdate);
      form.setFieldValue("isDelete", data.isDelete);
    }
  }, [roleMenus.roleMenuDetail.data]);

  const handleUpdateRoleMenu = () => {
    form
      .validateFields()
      .then((values) => {
        const formData = {
          id,
          isRead: values.isRead ? 1 : 0,
          isCreate: values.isCreate ? 1 : 0,
          isUpdate: values.isUpdate ? 1 : 0,
          isDelete: values.isDelete ? 1 : 0,
        };

        try {
          updateRoleMenu(formData);
        } catch (error: any) {
          sendErrorHandlerApi("handleUpdateRoleMenu", 173, error);
        }
      })
      .catch((error: any) => {
        const messageHandler = MessageHandler();
        // const errorHandler = messageHandler.error({
        //   content: tEdit("form.nonNullable.message"),
        // });

        if (isApiResponse(error)) {
          sendErrorHandlerApi(
            "handleUpdateRoleMenu",
            173,
            error,
            messageHandler.error,
          );
        }
      });
  };

  const onGoBack = () => {
    Utils().onGoBack(router, "/user-management/role-permissions");
  };

  const onCancelEditRoleMenu = () => {
    onGoBack();
  };

  return (
    <LayoutUserManagement
      locationUrlList={LOCATION_BREADCRUMBS}
      titlePage={tEdit("title")}
      backUrl={ROUTE.USER_MANAGEMENT.ROLE_PERMISSION}
    >
      <Form
        form={form}
        layout="vertical"
        disabled={loading[roleMenuTypes.UPDATE_ROLE_MENU]}
        requiredMark={undefined}
      >
        {/* {Search Input Card} */}
        <Card
          className={styles["ant-card-base-custom"]}
          title={tEdit("cardTitle")}
        >
          <Row gutter={16}>
            <Col xs={24} sm={24} md={24}>
              <Form.Item
                label={tEdit("form.menu.title")}
                rules={[
                  { required: true, message: tEdit("form.required.message") },
                ]}
                name="menuId"
              >
                {!loading[menuTypes.GET_DROPDOWN_MENUS] ? (
                  <Select
                    id="menuId"
                    placeholder={tEdit("form.menu.placeholder")}
                    loading={
                      loading[menuTypes.GET_DROPDOWN_MENUS] &&
                      loading[roleMenuTypes.GET_ROLE_MENU_DETAIL]
                    }
                    filterOption={false}
                    disabled
                  >
                    {dataDropdownMenu.map(({ value, label }) => (
                      <Select.Option value={value} key={value}>
                        {label}
                      </Select.Option>
                    ))}
                  </Select>
                ) : (
                  <Skeleton.Input block />
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label={tEdit("form.role.title")}
                rules={[
                  { required: true, message: tEdit("form.required.message") },
                ]}
                name="roleId"
              >
                <Select
                  id="roleId"
                  placeholder={tEdit("form.role.placeholder")}
                  loading={loading[roleTypes.GET_DROPDOWN_ROLES]}
                  filterOption={false}
                  disabled
                >
                  {dataDropdownRoles.map(({ id, roleName }) => (
                    <Select.Option value={`${id}`} key={id}>
                      {roleName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12}>
              <Row gutter={16}>
                <Col>
                  <Form.Item
                    valuePropName="checked"
                    name="isRead"
                    label={tEdit("form.action.title")}
                  >
                    <Checkbox id="isRead" value="1">
                      {tEdit("form.action.options.0")}
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item valuePropName="checked" name="isCreate" label=" ">
                    <Checkbox id="isCreate" value="1">
                      {tEdit("form.action.options.1")}
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item valuePropName="checked" name="isUpdate" label=" ">
                    <Checkbox id="isUpdate" value="1">
                      {tEdit("form.action.options.2")}
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item valuePropName="checked" name="isDelete" label=" ">
                    <Checkbox id="isDelete" value="1">
                      {tEdit("form.action.options.3")}
                    </Checkbox>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>

        {/* {Button Actions} */}
        <FormActions>
          <Row justify="end" gutter={[8, 8]}>
            <Col>
              <Button
                id="cancel"
                className="ant-btn-custom secondary"
                onClick={onCancelEditRoleMenu}
                disabled={loading[roleMenuTypes.UPDATE_ROLE_MENU]}
              >
                {tEdit("form.button.cancel")}
              </Button>
            </Col>

            <Col>
              <Button
                id="save"
                className="ant-btn-custom primary"
                type="primary"
                onClick={handleUpdateRoleMenu}
                htmlType="submit"
                loading={loading[roleMenuTypes.UPDATE_ROLE_MENU]}
              >
                {tEdit("form.button.save")}
              </Button>
            </Col>
          </Row>
        </FormActions>
      </Form>
    </LayoutUserManagement>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  menus: state.menus,
  roles: state.roles,
  roleMenus: state.roleMenus,
});

const mapDispatchToProps = {
  updateRoleMenu: roleMenuActions.updateRoleMenuFetch,
  getDropdownMenus: menuActions.getDropdownMenusFetch,
  getAllRoleMenus: roleMenuActions.getAllRoleMenusFetch,
  getRoleMenuDetail: roleMenuActions.getRoleMenuDetailFetch,
  clearAllRoleMenu: roleMenuActions.clearAllRoleMenus,
  getDropdownRoles: roleActions.getDropdownRolesFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditRoleMenu);
