/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import Card from "@sera-components/card";
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import ActualOutgoingApi from "@sera-libraries/api/actual-outgoing";
import FormatUtils from "@sera-utils/format";
import { Col, Form, message, Row, Space, Spin } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/** Actual Outgoing detail — parity Outstanding Outgoing dn-detail-page.
 *  Read-only: DN info + addInfo + material table + status history. */
const ActualOutgoingDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation(undefined, {
    keyPrefix: "planOutgoing.actualOutgoing",
  });
  const toDate = (v?: string | null) =>
    v ? FormatUtils().dateTimeTransform(v) : "-";

  const [loading, setLoading] = useState(false);
  const [header, setHeader] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [addInfoHeader, setAddInfoHeader] = useState<any[]>([]);
  const [searchBy, setSearchBy] = useState("materialCode");

  const fetchDetail = async (opts?: { search?: string; searchBy?: string }) => {
    if (!id) return;
    setLoading(true);
    try {
      const [detailRes, historyRes, addInfoRes] = await Promise.allSettled([
        ActualOutgoingApi().retrieveDetail(String(id), opts),
        ActualOutgoingApi().retrieveHistory(String(id)),
        ActualOutgoingApi().retrieveAddInfoHeader(String(id)),
      ]);
      if (detailRes.status === "fulfilled")
        setHeader((detailRes.value as any)?.data);
      if (historyRes.status === "fulfilled")
        setHistory((historyRes.value as any) ?? []);
      if (addInfoRes.status === "fulfilled")
        setAddInfoHeader((addInfoRes.value as any) ?? []);
    } catch {
      message.error(t("failed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const infoFields = [
    { label: t("view.deliveryNoteNo"), value: header?.deliveryNoteNo },
    { label: t("view.poNo"), value: header?.poNo },
    { label: t("view.poType"), value: header?.poType ?? "-" },
    { label: t("view.poDate"), value: toDate(header?.poDate ?? null) },
    {
      label: t("view.outgoingDate"),
      value: toDate(header?.outgoingDate ?? null),
    },
    {
      label: t("view.customerDestination"),
      value: header?.customerDestination ?? "-",
    },
    { label: t("view.referenceNo"), value: header?.referenceNo ?? "-" },
    ...(addInfoHeader ?? []).map((a: any) => ({
      label: a.name ?? "-",
      value: a.value,
    })),
  ];

  const detailSearchOptions = [
    ["materialCode", t("view.detail.materialCode")],
    ["materialName", t("view.detail.materialName")],
    ["materialBrand", t("view.detail.materialBrand")],
    ["shipmentNo", t("view.detail.shipmentNo")],
    ["packagingNo", t("view.detail.packagingNo")],
  ].map(([value, label]) => ({ value, label }));

  const detailColumns = [
    {
      title: t("view.detail.materialCode"),
      dataIndex: "materialCode",
      key: "materialCode",
    },
    {
      title: t("view.detail.materialName"),
      dataIndex: "materialName",
      key: "materialName",
      truncate: true,
    },
    {
      title: t("view.detail.materialBrand"),
      dataIndex: "materialBrand",
      key: "materialBrand",
    },
    { title: t("view.detail.uom"), dataIndex: "uom", key: "uom", width: 80 },
    {
      title: t("view.detail.poQty"),
      dataIndex: "poQty",
      key: "poQty",
      width: 90,
    },
    {
      title: t("view.detail.pickingQty"),
      dataIndex: "pickingQty",
      key: "pickingQty",
      width: 100,
      render: (v: number, r: any) => (
        <span
          style={{
            color: v !== r.poQty ? "#d46b08" : undefined,
            fontWeight: v !== r.poQty ? 700 : undefined,
          }}
        >
          {v ?? 0}
        </span>
      ),
    },
    {
      title: t("view.detail.shipmentNo"),
      dataIndex: "shipmentNo",
      key: "shipmentNo",
      render: (v: string | null) => v ?? "-",
      truncate: true,
    },
    {
      title: t("view.detail.packagingNo"),
      dataIndex: "packagingNo",
      key: "packagingNo",
      render: (v: string | null) => v ?? "-",
      truncate: true,
    },
    {
      title: t("view.detail.pickingDate"),
      dataIndex: "pickingDate",
      key: "pickingDate",
      render: (v: string | null) => toDate(v),
    },
  ].map((c) => ({ ...c, align: "left" as const }));

  const historyColumns = [
    { title: t("history.status"), dataIndex: "status", key: "status" },
    {
      title: t("history.date"),
      dataIndex: "date",
      key: "date",
      render: (v: string | null) => toDate(v),
    },
    { title: t("history.pic"), dataIndex: "pic", key: "pic" },
    {
      title: t("history.leadtime"),
      dataIndex: "leadtime",
      key: "leadtime",
      render: (v: number | null) =>
        v == null ? "-" : `${v} ${t("history.minutes")}`,
    },
    {
      title: t("history.createdBy"),
      dataIndex: "createdBy",
      key: "createdBy",
    },
  ].map((c) => ({ ...c, align: "left" as const }));

  const historyRows = [...history].sort((a: any, b: any) =>
    (b.date ?? "").localeCompare(a.date ?? ""),
  );

  return (
    <Spin spinning={loading}>
      <Space
        direction="vertical"
        size={24}
        style={{ display: "flex", width: "100%" }}
      >
        <Card title={t("view.infoTitle")}>
          <Form layout="vertical">
            <Row gutter={16}>
              {infoFields.map((f) => (
                <Col key={f.label} xs={24} md={12}>
                  <Form.Item label={f.label}>
                    <Input disabled value={f.value ?? "-"} />
                  </Form.Item>
                </Col>
              ))}
              <Col xs={24} md={12}>
                <Form.Item label={t("view.description")}>
                  <Input disabled value={header?.description ?? "-"} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label={t("view.status")}>
                  <Input disabled value={header?.status ?? "-"} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

        <Card title={t("view.materialTitle")}>
          <Table
            rowKey="id"
            loading={loading}
            dataSource={header?.details ?? []}
            columns={detailColumns as any}
            scroll={{ x: "max-content" }}
            total={(header?.details ?? []).length}
            current={1}
            pageSize={10}
            showTitle={false}
            showActions={false}
            isCustomSearch
            customSearch={
              <Row align="middle" gutter={[8, 4]}>
                <Col flex="0 0 12rem">
                  <Select
                    style={{ width: "100%", minWidth: "12rem" }}
                    id="actual-outgoing-detail-search-by"
                    value={searchBy}
                    onChange={(v: string) => {
                      setSearchBy(v);
                      fetchDetail();
                    }}
                    allowClear={false}
                  >
                    {detailSearchOptions.map((opt) => (
                      <Select.Option key={opt.value} value={opt.value}>
                        {opt.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Col>
                <Col flex="auto">
                  <Input.Search
                    loading={loading}
                    style={{ width: "100%", minWidth: "16rem" }}
                    placeholder={t("searchPlaceholder")}
                    allowClear
                    onSearch={(v?: string) =>
                      fetchDetail(v ? { search: v, searchBy } : undefined)
                    }
                  />
                </Col>
              </Row>
            }
          />
        </Card>

        <Card title={t("historyTitle")}>
          <Table
            rowKey="id"
            loading={loading}
            dataSource={historyRows}
            columns={historyColumns as any}
            total={historyRows.length}
            current={1}
            pageSize={10}
            showTitle={false}
            showActions={false}
          />
        </Card>
      </Space>
    </Spin>
  );
};

export default ActualOutgoingDetailPage;
