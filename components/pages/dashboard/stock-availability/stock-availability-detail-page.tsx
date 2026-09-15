/* eslint-disable @typescript-eslint/no-explicit-any */
import Card from "@sera-components/card";
import Input from "@sera-components/input";
import OutstandingIncomingApi from "@sera-libraries/api/outstanding-incoming";
import OutstandingOutgoingApi from "@sera-libraries/api/outstanding-outgoing";
import StockAvailabilityApi from "@sera-libraries/api/stock-availability";
import {
  PlanQtyRow,
  StockAvailabilityRow,
  StockOnHandHistoryRow,
} from "@sera-types/stock-availability.type";
import FormatUtils from "@sera-utils/format";
import { Col, Form, Row, Spin, Table, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  materialCode: string;
  customerCode: string;
  warehouseCode: string;
}

const toDate = (v?: string | null) =>
  v ? FormatUtils().dateTimeTransform(v) : "-";

const tabTable = (columns: any[], dataSource: any[], loading: boolean) => (
  <Table
    size="small"
    rowKey={(_, i) => String(i)}
    columns={columns}
    dataSource={dataSource}
    loading={loading}
    pagination={{ pageSize: 10, showSizeChanger: false }}
    scroll={{ x: "max-content" }}
  />
);

/** Halaman detail 3 tab (eks modal) — Plan Incoming per DN / Plan Outgoing
 *  per DN / History SOH. Tab plan in/out dimuat saat halaman dibuka;
 *  history tetap lazy per tab. Header material di-fetch dari list API
 *  (search by materialCode, limit 1). */
export const StockAvailabilityDetailPage = ({
  materialCode,
  customerCode,
  warehouseCode,
}: Props) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "dashboard.stockAvailability.detail",
  });

  const [row, setRow] = useState<StockAvailabilityRow | null>(null);
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const [incoming, setIncoming] = useState<PlanQtyRow[]>([]);
  const [outgoing, setOutgoing] = useState<PlanQtyRow[]>([]);
  const [history, setHistory] = useState<StockOnHandHistoryRow[]>([]);
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const loadTab = async (key: string) => {
    if (loaded[key]) return;
    setLoading((prev) => ({ ...prev, [key]: true }));
    try {
      if (key === "incoming") {
        const data =
          await OutstandingIncomingApi().retrievePlanQtyByMaterial(
            materialCode,
          );
        setIncoming(data);
      } else if (key === "outgoing") {
        const data =
          await OutstandingOutgoingApi().retrievePlanQtyByMaterial(
            materialCode,
          );
        setOutgoing(data);
      } else if (key === "history") {
        const data = await StockAvailabilityApi().retrieveHistory({
          customerCode,
          warehouseCode,
          materialCode,
        });
        setHistory(data);
      }
      setLoaded((prev) => ({ ...prev, [key]: true }));
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  useEffect(() => {
    if (!materialCode) return;
    // header material — reuse list API (envelope { data })
    StockAvailabilityApi()
      .retrieveList({
        search: materialCode,
        searchBy: "materialCode",
        page: 1,
        limit: 1,
        customerCode: customerCode || undefined,
        warehouseCode: warehouseCode || undefined,
      } as any)
      .then((resp: any) => setRow(resp?.data?.data?.[0] ?? null));
    loadTab("incoming");
    loadTab("outgoing");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [materialCode]);

  const planQtyColumns = [
    {
      title: t("planQty.deliveryNoteNo"),
      dataIndex: "deliveryNoteNo",
      key: "deliveryNoteNo",
    },
    {
      title: t("planQty.qty"),
      dataIndex: "qty",
      key: "qty",
      align: "center" as const,
    },
    {
      title: t("planQty.createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (v: string) => toDate(v),
    },
  ];

  const sumQty = (rows: PlanQtyRow[]) =>
    rows.reduce((s, r) => s + (Number(r.qty) || 0), 0);

  const historyColumns = [
    { title: t("history.category"), dataIndex: "category", key: "category" },
    {
      title: t("history.transactionType"),
      dataIndex: "transactionType",
      key: "transactionType",
    },
    {
      title: t("history.deliveryNoteNo"),
      dataIndex: "deliveryNoteNo",
      key: "deliveryNoteNo",
    },
    {
      title: t("history.qty"),
      dataIndex: "qty",
      key: "qty",
      align: "center" as const,
    },
    {
      title: t("history.qtySOHBefore"),
      dataIndex: "qtySOHBefore",
      key: "qtySOHBefore",
      align: "center" as const,
    },
    {
      title: t("history.qtySOHAfter"),
      dataIndex: "qtySOHAfter",
      key: "qtySOHAfter",
      align: "center" as const,
    },
    {
      title: t("history.poDate"),
      dataIndex: "poDate",
      key: "poDate",
      render: (v: string) => toDate(v),
    },
    {
      title: t("history.createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (v: string) => toDate(v),
    },
  ];

  const items = [
    {
      key: "incoming",
      label: `${t("tab.incoming")} (${sumQty(incoming)})`,
      children: (
        <Spin spinning={!!loading.incoming}>
          {tabTable(planQtyColumns, incoming, !!loading.incoming)}
        </Spin>
      ),
    },
    {
      key: "outgoing",
      label: `${t("tab.outgoing")} (${sumQty(outgoing)})`,
      children: (
        <Spin spinning={!!loading.outgoing}>
          {tabTable(planQtyColumns, outgoing, !!loading.outgoing)}
        </Spin>
      ),
    },
    {
      key: "history",
      label: t("tab.history"),
      children: (
        <Spin spinning={!!loading.history}>
          {tabTable(historyColumns, history, !!loading.history)}
        </Spin>
      ),
    },
  ];

  return (
    <Card noShadow>
      <Spin spinning={!row}>
        <Form layout="vertical">
          <Row gutter={16}>
            {["materialCode", "materialName", "materialBrand", "qtySOH"].map(
              (key) => (
                <Col key={key} xs={24} md={12}>
                  <Form.Item label={t(key)}>
                    <Input
                      disabled
                      value={
                        (key === "materialCode"
                          ? (row?.materialCode ?? materialCode)
                          : (row as any)?.[key]) ?? "-"
                      }
                    />
                  </Form.Item>
                </Col>
              ),
            )}
          </Row>
        </Form>
      </Spin>
      <Tabs
        items={items}
        onChange={(key) => loadTab(key)}
        defaultActiveKey="incoming"
      />
    </Card>
  );
};

export default StockAvailabilityDetailPage;
