import Button from "@sera-components/button";
import { EditOutlined } from "@sera-components/icons";
import StatusTag from "@sera-components/status-tag";
import { DetailExpensesDetail } from "@sera-types/expense-monitoring";
import { DATE_FORMAT, NUMBER_FORMAT } from "@sera-utils/constants/common";
import { Col, Row } from "antd";
import { useTranslation } from "react-i18next";

interface ColumnsExpenseDetailProps {
  onUpdate: (_record: DetailExpensesDetail) => void;
}

export const ColumnsExpenseDetail = ({
  onUpdate,
}: ColumnsExpenseDetailProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "admExpense.detail.expenseDetail.table.column",
  });

  return [
    {
      key: "no",
      dataIndex: "no",
      title: "No",
      fixed: "left",
      width: 60,
      align: "center",
    },
    {
      key: "termin",
      dataIndex: "termin",
      title: t("termin"),
      render: (_record: string) => `Termin ${_record}`,
    },
    {
      key: "status",
      dataIndex: "status",
      title: t("status"),
      align: "center",
      render: (_record: string) => <StatusTag value={_record} block />,
    },
    {
      key: "umNumber",
      dataIndex: "umNumber",
      title: t("umNumber"),
    },
    {
      key: "bphNumber",
      dataIndex: "bphNumber",
      title: t("bphNumber"),
    },
    {
      key: "transferredDate",
      dataIndex: "transferredDate",
      title: t("transferredDate"),
      render: (_record: string) => DATE_FORMAT(_record),
    },
    {
      key: "amount",
      dataIndex: "amount",
      title: t("amount"),
      render: (_record: string) => `Rp ${NUMBER_FORMAT(_record)}`,
    },
    {
      key: "adminFee",
      dataIndex: "adminFee",
      title: t("adminFee"),
      render: (_record: string) => `Rp ${NUMBER_FORMAT(_record)}`,
    },
    {
      key: "referenceNumber",
      dataIndex: "referenceNumber",
      title: t("referenceNumber"),
    },
    {
      key: "note",
      dataIndex: "note",
      title: t("note"),
    },
    {
      key: "action",
      title: t("action"),
      fixed: "right",
      exception: true,
      render: (_record: DetailExpensesDetail) => (
        <Row justify="center" gutter={[8, 4]}>
          <Col>
            <Button
              id="edit-button"
              size="small"
              tooltip={t("button.update.tooltip")}
              type="link"
              icon={<EditOutlined />}
              onClick={() => onUpdate(_record)}
              disabled={_record?.status === "Success"}
            />
          </Col>
        </Row>
      ),
    },
  ];
};

export const ColumnsAuditTrail = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "admExpense.detail.auditTrail.table.column",
  });

  return [
    {
      key: "no",
      dataIndex: "no",
      title: "No",
      fixed: "left",
      width: 60,
      align: "center",
    },
    {
      key: "status",
      dataIndex: "status",
      title: t("status"),
    },
    {
      key: "createdAt",
      dataIndex: "createdAt",
      title: t("createdAt"),
    },
    {
      key: "createdByName",
      dataIndex: "createdByName",
      title: t("createdByName"),
      align: "left",
    },
  ];
};

export const ColumnsAdditionalExpense = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "admExpense.detail.additionalExpense.table.column",
  });

  return [
    {
      key: "no",
      dataIndex: "no",
      title: "No",
      fixed: "left",
      width: 60,
      align: "center",
    },
    {
      key: "createdAt",
      dataIndex: "createdAt",
      title: t("createdAt"),
    },
    {
      key: "status",
      dataIndex: "status",
      title: t("status"),
      align: "center",
      render: (_record: string) => <StatusTag value={_record} block />,
    },
    {
      key: "fuel",
      dataIndex: "fuel",
      title: t("fuel"),
      render: (_record: string) => `Rp ${NUMBER_FORMAT(_record)}`,
    },
    {
      key: "toll",
      dataIndex: "toll",
      title: t("toll"),
      render: (_record: string) => `Rp ${NUMBER_FORMAT(_record)}`,
    },
    {
      key: "mell",
      dataIndex: "mell",
      title: t("mell"),
      render: (_record: string) => `Rp ${NUMBER_FORMAT(_record)}`,
    },
    {
      key: "loadingUnloading",
      dataIndex: "loadingUnloading",
      title: t("loadingUnloading"),
      render: (_record: string) => `Rp ${NUMBER_FORMAT(_record)}`,
    },
    {
      key: "harborCrossing",
      dataIndex: "harborCrossing",
      title: t("harborCrossing"),
      render: (_record: string) => `Rp ${NUMBER_FORMAT(_record)}`,
    },
    {
      key: "workerContributions",
      dataIndex: "workerContributions",
      title: t("workerContributions"),
      render: (_record: string) => `Rp ${NUMBER_FORMAT(_record)}`,
    },
    {
      key: "security",
      dataIndex: "security",
      title: t("security"),
      render: (_record: string) => `Rp ${NUMBER_FORMAT(_record)}`,
    },
    {
      key: "incentiveKM",
      dataIndex: "incentiveKM",
      title: t("incentiveKM"),
      render: (_record: string) => `Rp ${NUMBER_FORMAT(_record)}`,
    },
    {
      key: "incentiveDaily",
      dataIndex: "incentiveDaily",
      title: t("incentiveDaily"),
      render: (_record: string) => `Rp ${NUMBER_FORMAT(_record)}`,
    },
    {
      key: "incentiveSIO",
      dataIndex: "incentiveSIO",
      title: t("incentiveSIO"),
      render: (_record: string) => `Rp ${NUMBER_FORMAT(_record)}`,
    },
    {
      key: "note",
      dataIndex: "note",
      title: t("note"),
    },
    {
      key: "isBillToCustomer",
      dataIndex: "isBillToCustomer",
      title: t("isBillToCustomer"),
      align: "center",
      render: (_record: boolean) => (
        <StatusTag
          value={t(`isBillToCustomer_value.${_record ? 1 : 0}`)}
          fallback={_record ? "success" : "error"}
        />
      ),
    },
    {
      key: "totalExpense",
      dataIndex: "totalExpense",
      title: t("totalExpense"),
      align: "left",
      fixed: "right",
      render: (_record: string) => `Rp ${NUMBER_FORMAT(_record)}`,
    },
  ];
};
