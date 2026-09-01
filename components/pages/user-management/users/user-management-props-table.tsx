/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EyeOutlined } from "@ant-design/icons";
import Badge from "@sera-components/badge";
import Button from "@sera-components/button";
import { DeleteOutlined, EditOutlined } from "@sera-components/icons";
import { User } from "@sera-types/user.type";
import FormatUtils from "@sera-utils/format";
import PermissionUtils from "@sera-utils/permission-utils";
import { UserStatusType } from "@sera-utils/settings/types";
import SettingsUtils from "@sera-utils/settings/utils";
import { Col, Row, Tag, Tooltip } from "antd";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";

interface ColumnsProps {
  onDeleteAction: (record: User) => void;
}

const menuUser: any = PermissionUtils().getAccessMenuPermission(
  `/user-management/users`,
);

export const actionUser = {
  isCreate: menuUser?.data?.isCreate || false,
  isUpdate: menuUser?.data?.isUpdate || false,
  isDelete: menuUser?.data?.isDelete || false,
  isRead: menuUser?.data?.isRead || false,
};

export const SearchByOptions = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "userManagement.table.options",
  });

  return [
    {
      label: t("0"),
      value: "name",
    },
    {
      label: t("1"),
      value: "email",
    },
  ];
};

export const Columns = ({ onDeleteAction }: ColumnsProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "userManagement.table.columns",
  });

  const { data: session } = useSession() as any;
  const { id } = session.detail.data.user;

  return [
    {
      title: "No.",
      key: "no",
      render: (text: number, record: User) => (
        <Row justify="center">
          <Col>{record.no}</Col>
        </Row>
      ),
      width: 60,
    },
    {
      title: t("name"),
      dataIndex: "name",
      key: "name",
      width: 250,
      sorter: true,
      truncate: true,
    },
    {
      title: t("email"),
      dataIndex: "email",
      key: "email",
      sorter: true,
      width: 250,
      truncate: true,
    },
    {
      title: t("nrp"),
      dataIndex: "nrp",
      key: "nrp",
      width: 150,
      render: (_: unknown, record: User) => {
        return record.nrp ?? "-";
      },
    },
    {
      title: t("role"),
      dataIndex: "role",
      key: "role",
      width: 200,
      render: (_: unknown, record: User) => {
        const roles = record?.roles || [];
        const allNames = roles.map((r) => r.name.toUpperCase()).join(", ");

        if (roles.length === 1) {
          const name = roles[0].name.toUpperCase();
          return (
            <Tooltip title={name}>
              <Tag
                color="green"
                style={{
                  maxWidth: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "inline-block",
                  verticalAlign: "middle",
                }}
              >
                {name}
              </Tag>
            </Tooltip>
          );
        }
        return (
          <Tooltip title={allNames}>
            <Tag color="green" style={{ cursor: "pointer" }}>
              +{roles.length} Roles
            </Tag>
          </Tooltip>
        );
      },
    },
    {
      title: t("status"),
      dataIndex: "isActive",
      key: "isActive",
      width: 150,
      render: (text: UserStatusType) => (
        <Badge
          color={SettingsUtils().getUserStatusColor(text)}
          text={SettingsUtils().getUserStatus(text)}
        />
      ),
    },
    {
      title: t("createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: true,
      width: 175,
      render: (text: any, record: any) =>
        FormatUtils().dateTimeTransform(record.createdAt),
    },
    {
      title: t("updatedAt"),
      dataIndex: "updatedAt",
      key: "updatedAt",
      sorter: true,
      width: 175,
      render: (text: any, record: any) =>
        FormatUtils().dateTimeTransform(record.updatedAt),
    },
    {
      title: t("actions"),
      key: "operation",
      fixed: "right",
      width: 120,
      render: (record: User) => (
        <Row justify="center" gutter={[8, 0]}>
          {actionUser.isRead ? (
            <Col>
              <Link
                id="link-edit-user"
                href={`/user-management/users/${record.id}`}
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
          {actionUser.isUpdate ? (
            <Col>
              <Link
                id="link-edit-user"
                href={`/user-management/users/edit/${record.id}`}
                passHref
              >
                <Button
                  id="edit-button"
                  size="small"
                  tooltip={t("button.update.tooltip")}
                  type="link"
                  disabled={record.id === id}
                  icon={<EditOutlined />}
                />
              </Link>
            </Col>
          ) : null}

          {actionUser.isDelete ? (
            <Col>
              <Button
                id="delete-button"
                size="small"
                tooltip={t("button.delete.tooltip")}
                type="link"
                danger
                disabled={record.id === id}
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
