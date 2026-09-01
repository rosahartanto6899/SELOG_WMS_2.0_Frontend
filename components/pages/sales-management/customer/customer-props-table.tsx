/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EyeOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import { DeleteOutlined, EditOutlined } from "@sera-components/icons";
import StatusTag from "@sera-components/status-tag";
import { CustomerSalesMaster } from "@sera-types/customer.type";
import { ROUTE } from "@sera-utils/constants/routes";
import useCheckPermission from "@sera-utils/hooks/useCheckPermission";
import PermissionUtils from "@sera-utils/permission-utils";
import { Col, Row } from "antd";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const menuBranch: any = PermissionUtils().getAccessMenuPermission(
  ROUTE.SALES_MANAGEMENT.CUSTOMER,
);

export const actionCustomer = {
  isRead: menuBranch?.data?.isRead || false,
  isCreate: menuBranch?.data?.isCreate || false,
  isUpdate: menuBranch?.data?.isUpdate || false,
  isDelete: menuBranch?.data?.isDelete || false,
};

export const SearchByOptions = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "customer.table.options",
  });

  return [
    { label: t("0"), value: "cmd" },
    { label: t("1"), value: "name" },
  ];
};

export const COLUMNS_DEFAULT_UNCHECK = ["termOfPayment"];

export const Columns = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "customer.table",
  });

  const { isUpdate } = useCheckPermission({
    menuLink: ROUTE.SALES_MANAGEMENT.CUSTOMER,
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
      key: "cmd",
      dataIndex: "cmd",
      title: t("column.cmd"),
      sorter: true,
      fixed: "left",
    },
    {
      key: "name",
      dataIndex: "name",
      title: t("column.name"),
      sorter: true,
      fixed: "left",
    },
    {
      key: "status",
      dataIndex: "status",
      title: t("column.status"),
      align: "center",
      render: (_record: string) => (
        <StatusTag value={_record} block fallback="warning" />
      ),
    },
    {
      key: "street",
      dataIndex: "street",
      title: t("column.street"),
    },
    {
      key: "city",
      dataIndex: "city",
      title: t("column.city"),
    },
    {
      key: "phone",
      dataIndex: "phone",
      title: t("column.phone"),
    },
    {
      key: "email",
      dataIndex: "email",
      title: t("column.email"),
    },
    {
      key: "industry",
      dataIndex: "industry",
      title: t("column.industry"),
    },
    {
      key: "category",
      dataIndex: "category",
      title: t("column.category"),
    },
    {
      key: "termOfPayment",
      dataIndex: "termOfPayment",
      title: t("column.termOfPayment"),
    },
    {
      title: t("column.actions"),
      key: "operation",
      fixed: "right",
      width: 100,
      exception: true,
      render: (record: any) => (
        <Row justify="center" gutter={[8, 0]}>
          <Col>
            <Link
              id="link-view-customer"
              href={`${ROUTE.SALES_MANAGEMENT.CUSTOMER}/${record.id}`}
              passHref
            >
              <Button
                id="view-button"
                size="small"
                tooltip={t("button.detail.tooltip")}
                type="link"
                icon={<EyeOutlined />}
              />
            </Link>
          </Col>

          {isUpdate ? (
            <Col>
              <Link
                id="link-edit-customer"
                href={`${ROUTE.SALES_MANAGEMENT.CUSTOMER}/edit/${record.id}`}
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
        </Row>
      ),
    },
  ]?.map((_column) => ({ ..._column, hidden: false }));
};

interface SalesColumnsProps {
  isRead: boolean;
  onDeleteAction: (_record: string) => void;
}

export const SalesColumns = ({ isRead, onDeleteAction }: SalesColumnsProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "customer.form.sales.table",
  });

  return [
    {
      key: "no",
      dataIndex: "no",
      title: "No",
      fixed: "left",
      width: 60,
      align: "center",
    },
    {
      key: "branch",
      dataIndex: "branch",
      title: t("column.branch"),
      render: (_record: CustomerSalesMaster) => _record?.name,
    },
    {
      key: "salesDealing",
      dataIndex: "salesDealing",
      title: t("column.salesDealing"),
      render: (_record: CustomerSalesMaster) => _record?.name,
    },
    {
      key: "salesServicing",
      dataIndex: "salesServicing",
      title: t("column.salesServicing"),
      align: "left",
      render: (_record: CustomerSalesMaster) => _record?.name,
    },
    {
      key: "operation",
      dataIndex: "id",
      title: t("column.actions"),
      fixed: "right",
      hidden: isRead,
      render: (_record: string) => (
        <Row justify="center" gutter={[8, 0]}>
          <Col>
            <Button
              id="delete-button"
              size="small"
              tooltip={t("button.delete.tooltip")}
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDeleteAction(_record)}
            />
          </Col>
        </Row>
      ),
    },
  ];
};

export const ContactColumns = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "customer.form.contact.table",
  });

  return [
    {
      key: "no",
      dataIndex: "no",
      title: "No",
      fixed: "left",
      width: 60,
      align: "center",
    },
    {
      title: t("column.name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("column.department"),
      dataIndex: "department",
      key: "department",
    },
    {
      title: t("column.phone"),
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: t("column.mobilePhone"),
      dataIndex: "mobilePhone",
      key: "mobilePhone",
    },
    {
      title: t("column.email"),
      dataIndex: "email",
      key: "email",
      align: "left",
    },
  ];
};
