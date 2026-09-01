import { EyeOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import StatusTag from "@sera-components/status-tag";
import { MasterDataItem } from "@sera-types/master-data.type";
import { DATE_FORMAT, FORMAT_DATE_TIME } from "@sera-utils/constants/common";
import { Col, Row } from "antd";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import useGetPermission from "../hooks/useGetPermission";

export const UNCHECK_KEYS = ["C", "E", "H", "I", "J", "L"];

interface ColumnsListProps {
  statuses?: MasterDataItem[];
}

export const ColumnsList = ({ statuses }: ColumnsListProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "tracingAndTracking.table.column",
  });

  const { isRead } = useGetPermission("tracing-and-tracking");

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
      dataIndex: "status",
      title: t("A"),
      fixed: "left",
      align: "center",
      render: (_record: string) => {
        const _data = statuses?.find((_item) => _record === _item?.name);
        return <StatusTag value={_record} color={_data?.color ?? ""} block />;
      },
    },
    {
      key: "B",
      dataIndex: "shipmentNo",
      title: t("B"),
      fixed: "left",
    },
    {
      key: "C",
      dataIndex: "shipmentType",
      title: t("C"),
      fixed: "left",
    },
    {
      key: "D",
      dataIndex: "customerName",
      title: t("D"),
    },
    {
      key: "E",
      dataIndex: "unitType",
      title: t("E"),
    },
    {
      key: "F",
      dataIndex: "origin",
      title: t("F"),
    },
    {
      key: "G",
      dataIndex: "destination",
      title: t("G"),
    },
    {
      key: "H",
      dataIndex: "licensePlate",
      title: t("H"),
    },
    {
      key: "I",
      dataIndex: "driver1",
      title: t("I"),
    },
    {
      key: "J",
      dataIndex: "driver2",
      title: t("J"),
    },
    {
      key: "K",
      dataIndex: ["lastPosition", "address"],
      width: 160,
      truncate: true,
      title: t("K"),
      render: (_value: string | null) => _value ?? "-",
    },
    {
      key: "L",
      dataIndex: "lastUpdated",
      title: t("L"),
      render: (_value: string) =>
        _value ? DATE_FORMAT(_value, FORMAT_DATE_TIME) : "-",
    },
    {
      key: "Z",
      dataIndex: "id",
      title: t("Z"),
      align: "center",
      fixed: "right",
      render: (_record: string) => {
        return (
          <Row justify="center" gutter={[8, 4]}>
            {isRead && (
              <Col>
                <Link
                  id="link-add-empty-miles"
                  href={`/journey-management/tracing-and-tracking/${_record}`}
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
            )}
          </Row>
        );
      },
    },
  ];
};
