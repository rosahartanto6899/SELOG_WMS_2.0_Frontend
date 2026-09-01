/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EyeOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import { EditOutlined } from "@sera-components/icons";
import StatusTag from "@sera-components/status-tag";
import { IUpdateNotePayload } from "@sera-types/driver-stock.type";
import { BRANCH_ORDER } from "@sera-utils/constants/common";
import { ROUTE } from "@sera-utils/constants/routes";
import useCheckPermission from "@sera-utils/hooks/useCheckPermission";
import PermissionUtils from "@sera-utils/permission-utils";
import { Col, Row, TagProps } from "antd";
import dayjs from "dayjs";
import Link from "next/link";
// import Link from "next/link";
import { useTranslation } from "react-i18next";

import useDriverStock from "./hooks/useDriverStock";

// import useGetPermissionMasterData from "../hooks/useGetPermission";

const menuBranch: any = PermissionUtils().getAccessMenuPermission(
  ROUTE.DRIVER_MANAGEMENT.DRIVER_STOCK,
);

export const DRIVER_STOCK_DEFAULT_UNCHECK = [
  "licenseExpired",
  "endDate",
  "employeeId",
];

export const actionBranch = {
  isCreate: menuBranch?.data?.isCreate || false,
  isUpdate: menuBranch?.data?.isUpdate || false,
  isDelete: menuBranch?.data?.isDelete || false,
};

export const DRIVER_CAPACITY_STATUS_TAG: {
  label: string;
  color: TagProps["color"];
}[] = [
  { label: "Ready", color: "warning" },
  { label: "On Journey", color: "green" },
  { label: "Off", color: "red" },
  { label: "Coaching", color: "purple" },
  { label: "Standby", color: "" },
];

export const SearchByOptions = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "driverStock.table.options",
  });

  return [
    { label: t("0"), value: "driverName" },
    { label: t("1"), value: "employeeStatus" },
    { label: t("2"), value: "licenseStatus" },
    { label: t("3"), value: "contractStatus" },
    { label: t("4"), value: "driverStatus" },
    { label: t("5"), value: "fatigueStatus" },
  ];
};

export const ColumnsSummary = () => {
  const {
    data: { rawSummary },
  } = useDriverStock();

  const _renderSummary = (
    _record: string | number,
    _item: { indicator: string },
  ) => {
    if (_item?.indicator === "total") return <strong>{_record}</strong>;
    return _record;
  };

  return [
    {
      key: "indicator",
      dataIndex: "indicator",
      title: "Indicator",
      fixed: "left",
      width: 120,
    },
    ...BRANCH_ORDER?.map((_branchName) =>
      rawSummary.driverData.driverBranches?.find(
        (_item) => _item?.branchName === _branchName,
      ),
    )
      ?.filter((_item) => _item !== undefined)
      ?.map((_branch) => ({
        key: _branch?.branchName,
        dataIndex: _branch.branchName,
        title: _branch.branchName,
      })),
    {
      key: "total",
      dataIndex: "total",
      title: "Total",
      fixed: "right",
    },
  ]?.map((_column) => ({
    ..._column,
    align: _column?.key === "indicator" ? "left" : "center",
    render: _renderSummary,
  }));
};

