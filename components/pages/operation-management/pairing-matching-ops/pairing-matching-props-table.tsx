/* eslint-disable @typescript-eslint/no-explicit-any */
import { CheckOutlined, EyeOutlined, ToolOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import StatusTag from "@sera-components/status-tag";
import { MasterDataItem } from "@sera-types/master-data.type";
import { Demands } from "@sera-types/pairing-matching-ops";
import {
  DATE_FORMAT,
  FORMAT_DATE_TIME,
  NUMBER_FORMAT,
} from "@sera-utils/constants/common";
import { ROUTE } from "@sera-utils/constants/routes";
import useCheckPermission from "@sera-utils/hooks/useCheckPermission";
import { Col, Row } from "antd";
import { includes } from "lodash";
import { useTranslation } from "react-i18next";

export const UNCHECK_DEMANDS_KEYS = ["C", "D", "F", "Q", "R", "U", "V", "BB"];
export const UNCHECK_PAIRED_KEYS = ["C"];

export const ColumnsDemands = ({
  onClick,
}: {
  onClick?: (type: "repair" | "confirm" | "history", record: any) => void;
}) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "pairingMatchingOps.table.demands.column",
  });

  const { isCreate, isRead } = useCheckPermission({
    menuLink: ROUTE.OPERATION_MANAGEMENT.PAIRING_MATCHING_OPS,
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
      key: "A",
      dataIndex: "priority",
      title: t("A"),
      fixed: "left",
      render: (record: string) => {
        return <StatusTag value={record} block />;
      },
    },
    {
      key: "B",
      dataIndex: "confirmationStatus",
      title: t("B"),
      fixed: "left",
      render: (record: string) => {
        return <StatusTag value={record} block />;
      },
    },
    {
      key: "C",
      dataIndex: "createdAt",
      title: t("C"),
      fixed: "left",
    },
    {
      key: "D",
      dataIndex: "createdBy",
      title: t("D"),
      fixed: "left",
    },
    {
      key: "E",
      dataIndex: "shipmentNo",
      title: t("E"),
      fixed: "left",
    },
    {
      key: "F",
      dataIndex: "bookingCode",
      title: t("F"),
      fixed: "left",
    },
    {
      key: "G",
      dataIndex: "shipmentType",
      title: t("G"),
    },
    {
      key: "BB",
      dataIndex: "routeCode",
      title: t("BB"),
    },
    {
      key: "H",
      dataIndex: "customer",
      title: t("H"),
    },
    {
      key: "I",
      dataIndex: "branchOrder",
      title: t("I"),
    },
    {
      key: "J",
      dataIndex: "unitType",
      title: t("J"),
    },
    {
      key: "K",
      dataIndex: "qtyDriver",
      title: t("K"),
      align: "center",
    },
    {
      key: "L",
      dataIndex: "origin",
      title: t("L"),
    },
    {
      key: "M",
      dataIndex: "destination",
      title: t("M"),
    },
    {
      key: "N",
      dataIndex: "pickupDate",
      title: t("N"),
    },
    {
      key: "O",
      dataIndex: "estUnloading",
      title: t("O"),
    },
    {
      key: "P",
      dataIndex: "licensePlate",
      title: t("P"),
    },
    {
      key: "Q",
      dataIndex: "driverVkd1",
      title: t("Q"),
    },
    {
      key: "R",
      dataIndex: "driverId1",
      title: t("R"),
    },
    {
      key: "S",
      dataIndex: "driver1",
      title: t("S"),
    },
    {
      key: "T",
      dataIndex: "phoneDriver1",
      title: t("T"),
    },
    {
      key: "U",
      dataIndex: "driverVkd2",
      title: t("U"),
    },
    {
      key: "V",
      dataIndex: "driverId2",
      title: t("V"),
    },
    {
      key: "W",
      dataIndex: "driver2",
      title: t("W"),
    },
    {
      key: "X",
      dataIndex: "phoneDriver2",
      title: t("X"),
    },
    {
      key: "Y",
      dataIndex: "revenue",
      title: t("Y"),
      render: (_record: number) => <Col>Rp.{NUMBER_FORMAT(_record)}</Col>,
    },
    {
      key: "AA",
      dataIndex: "expenses",
      title: t("AA"),
      render: (_record: number) => <Col>Rp.{NUMBER_FORMAT(_record)}</Col>,
    },
    {
      key: "Z",
      dataIndex: "Z",
      title: t("Z"),
      align: "center",
      fixed: "right",
      onCell: () => {
        return {
          onClick: (e: any) => {
            e.stopPropagation();
          },
        };
      },
      render: (_: any, _record: Demands) => {
        const repairList = ["Need to Confirm", "Ritase"];
        const confirmList = ["Need to Confirm", "Ritase", "Dedicated"];
        const isRepairEnable =
          includes(repairList, _record.confirmationStatus) &&
          includes(repairList, _record.shipmentType);
        const isConfirmEnable =
          includes(confirmList, _record.confirmationStatus) &&
          includes(confirmList, _record.shipmentType);
        return (
          <Row justify="center" gutter={[8, 4]}>
            {isCreate && (
              <>
                <Col>
                  <Button
                    id="repair-button"
                    size="small"
                    tooltip={t("button.repair.tooltip")}
                    type="link"
                    icon={<ToolOutlined />}
                    disabled={!isRepairEnable}
                    onClick={() => onClick && onClick("repair", _record)}
                  />
                </Col>
                <Col>
                  <Button
                    id="confirm-button"
                    size="small"
                    tooltip={t("button.confirm.tooltip")}
                    type="link"
                    disabled={!isConfirmEnable}
                    icon={<CheckOutlined />}
                    onClick={() => onClick && onClick("confirm", _record)}
                  />
                </Col>
              </>
            )}

            {isRead && (
              <Col>
                <Button
                  id="detail-button"
                  size="small"
                  tooltip={t("button.detail.tooltip")}
                  type="link"
                  icon={<EyeOutlined />}
                  onClick={() => onClick && onClick("history", _record)}
                />
              </Col>
            )}
          </Row>
        );
      },
    },
  ];
};

