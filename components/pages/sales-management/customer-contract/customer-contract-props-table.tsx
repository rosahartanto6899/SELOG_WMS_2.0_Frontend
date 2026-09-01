/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EyeOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import { DATE_FORMAT, DEFAULT_FORMAT_DATE } from "@sera-utils/constants/common";
import { ROUTE } from "@sera-utils/constants/routes";
import PermissionUtils from "@sera-utils/permission-utils";
import { Col, Row } from "antd";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const menuSales: any = PermissionUtils().getAccessMenuPermission(
  ROUTE.SALES_MANAGEMENT.CUSTOMER_CONTRACT,
);

export const actionCustomerContract = {
  isRead: menuSales?.data?.isRead || false,
  isCreate: menuSales?.data?.isCreate || false,
  isUpdate: menuSales?.data?.isUpdate || false,
  isDelete: menuSales?.data?.isDelete || false,
};

export const COLUMNS_DEFAULT_UNCHECK = [
  "quotationValidFromDate",
  "quotationValidToDate",
  "quotationCreatedDate",
  "quotationCreatedBy",
];

export const SearchByOptions = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "customerContract.table.contract.options",
  });

  return [
    { label: t("0"), value: "cmd" },
    { label: t("1"), value: "customerName" },
    { label: t("2"), value: "contractNo" },
  ];
};

export const Columns = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "customerContract.table.contract",
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
      key: "cmd",
      dataIndex: "cmd",
      title: t("column.cmd"),
      fixed: "left",
    },
    {
      key: "customerName",
      dataIndex: "customerName",
      title: t("column.customerName"),
      fixed: "left",
    },
    {
      key: "contractNo",
      dataIndex: "contractNo",
      title: t("column.contractNo"),
      fixed: "left",
    },
    {
      key: "startDate",
      dataIndex: "startDate",
      title: t("column.startDate"),
      align: "center",
      sorter: true,
      render: (_record: string) => DATE_FORMAT(_record, DEFAULT_FORMAT_DATE),
    },
    {
      key: "endDate",
      dataIndex: "endDate",
      title: t("column.endDate"),
      align: "center",
      sorter: true,
      render: (_record: string) => DATE_FORMAT(_record, DEFAULT_FORMAT_DATE),
    },
    {
      key: "createdDate",
      dataIndex: "createdDate",
      title: t("column.createdDate"),
      align: "center",
      render: (_record: string) => DATE_FORMAT(_record, DEFAULT_FORMAT_DATE),
    },
    {
      key: "createdBy",
      dataIndex: "createdBy",
      title: t("column.createdBy"),
    },
    {
      key: "quotationSalesDocument",
      dataIndex: "quotationSalesDocument",
      title: t("column.quotationSalesDocument"),
    },
    {
      key: "quotationValidFromDate",
      dataIndex: "quotationValidFromDate",
      title: t("column.quotationValidFromDate"),
      align: "center",
      render: (_record: string) => DATE_FORMAT(_record, DEFAULT_FORMAT_DATE),
    },
    {
      key: "quotationValidToDate",
      dataIndex: "quotationValidToDate",
      title: t("column.quotationValidToDate"),
      align: "center",
      render: (_record: string) => DATE_FORMAT(_record, DEFAULT_FORMAT_DATE),
    },
    {
      key: "quotationCreatedDate",
      dataIndex: "quotationCreatedDate",
      title: t("column.quotationCreatedDate"),
      align: "center",
      render: (_record: string) => DATE_FORMAT(_record, DEFAULT_FORMAT_DATE),
    },
    {
      key: "quotationCreatedBy",
      dataIndex: "quotationCreatedBy",
      title: t("column.quotationCreatedBy"),
    },
    {
      key: "operation",
      dataIndex: "id",
      title: t("column.actions"),
      fixed: "right",
      exception: true,
      render: (_record: string) => (
        <Row justify="center" gutter={[8, 0]}>
          <Col>
            <Link
              id="link-view-customer-contract"
              href={`${ROUTE.SALES_MANAGEMENT.CUSTOMER_CONTRACT}/${_record}`}
              passHref
            >
              <Button
                id="view-button"
                size="small"
                tooltip={t("button.read.tooltip")}
                type="link"
                icon={<EyeOutlined />}
              />
            </Link>
          </Col>
        </Row>
      ),
    },
  ]?.map((_column) => ({ ..._column, hidden: false }));
};

export const ColumnsListMaterial = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "customerContract.table.material",
  });

  return [
    {
      key: "materialCode",
      dataIndex: "materialCode",
      title: t("column.materialCode"),
      align: "left",
    },
    {
      key: "materialName",
      dataIndex: "materialName",
      title: t("column.materialName"),
    },
    {
      key: "vehicleTypeName",
      dataIndex: "vehicleTypeName",
      title: t("column.vehicleTypeName"),
    },
    {
      key: "shipmentType",
      dataIndex: "shipmentType",
      title: t("column.shipmentType"),
    },
    {
      key: "salesOffice",
      dataIndex: "salesOffice",
      title: t("column.salesOffice"),
      align: "left",
    },
  ];
};
