/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EyeOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import StatusTag from "@sera-components/status-tag";
import { AdditionalExpenseRecord } from "@sera-types/additional-expense.type";
// import { ApprovalExpenseRecord } from "@sera-types/approval-expense.type";
import { ROUTE } from "@sera-utils/constants/routes";
import FormatUtils from "@sera-utils/format";
import useCheckPermission from "@sera-utils/hooks/useCheckPermission";
import PermissionUtils from "@sera-utils/permission-utils";
import { Col, Grid, Row, TagProps } from "antd";
import dayjs from "dayjs";
import Link from "next/link";
// import Link from "next/link";
import { useTranslation } from "react-i18next";

const menuBranch: any = PermissionUtils().getAccessMenuPermission(
  ROUTE.APPROVALS.ADDITIONAL_EXPENSE,
);

export const actionAdditionalExpense = {
  isCreate: menuBranch?.data?.isCreate || false,
  isUpdate: menuBranch?.data?.isUpdate || false,
  isDelete: menuBranch?.data?.isDelete || false,
};

export const ADDITIONAL_EXPENSE_STATUS: {
  label: string;
  color: TagProps["color"];
}[] = [
  { label: "Approved", color: "success" },
  { label: "Rejected", color: "orange" },
  { label: "Waiting For Approval", color: "blue" },
];

export const SearchByOptions = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "additionalExpense.table.options",
  });

  return [
    { label: t("0"), value: "shipmentNo" },
    { label: t("1"), value: "roleName" },
    { label: t("2"), value: "customerName" },
    { label: t("3"), value: "status" },
  ];
};

export const Columns = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "additionalExpense.table",
  });

  const { isRead } = useCheckPermission({
    menuLink: ROUTE.APPROVALS.ADDITIONAL_EXPENSE,
  });

  const { xl } = Grid.useBreakpoint();

  // release fixed column when large breakpoints are not met
  const leftFixed = xl ? "left" : undefined;
  const rightFixed = xl ? "right" : undefined;

  return [
    {
      title: "No",
      key: "no",
      render: (_: never, record: any) => (
        <Row justify="center">
          <Col>{record.no}</Col>
        </Row>
      ),
      fixed: "left",
      exception: true,
    },
    {
      title: t("column.status"),
      dataIndex: "status",
      key: "status",
      truncate: true,
      fixed: "left",
      align: "center",
      render: (status: string) => {
        if (!status) return "-";
        const { label, color } =
          ADDITIONAL_EXPENSE_STATUS.find((o) => o.label === status) || {};
        return (
          <StatusTag
            value={label ?? status ?? ""}
            fallback={color ?? ""}
            block
          />
        );
      },
    },
    {
      title: t("column.roleName"),
      dataIndex: "roleName",
      key: "roleName",
      truncate: true,
      fixed: leftFixed,
    },
    {
      title: t("column.shipmentNo"),
      dataIndex: "shipmentNo",
      key: "shipmentNo",
      truncate: true,
      fixed: leftFixed,
    },
    {
      title: t("column.createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      truncate: true,
      align: "center",
    },
    {
      title: t("column.bookingOrderNo"),
      dataIndex: "bookingOrderNo",
      key: "bookingOrderNo",
      truncate: true,
    },
    {
      title: t("column.branchName"),
      dataIndex: "branchName",
      key: "branchName",
      truncate: true,
    },
    {
      title: t("column.startJourneyDate"),
      dataIndex: "startJourneyDate",
      key: "startJourneyDate",
      truncate: true,
      align: "center",
      render: (date: string) =>
        date ? dayjs(date).format("YYYY-MM-DD HH:mm") : "-",
    },
    {
      title: t("column.customerName"),
      dataIndex: "customerName",
      key: "customerName",
      truncate: true,
    },
    {
      title: t("column.shipmentType"),
      dataIndex: "shipmentType",
      key: "shipmentType",
      truncate: true,
    },
    {
      title: t("column.unitType"),
      dataIndex: "unitType",
      key: "unitType",
      truncate: true,
    },
    {
      title: t("column.originName"),
      dataIndex: "originName",
      key: "originName",
      truncate: true,
    },
    {
      title: t("column.destinationName"),
      dataIndex: "destinationName",
      key: "destinationName",
      truncate: true,
    },
    {
      title: t("column.licensePlate"),
      dataIndex: "licensePlate",
      key: "licensePlate",
      truncate: true,
    },
    {
      title: t("column.driver1Name"),
      dataIndex: "driver1Name",
      key: "driver1Name",
      truncate: true,
    },
    {
      title: t("column.driver2Name"),
      dataIndex: "driver2Name",
      key: "driver2Name",
      truncate: true,
    },
    {
      title: t("column.totalExpense"),
      dataIndex: "totalExpense",
      key: "totalExpense",
      truncate: true,
      fixed: rightFixed,
      render: (val: number) => FormatUtils().formatCurrency(val || 0),
    },
    {
      title: t("column.action"),
      key: "operation",
      fixed: "right",
      hidden: !isRead,
      render: (_: never, record: AdditionalExpenseRecord) => (
        <Row justify="center" gutter={[8, 0]}>
          {isRead ? (
            <Col>
              <Link
                id="link-detail-additional-expense"
                href={`${ROUTE.APPROVALS.ADDITIONAL_EXPENSE}/${record.shipmentId}?shipmentExpenseId=${record.referenceValue}&status=${record.status}&role=${encodeURIComponent(record.roleName)}`}
                passHref
              >
                <Button
                  id="button-detail-additional-expense"
                  size="small"
                  tooltip={t("button.detail.tooltip")}
                  type="link"
                  icon={<EyeOutlined />}
                />
              </Link>
            </Col>
          ) : null}
        </Row>
      ),
    },
  ]?.map((_column) => ({ ..._column, hidden: false }));
};

