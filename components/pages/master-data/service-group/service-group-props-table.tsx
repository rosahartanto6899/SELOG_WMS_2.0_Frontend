/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "@sera-components/button";
import { DeleteOutlined, EditOutlined } from "@sera-components/icons";
import { ServiceGroup } from "@sera-types/service-group.type";
import { ROUTE } from "@sera-utils/constants/routes";
import { Col, Row } from "antd";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import useGetPermissionMasterData from "../hooks/useGetPermission";

export const SearchByOptions = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "serviceGroup.table.options",
  });

  return [
    { label: t("0"), value: "name" },
    { label: t("1"), value: "branchName" },
  ];
};

interface ColumnsProps {
  onDeleteAction: (record: any) => void;
}

export const Columns = ({ onDeleteAction }: ColumnsProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: "serviceGroup.table" });
  const { isUpdate, isDelete } = useGetPermissionMasterData("service-group");

  return [
    {
      title: "No.",
      key: "no",
      render: (_: never, record: ServiceGroup) => (
        <Row justify="center">
          <Col>{record.no}</Col>
        </Row>
      ),
      width: 60,
    },
    {
      title: t("column.name"),
      dataIndex: "name",
      key: "name",
      sorter: true,
    },
    {
      title: t("column.branchName"),
      dataIndex: "branchName",
      key: "branchName",
      sorter: true,
    },
    {
      title: t("column.actions"),
      key: "actions",
      fixed: "right",
      width: 120,
      hidden: !isUpdate && !isDelete,
      render: (record: ServiceGroup) => (
        <Row justify="center" gutter={[8, 0]}>
          {isUpdate && (
            <Col>
              <Link
                id="link-edit-service-group"
                href={`${ROUTE.MASTER_DATA.SERVICE_GROUP}/edit/${record.id}`}
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
          )}

          {isDelete && (
            <Col>
              <Button
                id="delete-service-group"
                size="small"
                tooltip={t("button.delete.tooltip")}
                type="link"
                danger
                icon={<DeleteOutlined />}
                onClick={() => onDeleteAction(record)}
              />
            </Col>
          )}
        </Row>
      ),
    },
  ];
};
