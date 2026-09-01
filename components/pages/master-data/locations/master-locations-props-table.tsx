/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "@sera-components/button";
import { DeleteOutlined, EditOutlined } from "@sera-components/icons";
import { Location } from "@sera-types/location.type";
import { ROUTE } from "@sera-utils/constants/routes";
import PermissionUtils from "@sera-utils/permission-utils";
import { Col, Row, Tooltip } from "antd";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import useGetPermissionMasterData from "../hooks/useGetPermission";

interface ColumnsProps {
  onDeleteAction: (record: any) => void;
}

const menuLocation: any = PermissionUtils().getAccessMenuPermission(
  `/master-data/locations`,
);

export const actionBranch = {
  isCreate: menuLocation?.data?.isCreate || false,
  isUpdate: menuLocation?.data?.isUpdate || false,
  isDelete: menuLocation?.data?.isDelete || false,
};

export const SearchByOptions = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "location.table.options",
  });

  return [
    { label: t("0"), value: "name" },
    { label: t("1"), value: "province" },
    { label: t("2"), value: "type" },
  ];
};

export const Columns = ({ onDeleteAction }: ColumnsProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: "location.table" });
  const { isUpdate, isDelete } = useGetPermissionMasterData("locations");

  return [
    {
      title: "No.",
      key: "no",
      render: (_: never, record: Location) => (
        <Row justify="center">
          <Col>{record.no}</Col>
        </Row>
      ),
      fixed: "left",
      width: 60,
    },
    {
      title: t("column.name"),
      dataIndex: "name",
      key: "name",
      sorter: true,
      width: 160,
      fixed: "left",
      truncate: true,
    },
    {
      title: t("column.type"),
      dataIndex: "type",
      key: "type",
      width: 160,
      truncate: true,
    },
    {
      title: t("column.address"),
      dataIndex: "address",
      key: "address",
      width: 160,
      truncate: true,
    },
    {
      title: t("column.province"),
      dataIndex: ["province", "name"],
      key: "province.name",
      width: 210,
      ellipsis: true,
      render: (_: never, record: Location) => {
        const text = record.province?.name ?? "-";
        return (
          <Tooltip title={text}>
            <div
              style={{
                maxWidth: 200,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {text}
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: t("column.city"),
      dataIndex: ["city", "name"],
      key: "city.name",
      width: 210,
      ellipsis: true,
      render: (_: never, record: Location) => {
        const text = record.city?.name ?? "-";
        return (
          <Tooltip title={text}>
            <div
              style={{
                maxWidth: 200,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {text}
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: t("column.district"),
      dataIndex: ["district", "name"],
      key: "district.name",
      width: 210,
      ellipsis: true,
      render: (_: never, record: Location) => {
        const text = record.district?.name ?? "-";
        return (
          <Tooltip title={text}>
            <div
              style={{
                maxWidth: 200,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {text}
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: t("column.area"),
      dataIndex: "area",
      key: "area",
      width: 160,
      truncate: true,
    },
    {
      title: t("column.coordinate"),
      dataIndex: "coordinate",
      key: "coordinate",
      width: 160,
      truncate: true,
    },
    {
      title: t("column.actions"),
      key: "operation",
      fixed: "right",
      width: 120,
      hidden: !isUpdate && !isDelete,
      render: (_: never, record: Location) => (
        <Row justify="center" gutter={[8, 0]}>
          {isUpdate ? (
            <Col>
              <Link
                id="link-edit-branch"
                href={`${ROUTE.MASTER_DATA.LOCATION}/edit/${record.id}`}
                passHref
              >
                <Button
                  id="edit-button"
                  size="small"
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
                id="delete-button"
                size="small"
                tooltip={t("button.delete.tooltip")}
                type="link"
                danger
                icon={<DeleteOutlined />}
                onClick={() => onDeleteAction(record)}
              />
            </Col>
          ) : null}
        </Row>
      ),
    },
  ];
};
