/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EyeOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import { DeleteOutlined, EditOutlined } from "@sera-components/icons";
import { CustomerRoute } from "@sera-types/customer-route.type";
import { ROUTE } from "@sera-utils/constants/routes";
import FormatUtils from "@sera-utils/format";
import useCheckPermission from "@sera-utils/hooks/useCheckPermission";
import PermissionUtils from "@sera-utils/permission-utils";
import { Col, Row } from "antd";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const menuBranch: any = PermissionUtils().getAccessMenuPermission(
  ROUTE.SALES_MANAGEMENT.CUSTOMER_ROUTE,
);

export const actionCustomerRoute = {
  isRead: menuBranch?.data?.isRead || false,
  isCreate: menuBranch?.data?.isCreate || false,
  isUpdate: menuBranch?.data?.isUpdate || false,
  isDelete: menuBranch?.data?.isDelete || false,
};

export const SearchByOptions = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "customerRoute.table.options",
  });

  return [
    { label: t("0"), value: "routeCode" },
    { label: t("1"), value: "cmdCode" },
    { label: t("2"), value: "customerName" },
  ];
};

export const COLUMNS_DEFAULT_UNCHECK = [""];

interface ColumnsProps {
  onDeleteAction?: (record: any) => void;
}

export const Columns = ({ onDeleteAction }: ColumnsProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "customerRoute.table",
  });

  const { isUpdate, isDelete } = useCheckPermission({
    menuLink: ROUTE.SALES_MANAGEMENT.CUSTOMER_ROUTE,
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
      key: "routeCode",
      dataIndex: "routeCode",
      title: t("column.routeCode"),
      sorter: true,
      fixed: "left",
    },
    {
      key: "cmdCode",
      dataIndex: "cmdCode",
      title: t("column.cmdCode"),
      sorter: true,
      fixed: "left",
    },
    {
      key: "customerName",
      dataIndex: "customerName",
      title: t("column.customerName"),
      sorter: true,
      fixed: "left",
    },
    {
      key: "contractNo",
      dataIndex: "contractNo",
      title: t("column.contractNo"),
    },
    {
      key: "vehicleTypeName",
      dataIndex: "vehicleTypeName",
      title: t("column.vehicleTypeName"),
    },
    {
      key: "origin",
      dataIndex: "origin",
      title: t("column.origin"),
    },
    {
      key: "areaOrigin",
      dataIndex: "areaOrigin",
      title: t("column.areaOrigin"),
    },
    {
      key: "detailOrigin",
      dataIndex: "detailOrigin",
      title: t("column.detailOrigin"),
      width: 200,
      truncate: true,
    },
    {
      key: "destination",
      dataIndex: "destination",
      title: t("column.destination"),
    },
    {
      key: "areaDestination",
      dataIndex: "areaDestination",
      title: t("column.areaDestination"),
    },
    {
      key: "detailDestination",
      dataIndex: "detailDestination",
      title: t("column.detailDestination"),
      width: 200,
      truncate: true,
    },
    {
      key: "revenuePerShipment",
      dataIndex: "revenuePerShipment",
      title: t("column.revenuePerShipment"),
      render: (_: never, record: CustomerRoute) => {
        return (
          <span>{`${FormatUtils().formatCurrency(record.revenuePerShipment ?? 0)}`}</span>
        );
      },
    },
    // {
    //   key: "cost",
    //   dataIndex: "cost",
    //   title: t("column.cost"),
    //   render: (_: never, record: CustomerRoute) => {
    //     return (
    //       <span>{`${FormatUtils().formatCurrency(record.cost ?? 0)}`}</span>
    //     );
    //   },
    // },
    {
      key: "operation",
      dataIndex: "customerRouteId",
      title: t("column.actions"),
      fixed: "right",
      exception: true,
      render: (_record: string) => (
        <Row justify="center" gutter={[8, 0]}>
          <Col>
            <Link
              id="link-detail-customer-route"
              href={`${ROUTE.SALES_MANAGEMENT.CUSTOMER_ROUTE}/${_record}`}
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

          {isUpdate ? (
            <Col>
              <Link
                id="link-edit-customer-route"
                href={`${ROUTE.SALES_MANAGEMENT.CUSTOMER_ROUTE}/edit/${_record}`}
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
                onClick={() => onDeleteAction && onDeleteAction(_record)}
              />
            </Col>
          ) : null}
        </Row>
      ),
    },
  ]?.map((_column) => ({ ..._column, hidden: false }));
};
