/* eslint-disable @typescript-eslint/no-explicit-any */
import OutstandingOutgoingApi from "@sera-libraries/api/outstanding-outgoing";
import { Modal, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  shipmentNo: string | null;
  onClose: () => void;
}

/** Popup packaging per shipment (Q6 — parity modalPackagingByShipmentNo). */
const PackagingByShipmentModal = ({ shipmentNo, onClose }: Props) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "planOutgoing.outstandingOutgoing.shipmentPopup",
  });
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (shipmentNo) {
      setLoading(true);
      OutstandingOutgoingApi()
        .retrievePackagingsByShipment(shipmentNo)
        .then((data: any) => setRows(data ?? []))
        .finally(() => setLoading(false));
    }
  }, [shipmentNo]);

  const columns = [
    { title: t("packagingNo"), dataIndex: "packagingNo", truncate: true },
    {
      title: t("customerDestination"),
      dataIndex: "customerDestination",
      truncate: true,
    },
    { title: t("materialCode"), dataIndex: "materialCode" },
    { title: t("materialName"), dataIndex: "materialName", truncate: true },
    { title: t("materialBrand"), dataIndex: "materialBrand" },
    { title: t("qty"), dataIndex: "qty", width: 70, align: "right" as const },
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
      width={1000}
      title={`${t("title")} — ${shipmentNo ?? ""}`}
      footer={null}
    >
      <Table
        size="small"
        rowKey={(r) => `${r.packagingNo}-${r.materialCode}`}
        loading={loading}
        dataSource={rows}
        columns={columns}
        pagination={false}
      />
    </Modal>
  );
};

export default PackagingByShipmentModal;
