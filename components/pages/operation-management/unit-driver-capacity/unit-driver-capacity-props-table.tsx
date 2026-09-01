/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EyeOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import StatusTag from "@sera-components/status-tag";
import {
  DriverCapacity,
  UnitCapacity,
} from "@sera-types/unit-driver-capacity.type";
import { ROUTE } from "@sera-utils/constants/routes";
import useCheckPermission from "@sera-utils/hooks/useCheckPermission";
import PermissionUtils from "@sera-utils/permission-utils";
import { Col, Row } from "antd";
import { TagProps } from "antd/lib";
import dayjs from "dayjs";
import { startCase } from "lodash";
import Link from "next/link";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const menuBranch: any = PermissionUtils().getAccessMenuPermission(
  ROUTE.OPERATION_MANAGEMENT.UNIT_DRIVER_CAPACITY,
);

export const actionUnitDriverCapacity = {
  isCreate: menuBranch?.data?.isCreate || false,
  isUpdate: menuBranch?.data?.isUpdate || false,
  isDelete: menuBranch?.data?.isDelete || false,
};

export const UNIT_CAPACITY_STATUS_TAG_SUMMARY: {
  label: string;
  color: TagProps["color"];
}[] = [
  { label: "Arah Balik", color: "volcano" },
  { label: "Bongkar", color: "gold" },
  { label: "Free", color: "" },
  { label: "Free Arah Balik", color: "blue" },
  { label: "Muat", color: "orange" },
  { label: "On Journey", color: "green" },
  { label: "Planning", color: "purple" },
  { label: "UTSP", color: "red" },
];

export const UNIT_STATUS_TAG: {
  label: string;
  color: TagProps["color"];
}[] = [
  { label: "Available", color: "green" },
  { label: "On Trip", color: "blue" },
  { label: "Maintenance", color: "warning" },
];

export const DRIVER_CAPACITY_STATUS_TAG: {
  label: string;
  color: TagProps["color"];
}[] = [
  { label: "Ready", color: "warning" },
  { label: "On Journey", color: "green" },
  { label: "Off", color: "red" },
  { label: "Coaching", color: "purple" },
  { label: "Standby", color: "" },
  { label: "Absence", color: "red" },
];

export const UnitSearchByOptions = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "unitDriverCapacity.unit.table.options",
  });

  return [
    { label: t("0"), value: "unitType" },
    { label: t("1"), value: "capacityStatus" },
    { label: t("2"), value: "destinationArea" },
    { label: t("3"), value: "licensePlate" },
  ];
};

export const DriverSearchByOptions = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "unitDriverCapacity.driver.table.options",
  });

  return [
    { label: t("0"), value: "employeeStatus" },
    { label: t("1"), value: "vkvd" },
    { label: t("2"), value: "status" },
    { label: t("3"), value: "employeeName" },
  ];
};

