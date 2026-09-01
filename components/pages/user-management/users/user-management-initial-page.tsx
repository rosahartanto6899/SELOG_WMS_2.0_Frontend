/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "@sera-components/button";
import { Plus } from "@sera-components/icons";
import Input from "@sera-components/input";
import Modal from "@sera-components/modal";
import {
  actionUser,
  Columns,
  SearchByOptions,
} from "@sera-components/pages/user-management/users/user-management-props-table";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import Typography from "@sera-components/typography";
import UserApi from "@sera-libraries/api/auth";
import MessageHandler from "@sera-libraries/message-handler";
import { RootState } from "@sera-redux";
import { userActions } from "@sera-redux/slices/user.slice";
import { BaseType } from "@sera-types/base.type";
import { LoadingState } from "@sera-types/loading.type";
import { User, UserState, userTypes } from "@sera-types/user.type";
import { Col, Row } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface UserManagementProps {
  loading: LoadingState;
  users: UserState;
  getUsers: typeof userActions.getUsersFetch;
  getUserDetailClear: typeof userActions.getUserDetailClear;
  getUsersAutoComplete: typeof userActions.getUsersAutoCompleteFetch;
  deleteUser: typeof userActions.deleteUserFetch;
  getUsersAutoCompleteClear: typeof userActions.getUsersAutoCompleteClear;
  createNewUserClear: typeof userActions.createNewUserClear;
  updateUserClear: typeof userActions.updateUserClear;
  deleteUserClear: typeof userActions.deleteUserClear;
}

