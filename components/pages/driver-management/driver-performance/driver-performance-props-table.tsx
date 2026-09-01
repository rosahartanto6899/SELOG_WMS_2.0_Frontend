import { NUMBER_FORMAT } from "@sera-utils/constants/common";
import { Col, Row } from "antd";
import { useTranslation } from "react-i18next";

import PerformanceGrade, { TStatusType } from "./performance-grade-tag";

export const DRIVER_PERFORMANCE_DEFAULT_UNCHECK = [
  "vkvd",
  "shipment",
  "workDays",
  "clockIn",
  "totalOntimePickup",
  "totalOntimeDelivery",
  "onTimePodReturn",
  "totalClaim",
  "totalHarshShipment",
  "totalPODhandling",
];

export const Columns = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "driverPerformance.table",
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
      title: t("column.branchId"),
      dataIndex: "branchName",
      key: "branchName",

      truncate: true,
      align: "left",
      fixed: "left",
    },
    {
      title: t("column.shipmentType"),
      dataIndex: "shipmentType",
      key: "shipmentType",
      truncate: true,
      align: "left",
      fixed: "left",
    },
    {
      title: t("column.driverId"),
      dataIndex: "employeeId",
      key: "employeeId",
      truncate: true,
      align: "left",
      fixed: "left",
    },
    {
      title: t("column.driverVKVD"),
      dataIndex: "vkvd",
      key: "vkvd",
      truncate: true,
      align: "center",
      fixed: "left",
    },
    {
      title: t("column.driverName"),
      dataIndex: "employeeName",
      key: "employeeName",
      truncate: true,
      align: "left",
      fixed: "left",
    },
    {
      title: t("column.scoring"),
      dataIndex: "score",
      key: "score",
      sorter: true,
      align: "center",
      render: (value: TStatusType) => <PerformanceGrade value={value} />,
    },
    {
      title: t("column.totalShipment"),
      dataIndex: "shipment",
      key: "shipment",
      truncate: true,
      align: "center",
      render: (value: number) => NUMBER_FORMAT(value),
    },
    {
      title: t("column.totalWorkdays"),
      dataIndex: "workDays",
      key: "workDays",
      truncate: true,
      align: "center",
      render: (value: number) => NUMBER_FORMAT(value),
    },
    {
      title: t("column.totalClockIn"),
      dataIndex: "clockIn",
      key: "clockIn",
      truncate: true,
      align: "center",
      render: (value: number) => NUMBER_FORMAT(value),
    },
    {
      title: t("column.totalOnTimePickup"),
      dataIndex: "totalOntimePickup",
      key: "totalOntimePickup",
      truncate: true,
      align: "center",
      render: (value: number) => NUMBER_FORMAT(value),
    },
    {
      title: t("column.totalOnTimeDelivery"),
      dataIndex: "totalOntimeDelivery",
      key: "totalOntimeDelivery",
      truncate: true,
      align: "center",
      render: (value: number) => NUMBER_FORMAT(value),
    },
    {
      title: t("column.totalOnTimePodReturn"),
      dataIndex: "totalPODhandling",
      key: "totalPODhandling",
      truncate: true,
      align: "center",
      render: (value: number) => NUMBER_FORMAT(value),
    },
    {
      title: t("column.totalClaimShipment"),
      dataIndex: "totalClaim",
      key: "totalClaim",
      truncate: true,
      align: "center",
      render: (value: number) => NUMBER_FORMAT(value),
    },
    {
      title: t("column.totalHarshShipment"),
      dataIndex: "totalHarshShipment",
      key: "totalHarshShipment",
      truncate: true,
      align: "center",
      render: (value: number) => NUMBER_FORMAT(value),
    },
    {
      title: t("column.ciCompliance"),
      dataIndex: "totalCiComplience",
      key: "totalCiComplience",
      truncate: true,
      align: "center",
      render: (value: number) => `${value}%`,
    },
    {
      title: t("column.onTimePickup"),
      dataIndex: "onTimePickup",
      key: "onTimePickup",
      truncate: true,
      align: "center",
      render: (value: string) => `${value}%`,
    },
    {
      title: t("column.onTimeDelivery"),
      dataIndex: "onTimeDelivery",
      key: "onTimeDelivery",
      truncate: true,
      align: "center",
      render: (value: string) => `${value}%`,
    },
    {
      title: t("column.podHandling"),
      dataIndex: "onTimePodReturn",
      key: "onTimePodReturn",
      truncate: true,
      align: "center",
      render: (value: number) => `${value}%`,
    },
    {
      title: t("column.claim"),
      dataIndex: "claim",
      key: "claim",
      truncate: true,
      align: "center",
      render: (value: number) => `${value}%`,
    },
    {
      title: t("column.harshShipment"),
      dataIndex: "harsh",
      key: "harsh",
      truncate: true,
      align: "center",
      render: (value: number) => `${value}%`,
    },
    {
      title: t("column.accident"),
      dataIndex: "accident",
      key: "accident",
      truncate: true,
      align: "center",
    },
    {
      title: t("column.average"),
      dataIndex: "average",
      key: "average",
      truncate: true,
      align: "center",
      render: (value: number) => `${value}%`,
    },
  ]?.map((_column) => ({ ..._column, hidden: false }));
};

export const filterOptions = [
  {
    label: "Driver Name",
    value: "employeeName",
    options: [],
  },
  {
    label: "Grade",
    value: "score",
    options: [
      { label: "A", value: "a" },
      { label: "B", value: "b" },
      { label: "C", value: "c" },
    ],
  },
];
