/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { MoreOutlined, PrinterOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
// eslint-disable-next-line import/no-named-as-default
import { DeleteOutlined, EditOutlined, Plus } from "@sera-components/icons";
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import CustomerApi from "@sera-libraries/api/customer";
import LocationApi from "@sera-libraries/api/location";
import { locationActions } from "@sera-redux";
import { BaseType } from "@sera-types/base.type";
import { Location } from "@sera-types/location.type";
import FormatUtils from "@sera-utils/format";
import useCheckPermission from "@sera-utils/hooks/useCheckPermission";
import { useIsMobileView } from "@sera-utils/hooks/useIsMobileView";
import {
  Checkbox,
  Col,
  Drawer,
  Flex,
  message,
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
  dataSource?: Location[];
  options?: any;
  loading: any;
  onFetch: typeof locationActions.getLocationsFetch;
  onDelete: typeof locationActions.deleteLocationFetch;
}

const ZoneTable = (props: Props) => {
  const { dataSource, options, loading, onFetch, onDelete } = props;
  const { t } = useTranslation(undefined, { keyPrefix: "masterData.location" });
  const baseLink = "/master-data/location";
  const { isCreate, isUpdate, isDelete } = useCheckPermission({
    menuLink: baseLink,
  });
  const isMobile = useIsMobileView();
  const router = useRouter();
  const [actionRow, setActionRow] = useState<Location | null>(null);

  const [listOptions, setListOptions] = useState<BaseType>({
    page: 1,
    limit: 10,
    order: "createdDate",
    sort: "desc",
  });
  const [searchByOption, setSearchByOption] = useState("code");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkPrintLoading, setBulkPrintLoading] = useState(false);
  const { data: session, status: sessionStatus } = useSession() as any;
  const [customerName, setCustomerName] = useState<string>();
  const warehouseName = session?.user?.warehouseName ?? undefined;

  // Customer & warehouse scoping di-enforce penuh backend-side dari JWT
  // (klaim tokenCustomerCode / tokenWarehouseCode) — FE tidak perlu kirim apa pun.
  useEffect(() => {
    if (sessionStatus === "loading") return;
    onFetch({ ...listOptions });
  }, [listOptions, sessionStatus]);

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
          options: { ...listOptions },
        });
      },
    });
  };

  // Cetak label barcode — hasil print disamakan dengan halaman material
  // (material-table.tsx printLabels): grid label 7cm×3cm, label efektif
  // 6cm×2cm berisi barcode di atas + kode location di bawah, lalu auto-print
  // setelah gambar termuat dan tab tertutup sendiri.
  const printLabels = async (
    records: { barcode?: string | null; code?: string; name?: string }[],
  ) => {
    const withBarcode = records.filter(
      (r): r is { barcode: string; code?: string; name?: string } =>
        !!r.barcode,
    );
    if (!withBarcode.length) {
      message.warning(t("message.noBarcode"));
      return;
    }
    try {
      const resp: any = await LocationApi().generateBarcodeLabels(
        withBarcode.map((r) => ({
          barcode: r.barcode,
          code: r.code,
          name: r.name,
        })),
      );
      const items = resp?.data?.data ?? [];
      if (!items.length) {
        message.warning(t("message.noBarcode"));
        return;
      }
      const html = items
        .map(
          (i: any) =>
            `<div class="label"><img src="${i.image}"/><label class="lblMaterialCode">${i.code ?? ""}</label></div>`,
        )
        .join("");
      const win = window.open("", "_blank");
      win?.document.write(`<html><head><title>${t("print.title")}</title>
        <style>
          body { margin: 0; padding: 0; background: white; }
          #printContent { display: grid; grid-template-columns: repeat(auto-fill, 7cm); grid-auto-rows: 3cm; width: 100%; height: auto; }
          .label { margin: 4mm auto; width: 6cm; height: 2cm; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; box-sizing: border-box; }
          .lblMaterialCode { margin-top: 1px; }
          .label img { width: 100%; height: 100%; object-fit: cover; margin: 10px 0 0 0; padding: 0; }
          @media print {
            body { margin: 0; padding: 0; width: 100%; height: 100%; background: white; }
            #printContent { margin: 0; width: 100%; height: auto; display: grid; grid-template-columns: repeat(auto-fill, 7cm); grid-auto-rows: 3cm; gap: 2mm; }
            .label { page-break-inside: avoid; margin: 4mm auto; width: 6cm; height: 2cm; }
          }
        </style></head><body>
        <div id="printContent">${html}</div>
        <script>
          (function () {
            var images = document.querySelectorAll("#printContent img");
            var imagePromises = Array.from(images).map(function (img) {
              return new Promise(function (resolve) {
                if (img.complete) {
                  resolve();
                } else {
                  img.onload = resolve;
                  img.onerror = resolve;
                }
              });
            });
            Promise.race([
              Promise.all(imagePromises),
              new Promise(function (resolve) { setTimeout(resolve, 3000); }),
            ]).then(function () {
              setTimeout(function () { window.print(); }, 500);
            });
            window.onafterprint = function () { window.close(); };
          })();
        </script></body></html>`);
      win?.document.close();
    } catch {
      message.error(t("message.printFailed"));
    }
  };

  const printLabel = (record: Location) => printLabels([record]);

  const printSelectedLabels = async () => {
    const records = (dataSource ?? []).filter((r) =>
      selectedIds.includes(r.id ?? ""),
    );
    setBulkPrintLoading(true);
    await printLabels(records);
    setBulkPrintLoading(false);
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
      width: 140,
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
      title: t("table.columns.barcode"),
      dataIndex: "barcode",
      key: "barcode",
      width: 140,
    },
    {
      title: t("table.columns.category"),
      dataIndex: "category",
      key: "category",
      width: 150,
    },
    {
      title: t("table.columns.zone"),
      dataIndex: "zoneName",
      key: "zoneName",
      width: 160,
      truncate: true,
    },
    {
      title: t("table.columns.description"),
      dataIndex: "description",
      key: "description",
      width: 220,
      truncate: true,
    },
    {
      title: t("table.columns.createdAt"),
      dataIndex: "createdDate",
      key: "createdDate",
      width: 180,
      sorter: true,
      render: (_: unknown, record: Location) =>
        FormatUtils().dateTimeTransform(record.createdDate ?? ""),
    },
    {
      title: t("table.columns.actions"),
      key: "operation",
      fixed: "right",
      width: 120,
      render: (record: Location) => (
        <Row justify="center" gutter={[8, 0]}>
          <Col>
            <Button
              id="print-button"
              size="small"
              tooltip={t("table.button.print.tooltip")}
              type="link"
              icon={<PrinterOutlined />}
              onClick={() => printLabel(record)}
            />
          </Col>
          {isUpdate ? (
            <Col>
              <Link
                id="link-edit-location"
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

  const toggleSelect = (id: string, checked: boolean) =>
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id),
    );

  return (
    <>
      <Flex vertical gap={24}>
        {dataSource &&
          (isMobile ? (
            // mobile: card list per location — pola master material;
            // tap kartu → drawer aksi, checkbox → bulk print
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
                  menu={{
                    ariaLabel: t("table.button.print.label"),
                    items: [
                      {
                        key: "print",
                        icon: <PrinterOutlined />,
                        label: t("table.button.print.label"),
                        disabled: !selectedIds.length,
                      },
                    ],
                    onClick: () => printSelectedLabels(),
                  }}
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
                  {dataSource.map((m: Location) => (
                    <div
                      key={m.id ?? m.code}
                      style={{
                        background: "#fff",
                        border: "1px solid #f0f0f0",
                        borderRadius: 12,
                        display: "flex",
                        gap: 12,
                        padding: "12px 14px",
                      }}
                    >
                      <Checkbox
                        style={{ marginTop: 4 }}
                        checked={!!m.id && selectedIds.includes(m.id)}
                        onChange={(e) =>
                          m.id && toggleSelect(m.id, e.target.checked)
                        }
                      />
                      <div
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
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          flex: 1,
                          gap: 4,
                          minWidth: 0,
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
                        <div
                          style={{
                            color: "#667085",
                            fontSize: 12,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {[m.category, m.zoneName]
                            .filter(Boolean)
                            .join(" · ") || "-"}
                        </div>
                        {(m.barcode || m.createdDate) && (
                          <div style={{ color: "#98a2b3", fontSize: 12 }}>
                            {[
                              m.barcode,
                              FormatUtils().dateTimeTransform(
                                m.createdDate ?? "",
                              ),
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                          </div>
                        )}
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
              columns={COLUMNS as any}
              current={Number(options?.page)}
              pageSize={options?.limit}
              total={options?.totalData ?? 0}
              rowKey={(row: Location) => row.id ?? `${row.no}`}
              loading={loading}
              title={t("table.title")}
              scroll={{ x: 1100 }}
              onPageChange={onPageChangeListener}
              onTableChange={onTableChangeListener}
              isCustomSearch
              multipleSelect
              multipleDelete={false}
              onSelectedRowsChange={(keys) => setSelectedIds(keys as string[])}
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
                  <Col>
                    <Button
                      id="action-bulk-print"
                      icon={<PrinterOutlined />}
                      loading={bulkPrintLoading}
                      disabled={!selectedIds.length}
                      onClick={printSelectedLabels}
                    >
                      {t("table.button.print.label")}
                    </Button>
                  </Col>
                  {isCreate ? (
                    <Col>
                      <Link
                        id="link-add-location"
                        href={`${baseLink}/add`}
                        passHref
                      >
                        <Button id="action-add" type="primary" icon={<Plus />}>
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
          <Button
            block
            icon={<PrinterOutlined />}
            onClick={() => {
              const row = actionRow;
              setActionRow(null);
              if (row) printLabel(row);
            }}
          >
            {t("table.button.print.label")}
          </Button>
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
