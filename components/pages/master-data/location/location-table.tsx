/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { PrinterOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import Card from "@sera-components/card";
import FilterDropdown from "@sera-components/filter-dropdown";
// eslint-disable-next-line import/no-named-as-default
import { DeleteOutlined, EditOutlined, Plus } from "@sera-components/icons";
import Input from "@sera-components/input";
import Modal from "@sera-components/modal";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import LocationApi from "@sera-libraries/api/location";
import WmsWarehouseApi from "@sera-libraries/api/wms-warehouse";
import { locationActions } from "@sera-redux";
import { BaseType } from "@sera-types/base.type";
import { Location } from "@sera-types/location.type";
import FormatUtils from "@sera-utils/format";
import useCheckPermission from "@sera-utils/hooks/useCheckPermission";
import { Col, Flex, message, Row, Typography } from "antd";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

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

  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [warehouseCodes, setWarehouseCodes] = useState<string[]>([]);
  const [listOptions, setListOptions] = useState<BaseType>({
    page: 1,
    limit: 10,
    order: "code",
    sort: "asc",
  });
  const [searchByOption, setSearchByOption] = useState("code");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selected, setSelected] = useState<{ id: string; name: string }>({
    id: "",
    name: "",
  });

  useEffect(() => {
    WmsWarehouseApi()
      .retrieveDropdownWarehouses()
      .then((resp: any) => setWarehouses(resp?.data?.data ?? []))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    onFetch({
      ...listOptions,
      warehouseCode: warehouseCodes.length
        ? warehouseCodes.join(",")
        : undefined,
    });
  }, [listOptions, warehouseCodes]);

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
    setShowDeleteConfirm(true);
    setSelected(obj);
  };

  // per-row label print (single) — multi-select print to follow if Table exposes rowSelection
  const printLabel = async (record: Location) => {
    if (!record?.barcode) {
      message.warning(t("message.noBarcode"));
      return;
    }
    try {
      const resp: any = await LocationApi().generateBarcodeLabels([
        {
          barcode: record.barcode,
          code: record.code,
          name: record.name,
        },
      ]);
      const items = resp?.data?.data ?? [];
      if (!items.length) {
        message.warning(t("message.noBarcode"));
        return;
      }
      const html = items
        .map(
          (i: any) =>
            `<div class="label"><label class="lblCode">${i.code ?? ""}</label><img src="${i.image}"/><label class="lblName">${i.name ?? ""}</label></div>`,
        )
        .join("");
      const win = window.open("", "_blank");
      win?.document.write(`<html><head><title>${t("print.title")}</title>
        <style>
          @media print { @page { size: 62mm 40mm; margin: 0; } }
          .label { width: 62mm; height: 40mm; text-align: center; page-break-after: always; font-family: monospace; }
          .lblCode { font-weight: bold; font-size: 11pt; display: block; }
          .lblName { font-size: 8pt; display: block; }
          img { max-width: 54mm; }
        </style></head><body>${html}</body></html>`);
      win?.document.close();
      win?.focus();
      win?.print();
    } catch {
      message.error(t("message.printFailed"));
    }
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

  return (
    <>
      <Flex vertical gap={24}>
        <Card.Filter>
          <Row gutter={[8, 4]}>
            <Col>
              <FilterDropdown
                buttonLabel={t("table.selectWarehouse")}
                options={warehouses.map((w: any) => ({
                  label: w.name,
                  value: w.code,
                }))}
                selectedValues={warehouseCodes}
                onChange={(values) => setWarehouseCodes(values ?? [])}
                loading={false}
                disabled={false}
              />
            </Col>
          </Row>
        </Card.Filter>

        {dataSource && (
          <Table
            dataSource={dataSource}
            columns={COLUMNS}
            current={Number(options?.page)}
            pageSize={options?.limit}
            total={options?.totalData ?? 0}
            rowKey={(row: Location) => `${row.no}`}
            loading={loading}
            title={t("table.title")}
            scroll={{ x: 1100 }}
            onPageChange={onPageChangeListener}
            onTableChange={onTableChangeListener}
            isCustomSearch
            multipleDelete={false}
            actions={
              <Row gutter={8}>
                {isCreate ? (
                  <Col span={24}>
                    <Link
                      id="link-add-location"
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
        )}
      </Flex>

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
            options: {
              ...listOptions,
              warehouseCode: warehouseCodes.join(",") || undefined,
            },
          });
          setShowDeleteConfirm(false);
        }}
      >
        <Typography.Text>{t("modal.delete.subtitle")} </Typography.Text>
        <Typography.Text strong>{selected.name}</Typography.Text>
      </Modal.Confirm>
    </>
  );
};

export default ZoneTable;