interface ColumnsUnitsProps {
  statuses?: MasterDataItem[];
}

export const ColumnsUnits = ({ statuses }: ColumnsUnitsProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "pairingMatchingOps.table.units.column",
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
      truncate: true,
      width: 120,
    },
    {
      key: "isAllotment",
      dataIndex: "note",
      title: t("isAllotment"),
      align: "left",
      width: 120,
      truncate: true,
    },
  ];
};

interface ColumnsDriversProps {
  statuses?: MasterDataItem[];
}

export const ColumnsDrivers = ({ statuses }: ColumnsDriversProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "pairingMatchingOps.table.drivers.column",
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
    },
    {
      key: "fatigueStatus",
      dataIndex: "fatigueLevel",
      title: t("fatigueStatus"),
      render: (_record: string) => <StatusTag value={_record} block />,
    },
    {
      key: "tier",
      dataIndex: "tier",
      title: t("tier"),
      align: "left",
      render: (_record: string) => <StatusTag value={_record} block />,
    },
    {
      key: "lastLocation",
      dataIndex: "lastLocation",
      title: t("lastLocation"),
    },
    {
      key: "allotment",
      dataIndex: "note",
      title: t("allotment"),
      width: 120,
      truncate: true,
    },
  ];
};

export const ColumnsHistory = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "pairingMatchingOps.table.history.column",
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
      title: t("A"),
    },
    {
      key: "activityDetail",
      dataIndex: "activityDetail",
      title: t("B"),
    },
    {
      key: "activityDate",
      dataIndex: "activityDate",
      title: t("C"),
      render: (_record: string) => DATE_FORMAT(_record, FORMAT_DATE_TIME),
    },
    {
      key: "activityBy",
      dataIndex: "activityBy",
      title: t("D"),
      align: "left",
    },
  ];
};

export const UnitsSearchByOptions = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "pairingMatchingOps.table.units.options",
  });

  return [
    { label: t("0"), value: "licensePlate" },
    { label: t("1"), value: "status" },
  ];
};

export const DriversSearchByOptions = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "pairingMatchingOps.table.drivers.options",
  });

  return [
    { label: t("0"), value: "vkvd" },
    { label: t("1"), value: "driverName" },
    { label: t("2"), value: "employeeStatus" },
    { label: t("3"), value: "tier" },
  ];
};
