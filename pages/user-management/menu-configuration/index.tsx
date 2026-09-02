/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import Button from "@sera-components/button";
import { Plus } from "@sera-components/icons";
import Input from "@sera-components/input";
import PageLayout from "@sera-components/layout/page-layout";
import Modal from "@sera-components/modal";
import {
  Columns,
  SearchByOptions,
} from "@sera-components/pages/user-management/menu-configuration/menu-configuration-props-table";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import Typography from "@sera-components/typography";
import MessageHandler from "@sera-libraries/message-handler";
import { RootState } from "@sera-redux";
import { menuActions } from "@sera-redux/slices/menu.slice";
import { BaseType } from "@sera-types/base.type";
import { LoadingState } from "@sera-types/loading.type";
import { Menu, MenuState, menuTypes } from "@sera-types/menu.type";
import { ROUTE } from "@sera-utils/constants/routes";
import useCheckPermission from "@sera-utils/hooks/useCheckPermission";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Col, Row } from "antd";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface MenuConfigurationProps {
  loading: LoadingState;
  menus: MenuState;
  getMenus: typeof menuActions.getMenusFetch;
  getMenusAutoComplete: typeof menuActions.getMenusAutoCompleteFetch;
  deleteMenu: typeof menuActions.deleteMenuFetch;
  getMenuDetailClear: typeof menuActions.getMenuDetailClear;
  createNewMenuClear: typeof menuActions.createNewMenuClear;
  updateMenuClear: typeof menuActions.updateMenuClear;
  deleteMenuClear: typeof menuActions.deleteMenuClear;
}