const UserManagement = ({
  loading,
  users,
  getUsers,
  getUserDetailClear,
  getUsersAutoComplete,
  deleteUser,
  getUsersAutoCompleteClear,
  createNewUserClear,
  updateUserClear,
  deleteUserClear,
}: UserManagementProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: "userManagement" });

  const onResendVerification = UserApi().resendVerification;

  const [searchBy, setSearchBy] = useState("name");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [showConfirmResendConfirm, setShowConfirmResendConfirm] =
    useState<boolean>(false);
  const [loadingResend, setLoadingResend] = useState<boolean>(false);
  const [usersListOptions, setUsersListOptions] = useState<BaseType>({
    page: 1,
    limit: users.options?.limit ?? 10,
    searchBy: "name",
    order: "createdAt",
    sort: "desc",
  });
  const [usersAutoCompleteOptions, setUsersAutoCompleteOptions] =
    useState<BaseType>({
      searchBy: "name",
      page: 1,
      limit: 10,
    });
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    name: string;
    email: string;
  }>({
    id: "",
    name: "",
    email: "",
  });

  const onPageChangeListener = (current: number, limit: number) => {
    setUsersListOptions((prevState: BaseType) => ({
      ...prevState,
      page: current,
      limit,
    }));
  };

  const onTableChangeListener = (
    pagination: any,
    filters: any,
    sorter: any,
  ) => {
    if (sorter) {
      setUsersListOptions((prevState: BaseType) => ({
        ...prevState,
        order: sorter.field,
        sort: sorter.order === "ascend" ? "asc" : "desc",
      }));
    }
  };

  const onSearchChangeListener = (search?: string, searchBy?: string) => {
    setUsersListOptions((prevState: BaseType) => ({
      ...prevState,
      search,
      searchBy,
      page: 1,
    }));
  };

  const onSearchingChangeListener = (search?: string) => {
    setUsersAutoCompleteOptions((prevState: BaseType) => ({
      ...prevState,
      search,
    }));
  };

  const onClearSearchListener = () => {
    setUsersListOptions((prevState: BaseType) => ({
      ...prevState,
      search: null,
    }));
  };

  const handlerSelectSearchBy = (value?: string) => {
    setSearchBy(value!);
    setUsersListOptions((prevState: BaseType) => {
      if (prevState.search) {
        return {
          ...prevState,
          search: null,
        };
      }

      return prevState;
    });

    setUsersAutoCompleteOptions((prevState: BaseType) => {
      if (prevState.search) {
        return {
          ...prevState,
          search: null,
        };
      }

      return prevState;
    });

    getUsersAutoCompleteClear();
  };

  const hideConfirmResendModal = () => {
    setShowConfirmResendConfirm(false);
    setSelectedUser({ id: "", name: "", email: "" });
  };

  const resendEmailVerification = async (email: string) => {
    setLoadingResend(true);
    const messageHandler = MessageHandler();
    await onResendVerification(email)
      .then((res: any) => {
        setLoadingResend(false);
        hideConfirmResendModal();
        messageHandler.success({ content: res.data.message });
      })
      .catch(() => {
        setLoadingResend(false);
        hideConfirmResendModal();
      });
  };

  const showDeleteModal = (obj: {
    id?: string;
    name?: string;
    email?: string;
  }) => {
    const { id = "", name = "", email = "" } = obj;
    setShowDeleteConfirm(true);
    setSelectedUser({ id, name, email });
  };

  const hideDeleteModal = () => {
    setShowDeleteConfirm(false);
    setSelectedUser({ id: "", name: "", email: "" });
  };

  useEffect(() => {
    getUserDetailClear();
  }, []);

  useEffect(() => {
    getUsers({ ...usersListOptions, searchBy });
  }, [usersListOptions]);

  useEffect(() => {
    if (usersAutoCompleteOptions.search)
      getUsersAutoComplete({ ...usersAutoCompleteOptions, searchBy });
  }, [usersAutoCompleteOptions]);

  useEffect(() => {
    const { name } = users.createNewUser;
    if (name) {
      MessageHandler().success(`User “${name}” ${t("message.add")}`);
      createNewUserClear();
    }
  }, [users.createNewUser]);

  useEffect(() => {
    const { name } = users.updateUser;
    if (name) {
      MessageHandler().success(`User “${name}” ${t("message.edit")}`);
      updateUserClear();
    }
  }, [users.updateUser]);

  useEffect(() => {
    const { name } = users.deleteUser;
    if (name) {
      MessageHandler().success({
        title: name,
        content: t("message.delete"),
      });
      deleteUserClear();
    }
  }, [users.deleteUser]);

  useEffect(() => {
    if (!loading[userTypes.DELETE_USER] && showDeleteConfirm) {
      hideDeleteModal();
    }
  }, [loading[userTypes.DELETE_USER]]);

  return (
    <>
      <Table
        title={t("table.title")}
        dataSource={users.data}
        columns={Columns({
          onDeleteAction: (record) =>
            showDeleteModal({
              id: record.id,
              name: record.name,
              email: record.email,
            }),
        }).filter((item) => item.key)}
        current={users.options?.page}
        pageSize={users.options?.limit}
        total={users.options?.totalData ?? 0}
        rowKey={(row: User) => `${row.no}`}
        loading={loading[userTypes.GET_USERS]}
        scroll={{ x: "max-content" }}
        multipleDelete={false}
        autoCompleteItems={users.autoComplete?.data}
        onPageChange={onPageChangeListener}
        onTableChange={onTableChangeListener}
        onSearchChange={onSearchChangeListener}
        onSearching={onSearchingChangeListener}
        onClearSearch={onClearSearchListener}
        isCustomSearch
        customSearch={
          <Row align="middle" gutter={[8, 4]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Select
                id="user-management-user-search"
                defaultValue="name"
                placeholder={t("table.search.default.placeholder")}
                onChange={(value) => handlerSelectSearchBy(value)}
                onClear={() => handlerSelectSearchBy("")}
                allowClear={false}
              >
                {SearchByOptions().map((opt) => (
                  <Select.Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Select.Option>
                ))}
              </Select>
            </Col>

            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              {usersListOptions.searchBy !== "isInternal" && (
                <Input.Search
                  loading={loading[userTypes.GET_USERS]}
                  placeholder={t("table.search.internal.placeholder")}
                  autoCompleteItems={users.autoComplete?.data}
                  onSearching={onSearchingChangeListener}
                  onSearch={(search) =>
                    onSearchChangeListener(
                      search,
                      usersListOptions.searchBy ?? "name",
                    )
                  }
                  onClear={onClearSearchListener}
                  value={usersListOptions.search ?? ""}
                />
              )}

              {usersListOptions.searchBy === "isInternal" && (
                <Select
                  id="user-management-user-search-internal"
                  placeholder={t("table.search.internal.placeholder")}
                  onChange={(value) =>
                    onSearchChangeListener(value, "isInternal")
                  }
                  showSearch={false}
                >
                  <Select.Option value="1">Internal</Select.Option>
                  <Select.Option value="0">External</Select.Option>
                </Select>
              )}
            </Col>
          </Row>
        }
        actions={
          <Row gutter={8}>
            {actionUser.isCreate ? (
              <Col span={24}>
                <Link
                  id="link-add-user"
                  href="/user-management/users/add"
                  passHref
                >
                  <Button
                    id="action-add"
                    type="primary"
                    disabled={false}
                    icon={<Plus />}
                    style={{ width: "100%" }}
                  >
                    {t("table.columns.button.add.label")}
                  </Button>
                </Link>
              </Col>
            ) : null}
          </Row>
        }
      />

      <Modal.Confirm
        type="danger"
        open={showDeleteConfirm}
        title={t("modal.delete.title")}
        okText={t("modal.delete.text.ok")}
        okButtonProps={{
          disabled: loading[userTypes.DELETE_USER],
          loading: loading[userTypes.DELETE_USER],
        }}
        onOk={() =>
          deleteUser({
            id: selectedUser.id,
            name: selectedUser.name,
            options: usersListOptions,
          })
        }
        cancelButtonProps={{ disabled: loading[userTypes.DELETE_USER] }}
        onCancel={() => setShowDeleteConfirm(false)}
      >
        <>
          <Typography.Text>{t("modal.delete.text.confirm")}</Typography.Text>
          <Typography.Text strong>{`"${selectedUser.name}"`}?</Typography.Text>
        </>
      </Modal.Confirm>

      <Modal.Confirm
        type="warning"
        open={showConfirmResendConfirm}
        title={t("modal.resend.title")}
        okText={t("modal.resend.text.ok")}
        okButtonProps={{ disabled: loadingResend, loading: loadingResend }}
        onOk={() => resendEmailVerification(selectedUser.email)}
        cancelButtonProps={{ disabled: loadingResend }}
        onCancel={() => setShowConfirmResendConfirm(false)}
      >
        <>
          <Typography.Text>{t("modal.resend.text.confirm")}</Typography.Text>
          <Typography.Text strong>{`"${selectedUser.name}"`}?</Typography.Text>
        </>
      </Modal.Confirm>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  users: state.users,
});

const mapDispatchToProps = {
  getUsers: userActions.getUsersFetch,
  getUserDetailClear: userActions.getUserDetailClear,
  getUsersAutoComplete: userActions.getUsersAutoCompleteFetch,
  deleteUser: userActions.deleteUserFetch,
  getUsersAutoCompleteClear: userActions.getUsersAutoCompleteClear,
  createNewUserClear: userActions.createNewUserClear,
  updateUserClear: userActions.updateUserClear,
  deleteUserClear: userActions.deleteUserClear,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManagement);
