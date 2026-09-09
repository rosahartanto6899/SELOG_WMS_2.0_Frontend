/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "@sera-components/button";
import { InputNumber, Modal, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  rows: any[]; // baris DN items terpilih
  submitting: boolean;
  onCancel: () => void;
  onSubmit: (packagings: any[]) => void;
}

interface GroupRow {
  key: string;
  materialCode: string;
  materialName: string;
  materialBrand: string;
  uom: string;
  customerDestination: string;
  qty: number; // Σ poQty (agregasi FE parity legacy)
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
}

/** Modal agregasi packaging — kelompok per materialCode|name|brand|destination,
 *  qty dijumlahkan (parity agregasi legacy); input berat (kg) + dimensi. */
const PackagingFormModal = ({
  open,
  rows,
  submitting,
  onCancel,
  onSubmit,
}: Props) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "planOutgoing.outstandingOutgoing.packaging",
  });

  const [groups, setGroups] = useState<GroupRow[]>([]);

  useEffect(() => {
    if (!open) return;
    const acc = new Map<string, GroupRow>();
    for (const r of rows) {
      const key = `${r.materialCode}|${r.materialName}|${r.materialBrand}|${r.customerDestination}`;
      const prev = acc.get(key);
      if (prev) {
        prev.qty += Number(r.poQty ?? 0);
      } else {
        acc.set(key, {
          key,
          materialCode: r.materialCode,
          materialName: r.materialName,
          materialBrand: r.materialBrand,
          uom: r.uom,
          customerDestination: r.customerDestination ?? "",
          qty: Number(r.poQty ?? 0),
          weight: 0,
          length: 0,
          width: 0,
          height: 0,
        });
      }
    }
    setGroups([...acc.values()]);
  }, [open, rows]);

  const patch = (key: string, p: Partial<GroupRow>) =>
    setGroups((prev) => prev.map((g) => (g.key === key ? { ...g, ...p } : g)));

  const columns = [
    { title: t("materialCode"), dataIndex: "materialCode", width: 130 },
    { title: t("materialName"), dataIndex: "materialName", truncate: true },
    { title: t("materialBrand"), dataIndex: "materialBrand", width: 110 },
    { title: t("uom"), dataIndex: "uom", width: 70 },
    { title: t("qty"), dataIndex: "qty", width: 70, align: "right" as const },
    {
      title: t("weight"),
      dataIndex: "weight",
      width: 110,
      render: (v: number, r: GroupRow) => (
        <InputNumber
          size="small"
          min={0}
          style={{ width: "100%" }}
          placeholder="kg"
          value={v}
          onChange={(nv) => patch(r.key, { weight: nv ?? 0 })}
        />
      ),
    },
    {
      title: `${t("length")} × ${t("width")} × ${t("height")}`,
      key: "dims",
      width: 220,
      render: (_: any, r: GroupRow) => (
        <span style={{ display: "inline-flex", gap: 4 }}>
          {(["length", "width", "height"] as const).map((f) => (
            <InputNumber
              key={f}
              size="small"
              min={0}
              style={{ width: 64 }}
              placeholder={t(f)}
              value={r[f]}
              onChange={(nv) => patch(r.key, { [f]: nv ?? 0 } as any)}
            />
          ))}
        </span>
      ),
    },
  ];

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      width={960}
      title={t("modalTitle")}
      footer={[
        <Button
          key="submit"
          type="primary"
          loading={submitting}
          onClick={() => onSubmit(groups)}
        >
          {t("submit")}
        </Button>,
        <Button key="cancel" onClick={onCancel}>
          {t("close")}
        </Button>,
      ]}
    >
      <Table
        size="small"
        rowKey="key"
        dataSource={groups}
        columns={columns as any}
        pagination={false}
      />
    </Modal>
  );
};

export default PackagingFormModal;
