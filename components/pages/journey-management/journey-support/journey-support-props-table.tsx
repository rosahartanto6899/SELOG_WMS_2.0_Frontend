/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EyeOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import { EditOutlined } from "@sera-components/icons";
import StatusTag from "@sera-components/status-tag";
import {
  JourneySupportActivity,
  JourneySupportRecord,
} from "@sera-types/journey-support.type";
import { MasterDataItem } from "@sera-types/master-data.type";
import { ROUTE } from "@sera-utils/constants/routes";
import useCheckPermission from "@sera-utils/hooks/useCheckPermission";
import PermissionUtils from "@sera-utils/permission-utils";
import { Col, Row, TagProps } from "antd";
import dayjs from "dayjs";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";

const menuBranch: any = PermissionUtils().getAccessMenuPermission(
  ROUTE.JOURNEY_MANAGEMENT.JOURNEY_SUPPORT,
);

export interface ColumnsActivityLogProps {
  onEdit: Dispatch<SetStateAction<number | null>>;
  editableIndex: number | null;
}

export const actionJourneySupport = {
  isCreate: menuBranch?.data?.isCreate || false,
  isUpdate: menuBranch?.data?.isUpdate || false,
  isDelete: menuBranch?.data?.isDelete || false,
};

export const JOURNEY_SUPPORT_CAPACITY_STATUS: {
  label: string;
  color: TagProps["color"];
}[] = [
  { label: "Loading", color: "warning" },
  { label: "On Journey", color: "success" },
  { label: "Unloading", color: "orange" },
  { label: "Shipment on Duty", color: "blue" },
];

export const SearchByOptions = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "journeySupport.table.options",
  });

  return [
    { label: t("0"), value: "shipmentNo" },
    { label: t("1"), value: "licensePlate" },
  ];
};

interface ColumnsProps {
  statuses?: MasterDataItem[];
}

