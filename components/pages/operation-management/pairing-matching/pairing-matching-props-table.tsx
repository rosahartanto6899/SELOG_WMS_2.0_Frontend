/* eslint-disable @typescript-eslint/no-explicit-any */
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import StatusTag from "@sera-components/status-tag";
import { MasterDataItem } from "@sera-types/master-data.type";
import { CapacityPaired } from "@sera-types/pairing-matching";
import {
  DATE_FORMAT,
  FORMAT_DATE_TIME,
  NUMBER_FORMAT,
} from "@sera-utils/constants/common";
import { Col, Row } from "antd";
import { useTranslation } from "react-i18next";

export const UNCHECK_DEMANDS_KEYS = [
  "createdAt",
  "createdBy",
  "bookingCode",
  "routeCode",
];
export const UNCHECK_PAIRED_KEYS = ["bookingNo"];

export const ColumnsDemands = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "pairingMatching.table.demands.column",
  });

  return [
    {
      key: "no",
      dataIndex: "no",
      title: "No",
      fixed: "left",
      width: 60,
      align: "center",
      exception: true,
    },
    {
      key: "confirmationStatus",
      dataIndex: "confirmationStatus",
      title: t("confirmationStatus"),
      fixed: "left",
      align: "center",
      render: (_record: string) => <StatusTag value={_record} block />,
    },
    {
      key: "priority",
      dataIndex: "priority",
      title: t("priority"),
      render: (record: string) => {
        return <StatusTag value={record} block />;
      },
    },
    {
      key: "createdAt",
      dataIndex: "createdAt",
      title: t("createdAt"),
      render: (_record: string) => DATE_FORMAT(_record, FORMAT_DATE_TIME),
    },
    {
      key: "createdBy",
      dataIndex: "createdBy",
      title: t("createdBy"),
    },
    {
      key: "shipmentNo",
      dataIndex: "shipmentNo",
      title: t("shipmentNo"),
    },
    {
      key: "bookingCode",
      dataIndex: "bookingCode",
      title: t("bookingCode"),
    },
    {
      key: "routeCode",
      dataIndex: "routeCode",
      title: t("routeCode"),
    },
    {
      key: "customer",
      dataIndex: "customer",
      title: t("customer"),
    },
    {
      key: "branchOrder",
      dataIndex: "branchOrder",
      title: t("branchOrder"),
    },
    {
      key: "unitType",
      dataIndex: "unitType",
      title: t("unitType"),
    },
    {
      key: "qtyDriver",
      dataIndex: "qtyDriver",
      title: t("qtyDriver"),
      align: "center",
    },
    {
      key: "origin",
      dataIndex: "origin",
      title: t("origin"),
    },
    {
      key: "destination",
      dataIndex: "destination",
      title: t("destination"),
    },
    {
      key: "pickupDate",
      dataIndex: "pickupDate",
      title: t("pickupDate"),
      render: (_record: string) => DATE_FORMAT(_record, FORMAT_DATE_TIME),
    },
    {
      key: "estUnloading",
      dataIndex: "estUnloading",
      title: t("estUnloading"),
      render: (_record: string) => DATE_FORMAT(_record, FORMAT_DATE_TIME),
    },
    {
      key: "revenue",
      dataIndex: "revenue",
      title: t("revenue"),
      align: "left",
      render: (_record: string) => `Rp ${NUMBER_FORMAT(_record)}`,
    },
  ];
};

interface ColumnsUnitsProps {
  statuses?: MasterDataItem[];
}