export const ColumnsSummaryRoute = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "additionalExpense.table",
  });

  return [
    {
      title: t("summaryColumn.type"),
      dataIndex: "type",
      key: "type",
      truncate: true,
      align: "left",
    },
    {
      title: t("summaryColumn.location"),
      dataIndex: "location",
      key: "location",
      truncate: true,
    },
    {
      title: t("summaryColumn.address"),
      dataIndex: "address",
      key: "address",
      truncate: true,
    },
    {
      title: t("summaryColumn.province"),
      dataIndex: "province",
      key: "province",
      truncate: true,
    },
    {
      title: t("summaryColumn.city"),
      dataIndex: "city",
      key: "city",
      truncate: true,
    },
    {
      title: t("summaryColumn.district"),
      dataIndex: "district",
      key: "district",
      truncate: true,
    },
    {
      title: t("summaryColumn.area"),
      dataIndex: "area",
      key: "area",
      truncate: true,
      align: "left",
    },
  ];
};

export const ColumnExpensesDetailDriver = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "additionalExpense.table",
  });

  return [
    {
      title: t("driverColumn.no"),
      dataIndex: "no",
      key: "no",
      truncate: true,
      align: "center",
    },
    {
      title: t("driverColumn.termin"),
      dataIndex: "termin",
      key: "termin",
      truncate: true,
    },
    {
      title: t("driverColumn.umNumber"),
      dataIndex: "umNumber",
      key: "umNumber",
      truncate: true,
    },
    {
      title: t("driverColumn.bphNumber"),
      dataIndex: "bphNumber",
      key: "bphNumber",
      truncate: true,
    },
    {
      title: t("driverColumn.transferredDate"),
      dataIndex: "transferredDate",
      key: "transferredDate",
      truncate: true,
      render: (date: string) =>
        date ? dayjs(date).format("YYYY-MM-DD HH:mm") : "-",
    },
    {
      title: t("driverColumn.amount"),
      dataIndex: "amount",
      key: "amount",
      truncate: true,
      render: (val: number) => FormatUtils().formatCurrency(val || 0),
    },
    {
      title: t("driverColumn.referenceNumber"),
      dataIndex: "referenceNumber",
      key: "referenceNumber",
      truncate: true,
    },
    {
      title: t("driverColumn.status"),
      dataIndex: "status",
      key: "status",
      truncate: true,
      align: "center",
      render: (text: string) => (text ? <StatusTag value={text} block /> : "-"),
    },
    {
      title: t("driverColumn.note"),
      dataIndex: "note",
      key: "note",
      align: "left",
      truncate: true,
    },
    {
      title: t("driverColumn.approvalNote"),
      dataIndex: "approvalNote",
      key: "approvalNote",
      align: "left",
      truncate: true,
    },
  ];
};

export const ColumnsAuditTrail = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "additionalExpense.table",
  });

  return [
    {
      title: t("auditTrailColumn.no"),
      dataIndex: "no",
      key: "no",
      truncate: true,
      align: "center",
    },
    {
      title: t("auditTrailColumn.status"),
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 120,
      render: (text: string) => (text ? <StatusTag value={text} block /> : "-"),
    },
    {
      title: t("auditTrailColumn.createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      truncate: true,
    },
    {
      title: t("auditTrailColumn.createdByName"),
      dataIndex: "createdByName",
      key: "createdByName",
      align: "center",
      truncate: true,
    },
  ];
};