export const Columns = ({ statuses }: ColumnsProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "journeySupport.table",
  });

  const { isRead } = useCheckPermission({
    menuLink: ROUTE.JOURNEY_MANAGEMENT.JOURNEY_SUPPORT,
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
      title: t("column.capacityStatus"),
      dataIndex: "capacityStatus",
      key: "capacityStatus",
      fixed: "left",
      render: (_record: string) => {
        const _data = statuses?.find((_item) => _record === _item?.name);
        return <StatusTag value={_record} color={_data?.color ?? ""} block />;
      },
    },
    {
      title: t("column.shipmentNumber"),
      dataIndex: "shipmentNumber",
      key: "shipmentNumber",
      fixed: "left",
      truncate: true,
    },
    {
      title: t("column.shipmentType"),
      dataIndex: "shipmentType",
      key: "shipmentType",
      align: "center",
      fixed: "left",
      truncate: true,
      exclude: true,
    },
    {
      title: t("column.customerName"),
      dataIndex: "customerName",
      key: "customerName",
      truncate: true,
    },
    {
      title: t("column.unitType"),
      dataIndex: "unitType",
      key: "unitType",
      truncate: true,
      exclude: true,
    },
    {
      title: t("column.origin"),
      dataIndex: "origin",
      key: "origin",
      truncate: true,
      width: 120,
    },
    {
      title: t("column.destination"),
      dataIndex: "destination",
      key: "destination",
      truncate: true,
      width: 120,
    },
    {
      title: t("column.licensePlate"),
      dataIndex: "licensePlate",
      key: "licensePlate",
      truncate: true,
      exclude: true,
    },
    {
      title: t("column.driver1Name"),
      dataIndex: "driver1Name",
      key: "driver1Name",
      truncate: true,
      exclude: true,
    },
    {
      title: t("column.driver2Name"),
      dataIndex: "driver2Name",
      key: "driver2Name",
      truncate: true,
      exclude: true,
    },
    {
      title: t("column.lastPosition"),
      dataIndex: "lastPosition",
      key: "lastPosition",
      truncate: true,
      width: 160,
    },
    {
      title: t("column.lastUpdate"),
      dataIndex: "lastUpdate",
      key: "lastUpdate",
      align: "center",
      truncate: true,
      render: (date: string) =>
        date ? dayjs(date).format("YYYY-MM-DD HH:mm") : "-",
    },
    {
      title: t("column.statusOBD"),
      dataIndex: "statusOBD",
      key: "statusOBD",
      truncate: true,
      align: "center",
      render: (text: string) => (text ? <StatusTag value={text} block /> : "-"),
    },
    {
      title: t("column.action"),
      key: "operation",
      fixed: "right",
      hidden: !isRead,
      render: (record: JourneySupportRecord) => (
        <Row justify="center" gutter={[8, 0]}>
          {isRead ? (
            <Col>
              <Link
                id="link-detail-journey-support"
                href={`${ROUTE.JOURNEY_MANAGEMENT.JOURNEY_SUPPORT}/${record.id}`}
                passHref
              >
                <Button
                  id="button-detail-journey-support"
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

export const ColumnsActivityLog = ({
  onEdit,
  // onRefresh,
}: {
  onEdit: (record: JourneySupportActivity) => void;
  onRefresh: (record: JourneySupportActivity) => void;
}) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "journeySupport.form.activityLogTable",
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
      title: t("column.activity"),
      dataIndex: "activity",
      key: "activity",
      fixed: "left",
      render: (text: string) => text,
    },
    {
      title: t("column.locationName"),
      dataIndex: "locationName",
      key: "locationName",
      truncate: true,
    },
    {
      title: "Skyward Data",
      align: "center",
      onHeaderCell: () => ({ className: "group-bordered-start-end-head" }),
      children: [
        {
          title: t("column.obdActualDate"),
          dataIndex: "obdActualDate",
          key: "obdActualDate",
          truncate: true,
          onHeaderCell: () => ({ className: "group-bordered-start-end-head" }),
          render: (date: string) => {
            const isValid = dayjs(date).isValid();
            return isValid
              ? dayjs(date).format("YYYY-MM-DD HH:mm:ss")
              : date || "-";
          },
        },
        {
          title: t("column.obdCoordinate"),
          dataIndex: "obdCoordinate",
          key: "obdCoordinate",
          truncate: true,
          onHeaderCell: () => ({ className: "group-bordered-end-head" }),
        },
        {
          title: t("column.obdAddress"),
          dataIndex: "obdAddress",
          key: "obdAddress",
          truncate: true,
          width: 200,
          onHeaderCell: () => ({ className: "group-bordered-end-head" }),
        },
      ],
    },
    {
      title: "Operational Data",
      align: "center",
      onHeaderCell: () => ({ className: "group-bordered-end-head" }),
      children: [
        {
          title: t("column.opsActualDate"),
          dataIndex: "opsActualDate",
          key: "opsActualDate",
          truncate: true,
          onHeaderCell: () => ({ className: "group-bordered-end-head" }),
          render: (date: string) =>
            date ? dayjs(date).format("YYYY-MM-DD HH:mm:ss") : "-",
        },
        {
          title: t("column.opsCoordinate"),
          dataIndex: "opsCoordinate",
          key: "opsCoordinate",
          truncate: true,
          onHeaderCell: () => ({ className: "group-bordered-end-head" }),
        },
        {
          title: t("column.opsAddress"),
          dataIndex: "opsAddress",
          key: "opsAddress",
          truncate: true,
          onHeaderCell: () => ({ className: "group-bordered-end-head" }),
          width: 200,
        },
      ],
    },
    {
      title: t("column.action"),
      key: "operation",
      fixed: "right",
      align: "center",
      hidden: !actionJourneySupport.isUpdate,
      render: (_: never, _v: JourneySupportActivity) => {
        const activityStatus = (_v.activity ?? "").split(" ") || [];
        const isDisabledShipmentActivity =
          activityStatus?.[0] === "Shipment" && activityStatus?.length > 1;

        return (
          <Row justify="center" gutter={[8, 0]}>
            <Col>
              <Button
                size="small"
                type="link"
                disabled={isDisabledShipmentActivity}
                icon={<EditOutlined />}
                onClick={() => onEdit(_v)}
              />
            </Col>
            {/* <Col>
              <Button
                size="small"
                type="link"
                icon={<Refresh />}
                onClick={() => onRefresh(_v)}
                disabled={_v.status?.toLowerCase() !== "failed"}
              />
            </Col> */}
          </Row>
        );
      },
    },
  ];
};
