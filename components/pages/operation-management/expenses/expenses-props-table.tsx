/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EyeOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import { EditOutlined } from "@sera-components/icons";
import StatusTag from "@sera-components/status-tag";
import { ExpensesRecord } from "@sera-types/expenses.type";
import { NUMBER_FORMAT } from "@sera-utils/constants/common";
import { ROUTE } from "@sera-utils/constants/routes";
import FormatUtils from "@sera-utils/format";
import useCheckPermission from "@sera-utils/hooks/useCheckPermission";
import PermissionUtils from "@sera-utils/permission-utils";
import { Col, Row } from "antd";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const menuBranch: any = PermissionUtils().getAccessMenuPermission(
  ROUTE.OPERATION_MANAGEMENT.EXPENSES,
);

export const actionExpenses = {
  isCreate: menuBranch?.data?.isCreate || false,
  isUpdate: menuBranch?.data?.isUpdate || false,
  isDelete: menuBranch?.data?.isDelete || false,
};

export const SearchByOptions = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "expenses.table.options",
  });

  return [
    { label: t("0"), value: "customerName" },
    { label: t("1"), value: "routeCode" },
    { label: t("2"), value: "jmpCode" },
    { label: t("4"), value: "origin" },
    { label: t("5"), value: "destination" },
  ];
};

export const Columns = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "expenses.table",
  });

  const { isRead, isUpdate } = useCheckPermission({
    menuLink: ROUTE.OPERATION_MANAGEMENT.EXPENSES,
  });

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
      align: "center",
      fixed: "left",
      render: (val: string) => <StatusTag block value={val} />,
    },
    {
      title: t("column.branch"),
      dataIndex: "branch",
      key: "branch",
      truncate: true,
      align: "left",
      fixed: "left",
    },
    {
      title: t("column.routeCode"),
      dataIndex: "routeCode",
      key: "routeCode",
      width: 200,
      truncate: true,
    },
    {
      title: t("column.jmpCode"),
      dataIndex: "jmpCode",
      key: "jmpCode",
      truncate: true,
      align: "left",
      exclude: true,
    },
    {
      title: t("column.cmdId"),
      dataIndex: "cmdId",
      key: "cmdId",
      truncate: true,
      align: "center",
      exclude: true,
    },
    {
      title: t("column.customerName"),
      dataIndex: "customerName",
      key: "customerName",
      truncate: true,
    },
    {
      title: t("column.revenue"),
      dataIndex: "revenue",
      key: "revenue",
      truncate: true,
      render: (val: number) => FormatUtils().formatCurrency(val || 0),
    },
    {
      title: t("column.totalExpense"),
      dataIndex: "totalExpense",
      key: "totalExpense",
      truncate: true,
      render: (val: number) => FormatUtils().formatCurrency(val || 0),
    },
    {
      title: t("column.expenseRatio"),
      dataIndex: "expenseRatio",
      key: "expenseRatio",
      truncate: true,
      render: (val: number) => `${NUMBER_FORMAT(val ?? 0)}%`,
    },
    {
      title: t("column.unitType"),
      dataIndex: "unitType",
      key: "unitType",
      truncate: true,
    },
    {
      title: t("column.origin"),
      dataIndex: "origin",
      key: "origin",
      truncate: true,
      align: "left",
    },
    {
      title: t("column.destination"),
      dataIndex: "destination",
      key: "destination",
      truncate: true,
      align: "left",
    },
    {
      title: t("column.tollUsageName"),
      dataIndex: "tollUsageName",
      key: "tollUsageName",
      truncate: true,
      align: "center",
    },
    {
      title: t("column.totalDriver"),
      dataIndex: "totalDriver",
      key: "totalDriver",
      truncate: true,
      align: "center",
    },
    {
      title: t("column.shipmentType"),
      dataIndex: "shipmentType",
      key: "shipmentType",
      truncate: true,
      align: "center",
    },
    {
      title: t("column.leadTime"),
      dataIndex: "leadtime",
      key: "leadtime",
      truncate: true,
      align: "center",
      exclude: true,
    },
    {
      title: t("column.totalDistance"),
      dataIndex: "totalDistance",
      key: "totalDistance",
      truncate: true,
      align: "center",
      exclude: true,
    },
    {
      title: t("column.action"),
      key: "operation",
      fixed: "right",
      hidden: !isRead && !isUpdate,
      render: (record: ExpensesRecord) => (
        <Row justify="center" gutter={[8, 0]}>
          {isRead ? (
            <Col>
              <Link
                id="link-detail-expenses"
                href={`${ROUTE.OPERATION_MANAGEMENT.EXPENSES}/${record.id}`}
                passHref
              >
                <Button
                  id="button-expenses"
                  size="small"
                  tooltip={t("button.detail.tooltip")}
                  type="link"
                  icon={<EyeOutlined />}
                />
              </Link>
            </Col>
          ) : null}
          {isUpdate ? (
            <Col>
              <Link
                id="link-edit-expenses"
                href={`${ROUTE.OPERATION_MANAGEMENT.EXPENSES}/edit/${record.id}`}
                passHref
              >
                <Button
                  id="button-expenses"
                  size="small"
                  tooltip={t("button.edit.tooltip")}
                  type="link"
                  icon={<EditOutlined />}
                />
              </Link>
            </Col>
          ) : null}
        </Row>
      ),
    },
  ]?.map((_column) => ({ ..._column, hidden: false }));
};

export const SHIPMENT_TYPE_OPTIONS = [
  {
    label: "Dedicated",
    value: "Dedicated",
  },
  {
    label: "Ritase",
    value: "Ritase",
  },
];
