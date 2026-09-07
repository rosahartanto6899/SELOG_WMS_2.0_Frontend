/* eslint-disable @typescript-eslint/no-explicit-any */
import Card from "@sera-components/card";
import Empty from "@sera-components/empty";
import StatusTag from "@sera-components/status-tag";
import ActualIncomingApi from "@sera-libraries/api/actual-incoming";
import OutstandingIncomingApi from "@sera-libraries/api/outstanding-incoming";
import {
  ForActualResult,
  OutstandingIncomingHistory,
} from "@sera-types/outstanding-incoming.type";
import FormatUtils from "@sera-utils/format";
import { Col, Descriptions, Row, Spin, Table, Tabs, Typography } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/** Detail Actual Incoming — reuse endpoint existing: for-actual, history, locations. */
const ActualIncomingDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation(undefined, {
    keyPrefix: "planIncoming.actualIncoming.detail",
  });
  const tt = useTranslation().t; // akses key lintas section

  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<ForActualResult | null>(null);
  const [history, setHistory] = useState<OutstandingIncomingHistory[]>([]);
  const [locations, setLocations] = useState<
    Array<{ location?: string | null; planIncomingHeaderId?: string | null }>
  >([]);
  const [actual, setActual] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const api = OutstandingIncomingApi();
        const [forActual, historyRows, locationRows, actual] =
          await Promise.all([
            api.retrieveForActual([String(id)]),
            api.retrieveHistoryTyped(String(id)),
            api
              .retrieveLocations(String(id))
              .then((resp: any) => resp?.data?.data ?? []),
            ActualIncomingApi().retrieveActual(String(id)),
          ]);
        if (cancelled) return;
        setPreview(forActual);
        setHistory(historyRows);
        setLocations(locationRows);
        setActual(actual);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <Row justify="center" style={{ padding: "4rem 0" }}>
        <Spin />
      </Row>
    );
  }

  const header = preview?.headerIncoming?.[0] ?? null;
  if (!header) return <Empty description={t("empty")} />;

  const toDate = (v?: string | null) =>
    v ? FormatUtils().dateTimeTransform(v) : "-";
  const location = actual?.binningLocation ?? locations[0]?.location ?? "-";
  const detailRows = (preview?.detailIncoming ?? []).map((d: any) => ({
    ...d,
    location,
  }));

  const colLabel = (key: string) =>
    tt(`planIncoming.actualIncoming.table.column.${key}`);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Card noShadow>
        <Typography.Title level={5}>{t("header.title")}</Typography.Title>
        <Descriptions size="small" bordered column={{ xs: 1, md: 2, xl: 3 }}>
          <Descriptions.Item label={colLabel("deliveryNoteNo")}>
            {header.deliveryNoteNo ?? "-"}
          </Descriptions.Item>
          <Descriptions.Item label={colLabel("poNo")}>
            {header.poNo ?? "-"} ({header.poType ?? "-"})
          </Descriptions.Item>
          <Descriptions.Item label={colLabel("incomingDate")}>
            {toDate(header.incomingDate)}
          </Descriptions.Item>
          <Descriptions.Item label={colLabel("poDate")}>
            {toDate(header.poDate)}
          </Descriptions.Item>
          <Descriptions.Item label={colLabel("supplierName")}>
            {header.supplierName ?? "-"}
          </Descriptions.Item>
          <Descriptions.Item label={colLabel("referenceNo")}>
            {header.referenceNo ?? "-"}
          </Descriptions.Item>
          <Descriptions.Item label={colLabel("status")}>
            <StatusTag value={header.status ?? "-"} fallback="default" />
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card noShadow>
        <Typography.Title level={5}>{t("pic.title")}</Typography.Title>
        <Descriptions size="small" bordered column={{ xs: 1, md: 2, xl: 3 }}>
          <Descriptions.Item label={t("pic.picReceiver")}>
            {actual?.picReceiver ?? "-"}
          </Descriptions.Item>
          <Descriptions.Item label={t("pic.picBinner")}>
            {actual?.picBinner ?? "-"}
          </Descriptions.Item>
          <Descriptions.Item label={t("pic.grBy")}>
            {actual?.grBy ?? "-"}
          </Descriptions.Item>
          <Descriptions.Item label={t("pic.grDate")}>
            {toDate(actual?.grDate)}
          </Descriptions.Item>
          <Descriptions.Item label={t("pic.binningLocation")}>
            {location}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card noShadow>
        <Tabs
          items={[
            {
              key: "material",
              label: t("tab.material"),
              children: (
                <Table
                  size="small"
                  rowKey="id"
                  pagination={false}
                  dataSource={detailRows}
                  columns={[
                    {
                      title: t("material.materialCode"),
                      dataIndex: "materialCode",
                    },
                    {
                      title: t("material.materialName"),
                      dataIndex: "materialName",
                    },
                    {
                      title: t("material.materialBrand"),
                      dataIndex: "materialBrand",
                    },
                    { title: t("material.uom"), dataIndex: "uom" },
                    { title: t("material.poQty"), dataIndex: "poQty" },
                    {
                      title: t("material.binningQty"),
                      dataIndex: "binningQty",
                    },
                    { title: t("material.location"), dataIndex: "location" },
                  ]}
                />
              ),
            },
            {
              key: "addInfo",
              label: t("tab.addInfo"),
              children: (
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Typography.Text strong>Header</Typography.Text>
                    <Table
                      size="small"
                      rowKey={(r: any) => `h-${r.name}-${r.value}`}
                      pagination={false}
                      dataSource={preview?.additionalHeader ?? []}
                      columns={[
                        { title: "Name", dataIndex: "name" },
                        { title: "Value", dataIndex: "value" },
                      ]}
                    />
                  </Col>
                  <Col xs={24} md={12}>
                    <Typography.Text strong>Detail</Typography.Text>
                    <Table
                      size="small"
                      rowKey={(r: any) =>
                        `d-${r.planIncomingDetailId}-${r.name}`
                      }
                      pagination={false}
                      dataSource={preview?.additionalDetail ?? []}
                      columns={[
                        { title: "Name", dataIndex: "name" },
                        { title: "Value", dataIndex: "value" },
                      ]}
                    />
                  </Col>
                </Row>
              ),
            },
            {
              key: "attachment",
              label: t("tab.attachment"),
              children: (
                <Table
                  size="small"
                  rowKey="attachmentUrl"
                  pagination={false}
                  dataSource={preview?.attachmentIncoming ?? []}
                  columns={[
                    { title: "File", dataIndex: "fileName" },
                    {
                      title: "URL",
                      dataIndex: "attachmentUrl",
                      render: (v: string) => (
                        <a href={v} target="_blank" rel="noreferrer">
                          {v}
                        </a>
                      ),
                    },
                  ]}
                />
              ),
            },
            {
              key: "history",
              label: t("tab.history"),
              children: (
                <Table
                  size="small"
                  rowKey="id"
                  pagination={false}
                  dataSource={history}
                  columns={[
                    {
                      title: colLabel("status"),
                      dataIndex: "status",
                    },
                    {
                      title: colLabel("grDate"),
                      dataIndex: "date",
                      render: (v: string) => toDate(v),
                    },
                    { title: "PIC", dataIndex: "pic" },
                    { title: "Leadtime (m)", dataIndex: "leadtime" },
                  ]}
                />
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default ActualIncomingDetail;
