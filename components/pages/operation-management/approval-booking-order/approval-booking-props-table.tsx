/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EyeOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import Input from "@sera-components/input";
import StatusTag from "@sera-components/status-tag";
import { ApprovalBookingRecord } from "@sera-types/approval-booking-order.type";
import { NUMBER_FORMAT } from "@sera-utils/constants/common";
import { ROUTE } from "@sera-utils/constants/routes";
import useCheckPermission from "@sera-utils/hooks/useCheckPermission";
import PermissionUtils from "@sera-utils/permission-utils";
import { Col, Grid, Row } from "antd";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const menuBranch: any = PermissionUtils().getAccessMenuPermission(
  ROUTE.OPERATION_MANAGEMENT.APPROVAL_BOOKING_ORDER,
);

export const actionApprovalBookingOrder = {
  isCreate: menuBranch?.data?.isCreate || false,
  isUpdate: menuBranch?.data?.isUpdate || false,
  isDelete: menuBranch?.data?.isDelete || false,
};

export const SearchByOptions = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "approvalBookingOrder.table.options",
  });

  return [
    { label: t("0"), value: "bookingCode" },
    { label: t("1"), value: "customerName" },
    { label: t("2"), value: "confirmationStatus" },
  ];
};

export const Columns = (
  onModal?: (record: ApprovalBookingRecord, input: string) => void,
) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "approvalBookingOrder.table",
  });
  const { lg } = Grid.useBreakpoint();

  // release fixed column when large breakpoints are not met
  const leftFixed = lg ? "left" : undefined;
  const rightFixed = lg ? "right" : undefined;

  const { isRead } = useCheckPermission({
    menuLink: ROUTE.OPERATION_MANAGEMENT.APPROVAL_BOOKING_ORDER,
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
      title: t("column.createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: true,
      truncate: true,
      exclude: true,
      fixed: leftFixed,
    },
    {
      title: t("column.createdBy"),
      dataIndex: "createdBy",
      key: "createdBy",
      truncate: true,
      exclude: true,
      fixed: leftFixed,
    },
    {
      title: t("column.bookingCode"),
      dataIndex: "bookingCode",
      key: "bookingCode",
      truncate: true,
      fixed: "left",
    },
    {
      title: t("column.confirmationStatus"),
      dataIndex: "confirmationStatus",
      key: "confirmationStatus",
      truncate: true,
      fixed: leftFixed,
      align: "center",
      render: (text: string) => <StatusTag value={text} block />,
    },
    {
      title: t("column.pickupDate"),
      dataIndex: "pickupDate",
      key: "pickupDate",
      align: "left",
      sorter: true,
      truncate: true,
    },
    {
      title: t("column.customerName"),
      dataIndex: "customerName",
      key: "customerName",
      align: "left",
      truncate: true,
    },
    {
      title: t("column.branchName"),
      dataIndex: "branchName",
      key: "branchName",
      align: "left",
      truncate: true,
    },
    {
      title: t("column.unitType"),
      dataIndex: "unitType",
      key: "unitType",
      align: "left",
      truncate: true,
    },
    {
      title: t("column.origin"),
      dataIndex: "origin",
      key: "origin",
      align: "left",
      truncate: true,
    },
    {
      title: t("column.destination"),
      dataIndex: "destination",
      key: "destination",
      align: "left",
      truncate: true,
    },
    {
      title: t("column.notes"),
      dataIndex: "notes",
      key: "notes",
      truncate: true,
      align: "center",
    },
    {
      title: t("column.confirmedAt"),
      dataIndex: "confirmedAt",
      key: "confirmedAt",
      truncate: true,
      align: "center",
    },
    {
      title: t("column.confirmedBy"),
      dataIndex: "confirmedBy",
      key: "confirmedBy",
      truncate: true,
      align: "center",
    },
    {
      title: t("column.qtyUnit"),
      dataIndex: "qtyUnit",
      key: "qtyUnit",
      fixed: rightFixed,
      align: "center",
      render: (text: number) => NUMBER_FORMAT(text),
    },
    {
      title: t("column.fulfill"),
      dataIndex: "fulfill",
      key: "fulfill",
      fixed: "right",
      align: "center",
      render: (text: number, record: ApprovalBookingRecord) => {
        const isCancelled = record?.confirmationStatus === "Cancelled";
        return (
          <Input
            disabled={isCancelled}
            onlyNumber
            min={0}
            placeholder={`${record.fulfill || 0}`}
            defaultValue={text}
            style={{
              width: "5rem",
              textAlign: "center",
              borderRadius: 5,
            }}
            onPressEnter={(e) => {
              const inputValue = (e.target as HTMLInputElement).value;
              onModal?.(record, inputValue);
            }}
          />
        );
      },
    },
    {
      title: t("column.unfill"),
      dataIndex: "unfill",
      key: "unfill",
      fixed: rightFixed,
      align: "center",
      render: (text: number) => NUMBER_FORMAT(text),
    },
    {
      title: t("column.action"),
      key: "operation",
      fixed: "right",
      hidden: !isRead,
      render: (record: any) => (
        <Row justify="center" gutter={[8, 0]}>
          {isRead ? (
            <Col>
              <Link
                id="link-detail-approval-booking"
                href={`${ROUTE.OPERATION_MANAGEMENT.APPROVAL_BOOKING_ORDER}/${record.id}`}
                passHref
              >
                <Button
                  id="button-detail-approval-booking"
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

export const CONFIRMATION_STATUS_OPTIONS = [
  {
    label: "Confirmed",
    value: "Confirmed",
  },
  {
    label: "Requested",
    value: "Requested",
  },
  {
    label: "Rejected",
    value: "Rejected",
  },
  {
    label: "Cancelled",
    value: "Cancelled",
  },
];
