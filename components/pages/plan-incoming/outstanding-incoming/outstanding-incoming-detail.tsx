/* eslint-disable @typescript-eslint/no-explicit-any */
import Card from "@sera-components/card";
import Empty from "@sera-components/empty";
import Input from "@sera-components/input";
import { Input as AntdInput } from "antd";
import {
  outstandingIncomingActions,
  useAppDispatch,
  useAppSelector,
} from "@sera-redux";
import { outstandingIncomingTypes } from "@sera-types/outstanding-incoming.type";
import FormatUtils from "@sera-utils/format";
import { Col, Form, Row, Space, Table } from "antd";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import styles from "./outstanding-incoming.module.scss";

const OutstandingIncomingDetail = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation(undefined, {
    keyPrefix: "planIncoming.outstandingIncoming.detail",
  });

  const {
    detail: { data: header, history },
  } = useAppSelector((state) => state.outstandingIncoming);
  const loading = useAppSelector(
    (state) =>
      state.loading[outstandingIncomingTypes.GET_OUTSTANDING_INCOMING_DETAIL],
  );


  useEffect(() => {
    if (id) {
      dispatch(
        outstandingIncomingActions.getOutstandingIncomingDetailFetch({
          id: String(id),
        }),
      );
    }
    return () => {
      dispatch(outstandingIncomingActions.getOutstandingIncomingDetailClear());
    };
  }, [id]);

  const toDate = (v?: string | null) =>
    v ? FormatUtils().dateTimeTransform(v) : "-";

  /* Kolom add-info detail — nama unik lintas baris material. */
  const detailAddInfoNames = [
    ...new Set(
      (header?.details ?? []).flatMap((d) =>
        (d.addInfos ?? []).map((a) => a.name).filter(Boolean) as string[],
      ),
    ),
  ];

  const detailColumns = [
    {
      title: t("detail.materialCode"),
      dataIndex: "materialCode",
      key: "materialCode",
    },
    {
      title: t("detail.materialName"),
      dataIndex: "materialName",
      key: "materialName",
      truncate: true,
    },
    {
      title: t("detail.materialBrand"),
      dataIndex: "materialBrand",
      key: "materialBrand",
    },
    { title: t("detail.uom"), dataIndex: "uom", key: "uom", width: 80 },
    {
      title: t("detail.poQty"),
      dataIndex: "poQty",
      key: "poQty",
      width: 90,
      className: styles["tabular-nums"],
    },
    {
      title: t("detail.partialQty"),
      dataIndex: "partialQty",
      key: "partialQty",
      width: 100,
      className: styles["tabular-nums"],
    },
    {
      title: t("detail.binningQty"),
      dataIndex: "binningQty",
      key: "binningQty",
      width: 100,
      className: styles["tabular-nums"],
    },
    {
      title: t("detail.binningDate"),
      dataIndex: "binningDate",
      key: "binningDate",
      render: (v: string | null) => toDate(v),
    },
    {
      title: t("detail.description"),
      dataIndex: "description",
      key: "description",
      truncate: true,
    },
    ...detailAddInfoNames.map((name) => ({
      title: name,
      key: `addinfo-${name}`,
      render: (_: any, row: any) =>
        row.addInfos?.find((a: any) => a.name === name)?.value ?? "-",
    })),
  ];

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
      className: styles["tabular-nums"],
      render: (v: number | null) =>
        v == null ? "-" : `${v} ${t("history.minutes")}`,
    },
    {
      title: t("history.createdBy"),
      dataIndex: "createdBy",
      key: "createdBy",
    },
  ];

  /* Field read-only ala form LOGIS: label atas + input disabled (lihat
     shipment-detail-form), grid 2 kolom responsif. Add-info header ikut
     jadi field dinamis. */
  const infoFields = [
    { label: t("detail.deliveryNoteNo"), value: header?.deliveryNoteNo },
    { label: t("detail.poNo"), value: header?.poNo },
    { label: t("detail.customerName"), value: header?.customerName },
    { label: t("detail.warehouseName"), value: header?.warehouseName },
    { label: t("detail.supplierName"), value: header?.supplierName },
    ...(header?.addInfos ?? []).map((a) => ({
      label: a.name ?? "-",
      value: a.value,
    })),
  ];

  return (
    <Space
      direction="vertical"
      size={24}
      style={{ display: "flex" }}
      className={styles["detail-stack"]}
    >
      <Card title={t("detail.informationTitle")}>
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
                  <Form.Item label={t("detail.description")}>
                    <AntdInput.TextArea
                      disabled
                      autoSize={{ minRows: 1, maxRows: 4 }}
                      value={header?.description ?? "-"}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label={t("detail.status")}>
                    <Input
                      disabled
                      value={[
                        header?.status,
                        header?.isHold ? "HOLD" : null,
                      ]
                        .filter(Boolean)
                        .join(" — ") || "-"}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
      <Card title={t("detail.materialTitle")}>
        <Table
          size="small"
          rowKey="id"
          loading={loading}
          locale={{ emptyText: <Empty /> }}
          dataSource={header?.details ?? []}
          columns={detailColumns}
          pagination={false}
          scroll={{ x: 900 }}
        />
      </Card>
      <Card title={t("detail.historyTitle")}>
        <Table
          size="small"
          rowKey="id"
          loading={loading}
          locale={{ emptyText: <Empty /> }}
          dataSource={[...(history ?? [])].sort((a, b) =>
            (b.date ?? "").localeCompare(a.date ?? ""),
          )}
          columns={historyColumns}
          pagination={false}
        />
      </Card>
    </Space>
  );
};

export default OutstandingIncomingDetail;
