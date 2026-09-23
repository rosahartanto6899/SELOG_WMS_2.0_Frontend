/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import Card from "@sera-components/card";
import TimelineDot from "@sera-components/icons/TimelineDot";
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import ActualOutgoingApi from "@sera-libraries/api/actual-outgoing";
import FormatUtils from "@sera-utils/format";
import { useIsMobileView } from "@sera-utils/hooks/useIsMobileView";
import { Col, Form, message, Pagination, Row, Space, Spin } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import MobileTableHeader from "../outstanding-outgoing/mobile-table-header";

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
  const [search, setSearch] = useState("");
  const isMobile = useIsMobileView();
  const [histPage, setHistPage] = useState(1);
  const [histPageSize, setHistPageSize] = useState(10);

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
  const histPageRows = historyRows.slice(
    (histPage - 1) * histPageSize,
    histPage * histPageSize,
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
              isMobile ? (
                <MobileTableHeader
                  selectId="actual-outgoing-detail-search-by-mobile"
                  searchFilterLabel={t("searchFilter")}
                  placeholder={t("searchPlaceholder")}
                  searchBy={searchBy}
                  searchByOptions={detailSearchOptions}
                  currentSearch={search || undefined}
                  onSelectSearchBy={(v) => {
                    setSearchBy(v ?? "materialCode");
                    setSearch("");
                    fetchDetail();
                  }}
                  onSearch={(v) => {
                    setSearch(v ?? "");
                    fetchDetail(v ? { search: v, searchBy } : undefined);
                  }}
                />
              ) : (
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
              )
            }
          />
        </Card>

        <Card title={t("historyTitle")}>
          {isMobile ? (
            // timeline vertikal — 5 kolom table tidak muat di layar sempit
            <div style={{ display: "flex", flexDirection: "column" }}>
              {histPageRows.map((h: any, i: number) => (
                <div
                  key={h.id ?? i}
                  style={{
                    display: "flex",
                    gap: 12,
                    padding: "12px 0",
                    borderBottom:
                      i < histPageRows.length - 1
                        ? "1px solid #f0f0f0"
                        : undefined,
                  }}
                >
                  <div style={{ paddingTop: 6 }}>
                    <TimelineDot />
                  </div>
                  <div
                    style={{
                      flex: 1,
                      minWidth: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
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
                      <strong style={{ overflowWrap: "anywhere" }}>
                        {h.status ?? "-"}
                      </strong>
                      <span style={{ fontSize: 12, whiteSpace: "nowrap" }}>
                        {toDate(h.date)}
                      </span>
                    </div>
                    <div style={{ color: "#667085", fontSize: 12 }}>
                      {t("history.pic")}: {h.pic ?? "-"} ·{" "}
                      {t("history.createdBy")} {h.createdBy ?? "-"}
                      {h.leadtime != null && (
                        <>
                          {" · "}
                          {h.leadtime} {t("history.minutes")}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {historyRows.length > histPageSize && (
                <Pagination
                  simple
                  size="small"
                  style={{ marginTop: 12, textAlign: "center" }}
                  current={histPage}
                  pageSize={histPageSize}
                  total={historyRows.length}
                  onChange={(p, s) => {
                    setHistPage(p);
                    setHistPageSize(s);
                  }}
                />
              )}
            </div>
          ) : (
            <Table
              rowKey="id"
              loading={loading}
              dataSource={histPageRows}
              columns={historyColumns as any}
              total={historyRows.length}
              current={histPage}
              pageSize={histPageSize}
              onPageChange={(p) => setHistPage(p)}
              onShowSizeChange={(_, s) => {
                setHistPageSize(s);
                setHistPage(1);
              }}
              showTitle={false}
              showActions={false}
            />
          )}
        </Card>
      </Space>
    </Spin>
  );
};

export default ActualOutgoingDetailPage;
