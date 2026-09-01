import Button from "@sera-components/button";
// eslint-disable-next-line import/no-named-as-default
import { DeleteOutlined, EditOutlined, Plus } from "@sera-components/icons";
import Input from "@sera-components/input";
import Modal from "@sera-components/modal";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import Typography from "@sera-components/typography";
import { roleActions } from "@sera-redux/slices/role.slice";
import {
  AutoCompleteType,
  BaseType,
  PaginationType,
} from "@sera-types/base.type";
import { LoadingState } from "@sera-types/loading.type";
import { Role, roleTypes } from "@sera-types/role.type";
import { ROUTE } from "@sera-utils/constants/routes";
import FormatUtils from "@sera-utils/format";
import useCheckPermission from "@sera-utils/hooks/useCheckPermission";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Col, Row } from "antd";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface RolesProps {
  dataSource?: Role[];
  roleOptions?: PaginationType;
  loading: LoadingState;
  autoComplete?: AutoCompleteType[];
  onFetchRoles: typeof roleActions.getRolesFetch;
  onFetchAutoComplete: typeof roleActions.getRolesAutoCompleteFetch;
  onDeleteRole: typeof roleActions.deleteRoleFetch;
}

const Roles = (props: RolesProps) => {
  const {
    roleOptions,
    onFetchRoles,
    onFetchAutoComplete,
    dataSource,
    loading,
    autoComplete,
    onDeleteRole,
  } = props;

  const { t } = useTranslation(undefined, { keyPrefix: "roles" });
  const menuLink = ROUTE.USER_MANAGEMENT.ROLES;
  const { isCreate, isUpdate, isDelete } = useCheckPermission({ menuLink });

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/components/user-management/roles/index");

  const SEARCH_OPTIONS = [{ label: t("table.options.0"), value: "roleName" }];

  const [rolesListOptions, setRolesListOptions] = useState<BaseType>({
    page: 1,
    limit: roleOptions?.limit ?? 10,
    order: "roleName",
    sort: "asc",
  });

  const [rolesAutoCompleteOptions, setRolesAutoCompleteOptions] =
    useState<BaseType>({
      page: 1,
      limit: 10,
    });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<{
    id: string;
    roleName: string;
  }>({ id: "", roleName: "" });
  const [searchByOption, setSearchByOption] = useState(SEARCH_OPTIONS[0].value);

  useEffect(() => {
    try {
      onFetchRoles(rolesListOptions);
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 75, error);
      else sendErrorHandler("useEffect", 75, error?.data?.message);
    }
  }, [rolesListOptions]);

  useEffect(() => {
    if (rolesAutoCompleteOptions.search) {
      try {
        onFetchAutoComplete(rolesAutoCompleteOptions);
      } catch (error: any) {
        if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 84, error);
        else sendErrorHandler("useEffect", 84, error?.data?.message);
      }
    }
  }, [rolesAutoCompleteOptions]);

  const onPageChangeListener = (current: number, limit: number) => {
    setRolesListOptions((prevState: BaseType) => ({
      ...prevState,
      page: current,
      limit,
    }));
  };

  const onTableChangeListener = (_: unknown, __: unknown, sorter: any) => {
    if (sorter) {
      setRolesListOptions((prevState: BaseType) => ({
        ...prevState,
        order: sorter.field,
        sort: sorter.order === "ascend" ? "asc" : "desc",
      }));
    }
  };

  const onChangeSelect = (searchBy: string) => {
    setSearchByOption(searchBy);
  };

  const onSearchChangeListener = (search?: string, searchBy?: string) => {
    setRolesListOptions((prevState: BaseType) => ({
      ...prevState,
      search,
      searchBy,
      page: 1,
    }));
  };

  const onClearSearchListener = () => {
    setRolesListOptions((prevState: BaseType) => ({
      ...prevState,
      search: null,
    }));
  };

  const onSearchingChangeListener = (search?: string, searchBy?: string) => {
    setRolesAutoCompleteOptions((prevState: BaseType) => ({
      ...prevState,
      searchBy,
      search,
    }));
  };

  const showDeleteModal = (obj: { id: string; roleName: string }) => {
    setShowDeleteConfirm(true);
    setSelectedRole(obj);
  };

  const hideDeleteModal = () => {
    setShowDeleteConfirm(false);
    setSelectedRole({ id: "", roleName: "" });
  };

  useEffect(() => {
    if (!loading[roleTypes.DELETE_ROLE] && showDeleteConfirm) {
      hideDeleteModal();
    }
  }, [loading[roleTypes.DELETE_ROLE]]);

  const COLUMNS = [
    {
      title: t("table.columns.no"),
      key: "no",
      dataIndex: "no",
      render: (_: unknown, record: Role) => (
        <Row justify="center">
          <Col>{record.no}</Col>
        </Row>
      ),
      width: 40,
    },
    {
      title: t("table.columns.role"),
      dataIndex: "roleName",
      key: "roleName",
      width: 300,
      sorter: true,
      truncate: true,
    },
    {
      title: t("table.columns.createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 200,
      sorter: true,
      render: (_: unknown, record: Role) =>
        FormatUtils().dateTimeTransform(record.createdAt ?? ""),
    },
    {
      title: t("table.columns.updatedAt"),
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 200,
      sorter: true,
      render: (_: unknown, record: Role) =>
        FormatUtils().dateTimeTransform(record.updatedAt ?? ""),
    },
    {
      title: t("table.columns.actions"),
      key: "operation",
      fixed: "right",
      width: 90,
      render: (record: Role) => (
        <Row justify="center" gutter={[8, 0]}>
          {isUpdate ? (
            <Col>
              <Link
                id="link-edit-role"
                href={`${menuLink}/edit/${record.id}`}
                passHref
              >
                <Button
                  id="action-edit-button"
                  size="small"
                  tooltip={t("table.button.update.tooltip")}
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
                tooltip={t("table.button.delete.tooltip")}
                type="link"
                danger
                disabled={false}
                icon={<DeleteOutlined />}
                onClick={() => {
                  showDeleteModal({
                    id: record.id ?? "",
                    roleName: record.roleName ?? "",
                  });
                }}
              />
            </Col>
          ) : null}
        </Row>
      ),
    },
  ];

  return (
    <>
      {dataSource && (
        <Table
          dataSource={dataSource}
          columns={COLUMNS}
          current={Number(roleOptions?.page)}
          pageSize={roleOptions?.limit}
          total={roleOptions?.totalData ?? 0}
          rowKey={(row: Role) => `${row.no}`}
          loading={loading[roleTypes.GET_ROLES]}
          title={t("table.title")}
          scroll={{ x: 1000 }}
          onPageChange={onPageChangeListener}
          onTableChange={onTableChangeListener}
          isCustomSearch
          multipleDelete={false}
          actions={
            <Row gutter={8}>
              {isCreate ? (
                <Col span={24}>
                  <Link id="link-add-role" href={`${menuLink}/add`} passHref>
                    <Button
                      id="action-add"
                      type="primary"
                      disabled={false}
                      icon={<Plus />}
                      style={{ width: "100%" }}
                    >
                      {t("table.button.add.label")}
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
                  id="table-select"
                  placeholder={t("table.searchPlaceholder")}
                  allowClear={false}
                  defaultValue={searchByOption}
                  onChange={(value) => onChangeSelect(value)}
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
                  placeholder={t("table.searchPlaceholder")}
                  autoCompleteItems={autoComplete}
                  onClearAutoComplete={onClearSearchListener}
                  onSearching={(searchingVal) =>
                    onSearchingChangeListener(searchingVal, searchByOption)
                  }
                  onSearch={(search) =>
                    onSearchChangeListener(search, searchByOption)
                  }
                  onClear={onClearSearchListener}
                  value={rolesAutoCompleteOptions.search ?? ""}
                />
              </Col>
            </Row>
          }
        />
      )}

      <Modal.Confirm
        title={t("modal.delete.title")}
        type="danger"
        open={showDeleteConfirm}
        okText={t("modal.delete.okText")}
        cancelText={t("modal.delete.cancelText")}
        okButtonProps={{
          disabled: loading[roleTypes.DELETE_ROLE],
          loading: loading[roleTypes.DELETE_ROLE],
        }}
        cancelButtonProps={{
          disabled: loading[roleTypes.DELETE_ROLE],
        }}
        onCancel={() => setShowDeleteConfirm(false)}
        onOk={() => {
          try {
            onDeleteRole({
              id: selectedRole.id,
              roleName: selectedRole.roleName,
              options: rolesListOptions,
            });
          } catch (err: any) {
            if (isApiResponse(err)) sendErrorHandlerApi("onOk", 320, err);
            else sendErrorHandler("onOk", 320, err?.data?.message);
          }
        }}
      >
        <>
          <Typography.Text>{t("modal.delete.prefixMessage")}</Typography.Text>
          <Typography.Text strong>
            {`"${selectedRole.roleName}"`}?
          </Typography.Text>
        </>
      </Modal.Confirm>
    </>
  );
};

export default Roles;
