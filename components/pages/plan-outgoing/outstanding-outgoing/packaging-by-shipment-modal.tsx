/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import OutstandingOutgoingApi from "@sera-libraries/api/outstanding-outgoing";
import { BaseType } from "@sera-types/base.type";
import { Col, Modal, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  shipmentNo: string | null;
  onClose: () => void;
}

const INIT_SEARCH_BY = "packagingNo";

/** Popup packaging per shipment (Q6) — server-side parity tab:
 *  search dropdown, paging, sort. */
const PackagingByShipmentModal = ({ shipmentNo, onClose }: Props) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "planOutgoing.outstandingOutgoing.shipmentPopup",
  });
  const { t: tOpt } = useTranslation(undefined, {
    keyPrefix: "planOutgoing.outstandingOutgoing.table.options",
  });
  const { t: tCommon } = useTranslation(undefined, {
    keyPrefix: "planOutgoing.outstandingOutgoing",
  });
  const [rows, setRows] = useState<any[] | null>(null);
  const [total, setTotal] = useState(0);
  const [listOptions, setListOptions] = useState<
    BaseType & { [key: string]: any }
  >({ page: 1, limit: 10, order: "packagingNo", sort: "asc" });
  const [searchBy, setSearchBy] = useState(INIT_SEARCH_BY);

  const load = () => {
    if (!shipmentNo) return;
    OutstandingOutgoingApi()
      .retrievePackagingsByShipment(shipmentNo, listOptions)
      .then((resp: any) => {
        setRows(resp?.data?.data ?? []);
        setTotal(resp?.data?.pagination?.totalData ?? 0);
      })
      .catch(() => setRows([]));
  };

  useEffect(() => {
    if (shipmentNo) {
      setRows(null);
      setListOptions({ page: 1, limit: 10, order: "packagingNo", sort: "asc" });
    }
  }, [shipmentNo]);

  useEffect(() => {
    if (shipmentNo) load();
  }, [shipmentNo, listOptions]);

  const onPageChange = (current: number, limit: number) =>
    setListOptions((prev) => ({ ...prev, page: current, limit }));

  const onTableChange = (_p: any, _f: any, sorter: any) => {
    if (sorter) {
      setListOptions((prev) => ({
        ...prev,
        order: sorter.field,
        sort: sorter.order === "ascend" ? "asc" : "desc",
      }));
    }
  };

  const handlerSelectSearchBy = (value?: string) => {
    setSearchBy(value ?? INIT_SEARCH_BY);
    setListOptions((prev: any) => ({ ...prev, search: null, page: 1 }));
  };

  const columns = [
    {
      title: "No",
      key: "no",
      width: 60,
      align: "center" as const,
      render: (_: any, record: any) => (
        <span>
          {((listOptions.page ?? 1) - 1) * (listOptions.limit ?? 10) +
            (rows ?? []).indexOf(record) +
            1}
        </span>
      ),
    },
    {
      title: t("packagingNo"),
      dataIndex: "packagingNo",
      truncate: true,
      sorter: true,
    },
    {
      title: t("customerDestination"),
      dataIndex: "customerDestination",
      truncate: true,
      sorter: true,
    },
    { title: t("materialCode"), dataIndex: "materialCode", sorter: true },
    {
      title: t("materialName"),
      dataIndex: "materialName",
      truncate: true,
      sorter: true,
    },
    { title: t("materialBrand"), dataIndex: "materialBrand", sorter: true },
    {
      title: t("qty"),
      dataIndex: "qty",
      width: 70,
      align: "right" as const,
      sorter: true,
    },
    { title: t("uom"), dataIndex: "uom", width: 70 },
    {
      title: t("weight"),
      dataIndex: "weight",
      width: 90,
      align: "right" as const,
    },
    {
      title: `${t("length")}×${t("width")}×${t("height")}`,
      key: "dims",
      width: 130,
      render: (_: any, r: any) =>
        `${r.length ?? 0}×${r.width ?? 0}×${r.height ?? 0}`,
    },
  ];

  return (
    <Modal
      open={!!shipmentNo}
      onCancel={onClose}
      width={1080}
      title={`${t("title")} — ${shipmentNo ?? ""}`}
      footer={null}
    >
      <Table
        rowKey={(r: any) => `${r.packagingNo}-${r.materialCode}`}
        loading={rows === null}
        dataSource={rows ?? []}
        columns={columns}
        scroll={{ x: "max-content" }}
        total={total}
        current={listOptions.page}
        pageSize={listOptions.limit}
        onPageChange={onPageChange}
        onTableChange={onTableChange}
        isCustomSearch
        customSearch={
          <Row align="middle" gutter={[8, 4]}>
            <Col flex="0 0 14rem">
              <Select
                style={{ width: "100%", minWidth: "14rem" }}
                id="packaging-by-shipment-search-by"
                defaultValue={INIT_SEARCH_BY}
                placeholder={tCommon("table.search.placeholder")}
                onChange={(value) => handlerSelectSearchBy(value)}
                onClear={() => handlerSelectSearchBy("")}
                allowClear={false}
              >
                {[
                  { value: "packagingNo", label: tOpt("packagingNoOpt") },
                  { value: "materialCode", label: tOpt("materialCodeOpt") },
                  { value: "materialName", label: tOpt("materialNameOpt") },
                  { value: "customerDestination", label: tOpt("2") },
                ].map((opt) => (
                  <Select.Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col flex="auto">
              <Input.Search
                loading={false}
                style={{ width: "100%", minWidth: "18rem" }}
                placeholder={tCommon("table.search.placeholder")}
                onSearch={(search?: string) =>
                  setListOptions((prevState: any) => ({
                    ...prevState,
                    search: search || undefined,
                    searchBy: search ? searchBy : undefined,
                    page: 1,
                  }))
                }
                onClear={() =>
                  setListOptions((prevState: any) => ({
                    ...prevState,
                    search: null,
                    searchBy: undefined,
                  }))
                }
              />
            </Col>
          </Row>
        }
      />
    </Modal>
  );
};

export default PackagingByShipmentModal;
