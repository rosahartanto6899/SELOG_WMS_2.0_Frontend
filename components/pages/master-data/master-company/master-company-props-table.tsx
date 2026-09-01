/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "@sera-components/button";
import { DeleteOutlined, EditOutlined } from "@sera-components/icons";
import { Company } from "@sera-types/company.type";
import PermissionUtils from "@sera-utils/permission-utils";
import { Col, Row } from "antd";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import useGetPermissionMasterData from "../hooks/useGetPermission";

interface ColumnsProps {
  onDeleteAction: (record: any) => void;
}

const menuCompany: any = PermissionUtils().getAccessMenuPermission(
  `/master-data/master-company`,
);

export const actionCompany = {
  isCreate: menuCompany?.data?.isCreate || false,
  isUpdate: menuCompany?.data?.isUpdate || false,
  isDelete: menuCompany?.data?.isDelete || false,
};

export const SearchByOptions = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "company.table.options",
  });

  return [
    {
      label: t("0"),
      value: "code",
    },
    {
      label: t("1"),
      value: "name",
    },
  ];
};

export const Columns = ({ onDeleteAction }: ColumnsProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: "company" });
  const { isUpdate, isDelete } = useGetPermissionMasterData("master-company");

  return [
    {
      title: "No.",
      key: "no",
      render: (text: number, record: Company) => (
        <Row justify="center">
          <Col>{record.no}</Col>
        </Row>
      ),
      width: 60,
    },
    {
      title: t("table.column.name"),
      dataIndex: "name",
      key: "name",
      sorter: true,
      width: 250,
    },
    {
      title: t("table.column.code"),
      dataIndex: "code",
      key: "code",
      justify: "left",
      align: "left",
      sorter: true,
    },
    {
      title: t("table.column.actions"),
      key: "operation",
      fixed: "right",
      width: 120,
      hidden: !isUpdate && !isDelete,
      render: (record: Company) => (
        <Row justify="center" gutter={[8, 0]}>
          {isUpdate ? (
            <Col>
              <Link
                id="link-edit-budget"
                href={`/master-data/master-company/edit/${record.code}`}
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
