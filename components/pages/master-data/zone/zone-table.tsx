/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { MoreOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
// eslint-disable-next-line import/no-named-as-default
import { DeleteOutlined, EditOutlined, Plus } from "@sera-components/icons";
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import CustomerApi from "@sera-libraries/api/customer";
import { zoneActions } from "@sera-redux";
import { BaseType } from "@sera-types/base.type";
import { Zone } from "@sera-types/zone.type";
import FormatUtils from "@sera-utils/format";
import useCheckPermission from "@sera-utils/hooks/useCheckPermission";
import { useIsMobileView } from "@sera-utils/hooks/useIsMobileView";
import {
  Col,
  Drawer,
  Flex,
  Modal,
  Pagination,
  Row,
  Space,
  Spin,
  Typography,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import MobileTableHeader from "../../plan-outgoing/outstanding-outgoing/mobile-table-header";

interface Props {
  dataSource?: Zone[];
  options?: any;
  loading: any;
  onFetch: typeof zoneActions.getZonesFetch;
  onDelete: typeof zoneActions.deleteZoneFetch;
}

const ZoneTable = (props: Props) => {
  const { dataSource, options, loading, onFetch, onDelete } = props;
  const { t } = useTranslation(undefined, { keyPrefix: "masterData.zone" });
  const baseLink = "/master-data/zone";
  const { isCreate, isUpdate, isDelete } = useCheckPermission({
    menuLink: baseLink,
  });
  const isMobile = useIsMobileView();
  const router = useRouter();
  const [actionRow, setActionRow] = useState<Zone | null>(null);

  const [listOptions, setListOptions] = useState<BaseType>({
    page: 1,
    limit: 10,
    order: "createdDate",
    sort: "desc",
  });
  const [searchByOption, setSearchByOption] = useState("code");
  const { data: session, status: sessionStatus } = useSession() as any;
  const [customerName, setCustomerName] = useState<string>();
  const warehouseCode = session?.user?.warehouseCode ?? undefined;
  const warehouseName = session?.user?.warehouseName ?? undefined;

  // Zone list is scoped to the Customer/Warehouse selected via "Switch
  // Customer"/"Switch Warehouse" in the header (customer scoping is already
  // enforced backend-side from the JWT).
  useEffect(() => {
    if (sessionStatus === "loading") return;
    onFetch(listOptions);
  }, [listOptions, warehouseCode, sessionStatus]);

  useEffect(() => {
    const customerId = session?.user?.customerId;
    if (!customerId) return;
    CustomerApi()
      .retrieveCustomerDetail({ id: customerId })
      .then((resp: any) => setCustomerName(resp?.data?.data?.name))
      .catch(() => undefined);
  }, [session?.user?.customerId]);

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

  const handlerSelectSearchBy = (value?: string) => {
    setSearchByOption(value ?? "code");
    setListOptions((prevState: BaseType) => ({
      ...prevState,
      search: null,
      page: 1,
    }));
  };

  const showDeleteModal = (obj: { id: string; name: string }) => {
    Modal.confirm({
      title: t("modal.delete.title"),
      content: `${t("modal.delete.subtitle")} "${obj.name}"?`,
      okButtonProps: { danger: true },
      okText: t("modal.delete.okText"),
      cancelText: t("modal.delete.cancelText"),
      onOk: () => {
        onDelete({
          id: obj.id,
          name: obj.name,
          options: listOptions,
        });
      },
    });
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
      title: t("table.columns.code"),
      dataIndex: "code",
      key: "code",
      width: 150,
      sorter: true,
      truncate: true,
    },
    {
      title: t("table.columns.name"),
      dataIndex: "name",
      key: "name",
      width: 220,
      sorter: true,
      truncate: true,
    },
    {
      title: t("table.columns.description"),
      dataIndex: "description",
      key: "description",
      width: 300,
      truncate: true,
    },
    {
      title: t("table.columns.createdAt"),
      dataIndex: "createdDate",
      key: "createdDate",
      width: 180,
      sorter: true,
      render: (_: unknown, record: Zone) =>
        FormatUtils().dateTimeTransform(record.createdDate ?? ""),
    },
    {
      title: t("table.columns.actions"),
      key: "operation",
      fixed: "right",
      width: isMobile ? 70 : 90,
      render: (record: Zone) =>
        isMobile ? (
          // satu tombol ⋯ → drawer aksi (edit/delete)
          <Button
            size="small"
            type="link"
            icon={<MoreOutlined />}
            onClick={() => setActionRow(record)}
          />
        ) : (
          <Row justify="center" gutter={[8, 0]}>
            {isUpdate ? (
              <Col>
                <Link
                  id="link-edit-zone"
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
      <Flex vertical gap={24}>
        {dataSource &&
          (isMobile ? (
            // mobile: card list per zone — pola master material/location;
            // tap kartu → drawer aksi
            <Spin spinning={!!loading}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                <MobileTableHeader
                  title={t("table.title")}
                  selectId="table-select-mobile"
                  searchFilterLabel={t("table.searchFilter")}
                  placeholder={t("table.searchPlaceholder")}
                  searchBy={searchByOption}
                  searchByOptions={["code", "name"].map((k) => ({
                    value: k,
                    label: t(`table.columns.${k}`),
                  }))}
                  currentSearch={(listOptions as any).search}
                  onSelectSearchBy={handlerSelectSearchBy}
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

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  {dataSource.map((m: Zone) => (
                    <div
                      key={m.id ?? m.code}
                      onClick={() => setActionRow(m)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setActionRow(m);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      style={{
                        background: "#fff",
                        border: "1px solid #f0f0f0",
                        borderRadius: 12,
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                        gap: 4,
                        minWidth: 0,
                        padding: "12px 14px",
                      }}
                    >
                      <div
                        style={{
                          alignItems: "baseline",
                          display: "flex",
                          gap: 8,
                          justifyContent: "space-between",
                        }}
                      >
                        <strong
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {m.code}
                        </strong>
                        <MoreOutlined style={{ color: "#98a2b3" }} />
                      </div>
                      <div
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {m.name}
                      </div>
                      {m.description && (
                        <div
                          style={{
                            color: "#667085",
                            fontSize: 12,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {m.description}
                        </div>
                      )}
                      <div style={{ color: "#98a2b3", fontSize: 12 }}>
                        {FormatUtils().dateTimeTransform(m.createdDate ?? "")}
                      </div>
                    </div>
                  ))}
                </div>

                {(options?.totalData ?? 0) > (options?.limit ?? 10) && (
                  <Pagination
                    simple
                    size="small"
                    style={{ textAlign: "center" }}
                    current={Number(options?.page)}
                    pageSize={options?.limit}
                    total={options?.totalData ?? 0}
                    onChange={onPageChangeListener}
                  />
                )}
              </div>
            </Spin>
          ) : (
            <Table
              dataSource={dataSource}
              columns={COLUMNS}
              current={Number(options?.page)}
              pageSize={options?.limit}
              total={options?.totalData ?? 0}
              rowKey={(row: Zone) => row.id ?? `${row.no}`}
              loading={loading}
              title={t("table.title")}
              scroll={{ x: 1000 }}
              onPageChange={onPageChangeListener}
              onTableChange={onTableChangeListener}
              isCustomSearch
              multipleDelete={false}
              footerNote={
                customerName &&
                warehouseName && (
                  <Typography.Text type="secondary">
                    {t("table.note.prefix")} <strong>{customerName}</strong> -{" "}
                    <strong>{warehouseName}</strong>.
                  </Typography.Text>
                )
              }
              actions={
                <Row gutter={8}>
                  {isCreate ? (
                    <Col span={24}>
                      <Link
                        id="link-add-zone"
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
              }
              customSearch={
                <Row align="middle" gutter={[8, 8]}>
                  <Col xs={24} md={{ flex: "0 1 auto" }}>
                    <Select
                      id="table-select"
                      className="table-search-select"
                      style={{ width: "20rem", maxWidth: "100%" }}
                      placeholder={t("table.searchBy")}
                      allowClear={false}
                      defaultValue={searchByOption}
                      onChange={(value) => handlerSelectSearchBy(value)}
                      onClear={() => handlerSelectSearchBy("")}
                    >
                      <Select.Option value="code">
                        {t("table.columns.code")}
                      </Select.Option>
                      <Select.Option value="name">
                        {t("table.columns.name")}
                      </Select.Option>
                    </Select>
                  </Col>
                  <Col xs={24} md={{ flex: "0 1 auto" }}>
                    <Input.Search
                      loading={!!loading}
                      id="table-search"
                      style={{ width: "28rem", maxWidth: "100%" }}
                      placeholder={t("table.searchPlaceholder")}
                      value={listOptions.search ?? ""}
                      onClear={() =>
                        setListOptions((prevState: BaseType) => ({
                          ...prevState,
                          search: null,
                        }))
                      }
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
              }
            />
          ))}
      </Flex>

      {/* Mobile: aksi per baris via bottom sheet */}
      <Drawer
        open={!!actionRow}
        placement="bottom"
        height="auto"
        title={actionRow?.code}
        onClose={() => setActionRow(null)}
        styles={{
          content: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          },
        }}
      >
        <div
          aria-hidden
          style={{
            background: "#d0d5dd",
            borderRadius: 999,
            height: 4,
            margin: "0 auto 12px",
            width: 36,
          }}
        />
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          {isUpdate ? (
            <Button
              block
              icon={<EditOutlined />}
              onClick={() => {
                const row = actionRow;
                setActionRow(null);
                if (row?.id) router.push(`${baseLink}/edit/${row.id}`);
              }}
            >
              {t("table.button.update.tooltip")}
            </Button>
          ) : null}
          {isDelete ? (
            <Button
              block
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                const row = actionRow;
                setActionRow(null);
                if (row)
                  showDeleteModal({
                    id: row.id ?? "",
                    name: row.name ?? "",
                  });
              }}
            >
              {t("table.button.delete.tooltip")}
            </Button>
          ) : null}
        </Space>
      </Drawer>
    </>
  );
};

export default ZoneTable;
