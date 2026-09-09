/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "@sera-components/button";
import OutstandingOutgoingApi from "@sera-libraries/api/outstanding-outgoing";
import { Modal, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  headerId: string | null;
  onClose: () => void;
}

/** Picking slip print — parity binning-slip-form incoming (modal + window.print,
 *  kolom parity usp_GetPrintDataPickingSlip). */
const PickingSlipForm = ({ open, headerId, onClose }: Props) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "planOutgoing.outstandingOutgoing.slip",
  });
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && headerId) {
      setLoading(true);
      OutstandingOutgoingApi()
        .retrievePickingSlip(headerId)
        .then((data: any) => setRows(data ?? []))
        .finally(() => setLoading(false));
    }
  }, [open, headerId]);

  const first = rows[0];
  const columns = [
    { title: t("materialCode"), dataIndex: "materialCode" },
    { title: t("partNumber"), dataIndex: "partNumber", truncate: true },
    { title: t("brand"), dataIndex: "brand", width: 110 },
    { title: t("qty"), dataIndex: "qty", width: 60, align: "right" as const },
    { title: t("satuan"), dataIndex: "satuan", width: 80 },
    { title: t("loc"), dataIndex: "loc", width: 110 },
    { title: t("remark"), dataIndex: "remark", width: 90 },
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={860}
      title={t("title")}
      footer={[
        <Button key="print" type="primary" onClick={() => window.print()}>
          {t("print")}
        </Button>,
      ]}
    >
      {first && (
        <div style={{ marginBottom: 12, lineHeight: 1.6 }}>
          <strong>{first.customerName}</strong> — {first.warehouseName}
          <br />
          {t("dn")}: {first.id ? "" : ""}
          {rows.length ? `${first.poNo}` : ""} | {t("destination")}:{" "}
          {first.customerDestination ?? "-"} | {t("reference")}:{" "}
          {first.referenceNo ?? "-"}
        </div>
      )}
      <Table
        size="small"
        rowKey={(r) => `${r.id}-${r.materialCode}`}
        loading={loading}
        dataSource={rows}
        columns={columns}
        pagination={false}
      />
    </Modal>
  );
};

export default PickingSlipForm;
