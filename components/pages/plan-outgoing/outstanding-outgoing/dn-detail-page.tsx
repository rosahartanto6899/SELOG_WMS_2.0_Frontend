/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { EditOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import Card from "@sera-components/card";
import Input from "@sera-components/input";
import MaterialSearch from "@sera-components/pages/plan-incoming/outstanding-incoming/material-search";
import Table from "@sera-components/table";
import OutstandingOutgoingApi from "@sera-libraries/api/outstanding-outgoing";
import {
  outstandingOutgoingActions,
  useAppDispatch,
  useAppSelector,
} from "@sera-redux";
import { outstandingOutgoingTypes } from "@sera-types/outstanding-outgoing.type";
import { ROUTE } from "@sera-utils/constants/routes";
import FormatUtils from "@sera-utils/format";
import useCheckPermission from "@sera-utils/hooks/useCheckPermission";
import { Input as AntdInput, InputNumber, message, Modal, Space } from "antd";
import { Col, Form, Row } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import styles from "./outstanding-outgoing.module.scss";

/** View detail DN — header info + material (+add-info kolom dinamis) +
 *  history + modal adjust qty (A6). Parity outstanding-incoming-detail. */
const DnDetailPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation(undefined, {
    keyPrefix: "planOutgoing.outstandingOutgoing.detail",
  });
  const { t: tc } = useTranslation(undefined, {
    keyPrefix: "planOutgoing.outstandingOutgoing.confirm",
  });

  const { isUpdate } = useCheckPermission({
    menuLink: ROUTE.PLAN_OUTGOING.OUTSTANDING_OUTGOING,
  });

  const {
    detail: { data: header, history },
  } = useAppSelector((state) => state.outstandingOutgoing);
  const loading = useAppSelector(
    (state) => state.loading[outstandingOutgoingTypes.GET_OUTGOING_DETAIL],
  );

  const [histPage, setHistPage] = useState(1);
  const [histPageSize, setHistPageSize] = useState(10);
  const [matSearch, setMatSearch] = useState("");
  const [matSearchBy, setMatSearchBy] = useState("materialCode");
  const [matPage, setMatPage] = useState(1);
  const [matPageSize, setMatPageSize] = useState(10);

  // modal adjust qty (A6)
  const [adjustRow, setAdjustRow] = useState<any>(null);
  const [adjustForm] = Form.useForm();
  const [adjustLoading, setAdjustLoading] = useState(false);

  const reload = () => {
    if (id)
      dispatch(
        outstandingOutgoingActions.getOutgoingDetailFetch({ id: String(id) }),
      );
  };

  useEffect(() => {
    reload();
    return () => {
      dispatch(outstandingOutgoingActions.getOutgoingDetailClear());
    };
  }, [id]);

  const toDate = (v?: string | null) =>
    v ? FormatUtils().dateTimeTransform(v) : "-";

  const detailAddInfoNames = [
    ...new Set(
      (header?.details ?? []).flatMap(
        (d: any) =>
          (d.addInfos ?? [])
            .map((a: any) => a.name)
            .filter(Boolean) as string[],
      ),
    ),
  ];

  const submitAdjust = async () => {
    const values = await adjustForm.validateFields();
    setAdjustLoading(true);
    try {
      const resp = await OutstandingOutgoingApi().adjustPlanQty(
        adjustRow.id,
        values,
      );
      message.success((resp as any)?.data?.data?.message ?? "Success");
      setAdjustRow(null);
      adjustForm.resetFields();
      reload();
    } catch (error: any) {
      const body: any = error?.response?.data ?? error?.data ?? {};
      message.error(body?.message ?? body?.data?.message ?? "Failed");
    } finally {
      setAdjustLoading(false);
    }
  };

  const detailColumns = [
    {
      title: t("materialCode"),
      dataIndex: "materialCode",
      key: "materialCode",
    },
    {
      title: t("materialName"),
      dataIndex: "materialName",
      key: "materialName",
      truncate: true,
    },
    {
      title: t("materialBrand"),
      dataIndex: "materialBrand",
      key: "materialBrand",
    },
    { title: t("uom"), dataIndex: "uom", key: "uom", width: 80 },
    {
      title: t("poQty"),
      dataIndex: "poQty",
      key: "poQty",
      width: 90,
      className: styles["tabular-nums"],
    },
    {
      title: t("pickingQty"),
      dataIndex: "pickingQty",
      key: "pickingQty",
      width: 100,
      className: styles["tabular-nums"],
    },
    {
      title: t("packagingNo"),
      dataIndex: "packagingNo",
      key: "packagingNo",
      render: (v: string | null) => v ?? "-",
      truncate: true,
    },
    {
      title: t("pickingDate"),
      dataIndex: "pickingDate",
      key: "pickingDate",
      render: (v: string | null) => toDate(v),
    },
    {
      title: t("description"),
      dataIndex: "description",
      key: "description",
      render: (v: string | null) => v ?? "-",
      truncate: true,
    },
    ...detailAddInfoNames.map((name) => ({
      title: name,
      key: `addinfo-${name}`,
      render: (_: any, row: any) =>
        row.addInfos?.find((a: any) => a.name === name)?.value ?? "-",
    })),
    ...(isUpdate
      ? [
          {
            title: "",
            key: "action",
            width: 90,
            render: (_: any, row: any) => (
              <Button
                icon={<EditOutlined />}
                onClick={() => {
                  setAdjustRow(row);
                  adjustForm.setFieldsValue({
                    planQty: row.poQty,
                    description: "",
                  });
                }}
              >
                {t("adjustQty")}
              </Button>
            ),
          },
        ]
      : []),
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
      className: styles["tabular-nums"],
      render: (v: number | null) =>
        v == null ? "-" : `${v} ${t("history.minutes")}`,
    },
    {
      title: t("history.createdBy"),
      dataIndex: "createdBy",
      key: "createdBy",
    },
  ].map((c) => ({ ...c, align: "left" as const }));

  const historyRows = [...(history ?? [])].sort((a: any, b: any) =>
    (b.date ?? "").localeCompare(a.date ?? ""),
  );

  /* Filter material utk search by + keyword (pola qi-form / detail incoming). */
  const matNeedle = matSearch.trim().toLowerCase();
  const matFiltered = matNeedle
    ? (header?.details ?? []).filter((d: any) =>
        String(d[matSearchBy] ?? "")
          .toLowerCase()
          .includes(matNeedle),
      )
    : (header?.details ?? []);

  const infoFields = [
    { label: t("deliveryNoteNo"), value: header?.deliveryNoteNo },
    { label: t("poNo"), value: header?.poNo },
    { label: t("poType"), value: header?.poType ?? "-" },
    { label: t("poDate"), value: toDate(header?.poDate ?? null) },
    {
      label: t("outgoingDate"),
      value: toDate(header?.outgoingDate ?? null),
    },
    {
      label: t("customerDestination"),
      value: header?.customerDestination ?? "-",
    },
    { label: t("referenceNo"), value: header?.referenceNo ?? "-" },
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
      <Card title={t("informationTitle")}>
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
              <Form.Item label={t("description")}>
                <AntdInput.TextArea
                  disabled
                  autoSize={{ minRows: 1, maxRows: 4 }}
                  value={header?.description ?? "-"}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label={t("status")}>
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

      <Card title={t("materialTitle")}>
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
              id="dn-detail-material"
              searchBy={matSearchBy}
              onSearchBy={(value) => {
                setMatSearchBy(value);
                setMatSearch("");
                setMatPage(1);
              }}
              placeholder={t("searchPlaceholder")}
              onSearchValue={(v) => {
                setMatSearch(v);
                setMatPage(1);
              }}
              options={["materialCode", "materialName", "materialBrand"].map(
                (k) => ({ value: k, label: t(k) }),
              )}
            />
          }
        />
      </Card>

      <Card title={t("historyTitle")}>
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

      <Modal
        open={!!adjustRow}
        title={t("adjustQtyTitle", { code: adjustRow?.materialCode ?? "" })}
        okText={t("save")}
        cancelText={t("cancel")}
        confirmLoading={adjustLoading}
        onOk={submitAdjust}
        onCancel={() => {
          setAdjustRow(null);
          adjustForm.resetFields();
        }}
      >
        <Form form={adjustForm} layout="vertical">
          <Form.Item
            label={t("newQty")}
            name="planQty"
            rules={[
              {
                required: true,
                message: t("qtyRequired"),
              },
            ]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label={t("reason")}
            name="description"
            rules={[{ required: true, message: t("reasonRequired") }]}
          >
            <AntdInput.TextArea
              autoSize={{ minRows: 2, maxRows: 4 }}
              placeholder={t("reasonPlaceholder")}
            />
          </Form.Item>
          <p style={{ opacity: 0.65, marginBottom: 0 }}>{tc("warning")}</p>
        </Form>
      </Modal>
    </Space>
  );
};

export default DnDetailPage;
