/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CloseOutlined, EyeOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import { EditOutlined } from "@sera-components/icons";
import StatusTag from "@sera-components/status-tag";
import { BookingOrderRecord } from "@sera-types/booking-order.type";
import { ROUTE } from "@sera-utils/constants/routes";
import useCheckPermission from "@sera-utils/hooks/useCheckPermission";
import PermissionUtils from "@sera-utils/permission-utils";
import { Col, Row } from "antd";
import { camelCase } from "lodash";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const menuBranch: any = PermissionUtils().getAccessMenuPermission(
  ROUTE.SALES_MANAGEMENT.BOOKING_ORDER,
);

export const actionCustomer = {
  isCreate: menuBranch?.data?.isCreate || false,
  isUpdate: menuBranch?.data?.isUpdate || false,
  isDelete: menuBranch?.data?.isDelete || false,
};

export const SearchByOptions = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "bookingOrder.table.options",
  });

  return [
    { label: t("0"), value: "bookingOrderNo" },
    { label: t("1"), value: "customerName" },
    { label: t("2"), value: "approvalStatus" },
  ];
};

export const Columns = ({
  onDel,
}: {
  onDel?: (record: BookingOrderRecord) => void;
}) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "bookingOrder.table",
  });
  const { isUpdate, isRead, isDelete } = useCheckPermission({
    menuLink: ROUTE.SALES_MANAGEMENT.BOOKING_ORDER,
  });

  const DISABLE_CANCEL_BTN = ["Cancelled", "Confirmed", "Rejected"];

  return [
    {
      title: "No",
      key: "no",
      render: (_: never, record: any) => (
        <Row justify="center">
          <Col>{record.no}</Col>
        </Row>
      ),
      width: 60,
      fixed: "left",
      exception: true,
    },
    {
      title: t("column.createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: true,
      truncate: true,
      fixed: "left",
    },
    {
      title: t("column.createdBy"),
      dataIndex: "createdBy",
      key: "createdBy",
      width: 120,
      truncate: true,
      fixed: "left",
    },
    {
      title: t("column.bookingCode"),
      dataIndex: "bookingCode",
      key: "bookingCode",
      truncate: true,
      fixed: "left",
    },
    {
      title: t("column.approvalStatus"),
      dataIndex: "approvalStatus",
      key: "approvalStatus",
      align: "center",
      fixed: "left",
      render: (_: never, record: BookingOrderRecord) => (
        <StatusTag value={record.approvalStatus} block />
      ),
    },
    {
      title: t("column.pickupDate"),
      dataIndex: "pickupDate",
      key: "pickupDate",
      align: "center",
      truncate: true,
    },
    {
      title: t("column.customerName"),
      dataIndex: "customerName",
      key: "customerName",
      align: "left",
      width: 160,
      truncate: true,
    },
    {
      title: t("column.branchName"),
      dataIndex: "branchName",
      key: "branchName",
      align: "left",
      width: 160,
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
      width: 160,
      truncate: true,
    },
    {
      title: t("column.destination"),
      dataIndex: "destination",
      key: "destination",
      align: "left",
      width: 160,
      truncate: true,
    },
    {
      title: t("column.qtyUnit"),
      dataIndex: "qtyUnit",
      key: "qtyUnit",
      align: "center",
      render: (text: number) => text,
    },
    {
      title: t("column.fulfill"),
      dataIndex: "fulfill",
      key: "fulfill",
      align: "center",
      render: (text: number) => text,
    },
    {
      title: t("column.unfill"),
      dataIndex: "unfill",
      key: "unfill",
      align: "center",
      render: (text: number) => text,
    },
    {
      title: t("column.approvedBy"),
      dataIndex: "approvedBy",
      key: "approvedBy",
      align: "center",
      width: 120,
      truncate: true,
    },
    {
      title: t("column.approvedDate"),
      dataIndex: "approvedDate",
      key: "approvedDate",
      align: "center",
      truncate: true,
    },
    {
      title: t("column.notes"),
      dataIndex: "notes",
      key: "notes",
      align: "center",
      width: 160,
      truncate: true,
    },
    {
      title: t("column.action"),
      key: "operation",
      fixed: "right",
      width: 160,
      hidden: !isUpdate,
      render: (record: BookingOrderRecord) => (
        <Row justify="center" gutter={[8, 0]}>
          {isRead ? (
            <Col>
              <Link
                id="link-edit-driver"
                href={`${ROUTE.SALES_MANAGEMENT.BOOKING_ORDER}/${record.id}${
                  camelCase(record.serviceType) === camelCase("dropBase")
                    ? "?shipmentType=drop"
                    : ""
                }`}
                passHref
              >
                <Button
                  id="read-button"
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
                id="link-edit-driver"
                href={`${ROUTE.SALES_MANAGEMENT.BOOKING_ORDER}/edit/${record.id}${
                  camelCase(record.serviceType) === camelCase("dropBase")
                    ? "?shipmentType=drop"
                    : ""
                }`}
                passHref
              >
                <Button
                  id="edit-button"
                  size="small"
                  disabled={record.approvalStatus !== "Draft"}
                  tooltip={t("button.update.tooltip")}
                  type="link"
                  icon={<EditOutlined />}
                />
              </Link>
            </Col>
          ) : null}
          {isDelete ? (
            <Col>
              <Button
                id="delete-button-booking-order"
                size="small"
                tooltip={t("button.delete.tooltip")}
                type="link"
                disabled={DISABLE_CANCEL_BTN.includes(record.approvalStatus)}
                onClick={() => onDel?.(record)}
                icon={
                  <CloseOutlined
                    style={{
                      color: DISABLE_CANCEL_BTN.includes(record.approvalStatus)
                        ? "gray"
                        : "red",
                    }}
                  />
                }
              />
            </Col>
          ) : null}
        </Row>
      ),
    },
  ]?.map((_column) => ({ ..._column, hidden: false }));
};

