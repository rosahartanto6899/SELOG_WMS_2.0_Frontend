/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "@sera-components/button";
import { DeleteOutlined, EditOutlined } from "@sera-components/icons";
import { VehicleType } from "@sera-types/vehicle-type.type";
import PermissionUtils from "@sera-utils/permission-utils";
import { Col, Row } from "antd";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import useGetPermissionMasterData from "../hooks/useGetPermission";

interface ColumnsProps {
  onDeleteAction: (record: any) => void;
}

const menuVehicleType: any = PermissionUtils().getAccessMenuPermission(
  `/master-data/vehicle-type`,
);

export const actionVehicleType = {
  isCreate: menuVehicleType?.data?.isCreate || false,
  isUpdate: menuVehicleType?.data?.isUpdate || false,
  isDelete: menuVehicleType?.data?.isDelete || false,
};

export const SearchByOptions = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "vehicleType.table.options",
  });

  return [
    {
      label: t("0"),
      value: "name",
    },
  ];
};

export const Columns = ({ onDeleteAction }: ColumnsProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: "vehicleType" });
  const { isUpdate, isDelete } = useGetPermissionMasterData("vehicle-type");
  return [
    {
      title: "No.",
      key: "no",
      render: (text: number, record: VehicleType, index: number) => (
        <Row justify="center">
          <Col>{index + 1}</Col>
        </Row>
      ),
      width: 60,
    },
    {
      title: t("table.column.code"),
      dataIndex: "code",
      key: "code",
      sorter: true,
      width: 150,
    },
    {
      title: t("table.column.name"),
      dataIndex: "name",
      key: "name",
      sorter: true,
      width: 250,
      truncate: true,
    },
    {
      title: t("table.column.group"),
      dataIndex: "group",
      key: "group",
      sorter: true,
      width: 250,
    },
    {
      title: t("table.column.actions"),
      key: "actions",
      fixed: "right",
      width: 120,
      hidden: !isUpdate && !isDelete,
      render: (record: VehicleType) => (
        <Row justify="center" gutter={[8, 0]}>
          {isUpdate ? (
            <Col>
              <Link
                id="link-edit-vehicle-type"
                href={`/master-data/vehicle-type/edit/${record.id}`}
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
