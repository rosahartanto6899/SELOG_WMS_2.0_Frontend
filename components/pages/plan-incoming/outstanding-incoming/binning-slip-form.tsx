/* eslint-disable @typescript-eslint/no-explicit-any */
import OutstandingIncomingApi from "@sera-libraries/api/outstanding-incoming";
import { BinningSlipRow } from "@sera-types/outstanding-incoming.type";
import { Button, Modal, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  headerId: string | null;
  onClose: () => void;
}

/** binning slip print data (columns parity with PrintBinningListDto). */
const BinningSlipForm = (props: Props) => {
  const { open, headerId, onClose } = props;
  const { t } = useTranslation(undefined, {
    keyPrefix: "planIncoming.outstandingIncoming.slip",
  });
  const [rows, setRows] = useState<BinningSlipRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && headerId) {
      setLoading(true);
      OutstandingIncomingApi()
        .retrieveBinningSlip(headerId)
        .then((data) => setRows(data ?? []))
        .finally(() => setLoading(false));
    }
  }, [open, headerId]);

  const columns = [
    { title: t("materialCode"), dataIndex: "materialCode" },
    { title: t("materialName"), dataIndex: "materialName" },
    { title: t("qty"), dataIndex: "qty", width: 60 },
    { title: t("satuan"), dataIndex: "satuan", width: 80 },
    { title: t("loc"), dataIndex: "loc", width: 110 },
    { title: t("remark"), dataIndex: "remark", width: 90 },
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={800}
      title={t("title")}
      footer={[
        <Button key="print" type="primary" onClick={() => window.print()}>
          {t("print")}
        </Button>,
      ]}
    >
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

export default BinningSlipForm;