export const ColumnsUnits = ({ statuses }: ColumnsUnitsProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "pairingMatching.table.units.column",
  });

  return [
    {
      key: "no",
      dataIndex: "no",
      title: "No",
      fixed: "left",
      width: 60,
      align: "center",
      exception: true,
    },
    {
      key: "status",
      dataIndex: "status",
      title: t("status"),
      align: "center",
      render: (_record: string) => {
        const _data = statuses?.find((_item) => _record === _item?.name);

        return (
          <StatusTag value={_record} fallback={_data?.color ?? ""} block />
        );
      },
    },
    {
      key: "licensePlate",
      dataIndex: "licensePlate",
      title: t("licensePlate"),
    },
    {
      key: "unitType",
      dataIndex: "unitType",
      title: t("unitType"),
    },
    {
      key: "unitYear",
      dataIndex: "unitYear",
      title: t("unitYear"),
    },
    {
      key: "lastLocation",
      dataIndex: "lastLocation",
      title: t("lastLocation"),
      width: 200,
      truncate: true,
    },
    {
      key: "note",
      dataIndex: "note",
      title: t("note"),
      align: "left",
      width: 200,
      truncate: true,
    },
  ];
};

interface ColumnsDriversProps {
  statuses?: MasterDataItem[];
}

export const ColumnsDrivers = ({ statuses }: ColumnsDriversProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "pairingMatching.table.drivers.column",
  });

  return [
    {
      key: "no",
      dataIndex: "no",
      title: "No",
      fixed: "left",
      width: 60,
      align: "center",
      exception: true,
    },
    {
      key: "capacityStatus",
      dataIndex: "capacityStatus",
      title: t("capacityStatus"),
      align: "center",
      render: (_record: string) => {
        const _data = statuses?.find((_item) => _record === _item?.name);

        return (
          <StatusTag value={_record} fallback={_data?.color ?? ""} block />
        );
      },
    },
    {
      key: "vkvd",
      dataIndex: "vkvd",
      title: t("vkvd"),
    },
    {
      key: "driverName",
      dataIndex: "driverName",
      title: t("driverName"),
    },
    {
      key: "employeeStatus",
      dataIndex: "employeeStatus",
      title: t("employeeStatus"),
      align: "center",
    },
    {
      key: "fatigueStatus",
      dataIndex: "fatigueLevel",
      title: t("fatigueStatus"),
      align: "center",
      render: (_record: string) => <StatusTag value={_record} block />,
    },
    {
      key: "tier",
      dataIndex: "tier",
      title: t("tier"),
      align: "center",
      render: (_record: string) => <StatusTag value={_record} block />,
    },
    {
      key: "lastLocation",
      dataIndex: "lastLocation",
      title: t("lastLocation"),
    },
    {
      key: "note",
      dataIndex: "note",
      title: t("note"),
      width: 200,
      truncate: true,
    },
  ];
};

interface ColumnsPairedProps {
  loading?: boolean;
  onConfirm?: (_record: any) => void;
  onView?: (_record: any) => void;
}

