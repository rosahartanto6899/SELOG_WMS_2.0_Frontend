/* eslint-disable @typescript-eslint/no-explicit-any */
import { EyeOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import StatusTag from "@sera-components/status-tag";
import FormatUtils from "@sera-utils/format";
import { useTranslation } from "react-i18next";

/** Kolom tabel Actual Outgoing (Q1) — parity legacy ActualOutgoing.js L239+.
 *  Kolom penting sorter server-side (whitelist ACTUAL_LIST_ORDER_WHITELIST).
 *  DN/status/addInfo pindah ke action column (eye icon → detail page). */
export const ActualOutgoingColumns = (handlers: {
  onView: (id: string) => void;
}) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "planOutgoing.actualOutgoing.column",
  });
  const toDate = (v?: string | null) =>
    v ? FormatUtils().dateTimeTransform(v) : "-";

  return [
    {
      title: t("deliveryNoteNo"),
      dataIndex: "deliveryNoteNo",
      key: "deliveryNoteNo",
      sorter: true,
    },
    {
      title: t("outgoingDate"),
      dataIndex: "outgoingDate",
      key: "outgoingDate",
      sorter: true,
      render: (v: string | null) => toDate(v),
    },
    { title: t("poNo"), dataIndex: "poNo", key: "poNo", sorter: true },
    {
      title: t("poType"),
      dataIndex: "poType",
      key: "poType",
      render: (v: string | null) => v ?? "-",
    },
    {
      title: t("poDate"),
      dataIndex: "poDate",
      key: "poDate",
      sorter: true,
      render: (v: string | null) => toDate(v),
    },
    {
      title: t("customerDestination"),
      dataIndex: "customerDestination",
      key: "customerDestination",
      render: (v: string | null) => v ?? "-",
    },
    {
      title: t("description"),
      dataIndex: "description",
      key: "description",
      render: (v: string | null) => v ?? "-",
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      sorter: true,
      render: (v: string | null) =>
        v ? <StatusTag value={v} fallback="default" /> : "-",
    },
    {
      title: t("createdDate"),
      dataIndex: "createdDate",
      key: "createdDate",
      sorter: true,
      render: (v: string | null) => toDate(v),
    },
    { title: t("createdBy"), dataIndex: "createdBy", key: "createdBy" },
    {
      title: "",
      key: "action",
      width: 60,
      align: "center" as const,
      render: (_: any, r: any) => (
        <Button
          size="small"
          type="text"
          icon={<EyeOutlined />}
          onClick={() => handlers.onView(r.id)}
        />
      ),
    },
  ].map((c) => ({ ...c, align: "left" as const }));
};

/** searchBy options — t sebagai PARAM (rules-of-hooks, parity 004 fix) */
export const ActualOutgoingSearchByOptions = (t: any) => [
  { label: t("0"), value: "deliveryNoteNo" },
  { label: t("1"), value: "poNo" },
  { label: t("2"), value: "customerDestination" },
  { label: t("3"), value: "referenceNo" },
  { label: t("4"), value: "description" },
  { label: t("5"), value: "status" },
];

/** StatusTag re-export utk konsistensi import */
export { StatusTag };
