/* eslint-disable @typescript-eslint/no-explicit-any */
import OutstandingOutgoingApi from "@sera-libraries/api/outstanding-outgoing";
import { Modal, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  packagingNo: string | null;
  onClose: () => void;
}

/** Popup PO/detil pembentuk packaging (Q5 — parity modalPOByPackagingNo). */
const PoByPackagingModal = ({ packagingNo, onClose }: Props) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "planOutgoing.outstandingOutgoing.poPopup",
  });
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (packagingNo) {
      setLoading(true);
      OutstandingOutgoingApi()
        .retrievePosByPackaging(packagingNo)
        .then((data: any) => setRows(data ?? []))
        .finally(() => setLoading(false));
    }
  }, [packagingNo]);

  const columns = [
    { title: t("deliveryNoteNo"), dataIndex: "deliveryNoteNo" },
    {
      title: t("customerDestination"),
      dataIndex: "customerDestination",
      truncate: true,
    },
    { title: t("materialCode"), dataIndex: "materialCode" },
    { title: t("materialName"), dataIndex: "materialName", truncate: true },
    { title: t("materialBrand"), dataIndex: "materialBrand" },
    {
      title: t("pickingQty"),
      dataIndex: "pickingQty",
      width: 100,
      align: "right" as const,
    },
    { title: t("uom"), dataIndex: "uom", width: 70 },
  ];

  return (
    <Modal
      open={!!packagingNo}
      onCancel={onClose}
      width={900}
      title={`${t("title")} — ${packagingNo ?? ""}`}
      footer={null}
    >
      <Table
        size="small"
        rowKey={(r) => `${r.deliveryNoteNo}-${r.materialCode}`}
        loading={loading}
        dataSource={rows}
        columns={columns}
        pagination={false}
      />
    </Modal>
  );
};

export default PoByPackagingModal;
