/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import Button from "@sera-components/button";
// eslint-disable-next-line import/no-named-as-default
import { DeleteOutlined, EditOutlined, Plus } from "@sera-components/icons";
import Input from "@sera-components/input";
import Modal from "@sera-components/modal";
import MobileTableHeader from "@sera-components/pages/plan-outgoing/outstanding-outgoing/mobile-table-header";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import { wmsWarehouseActions } from "@sera-redux/slices/wms-warehouse.slice";
import { BaseType } from "@sera-types/base.type";
import { WmsWarehouse } from "@sera-types/customer.type";
import FormatUtils from "@sera-utils/format";
import useCheckPermission from "@sera-utils/hooks/useCheckPermission";
import { useIsMobileView } from "@sera-utils/hooks/useIsMobileView";
import { Col, Row } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  dataSource?: WmsWarehouse[];
  options?: any;
  loading: any;
  onFetch: typeof wmsWarehouseActions.getWarehousesFetch;
  onDelete: typeof wmsWarehouseActions.deleteWarehouseFetch;
}

const WarehouseTable = (props: Props) => {
  const { dataSource, options, loading, onFetch, onDelete } = props;
  const { t } = useTranslation(undefined, { keyPrefix: "warehouseManagement" });
  const baseLink = "/user-management/warehouses";
  const { isCreate, isUpdate, isDelete } = useCheckPermission({
    menuLink: baseLink,
  });
  const isMobile = useIsMobileView();
  const router = useRouter();

  const [listOptions, setListOptions] = useState<BaseType>({
    page: 1,
    limit: 10,
    order: "createdAt",
    sort: "asc",
  });
  const [searchByOption, setSearchByOption] = useState("name");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selected, setSelected] = useState<{ id: string; name: string }>({
    id: "",
    name: "",
  });

  useEffect(() => {
    onFetch(listOptions);
  }, [listOptions]);

  const onPageChangeListener = (page: number, pageSize?: number) => {
    setListOptions((prevState: BaseType) => ({
      ...prevState,
      page,
      limit: pageSize ?? prevState.limit,
    }));
  };

  const onTableChangeListener = (_: unknown, __: unknown, sorter: any) => {
    if (sorter) {
      setListOptions((prevState: BaseType) => ({
        ...prevState,
        order: sorter.field,
        sort: sorter.order === "ascend" ? "asc" : "desc",
      }));
    }
  };

  const showDeleteModal = (obj: { id: string; name: string }) => {
    setShowDeleteConfirm(true);
    setSelected(obj);
  };

  const COLUMNS = [
    {
      key: "no",
      dataIndex: "no",
      title: "No.",
      fixed: "left",
      width: 60,
      align: "center",
    },
    {
      title: t("table.columns.customer"),
      key: "customer",
      width: 180,
      sorter: false,
      render: (_: unknown, record: WmsWarehouse) =>
        record.customer?.name ?? "-",
    },
    {
      title: t("table.columns.code"),
      dataIndex: "code",
      key: "code",
      width: 120,
      sorter: true,
      truncate: true,
    },
    {
      title: t("table.columns.name"),
      dataIndex: "name",
      key: "name",
      width: 200,
      sorter: true,
      truncate: true,
    },
    {
      title: t("table.columns.address"),
      dataIndex: "address",
      key: "address",
      width: 220,
      truncate: true,
    },
    {
      title: t("table.columns.phone"),
      dataIndex: "phone",
      key: "phone",
      width: 130,
    },
    {
      title: t("table.columns.createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      sorter: true,
      render: (_: unknown, record: WmsWarehouse) =>
        FormatUtils().dateTimeTransform(record.createdAt ?? ""),
    },
    {
      title: t("table.columns.actions"),
      key: "operation",
      fixed: "right",
      width: 90,
      render: (record: WmsWarehouse) => (
        <Row justify="center" gutter={[8, 0]}>
          {isUpdate ? (
            <Col>
              <Link
                id="link-edit-warehouse"
                href={`${baseLink}/edit/${record.id}`}
                passHref
              >
                <Button
                  id="action-edit-button"
                  size="small"
                  tooltip={t("table.button.update.tooltip")}
                  type="link"
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
                icon={<DeleteOutlined />}
                onClick={() =>
                  showDeleteModal({
                    id: record.id ?? "",
                    name: record.name ?? "",
                  })
                }
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
          current={Number(options?.page)}
          pageSize={options?.limit}
          total={options?.totalData ?? 0}
          rowKey={(row: WmsWarehouse) => `${row.no}`}
          loading={loading}
          title={isMobile ? undefined : t("table.title")}
          scroll={isMobile ? { x: 480 } : { x: 1000 }}
          columns={
            isMobile
              ? (COLUMNS.filter((c) =>
                  ["no", "customer", "code", "name", "operation"].includes(
                    String(c.key),
                  ),
                ) as any)
              : (COLUMNS as any)
          }
          onPageChange={onPageChangeListener}
          onTableChange={onTableChangeListener}
          isCustomSearch
          multipleDelete={false}
          actions={
            isMobile ? null : (
              <Row gutter={8}>
                {isCreate ? (
                  <Col span={24}>
                    <Link
                      id="link-add-warehouse"
                      href={`${baseLink}/add`}
                      passHref
                    >
                      <Button
                        id="action-add"
                        type="primary"
                        icon={<Plus />}
                        style={{ width: "100%" }}
                      >
                        {t("table.button.add.label")}
                      </Button>
                    </Link>
                  </Col>
                ) : null}
              </Row>
            )
          }
          customSearch={
            isMobile ? (
              <MobileTableHeader
                title={t("table.title")}
                selectId="table-select-mobile"
                searchFilterLabel={t("table.searchFilter")}
                placeholder={t("table.searchPlaceholder")}
                searchBy={searchByOption}
                searchByOptions={[
                  { value: "code", label: t("table.columns.code") },
                  { value: "name", label: t("table.columns.name") },
                ]}
                currentSearch={(listOptions as any).search}
                onSelectSearchBy={(v) => setSearchByOption(v ?? "name")}
                onSearch={(value?: string) =>
                  setListOptions((prevState: BaseType) => ({
                    ...prevState,
                    search: value || null,
                    searchBy: value ? searchByOption : undefined,
                    page: 1,
                  }))
                }
                action={
                  isCreate
                    ? {
                        label: t("table.button.add.label"),
                        icon: <Plus />,
                        onClick: () => router.push(`${baseLink}/add`),
                      }
                    : undefined
                }
              />
            ) : (
              <Row align="middle" gutter={[8, 4]}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <Select
                    id="table-select"
                    placeholder={t("table.searchPlaceholder")}
                    allowClear={false}
                    defaultValue={searchByOption}
                    onChange={(value) => setSearchByOption(value)}
                  >
                    <Select.Option value="code">
                      {t("table.columns.code")}
                    </Select.Option>
                    <Select.Option value="name">
                      {t("table.columns.name")}
                    </Select.Option>
                  </Select>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <Input.Search
                    loading={false}
                    id="table-search"
                    placeholder={t("table.searchPlaceholder")}
                    onSearch={(value) =>
                      setListOptions((prevState: BaseType) => ({
                        ...prevState,
                        search: value || null,
                        searchBy: searchByOption,
                        page: 1,
                      }))
                    }
                  />
                </Col>
              </Row>
            )
          }
        />
      )}

      <Modal.Confirm
        title={t("modal.delete.title")}
        type="danger"
        open={showDeleteConfirm}
        okText={t("modal.delete.okText")}
        cancelText={t("modal.delete.cancelText")}
        onCancel={() => setShowDeleteConfirm(false)}
        onOk={() => {
          onDelete({
            id: selected.id,
            name: selected.name,
            options: listOptions,
          });
          setShowDeleteConfirm(false);
        }}
      />
    </>
  );
};

export default WarehouseTable;