export const Columns = (props: {
  onEdit?: (values: IUpdateNotePayload) => void;
}) => {
  const { onEdit } = props;
  const { t } = useTranslation(undefined, {
    keyPrefix: "driverStock.table",
  });
  const { isRead, isUpdate } = useCheckPermission({
    menuLink: ROUTE.DRIVER_MANAGEMENT.DRIVER_STOCK,
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
      width: 60,
      exception: true,
    },
    {
      title: t("column.branch"),
      dataIndex: "branchName",
      key: "branchName",
      sorter: true,
      fixed: "left",
      truncate: true,
    },
    {
      title: t("column.driverId"),
      dataIndex: "employeeId",
      key: "employeeId",
      sorter: true,
      fixed: "left",
      truncate: true,
    },
    {
      title: t("column.vkvd"),
      dataIndex: "vkvd",
      key: "vkvd",
      sorter: true,
      fixed: "left",
      truncate: true,
    },
    {
      title: t("column.driverName"),
      dataIndex: "employeeName",
      key: "employeeName",
      sorter: true,
      fixed: "left",
      truncate: true,
    },
    {
      title: t("column.employeeStatus"),
      dataIndex: "employeeStatus",
      key: "employeeStatus",
      align: "center",
      sorter: true,
    },
    {
      title: t("column.licenseExpired"),
      dataIndex: "licenseExpired",
      key: "licenseExpired",
    },
    {
      title: t("column.licenseStatus"),
      dataIndex: "licenseStatus",
      key: "licenseStatus",
      align: "center",
      render: (_record: string) => <StatusTag value={_record} block />,
    },
    {
      title: t("column.contractEndDate"),
      dataIndex: "endDate",
      key: "endDate",
      render: (value: string) => dayjs(value).format("DD MMM YYYY"),
    },
    {
      title: t("column.contractStatus"),
      dataIndex: "contractStatus",
      key: "contractStatus",
      align: "center",
      render: (_record: string) => <StatusTag value={_record} block />,
    },
    {
      title: t("column.driverStatus"),
      dataIndex: "driverStatus",
      key: "driverStatus",
      align: "center",
      render: (status: string) => {
        if (!status) return "-";
        const { label, color } =
          DRIVER_CAPACITY_STATUS_TAG.find(
            (o) => o.label.toLowerCase() === status.toLowerCase(),
          ) || {};
        return <StatusTag value={label ?? status ?? ""} block color={color} />;
      },
    },
    {
      title: t("column.fatigueStatus"),
      dataIndex: "fatigueStatus",
      key: "fatigueStatus",
      align: "center",
      render: (_record: string) => <StatusTag value={_record} block />,
    },
    {
      title: t("column.serviceType"),
      dataIndex: "shipmentType",
      key: "shipmentType",
    },
    {
      title: t("column.customerAssignment"),
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: t("column.lastLocation"),
      dataIndex: "lastLocation",
      key: "lastLocation",
      width: 200,
      truncate: true,
    },
    {
      title: t("column.actions"),
      key: "operation",
      fixed: "right",
      width: 80,
      hidden: !isRead,
      exception: true,
      render: (record: any) => (
        <Row justify="center" gutter={[8, 0]}>
          {isRead ? (
            <Col>
              <Link
                id="link-detail-driver"
                href={`${ROUTE.DRIVER_MANAGEMENT.DRIVER_STOCK}/${record.id}`}
                passHref
              >
                <Button
                  id="detail-button"
                  size="small"
                  tooltip={t("button.read.tooltip")}
                  type="link"
                  icon={<EyeOutlined />}
                />
              </Link>
            </Col>
          ) : null}
          {isUpdate ? (
            <Button
              id="edit-button"
              size="small"
              tooltip={t("button.update.tooltip")}
              type="link"
              icon={<EditOutlined />}
              {...(onEdit && {
                onClick: () => onEdit({ id: record.id, note: record.note }),
              })}
            />
          ) : null}
        </Row>
      ),
    },
  ];
};

export const ColumnsInOut = () => {
  const _renderSummary = (
    _record: string | number,
    _item: { indicator: string },
  ) => {
    if (_item?.indicator === "Ratio Pkwt") return <strong>{_record}</strong>;
    return _record;
  };

  const {
    data: { rawSummary },
  } = useDriverStock();

  const months = Array.from({ length: 12 }, (_, i) => {
    return dayjs().month(i).format("MMM");
  });

  const columnData = [
    {
      key: "indicator",
      dataIndex: "indicator",
      title: "Indicator",
      fixed: "left",
      width: 120,
    },
    ...rawSummary.driverInOutData.map((_inout) => ({
      key: months[_inout.month - 1],
      dataIndex: months[_inout.month - 1],
      title: months[_inout.month - 1],
    })),
  ].map((_column) => ({
    ..._column,
    align: _column?.key === "indicator" ? "left" : "center",
    render: _renderSummary,
  }));

  return columnData;
};