export const ColumnsUnit = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "unitDriverCapacity.unit.table",
  });
  const { isRead } = useCheckPermission({
    menuLink: ROUTE.OPERATION_MANAGEMENT.UNIT_DRIVER_CAPACITY,
  });
  return [
    {
      title: "No",
      key: "no",
      render: (_: never, record: UnitCapacity) => (
        <Row justify="center">
          <Col>{record.no}</Col>
        </Row>
      ),
      width: 60,
      exception: true,
      fixed: "left",
    },
    {
      title: t("column.unitYear"),
      dataIndex: "unitYear",
      key: "unitYear",
      truncate: true,
      align: "center",
      fixed: "left",
      exclude: true,
    },
    {
      title: t("column.unitType"),
      dataIndex: "unitType",
      key: "unitType",
      fixed: "left",
      truncate: true,
    },
    {
      title: t("column.licensePlate"),
      dataIndex: "licensePlate",
      key: "licensePlate",
      truncate: true,
      fixed: "left",
    },
    {
      title: t("column.status"),
      dataIndex: "status",
      key: "status",
      align: "center",
      fixed: "left",
      render: (status: string) => {
        if (!status) return "-";
        const { label, color } =
          UNIT_CAPACITY_STATUS_TAG_SUMMARY.find(
            (o) => o.label.toLowerCase() === status.toLowerCase(),
          ) || {};
        return <StatusTag value={label ?? ""} fallback={color ?? ""} block />;
      },
    },
    {
      title: t("column.lastPosition"),
      dataIndex: "lastPosition",
      key: "lastPosition",
      truncate: true,
      width: 200,
    },
    {
      title: t("column.destinationArea"),
      dataIndex: "destinationArea",
      key: "destinationArea",
      align: "left",
    },
    {
      title: t("column.eta"),
      dataIndex: "eta",
      key: "eta",
      truncate: true,
      sorter: true,
      align: "center",
      render: (date: string) => {
        if (!date) return "";
        return dayjs(date).format("YYYY-MM-DD HH:mm");
      },
    },
    {
      title: t("column.branch"),
      dataIndex: "branch",
      key: "branch",
      align: "left",
      truncate: true,
    },
    {
      title: t("column.shipmentType"),
      dataIndex: "shipmentType",
      key: "shipmentType",
      align: "left",
      truncate: true,
    },
    {
      title: t("column.actions"),
      key: "operation",
      fixed: "right",
      hidden: !isRead,
      render: (record: UnitCapacity) => (
        <Row justify="center" gutter={[8, 0]}>
          {isRead ? (
            <Col>
              <Link
                id="link-detail-unit-capacity"
                href={`${ROUTE.OPERATION_MANAGEMENT.UNIT_DRIVER_CAPACITY}/${record.id}?type=unit`}
                passHref
              >
                <Button
                  id="detail-button"
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

export const ColumnsDriver = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "unitDriverCapacity.driver.table",
  });
  const { isRead } = useCheckPermission({
    menuLink: ROUTE.OPERATION_MANAGEMENT.UNIT_DRIVER_CAPACITY,
  });
  return [
    {
      title: "No",
      key: "no",
      render: (_: never, record: DriverCapacity) => (
        <Row justify="center">
          <Col>{record.no}</Col>
        </Row>
      ),
      width: 60,
      fixed: "left",
      exception: true,
    },
    {
      title: t("column.employeeStatus"),
      dataIndex: "employeeStatus",
      key: "employeeStatus",
      align: "center",
      fixed: "left",
      exclude: true,
    },
    {
      title: t("column.employeeId"),
      dataIndex: "employeeId",
      key: "employeeId",
      truncate: true,
      fixed: "left",
      exclude: true,
    },
    {
      title: t("column.vkvd"),
      dataIndex: "vkvd",
      key: "vkvd",
      truncate: true,
    },
    {
      title: t("column.employeeName"),
      dataIndex: "employeeName",
      key: "employeeName",
      align: "left",
    },
    {
      title: t("column.phoneNumber"),
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      truncate: true,
    },
    {
      title: t("column.status"),
      dataIndex: "status",
      key: "status",
      truncate: true,
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
      title: t("column.detailPosition"),
      dataIndex: "detailPosition",
      key: "detailPosition",
      truncate: true,
      width: 200,
    },
    {
      title: t("column.destinationArea"),
      dataIndex: "destinationArea",
      key: "destinationArea",
      align: "left",
    },
    {
      title: t("column.estimationTimeArrival"),
      dataIndex: "estimationTimeArrival",
      key: "estimationTimeArrival",
      truncate: true,
      align: "center",
      render: (date: string) => {
        if (!date) return "";
        return dayjs(date).format("DD-MM-YYYY HH:mm");
      },
    },
    {
      title: t("column.branch"),
      dataIndex: "branch",
      key: "branch",
      align: "left",
      truncate: true,
    },
    {
      title: t("column.shipmentType"),
      dataIndex: "shipmentType",
      key: "shipmentType",
      align: "left",
      truncate: true,
    },
    {
      title: t("column.actions"),
      key: "operation",
      fixed: "right",
      hidden: !isRead,
      render: (record: DriverCapacity) => (
        <Row justify="center" gutter={[8, 0]}>
          {isRead ? (
            <Col>
              <Link
                id="link-detail-driver-capacity"
                href={`${ROUTE.OPERATION_MANAGEMENT.UNIT_DRIVER_CAPACITY}/${record.id}?type=driver`}
                passHref
              >
                <Button
                  id="detail-button"
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

export const ColumUnitCapacitySummary = ({ area }: { area: string[] }) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "unitDriverCapacity.unit.table",
  });

  const columns = area.map((v, i) => ({
    title: startCase(v) || v,
    dataIndex: v,
    key: v,
    align: "center",
    onHeaderCell: () => ({
      className:
        i === 0 ? "group-bordered-start-end-head" : "group-bordered-end-head",
    }),
    render: (value: number, record: any) => {
      if (record?.status === "Total") return <strong>{value}</strong>;
      return value;
    },
  }));

  return [
    {
      title: t("column.status"),
      dataIndex: "status",
      key: "status",
      align: "center",
      fixed: "left",
      width: 160,
      render: (status: string) => {
        if (status === "Total") return <strong>{status}</strong>;
        const { label, color } =
          UNIT_CAPACITY_STATUS_TAG_SUMMARY.find(
            (o) => o.label.toLowerCase() === status.toLowerCase(),
          ) || {};
        return <StatusTag value={label ?? status ?? ""} block color={color} />;
      },
    },
    {
      key: "area",
      title: t("column.area"),
      onHeaderCell: () => ({ className: "group-bordered-start-end-head" }),
      children: columns,
    },
  ];
};

export const ColumDriverCapacitySummary = ({ area }: { area: string[] }) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "unitDriverCapacity.driver.table",
  });

  const columns = area.map((v, i) => ({
    title: startCase(v) || v,
    dataIndex: v,
    key: v,
    align: "center",
    onHeaderCell: () => ({
      className:
        i === 0 ? "group-bordered-start-end-head" : "group-bordered-end-head",
    }),
    render: (value: number, record: any) => {
      if (record?.status === "Total") return <strong>{value}</strong>;
      return value;
    },
  }));

  return [
    {
      title: t("column.status"),
      dataIndex: "status",
      key: "status",
      align: "center",
      fixed: "left",
      width: 130,
      render: (status: string) => {
        if (status === "Total") return <strong>{status}</strong>;
        const { label, color } =
          DRIVER_CAPACITY_STATUS_TAG.find(
            (o) => o.label.toLowerCase() === status.toLowerCase(),
          ) || {};
        return (
          <StatusTag
            value={label ?? status ?? ""}
            fallback={color || ""}
            block
            color={color}
          />
        );
      },
    },
    {
      key: "area",
      title: t("column.area"),
      children: columns,
      onHeaderCell: () => ({
        className: "group-bordered-start-end-head",
      }),
    },
  ];
};

export const INDICATOR_FORECAST_DRIVER = ["PKWT", "Mitra", "Total"];
export const INDICATOR_FORECAST_UNIT = [
  "Car Carrier",
  "Chiller",
  "FTR",
  "DSB",
  "Total",
];

export const ColumnForecastCapacity = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "unitDriverCapacity.forecast.table",
  });

  const FORECAST_DATES = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => dayjs().add(i, "days"));
  }, []);

  const FORECAST_DAYS = useMemo(() => {
    const MONTHS = FORECAST_DATES.map((d) => d.format("MMMM YYYY")).filter(
      (v, i, arr) => arr.indexOf(v) === i,
    );
    const todayKey = dayjs().format("DD-MM-YYYY");
    return MONTHS.map((v) => ({
      key: v,
      title: v,
      align: "center",
      children: FORECAST_DATES.filter((d) => d.format("MMMM YYYY") === v).map(
        (val) => {
          const _day = val.format("DD");
          const dayKey = val.format("DD-MM-YYYY");
          return {
            title: _day,
            dataIndex: dayKey,
            key: dayKey,
            align: "center",
            width: 60,
            render: (value: number, record: any) => {
              if (record.indicator === "Total") return <strong>{value}</strong>;
              return value;
            },
            onCell: () => ({
              className: dayKey === todayKey ? "data-warning" : "",
            }),
          };
        },
      ),
    }));
  }, [FORECAST_DATES]);

  return [
    {
      title: t("column.indicator"),
      dataIndex: "indicator",
      key: "indicator",
      truncate: true,
      align: "left",
      fixed: "left",
      width: 130,
      render: (indicator: string) => {
        if (indicator === "Total") return <strong>{indicator}</strong>;
        return indicator;
      },
    },
    ...FORECAST_DAYS,
  ];
};
