/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "@sera-components/button";
import { DeleteOutlined, EditOutlined } from "@sera-components/icons";
import { Menu, Menus } from "@sera-types/menu.type";
import { Col, Row } from "antd";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useTranslation } from "react-i18next";

interface ColumnsProps {
  onDeleteAction: (record: Menu) => void;
  isUpdate: boolean;
  isDelete: boolean;
  menuLink: string;
}

const DynamicIcon = dynamic(
  () => import("@sera-components/icons/DynamicIcon"),
  {
    ssr: false,
  },
);

export const SearchByOptions = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "menuConfiguration.table.options",
  });

  return [
    {
      label: t("0"),
      value: "menuName",
    },
    {
      label: t("1"),
      value: "menuLink",
    },
  ];
};

export const Columns = ({
  onDeleteAction,
  isUpdate = false,
  isDelete = false,
  menuLink = "",
}: ColumnsProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "menuConfiguration.table",
  });

  return [
    {
      title: "",
      dataIndex: "id",
      key: "id",
      width: 20,
      colSpan: 0,
      render: () => "",
    },
    {
      title: "",
      dataIndex: "no",
      key: "no",
      width: 20,
      colSpan: 0,
      render: () => "",
    },
    {
      title: t("columns.icon"),
      dataIndex: "menuIcon",
      key: "menuIcon",
      width: 40,
      colSpan: 3,
      render: (record: string) => <DynamicIcon type={record} />,
      onCell: (data: Menus) => {
        const returnObject = { colSpan: 3, className: "col-icon" };

        if (!data.parentId) {
          returnObject.colSpan = 3;
        } else if (data.parentId && data.children) {
          returnObject.colSpan = 2;
        } else {
          returnObject.colSpan = 1;
        }

        return returnObject;
      },
    },
    {
      title: t("columns.name"),
      dataIndex: "menuName",
      key: "menuName",
      truncate: true,
      width: 150,
    },
    {
      title: t("columns.menuLink"),
      dataIndex: "menuLink",
      key: "menuLink",
      truncate: true,
      width: 250,
    },
    {
      title: t("columns.parent"),
      dataIndex: "parent",
      key: "parent",
      width: 150,
      render: (record: Menu) =>
        record ? <span>{record.menuName}</span> : null,
    },
    {
      title: t("columns.actions"),
      key: "operation",
      fixed: "right",
      width: 90,
      render: (record: Menu) => (
        <Row justify="center" gutter={[8, 0]}>
          {isUpdate ? (
            <Col>
              <Link
                id="link-edit-menu-configuration"
                href={`${menuLink}/edit/${record.id}`}
                passHref
              >
                <Button
                  id="edit-button"
                  size="small"
                  type="link"
                  tooltip={t("button.update.tooltip")}
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
                type="link"
                danger
                disabled={false}
                icon={<DeleteOutlined />}
                tooltip={t("button.delete.tooltip")}
                onClick={() => onDeleteAction(record)}
              />
            </Col>
          ) : null}
        </Row>
      ),
    },
  ];
};