export const ColumnsPaired = ({
  loading,
  onConfirm,
  onView,
}: ColumnsPairedProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "pairingMatching.table.paired.column",
  });

  return [
    {
      key: "no",
      dataIndex: "no",
      title: "No",
      fixed: "left",
      width: 60,
      align: "center",
      exception: true,
    },
    {
      key: "confirmationStatus",
      dataIndex: "confirmationStatus",
      title: t("confirmationStatus"),
      align: "center",
      render: (_record: string) => <StatusTag value={_record} block />,
    },
    {
      key: "shipmentNo",
      dataIndex: "shipmentNo",
      title: t("shipmentNo"),
    },
    {
      key: "bookingNo",
      dataIndex: "bookingNo",
      title: t("bookingNo"),
    },
    {
      key: "customer",
      dataIndex: "customer",
      title: t("customer"),
    },
    {
      key: "branchName",
      dataIndex: "branchName",
      title: t("branchName"),
    },
    {
      key: "unitType",
      dataIndex: "unitType",
      title: t("unitType"),
    },
    {
      key: "origin",
      dataIndex: "origin",
      title: t("origin"),
    },
    {
      key: "destination",
      dataIndex: "destination",
      title: t("destination"),
    },
    {
      key: "pickupDate",
      dataIndex: "pickupDate",
      title: t("pickupDate"),
      render: (_record: string) => DATE_FORMAT(_record, FORMAT_DATE_TIME),
    },
    {
      key: "licensePlate",
      dataIndex: "licensePlate",
      title: t("licensePlate"),
    },
    {
      key: "driverName1",
      dataIndex: "driverName1",
      title: t("driverName1"),
    },
    {
      key: "phoneNumber1",
      dataIndex: "phoneNumber1",
      title: t("phoneNumber1"),
    },
    {
      key: "driverName2",
      dataIndex: "driverName2",
      title: t("driverName2"),
      render: (_record: string) => _record || "-",
    },
    {
      key: "phoneNumber2",
      dataIndex: "phoneNumber2",
      title: t("phoneNumber2"),
      render: (_record: string) => _record || "-",
    },
    {
      key: "action",
      dataIndex: "id",
      title: t("action"),
      fixed: "right",
      exception: true,
      render: (_: any, _record: CapacityPaired) => (
        <Row justify="center" gutter={[8, 4]}>
          <Col>
            <Button
              id="confirm-button"
              size="small"
              tooltip={t("button.confirm.tooltip")}
              type="link"
              icon={<EditOutlined />}
              disabled={loading || _record?.confirmationStatus !== "Paired"}
              onClick={() => {
                if (onConfirm) onConfirm(_record);
              }}
            />
          </Col>

          <Col>
            <Button
              id="history-button"
              size="small"
              tooltip={t("button.history.tooltip")}
              type="link"
              icon={<EyeOutlined />}
              disabled={loading}
              onClick={() => {
                if (onView) onView(_record);
              }}
            />
          </Col>
        </Row>
      ),
    },
  ];
};

export const ColumnsHistory = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "pairingMatching.table.history.column",
  });

  return [
    {
      key: "no",
      dataIndex: "no",
      title: "No",
      fixed: "left",
      width: 60,
      align: "center",
      exception: true,
    },
    {
      key: "shipmentNo",
      dataIndex: "shipmentNo",
      title: t("shipmentNo"),
    },
    {
      key: "activityDetail",
      dataIndex: "activityDetail",
      title: t("activityDetail"),
      width: 200,
      truncate: true,
    },
    {
      key: "activityDate",
      dataIndex: "activityDate",
      title: t("activityDate"),
      render: (_record: string) => DATE_FORMAT(_record, FORMAT_DATE_TIME),
    },
    {
      key: "activityBy",
      dataIndex: "activityBy",
      title: t("activityBy"),
      align: "left",
    },
  ];
};

export const DemandsSearchByOptions = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "pairingMatching.table.demands.options",
  });

  return [
    { label: t("0"), value: "bookingCode" },
    { label: t("1"), value: "shipmentNo" },
    { label: t("2"), value: "customer" },
    { label: t("3"), value: "pickupDate" },
    { label: t("4"), value: "origin" },
    { label: t("5"), value: "destination" },
    { label: t("6"), value: "priority" },
  ];
};

export const UnitsSearchByOptions = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "pairingMatching.table.units.options",
  });

  return [
    { label: t("0"), value: "licensePlate" },
    { label: t("1"), value: "status" },
  ];
};

export const DriversSearchByOptions = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "pairingMatching.table.drivers.options",
  });

  return [
    { label: t("0"), value: "vkvd" },
    { label: t("1"), value: "driverName" },
    { label: t("2"), value: "employeeStatus" },
    { label: t("3"), value: "tier" },
  ];
};

export const PairedSearchByOptions = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "pairingMatching.table.paired.options",
  });

  return [
    { label: t("0"), value: "shipmentNo" },
    { label: t("1"), value: "customer" },
    { label: t("2"), value: "origin" },
    { label: t("3"), value: "destination" },
    { label: t("4"), value: "confirmationStatus" },
  ];
};
