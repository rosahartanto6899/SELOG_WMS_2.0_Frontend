/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import FormActions from "@sera-components/hocs/form-actions";
import { LayoutUserManagement } from "@sera-components/pages/user-management";
import Select from "@sera-components/select";
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
import { Button, Card, Checkbox, Col, Form, Row } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import styles from "./add-role-permission.module.scss";

interface AddRoleMenuProps {
  loading: LoadingState;
  menus: MenuState;
  roles: RoleState;
  roleMenus: RoleMenuState;
  createNewRoleMenu: typeof roleMenuActions.createNewRoleMenuFetch;
  getDropdownMenus: typeof menuActions.getDropdownMenusFetch;
  getRoleDetail: typeof roleActions.getRoleDetailFetch;
  getAllRoleMenus: typeof roleMenuActions.getAllRoleMenusFetch;
  clearAllRoleMenu: typeof roleMenuActions.clearAllRoleMenus;
}

const AddRoleMenu: NextAppPage<AddRoleMenuProps> = (
  props: AddRoleMenuProps,
) => {
  const {
    loading,
    menus,
    roles,
    // roleMenus,
    clearAllRoleMenu,
    createNewRoleMenu,
    getDropdownMenus,
    getRoleDetail,
    getAllRoleMenus,
  } = props;

  const { t: tAdd } = useTranslation(undefined, {
    keyPrefix: "rolePermission.add",
  });

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/user-management/role-permissions/add/index");

  const LOCATION_BREADCRUMBS: {
    title: string;
    href?: string;
  }[] = [
    {
      title: tAdd("breadcrumb.0.title"),
    },
    {
      title: tAdd("breadcrumb.1.title"),
      href: "/user-management/role-permissions",
    },
    {
      title: tAdd("breadcrumb.2.title"),
    },
  ];

  const [form] = Form.useForm();
  const router = useRouter();
  const { roleId } = router.query;

  const [dataDropdownMenu, setDataDropdownMenu] = useState<MenuDropdown[]>([]);
  const [dataDetailRole, setDataDetailRole] = useState<Role>({});

  const handleCreateRoleMenu = () => {
    form
      .validateFields()
      .then((values) => {
        const formData = {
          menuId: values.menuId,
          roleId: values.roleId,
          isRead: values.isRead ? 1 : 0,
          isCreate: values.isCreate ? 1 : 0,
          isUpdate: values.isUpdate ? 1 : 0,
          isDelete: values.isDelete ? 1 : 0,
        };

        try {
          createNewRoleMenu(formData);
        } catch (error: any) {
          sendErrorHandlerApi("handleCreateRoleMenu", 74, error);
        }
      })
      .catch((error: any) => {
        const messageHandler = MessageHandler();
        const errorHandler = messageHandler.error({
          content: tAdd("form.nonNullable.message"),
        });

        if (isApiResponse(error)) {
          sendErrorHandlerApi("handleCreateRoleMenu", 74, error, errorHandler);
        } else {
          sendErrorHandler(
            "handleCreateRoleMenu",
            74,
            error?.data?.message,
            errorHandler,
          );
        }
      });
  };

  const onGoBack = () => {
    Utils().onGoBack(router, ROUTE.USER_MANAGEMENT.ROLE_PERMISSION);
  };

  const onCancelAddRoleMenu = () => {
    onGoBack();
  };

  useEffect(() => {
    const fetchAllApi = async () => {
      try {
        await Promise.all([
          getDropdownMenus(),
          getRoleDetail({ id: roleId }),
          getAllRoleMenus({
            page: 1,
            limit: 1000,
            roleId: roleId as string,
          }),
        ]);
        form.setFieldValue("isRead", true);
      } catch (err: any) {
        const errorHandler = MessageHandler().error;
        if (isApiResponse(err))
          sendErrorHandlerApi("useEffect", 129, err, errorHandler);
        else
          sendErrorHandler(
            "useEffect",
            130,
            "get dropdown, role detail, role menus failed",
            errorHandler,
          );
      }
    };

    fetchAllApi();

    return () => {
      form.resetFields();
      clearAllRoleMenu();
    };
  }, [getDropdownMenus, roleId, getAllRoleMenus]);

  useEffect(() => {
    const { data } = menus.dropdownMenus;
    if (data.length) {
      setDataDropdownMenu(data);
    }
  }, [menus.dropdownMenus.data]);

  useEffect(() => {
    setDataDetailRole(roles.roleDetail.data);

    setTimeout(() => {
      form.setFieldValue("roleId", roleId);
    }, 100);
  }, [roles.roleDetail.data]);

  return (
    <LayoutUserManagement
      locationUrlList={LOCATION_BREADCRUMBS}
      titlePage={tAdd("title")}
      backUrl={ROUTE.USER_MANAGEMENT.ROLE_PERMISSION}
    >
      <Form
        form={form}
        layout="vertical"
        disabled={loading[roleMenuTypes.CREATE_ROLE_MENU]}
        requiredMark={undefined}
      >
        {/* {Search Input Card} */}
        <Card
          className={styles["ant-card-base-custom"]}
          title={tAdd("cardTitle")}
        >
          <Row gutter={16}>
            <Col xs={24} sm={24} md={24}>
              <Form.Item
                label={tAdd("form.menu.title")}
                rules={[
                  { required: true, message: tAdd("form.required.message") },
                ]}
                name="menuId"
              >
                <Select
                  id="menuId"
                  placeholder={tAdd("form.menu.placeholder")}
                  loading={
                    loading[menuTypes.GET_DROPDOWN_MENUS] ||
                    loading[menuTypes.GET_ALL_ROLE_MENUS]
                  }
                  showSearch
                  filterSort={(optionA, optionB) =>
                    String(optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare(String(optionB?.label ?? "").toLowerCase())
                  }
                  filterOption={(input, option) =>
                    String(option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={dataDropdownMenu.map((menu) => ({
                    value: menu.value,
                    label: menu.label ?? "",
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label={tAdd("form.role.title")}
                rules={[{ required: true, message: "This field is required" }]}
                name="roleId"
              >
                <Select
                  id="roleId"
                  placeholder={tAdd("form.role.placeholder")}
                  loading={loading[roleTypes.GET_DROPDOWN_ROLES]}
                  filterOption={false}
                  // defaultValue={roleId}
                  disabled
                >
                  <Select.Option
                    value={dataDetailRole.id}
                    key={dataDetailRole.id}
                  >
                    {dataDetailRole.roleName}
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12}>
              <Row gutter={16}>
                <Col>
                  <Form.Item
                    valuePropName="checked"
                    name="isRead"
                    label={tAdd("form.action.title")}
                  >
                    <Checkbox
                      id="isRead"
                      value="1"
                      defaultChecked
                      checked
                      disabled
                    >
                      {tAdd("form.action.options.0")}
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item valuePropName="checked" name="isCreate" label=" ">
                    <Checkbox id="isCreate" value="1">
                      {tAdd("form.action.options.1")}
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item valuePropName="checked" name="isUpdate" label=" ">
                    <Checkbox id="isUpdate" value="1">
                      {tAdd("form.action.options.2")}
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item valuePropName="checked" name="isDelete" label=" ">
                    <Checkbox id="isDelete" value="1">
                      {tAdd("form.action.options.3")}
                    </Checkbox>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
        <FormActions>
          <Row justify="end" gutter={[8, 8]}>
            <Col>
              <Button
                id="cancel"
                className="ant-btn-custom secondary"
                onClick={onCancelAddRoleMenu}
                disabled={loading[roleMenuTypes.CREATE_ROLE_MENU]}
              >
                {tAdd("form.button.cancel")}
              </Button>
            </Col>

            <Col>
              <Button
                id="save"
                className="ant-btn-custom primary"
                type="primary"
                onClick={handleCreateRoleMenu}
                htmlType="submit"
                loading={loading[roleMenuTypes.CREATE_ROLE_MENU]}
              >
                {tAdd("form.button.save")}
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
  createNewRoleMenu: roleMenuActions.createNewRoleMenuFetch,
  getDropdownMenus: menuActions.getDropdownMenusFetch,
  getRoleDetail: roleActions.getRoleDetailFetch,
  getAllRoleMenus: roleMenuActions.getAllRoleMenusFetch,
  clearAllRoleMenu: roleMenuActions.clearAllRoleMenus,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddRoleMenu);
