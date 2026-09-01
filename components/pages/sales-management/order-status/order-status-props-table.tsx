/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BranchesOutlined,
  CloseOutlined,
  EyeOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
import Button from "@sera-components/button";
import StatusTag from "@sera-components/status-tag";
import { BusinessArea } from "@sera-types/business-area.type";
import { OrderStatusRecord } from "@sera-types/order-status.type";
import { ROUTE } from "@sera-utils/constants/routes";
import useCheckPermission from "@sera-utils/hooks/useCheckPermission";
import PermissionUtils from "@sera-utils/permission-utils";
import Utils from "@sera-utils/utils";
import { Col, Row } from "antd";
import { camelCase } from "lodash";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const menuBranch: any = PermissionUtils().getAccessMenuPermission(
  ROUTE.SALES_MANAGEMENT.SHIPMENT_STATUS,
);

const DISABLED_STATUS = [
  "Cancelled",
  "Rejected",
  "Done",
  "Completed",
  "Unloading",
  "Document Submission",
];

export const actionOrderStatus = {
  isCreate: menuBranch?.data?.isCreate || false,
  isUpdate: menuBranch?.data?.isUpdate || false,
  isDelete: menuBranch?.data?.isDelete || false,
};

export const SearchByOptions = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "orderStatus.table.options",
  });

  return [
    { label: t("0"), value: "branchName" },
    { label: t("1"), value: "shipmentNo" },
    { label: t("2"), value: "bookingOrderNo" },
    { label: t("3"), value: "origin" },
    { label: t("4"), value: "destination" },
    { label: t("5"), value: "salesDealing" },
    { label: t("6"), value: "salesServicing" },
  ];
};

export const Columns = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "orderStatus.table",
  });
  const { isRead, isUpdate } = useCheckPermission({
    menuLink: ROUTE.SALES_MANAGEMENT.SHIPMENT_STATUS,
  });
  const { intlNumberFormatter } = Utils();
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
      title: t("column.shipmentNo"),
      dataIndex: "shipmentNo",
      key: "shipmentNo",
      // sorter: true,
      truncate: true,
      fixed: "left",
    },
    {
      title: t("column.status"),
      dataIndex: "status",
      key: "status",
      align: "center",
      fixed: "left",
      render: (text: string) => (
        <StatusTag value={text} fallback="blue" block />
      ),
    },
    {
      title: t("column.bookingOrderNo"),
      dataIndex: "bookingOrderNo",
      key: "bookingOrderNo",
      width: 160,
      truncate: true,
    },
    {
      title: t("column.customerName"),
      dataIndex: "customerName",
      key: "customerName",
      align: "left",
      width: 160,
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
      align: "left",
      truncate: true,
    },
    {
      title: t("column.origin"),
      dataIndex: "origin",
      key: "origin",
      align: "left",
      width: 120,
      truncate: true,
    },
    {
      title: t("column.detailOrigin"),
      dataIndex: "detailOrigin",
      key: "detailOrigin",
      align: "left",
      width: 160,
      exclude: true,
      render: (_: never, record: OrderStatusRecord) =>
        record?.detailOrigin?.address || "-",
    },
    {
      title: t("column.destination"),
      dataIndex: "destination",
      key: "destination",
      align: "left",
      width: 120,
      truncate: true,
    },
    {
      title: t("column.detailDestination"),
      dataIndex: "detailDestination",
      key: "detailDestination",
      align: "left",
      width: 160,
      exclude: true,
      render: (_: never, record: OrderStatusRecord) =>
        record?.detailDestination?.address || "-",
    },
    {
      title: t("column.revenue"),
      dataIndex: "revenue",
      key: "revenue",
      align: "left",
      render: (text: number) => intlNumberFormatter.format(text),
    },
    {
      title: t("column.soNumber"),
      dataIndex: "soNumber",
      key: "soNumber",
      align: "left",
      truncate: true,
    },
    {
      title: t("column.branchName"),
      dataIndex: "branchName",
      key: "branchName",
      align: "left",
      width: 120,
      truncate: true,
      exclude: true,
    },
    {
      title: t("column.salesDealing"),
      dataIndex: "salesDealing",
      key: "salesDealing",
      align: "left",
      truncate: true,
      exclude: true,
    },
    {
      title: t("column.salesServicing"),
      dataIndex: "salesServicing",
      key: "salesServicing",
      align: "left",
      truncate: true,
      exclude: true,
    },
    {
      title: t("column.actions"),
      key: "operation",
      fixed: "right",
      hidden: !isRead && !isUpdate,
      render: (record: OrderStatusRecord) => (
        <Row justify="center" gutter={[8, 0]}>
          {isRead ? (
            <Col>
              <Link
                id="link-detail-driver"
                href={`${ROUTE.SALES_MANAGEMENT.SHIPMENT_STATUS}/${record.id}`}
                passHref
              >
                <Button
                  id="edit-button"
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
                id="link-reschedule-driver"
                href={`${ROUTE.SALES_MANAGEMENT.SHIPMENT_STATUS}/edit/${record.id}?type=reschedule`}
                passHref
              >
                <Button
                  id="reschedule-button"
                  size="small"
                  tooltip={t("button.reschedule.tooltip")}
                  disabled={DISABLED_STATUS.includes(record.status)}
                  type="link"
                  icon={<ScheduleOutlined />}
                />
              </Link>
            </Col>
          ) : null}
          {isUpdate ? (
            <Col>
              <Link
                id="link-reroute-driver"
                href={`${ROUTE.SALES_MANAGEMENT.SHIPMENT_STATUS}/edit/${record.id}?type=reroute`}
                passHref
              >
                <Button
                  id="reroute-button"
                  size="small"
                  tooltip={t("button.reroute.tooltip")}
                  disabled={DISABLED_STATUS.includes(record.status)}
                  type="link"
                  icon={<BranchesOutlined />}
                />
              </Link>
            </Col>
          ) : null}
          {isUpdate ? (
            <Col>
              <Link
                id="link-cancel-driver"
                href={`${ROUTE.SALES_MANAGEMENT.SHIPMENT_STATUS}/edit/${record.id}?type=cancel`}
                passHref
              >
                <Button
                  id="cancel-button"
                  size="small"
                  tooltip={t("button.cancel.tooltip")}
                  disabled={DISABLED_STATUS.includes(record.status)}
                  type="link"
                  icon={<CloseOutlined />}
                />
              </Link>
            </Col>
          ) : null}
        </Row>
      ),
    },
  ]?.map((_column) => ({ ..._column, hidden: false }));
};

export const ColumnsShipmentStatus = ({ data }: { data: BusinessArea[] }) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "orderStatus.table",
  });

  const columns = data.map((v) => ({
    title: v.name,
    dataIndex: `${camelCase(v.name)}`,
    key: `${camelCase(v.name)}`,
    align: "center",
  }));

  return [
    {
      title: t("column.category"),
      dataIndex: "category",
      key: "category",
      truncate: true,
      align: "left",
      fixed: "left",
    },
    ...columns,
  ];
};

export const ColumnRoute = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "orderStatus.editForm.summaryRouteLocation.table",
  });

  return [
    {
      title: t("column.type"),
      dataIndex: "type",
      key: "type",
      align: "left",
      truncate: true,
    },
    {
      title: t("column.location"),
      dataIndex: "location",
      key: "location",
      align: "left",
      truncate: true,
    },
    {
      title: t("column.address"),
      dataIndex: "address",
      key: "address",
      align: "left",
      truncate: true,
    },
  ];
};
