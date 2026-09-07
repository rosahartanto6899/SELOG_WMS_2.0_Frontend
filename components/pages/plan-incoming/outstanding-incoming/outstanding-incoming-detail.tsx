/* eslint-disable @typescript-eslint/no-explicit-any */
import Card from "@sera-components/card";
import Input from "@sera-components/input";
import Table from "@sera-components/table";
import {
  outstandingIncomingActions,
  useAppDispatch,
  useAppSelector,
} from "@sera-redux";
import { outstandingIncomingTypes } from "@sera-types/outstanding-incoming.type";
import FormatUtils from "@sera-utils/format";
import { Input as AntdInput } from "antd";
import { Col, Form, Row, Space } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import MaterialSearch from "./material-search";
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

  // history: client-side pagination (pola qi-form)
  const [histPage, setHistPage] = useState(1);
  const [histPageSize, setHistPageSize] = useState(10);

  // material: client-side search + pagination (pola qi-form), kolom add-info tetap dinamis
  const [matSearch, setMatSearch] = useState("");
  const [matSearchBy, setMatSearchBy] = useState("materialCode");
  const [matPage, setMatPage] = useState(1);
  const [matPageSize, setMatPageSize] = useState(10);

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
      (header?.details ?? []).flatMap(
        (d) =>
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
  ].map((c) => ({ ...c, align: "left" as const })); // semua kolom rata kiri

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
  ].map((c) => ({ ...c, align: "left" as const })); // semua kolom rata kiri

  /* History terbaru dulu, paging client-side. */
  const historyRows = [...(history ?? [])].sort((a, b) =>
    (b.date ?? "").localeCompare(a.date ?? ""),
  );

  /* Filter material utk search by + keyword (pola qi-form). */
  const matNeedle = matSearch.trim().toLowerCase();
  const matFiltered = matNeedle
    ? (header?.details ?? []).filter((d: any) =>
        String(d[matSearchBy] ?? "")
          .toLowerCase()
          .includes(matNeedle),
      )
    : (header?.details ?? []);

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
                  value={
                    [header?.status, header?.isHold ? "HOLD" : null]
                      .filter(Boolean)
                      .join(" — ") || "-"
                  }
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card title={t("detail.materialTitle")}>
        <Table
          rowKey="id"
          loading={loading}
          dataSource={matFiltered.slice(
            (matPage - 1) * matPageSize,
            matPage * matPageSize,
          )}
          columns={detailColumns as any}
          scroll={{ x: "max-content" }}
          total={matFiltered.length}
          current={matPage}
          pageSize={matPageSize}
          onPageChange={(p) => setMatPage(p)}
          onShowSizeChange={(_, s) => {
            setMatPageSize(s);
            setMatPage(1);
          }}
          isCustomSearch
          showTitle={false}
          showActions={false}
          customSearch={
            <MaterialSearch
              id="detail-material"
              searchBy={matSearchBy}
              onSearchBy={(value) => {
                setMatSearchBy(value);
                setMatSearch("");
                setMatPage(1);
              }}
              placeholder={t("detail.searchPlaceholder")}
              onSearchValue={(v) => {
                setMatSearch(v);
                setMatPage(1);
              }}
              options={["materialCode", "materialName", "materialBrand"].map(
                (k) => ({ value: k, label: t(`detail.${k}`) }),
              )}
            />
          }
        />
      </Card>
      <Card title={t("detail.historyTitle")}>
        <Table
          rowKey="id"
          loading={loading}
          dataSource={historyRows.slice(
            (histPage - 1) * histPageSize,
            histPage * histPageSize,
          )}
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
      </Card>
    </Space>
  );
};

export default OutstandingIncomingDetail;
