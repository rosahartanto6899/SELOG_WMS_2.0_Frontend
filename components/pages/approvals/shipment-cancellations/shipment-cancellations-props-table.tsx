/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EyeOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import StatusTag from "@sera-components/status-tag";
import { ShipmentCancellationsRecord } from "@sera-types/shipment-cancellations.type";
import { ROUTE } from "@sera-utils/constants/routes";
import useCheckPermission from "@sera-utils/hooks/useCheckPermission";
import PermissionUtils from "@sera-utils/permission-utils";
import { Col, Grid, Row, TagProps } from "antd";
import dayjs from "dayjs";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const menuBranch: any = PermissionUtils().getAccessMenuPermission(
  ROUTE.APPROVALS.SHIPMENT_CANCELLATIONS,
);

export const actionShipmentCancellations = {
  isCreate: menuBranch?.data?.isCreate || false,
  isUpdate: menuBranch?.data?.isUpdate || false,
  isDelete: menuBranch?.data?.isDelete || false,
};

export const SHIPMENT_CANCELLATIONS_STATUS: {
  label: string;
  color: TagProps["color"];
}[] = [
  { label: "Approved", color: "success" },
  { label: "Rejected", color: "orange" },
  { label: "Waiting For Approval", color: "blue" },
];

export const SearchByOptions = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "shipmentCancellations.table.options",
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
    keyPrefix: "shipmentCancellations.table",
  });

  const { isRead } = useCheckPermission({
    menuLink: ROUTE.APPROVALS.SHIPMENT_CANCELLATIONS,
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
          SHIPMENT_CANCELLATIONS_STATUS.find((o) => o.label === status) || {};
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
      title: t("column.type"),
      dataIndex: "type",
      key: "type",
      fixed: rightFixed,
      render: (text: string, record: ShipmentCancellationsRecord) => {
        if (record.requestType) {
          return record.requestType;
        }

        return text;
      },
    },
    {
      title: t("column.action"),
      key: "operation",
      fixed: "right",
      hidden: !isRead,
      render: (_: never, record: ShipmentCancellationsRecord) => {
        const isResched =
          (record.requestType || record.type).toLowerCase() === "reschedule";
        const isCancel =
          (record.requestType || record.type).toLowerCase() === "cancellation";

        let type;
        switch (true) {
          case isResched:
            type = "reschedule";
            break;
          case isCancel:
            type = "cancel";
            break;
          default:
            type = "reroute";
            break;
        }
        return (
          <Row justify="center" gutter={[8, 0]}>
            {isRead ? (
              <Col>
                <Link
                  id="link-detail-shipment-cancellations"
                  href={`${ROUTE.APPROVALS.SHIPMENT_CANCELLATIONS}/${record.shipmentId}?type=${type}&approvalId=${record.id}&status=${record.status}&role=${encodeURIComponent(record.roleName)}`}
                  passHref
                >
                  <Button
                    id="button-detail-shipment-cancellations"
                    size="small"
                    tooltip={t("button.detail.tooltip")}
                    type="link"
                    icon={<EyeOutlined />}
                  />
                </Link>
              </Col>
            ) : null}
          </Row>
        );
      },
    },
  ]?.map((_column) => ({ ..._column, hidden: false }));
};

export const ColumnsSummaryRoute = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "shipmentCancellations.table",
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

export const ColumnRoute = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix:
      "shipmentCancellations.form.approvalConfirmation.summaryRouteLocation.table",
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
      width: 160,
    },
    {
      title: t("column.address"),
      dataIndex: "address",
      key: "address",
      align: "left",
      truncate: true,
      width: 200,
    },
  ];
};

export const ColumnsApprovalHistory = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "shipmentCancellations.form.approvalHistory.table",
  });

  return [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      align: "center",
      width: 70,
    },
    {
      title: t("column.status"),
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 160,
      render: (text: string) => (text ? <StatusTag value={text} block /> : "-"),
    },
    {
      title: t("column.confirmedDate"),
      dataIndex: "confirmedDate",
      key: "confirmedDate",
      align: "center",
      render: (date: string) =>
        date ? dayjs(date).format("YYYY-MM-DD HH:mm") : "-",
    },
    {
      title: t("column.confirmedByName"),
      dataIndex: "confirmedByName",
      key: "confirmedByName",
    },
    {
      title: t("column.note"),
      dataIndex: "note",
      key: "note",
      align: "left",
    },
  ];
};
