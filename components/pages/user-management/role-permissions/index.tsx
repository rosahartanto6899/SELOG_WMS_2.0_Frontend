import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import { DeleteOutlined, EditOutlined, Plus } from "@sera-components/icons";
import Input from "@sera-components/input";
import Modal from "@sera-components/modal";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import Typography from "@sera-components/typography";
import { roleMenuActions, RootState } from "@sera-redux/index";
import {
  AutoCompleteType,
  BaseType,
  PaginationType,
} from "@sera-types/base.type";
import { LoadingState } from "@sera-types/loading.type";
import {
  RoleMenu,
  RoleMenuState,
  roleMenuTypes,
} from "@sera-types/role-menu.type";
import { ROUTE } from "@sera-utils/constants/routes";
import FormatUtils from "@sera-utils/format";
import useCheckPermission from "@sera-utils/hooks/useCheckPermission";
import { Col, Row } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface RoleMenusProps {
  dataSource?: RoleMenu[];
  roleMenuOptions?: PaginationType;
  loading: LoadingState;
  autoComplete?: AutoCompleteType[];
  onFetchRoleMenus: typeof roleMenuActions.getRoleMenusFetch;
  onFetchAutoComplete: typeof roleMenuActions.getRoleMenusAutoCompleteFetch;
  onClearAutoComplete: typeof roleMenuActions.clearRoleMenusAutoComplete;
  onDeleteRoleMenu: typeof roleMenuActions.deleteRoleMenuFetch;
  roleMenus: RoleMenuState;
}

interface RoleOptionsType extends BaseType {
  roleId?: string;
}