export const LicensePlateColumns = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "bookingOrder.table.licensePlate",
  });

  return [
    {
      title: "No",
      key: "no",
      align: "center",
      render: (_: never, record: any) => (
        <Row justify="center">
          <Col>{record.no}</Col>
        </Row>
      ),
      width: 60,
      fixed: "left",
      exception: true,
    },
    {
      title: t("column.licensePlate"),
      dataIndex: "licensePlate",
      key: "licensePlate",
      align: "left",
      width: 120,
      truncate: true,
    },
    {
      title: t("column.vehicleYear"),
      dataIndex: "vehicleYear",
      key: "vehicleYear",
      align: "center",
      width: 120,
      truncate: true,
    },
    {
      title: t("column.planRegMaintenance"),
      dataIndex: "planRegMaintenance",
      key: "planRegMaintenance",
      align: "center",
      width: 180,
      truncate: true,
    },
    {
      title: t("column.licenseExpired"),
      dataIndex: "licenseExpired",
      key: "licenseExpired",
      align: "center",
      width: 120,
      truncate: true,
    },
    {
      title: t("column.kirExpired"),
      dataIndex: "kirExpired",
      key: "kirExpired",
      align: "center",
      width: 120,
      truncate: true,
    },
  ]?.map((_column) => ({ ..._column, hidden: false }));
};

export const DriverColumns = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "bookingOrder.table.driver",
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
      width: 60,
      fixed: "left",
      exception: true,
    },
    {
      title: t("column.driverName"),
      dataIndex: "driverName",
      key: "driverName",
      align: "left",
      width: 160,
      truncate: true,
    },
    {
      title: t("column.driverId"),
      dataIndex: "driverId",
      key: "driverId",
      align: "left",
      truncate: true,
    },
    {
      title: t("column.simType"),
      dataIndex: "simType",
      key: "simType",
      align: "center",
      truncate: true,
    },
    {
      title: t("column.age"),
      dataIndex: "age",
      key: "age",
      align: "center",
      truncate: true,
    },
    {
      title: t("column.phoneNumber"),
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      align: "center",
      truncate: true,
    },
    {
      title: t("column.employeeStatus"),
      dataIndex: "employeeStatus",
      key: "employeeStatus",
      align: "center",
      truncate: true,
    },
    {
      title: t("column.employeeStatus"),
      dataIndex: "employeeStatus",
      key: "employeeStatus",
      align: "center",
      truncate: true,
    },
    {
      title: t("column.resignDate"),
      dataIndex: "resignDate",
      key: "resignDate",
      align: "center",
      truncate: true,
      render: (text: string) => text || "-",
    },
  ]?.map((_column) => ({ ..._column, hidden: false }));
};

export const RouteColumns = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "bookingOrder.table.route",
  });

  return [
    {
      title: t("column.type"),
      dataIndex: "type",
      key: "type",
      align: "left",
      width: 160,
      truncate: true,
    },
    {
      title: t("column.location"),
      dataIndex: "location",
      key: "location",
      align: "left",
      width: 160,
      truncate: true,
    },
    {
      title: t("column.address"),
      dataIndex: "address",
      key: "address",
      align: "left",
      width: 160,
      truncate: true,
    },
  ];
};

export const APPROVAL_STATUS_OPTIONS = [
  {
    label: "Requested",
    value: "Requested",
  },
  {
    label: "Confirmed",
    value: "Confirmed",
  },
  {
    label: "Rejected",
    value: "Rejected",
  },
];