const MenuConfiguration = ({
  loading,
  menus,
  getMenus,
  getMenusAutoComplete,
  deleteMenu,
  getMenuDetailClear,
  createNewMenuClear,
  updateMenuClear,
  deleteMenuClear,
}: MenuConfigurationProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: "menuConfiguration" });

  const menuLink = ROUTE.USER_MANAGEMENT.MENU_CONFIGURATION;
  const { isCreate, isUpdate, isDelete } = useCheckPermission({ menuLink });

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/user-management/menu-configuration/index");

  const [menusListOptions, setMenusListOptions] = useState<BaseType>({
    page: 1,
    limit: menus.options?.limit ?? 10,
    order: "menuOrder",
    sort: "asc",
  });
  const [menusAutoCompleteOptions, setMenusAutoCompleteOptions] =
    useState<BaseType>({
      page: 1,
      limit: 10,
    });
  const [selectedMenu, setSelectedMenu] = useState<{
    id: string;
    menuName: string;
  }>({ id: "", menuName: "" });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [searchByOption, setSearchByOption] = useState<string>(
    SearchByOptions()[0].value,
  );

  const searchByRef = useRef(searchByOption);

  const onChangeSelect = (searchBy: string) => {
    setSearchByOption(searchBy);
  };

  useEffect(() => {
    searchByRef.current = searchByOption;
  }, [searchByOption]);

  const onPageChangeListener = (current: number, limit: number) => {
    setMenusListOptions((prevState) => ({
      ...prevState,
      page: current,
      limit,
    }));
  };

  const onTableChangeListener = (_: unknown, __: unknown, sorter: any) => {
    if (sorter) {
      setMenusListOptions((prevState) => ({
        ...prevState,
        order: sorter.field,
        sort: sorter.order === "ascend" ? "asc" : ("desc" as string),
      }));
    }
  };

  const onSearchChangeListener = (search?: string, searchBy?: string) => {
    setMenusListOptions((prevState) => ({
      ...prevState,
      search,
      searchBy,
      page: 1,
    }));
  };

  const onSearchingChangeListener = (search?: string, searchBy?: string) => {
    setMenusAutoCompleteOptions((prevState: any) => ({
      ...prevState,
      searchBy,
      search,
    }));
  };

  const onClearSearchListener = () => {
    setMenusListOptions((prevState) => ({
      ...prevState,
      search: null,
    }));
  };

  const showDeleteModal = (obj: any) => {
    setShowDeleteConfirm(true);
    setSelectedMenu(obj);
  };

  const hideDeleteModal = () => {
    setShowDeleteConfirm(false);
    setSelectedMenu({ id: "", menuName: "" });
  };

  useEffect(() => {
    getMenuDetailClear();
  }, []);

  useEffect(() => {
    try {
      getMenus(menusListOptions);
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 125, error);
      else sendErrorHandler("useEffect", 125, error?.data?.message);
    }
  }, [menusListOptions]);

  useEffect(() => {
    if (menusAutoCompleteOptions.search) {
      try {
        getMenusAutoComplete(menusAutoCompleteOptions);
      } catch (error: any) {
        if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 134, error);
        else sendErrorHandler("useEffect", 134, error?.data?.message);
      }
    }
  }, [menusAutoCompleteOptions]);

  useEffect(() => {
    if (!loading[menuTypes.DELETE_MENU] && showDeleteConfirm) hideDeleteModal();
  }, [loading[menuTypes.DELETE_MENU]]);

  useEffect(() => {
    const { menuName } = menus.createNewMenu;
    if (menuName) {
      MessageHandler().success(`Menu “${menuName}” ${t("message.add")}`);
      createNewMenuClear();
    }
  }, [menus.createNewMenu.menuName]);

  useEffect(() => {
    const { menuName } = menus.updateMenu;
    if (menuName) {
      MessageHandler().success(`Menu “${menuName}” ${t("message.edit")}`);
      updateMenuClear();
    }
  }, [menus.updateMenu]);

  useEffect(() => {
    const { menuName } = menus.deleteMenu;
    if (menuName) {
      MessageHandler().success({
        title: menuName,
        content: t("message.delete"),
      });
      deleteMenuClear();
    }
  }, [menus.deleteMenu]);

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[
        { title: t("breadcrumb.0.title") },
        { title: t("breadcrumb.1.title") },
      ]}
      content={
        <>
          <Table
            title={t("table.title")}
            searchByPlaceholder="Actions"
            className="table-secondary"
            multipleDelete={false}
            columns={Columns({
              onDeleteAction: (record) => {
                showDeleteModal({
                  id: record.id,
                  menuName: record.menuName,
                  options: menusListOptions,
                });
              },
              isDelete,
              isUpdate,
              menuLink,
            })}
            dataSource={menus.data}
            scroll={{ x: 1000 }}
            loading={loading[menuTypes.GET_MENUS]}
            loadingRender={loading[menuTypes.GET_MENUS]}
            current={Number(menus.options?.page)}
            pageSize={menus.options?.limit}
            total={menus.options?.totalData ?? 0}
            rowKey={(_row: Menu) => `${_row.id}`}
            onPageChange={onPageChangeListener}
            onTableChange={onTableChangeListener}
            onSearchChange={onSearchChangeListener}
            defaultExpandAllRows
            actions={
              <Row gutter={8}>
                {isCreate ? (
                  <Col span={24}>
                    <Link
                      id="link-add-menu-configuration"
                      href={`${menuLink}/add`}
                      passHref
                    >
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
            isCustomSearch
            customSearch={
              <Row align="middle" gutter={[8, 4]}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <Select
                    id="table-select-menu"
                    placeholder={t("table.searchPlaceholder")}
                    allowClear={false}
                    value={searchByOption}
                    onChange={(value) => onChangeSelect(value)}
                  >
                    {SearchByOptions().map((opt) => (
                      <Select.Option key={opt.value} value={opt.value}>
                        {opt.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Col>

                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <Input.Search
                    loading={menus.isLoading ?? false}
                    placeholder={t("table.searchPlaceholder")}
                    autoCompleteItems={menus.autoComplete?.data}
                    onClearAutoComplete={onClearSearchListener}
                    onSearching={(searchingVal) =>
                      onSearchingChangeListener(
                        searchingVal,
                        searchByRef.current,
                      )
                    }
                    onSearch={(search) => {
                      onSearchChangeListener(search, searchByRef.current);
                    }}
                    onClear={onClearSearchListener}
                    value={menusAutoCompleteOptions.search ?? ""}
                  />
                </Col>
              </Row>
            }
          />
          <Modal.Confirm
            type="danger"
            open={showDeleteConfirm}
            title={t("modal.delete.title")}
            okText={t("modal.delete.text.ok")}
            okButtonProps={{
              disabled: loading[menuTypes.DELETE_MENU],
              loading: loading[menuTypes.DELETE_MENU],
            }}
            cancelButtonProps={{ disabled: loading[menuTypes.DELETE_MENU] }}
            onOk={() =>
              deleteMenu({
                id: selectedMenu.id,
                menuName: selectedMenu.menuName,
                options: menusListOptions,
              })
            }
            onCancel={() => setShowDeleteConfirm(false)}
          >
            <Typography.Text>{t("modal.delete.text.confirm")}</Typography.Text>
            <Typography.Text strong>
              {`"${selectedMenu.menuName}"`}?
            </Typography.Text>
          </Modal.Confirm>
        </>
      }
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  menus: state.menus,
});

const mapDispatchToProps = {
  getMenus: menuActions.getMenusFetch,
  getMenusAutoComplete: menuActions.getMenusAutoCompleteFetch,
  deleteMenu: menuActions.deleteMenuFetch,
  getMenuDetailClear: menuActions.getMenuDetailClear,
  createNewMenuClear: menuActions.createNewMenuClear,
  updateMenuClear: menuActions.updateMenuClear,
  deleteMenuClear: menuActions.deleteMenuClear,
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuConfiguration);