const RoleMenus = ({
  roleMenuOptions,
  onFetchRoleMenus,
  onFetchAutoComplete,
  onClearAutoComplete,
  dataSource,
  loading,
  autoComplete,
  onDeleteRoleMenu,
  roleMenus,
}: RoleMenusProps) => {
  const { roleId } = roleMenus;

  const { t } = useTranslation(undefined, { keyPrefix: "rolePermission" });

  const [isInitiate, setIsInitiate] = useState<boolean>(true);
  const [roleMenusListOptions, setRoleMenusListOptions] =
    useState<RoleOptionsType>({
      page: 1,
      limit: roleMenuOptions?.limit ?? 10,
      order: "createdAt",
      search: "",
      searchBy: "",
    });
  const [roleMenusAutoCompleteOptions, setRoleMenusAutoCompleteOptions] =
    useState<RoleOptionsType>({
      page: 1,
      limit: 10,
      order: "createdAt",
      search: "",
      searchBy: "",
    });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [selectedRoleMenu, setSelectedRoleMenu] = useState<{
    id: string;
    menuName: string;
  }>({ id: "", menuName: "" });

  const onPageChangeListener = (current: number, limit: number) => {
    setRoleMenusListOptions((prevState: BaseType) => ({
      ...prevState,
      page: current,
      limit,
    }));
  };

  const onTableChangeListener = (_: unknown, __: unknown, sorter: any) => {
    if (sorter) {
      setRoleMenusListOptions((prevState: BaseType) => ({
        ...prevState,
        order: sorter.field,
        sort: sorter.order === "ascend" ? "asc" : "desc",
      }));
    }
  };

  const onSearchChangeListener = (search?: string, searchBy?: string) => {
    setRoleMenusListOptions((prevState: BaseType) => ({
      ...prevState,
      search,
      searchBy,
      page: 1,
    }));
  };

  const onClearSearchListener = () => {
    const search: string[] = [];
    const searchBy: string[] = [];

    if (roleId) {
      search.push(roleId);
      searchBy.push("roleId");
    }

    setRoleMenusListOptions((prevState: BaseType) => ({
      ...prevState,
      search: JSON.stringify(search),
      searchBy: JSON.stringify(searchBy),
    }));
  };

  const onSearchingChangeListener = (search?: string, searchBy?: string) => {
    setRoleMenusAutoCompleteOptions((prevState: BaseType) => ({
      ...prevState,
      searchBy,
      search,
    }));
  };

  const showDeleteModal = (obj: { id: string; menuName: string }) => {
    setShowDeleteConfirm(true);
    setSelectedRoleMenu(obj);
  };

  const hideDeleteModal = () => {
    setShowDeleteConfirm(false);
    setSelectedRoleMenu({ id: "", menuName: "" });
  };

  const { isUpdate, isDelete, isCreate } = useCheckPermission({
    menuLink: ROUTE.USER_MANAGEMENT.ROLE,
  });

  const COLUMNS = [
    {
      title: t("table.header.0.title"),
      key: "no",
      dataIndex: "no",
      render: (text: number, record: RoleMenu) => (
        <Row justify="center">
          <Col>{record.no}</Col>
        </Row>
      ),
      width: 60,
      fixed: "left",
    },
    {
      title: t("table.header.1.title"),
      dataIndex: "menu",
      key: "menuId",
      width: 200,
      sorter: true,
      fixed: "left",
      render: (text: string | undefined, record: RoleMenu) =>
        record.menu?.menuName,
    },
    {
      title: t("table.header.3.title"),
      dataIndex: "roleId",
      key: "roleId",
      width: 160,
      fixed: "left",
      render: (text: string | undefined, record: RoleMenu) =>
        record.role?.roleName,
    },
    {
      title: t("table.header.4.title"),
      dataIndex: "isRead",
      key: "isRead",
      width: 100,
      render: (text: boolean) =>
        text ? (
          <CheckOutlined style={{ color: "#1CA841" }} />
        ) : (
          <CloseOutlined style={{ color: "#F52C48" }} />
        ),
    },
    {
      title: t("table.header.5.title"),
      dataIndex: "isCreate",
      key: "isCreate",
      width: 100,
      render: (text: boolean) =>
        text ? (
          <CheckOutlined style={{ color: "#1CA841" }} />
        ) : (
          <CloseOutlined style={{ color: "#F52C48" }} />
        ),
    },
    {
      title: t("table.header.6.title"),
      dataIndex: "isUpdate",
      key: "isUpdate",
      width: 100,
      render: (text: boolean) =>
        text ? (
          <CheckOutlined style={{ color: "#1CA841" }} />
        ) : (
          <CloseOutlined style={{ color: "#F52C48" }} />
        ),
    },
    {
      title: t("table.header.7.title"),
      dataIndex: "isDelete",
      key: "isDelete",
      width: 100,
      render: (text: boolean) =>
        text ? (
          <CheckOutlined style={{ color: "#1CA841" }} />
        ) : (
          <CloseOutlined style={{ color: "#F52C48" }} />
        ),
    },
    {
      title: t("table.header.9.title"),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 200,
      sorter: true,
      render: (_: string, record: RoleMenu) =>
        FormatUtils().dateTimeTransform(record.createdAt ?? ""),
    },
    {
      title: t("table.header.10.title"),
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 200,
      sorter: true,
      render: (_: string, record: RoleMenu) =>
        FormatUtils().dateTimeTransform(record.updatedAt ?? ""),
    },
    {
      title: t("table.header.11.title"),
      key: "operation",
      fixed: "right",
      width: 90,
      render: (record: RoleMenu) => (
        <Row justify="center" gutter={[8, 0]}>
          {isUpdate ? (
            <Col>
              <Link
                id="link-edit-role-permission"
                href={`/user-management/role-permissions/edit/${record.role?.id}/${record.id}`}
                passHref
              >
                <Button
                  id="action-edit-button"
                  size="small"
                  tooltip={t("tooltip.edit")}
                  type="link"
                  disabled={false}
                  icon={<EditOutlined />}
                />
              </Link>
            </Col>
          ) : null}
          {isDelete ? (
            <Col>
              <Button
                id="delete-button"
                size="small"
                tooltip={t("tooltip.delete")}
                type="link"
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  showDeleteModal({
                    id: record.id ?? "",
                    menuName: record.menu?.menuName ?? "",
                  });
                }}
              />
            </Col>
          ) : null}
        </Row>
      ),
    },
  ];

  const SEARCH_OPTIONS = [
    {
      label: t("searchBar.dropdownOption.title"),
      value: "menu",
    },
  ];

  useEffect(() => {
    if (roleId) {
      const additionalParams = {
        roleId,
      };

      setRoleMenusListOptions((prevState: BaseType) => ({
        ...prevState,
        ...additionalParams,
      }));
      setRoleMenusAutoCompleteOptions((prevState: BaseType) => ({
        ...prevState,
        ...additionalParams,
      }));
      if (isInitiate === true) setIsInitiate(false);
    }
  }, [roleId]);

  useEffect(() => {
    if (roleId && isInitiate === false) {
      onFetchRoleMenus(roleMenusListOptions);
    }
  }, [roleMenusListOptions]);

  useEffect(() => {
    if (
      roleMenusAutoCompleteOptions.search &&
      roleMenusAutoCompleteOptions.searchBy?.includes("menu") &&
      roleId &&
      isInitiate === false
    ) {
      onFetchAutoComplete({
        ...roleMenusAutoCompleteOptions,
        search: roleMenusAutoCompleteOptions.search,
        searchBy: roleMenusAutoCompleteOptions.searchBy ?? "",
      });
    }
  }, [roleMenusAutoCompleteOptions]);

  useEffect(() => {
    if (!loading[roleMenuTypes.DELETE_ROLE_MENU] && showDeleteConfirm) {
      hideDeleteModal();
    }
  }, [loading[roleMenuTypes.DELETE_ROLE_MENU]]);

  return (
    <>
      {dataSource && (
        <Table
          dataSource={dataSource}
          columns={COLUMNS}
          current={Number(roleMenuOptions?.page)}
          pageSize={roleMenuOptions?.limit}
          total={roleMenuOptions?.totalData ?? 0}
          rowKey={(row: RoleMenu) => `${row.no}`}
          loading={loading[roleMenuTypes.GET_ROLE_MENUS] || isInitiate}
          title={t("table.title")}
          scroll={{ x: 1000 }}
          onPageChange={onPageChangeListener}
          onTableChange={onTableChangeListener}
          isCustomSearch
          showActions
          actions={
            <Row gutter={8}>
              {isCreate ? (
                <Col span={24}>
                  <Link
                    id="link-add-permission"
                    href={`/user-management/role-permissions/add/${roleId}`}
                    passHref
                  >
                    <Button
                      id="action-add"
                      type="primary"
                      disabled={false}
                      icon={<Plus />}
                      style={{ width: "100%" }}
                    >
                      {t("button.title")}
                    </Button>
                  </Link>
                </Col>
              ) : null}
            </Row>
          }
          customSearch={
            <Row align="middle" gutter={[8, 4]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Select
                  id="role-permission-category"
                  defaultValue="menu"
                  placeholder={t("searchBar.dropdownOption.placeholder")}
                  allowClear={false}
                >
                  {SEARCH_OPTIONS.map((opt) => (
                    <Select.Option key={opt.value} value={opt.value}>
                      {opt.label}
                    </Select.Option>
                  ))}
                </Select>
              </Col>

              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Input.Search
                  loading={false}
                  placeholder={t("searchBar.placeholder")}
                  autoCompleteItems={autoComplete}
                  onClearAutoComplete={onClearAutoComplete}
                  onSearching={(searchingVal) =>
                    onSearchingChangeListener(searchingVal, "menu")
                  }
                  onSearch={(search) => {
                    onSearchChangeListener(search, "menu");
                  }}
                  onClear={onClearSearchListener}
                />
              </Col>
            </Row>
          }
          multipleDelete={false}
        />
      )}

      <Modal.Confirm
        title={t("modal.delete.title")}
        type="danger"
        open={showDeleteConfirm}
        okText={t("modal.delete.action.yes.title")}
        okButtonProps={{
          disabled: loading[roleMenuTypes.DELETE_ROLE_MENU],
          loading: loading[roleMenuTypes.DELETE_ROLE_MENU],
        }}
        cancelButtonProps={{
          disabled: loading[roleMenuTypes.DELETE_ROLE_MENU],
        }}
        onCancel={() => setShowDeleteConfirm(false)}
        onOk={() => {
          onDeleteRoleMenu({
            id: selectedRoleMenu.id,
            menuName: selectedRoleMenu.menuName,
            options: roleMenusListOptions,
          });
        }}
      >
        <>
          <Typography.Text>{t("modal.delete.body")}</Typography.Text>
          <Typography.Text strong>
            {`"${selectedRoleMenu.menuName}"`}?
          </Typography.Text>
        </>
      </Modal.Confirm>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  roleMenus: state.roleMenus,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(RoleMenus);
