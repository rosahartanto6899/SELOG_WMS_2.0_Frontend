/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "@sera-components/button";
import { DeleteOutlined, EditOutlined } from "@sera-components/icons";
import { BusinessArea } from "@sera-types/business-area.type";
import { ROUTE } from "@sera-utils/constants/routes";
import PermissionUtils from "@sera-utils/permission-utils";
import { Col, Row } from "antd";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import useGetPermissionMasterData from "../hooks/useGetPermission";

interface ColumnsProps {
  onDeleteAction: (record: any) => void;
}

const menuBranch: any = PermissionUtils().getAccessMenuPermission(
  `/master-data/master-branch`,
);

export const actionBranch = {
  isCreate: menuBranch?.data?.isCreate || false,
  isUpdate: menuBranch?.data?.isUpdate || false,
  isDelete: menuBranch?.data?.isDelete || false,
};

export const SearchByOptions = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "businessArea.table.options",
  });

  return [{ label: t("0"), value: "name" }];
};

export const Columns = ({ onDeleteAction }: ColumnsProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: "businessArea.table" });
  const { isUpdate, isDelete } = useGetPermissionMasterData("master-branch");

  return [
    {
      title: "No.",
      key: "no",
      render: (_: never, record: BusinessArea) => (
        <Row justify="center">
          <Col>{record.no}</Col>
        </Row>
      ),
      width: 60,
    },
    {
      title: t("column.code"),
      dataIndex: "code",
      key: "code",
      sorter: true,
    },
    {
      title: t("column.name"),
      dataIndex: "name",
      key: "name",
      sorter: true,
    },
    {
      title: t("column.actions"),
      key: "operation",
      fixed: "right",
      width: 120,
      hidden: !isUpdate && !isDelete,
      render: (record: BusinessArea) => (
        <Row justify="center" gutter={[8, 0]}>
          {isUpdate ? (
            <Col>
              <Link
                id="link-edit-branch"
                href={`${ROUTE.MASTER_DATA.MASTER_BRANCH}/edit/${record.id}`}
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
