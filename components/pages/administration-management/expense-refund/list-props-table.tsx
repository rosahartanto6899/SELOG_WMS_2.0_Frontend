import { EyeOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import { NUMBER_FORMAT } from "@sera-utils/constants/common";
import { Col, Row } from "antd";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export const UNCHECK_KEYS = [""];

export const ColumnsList = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "expenseRefund.table.column",
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
    // {
    //   key: "A",
    //   dataIndex: "expenseStatus",
    //   title: t("A"),
    //   fixed: "left",
    //   render: (record: string) => {
    //     return <StatusTag value={record} block />;
    //   },
    // },
    {
      key: "B",
      dataIndex: "shipmentNumber",
      title: t("B"),
      fixed: "left",
    },
    {
      key: "C",
      dataIndex: "bookingNumber",
      title: t("C"),
    },
    {
      key: "D",
      dataIndex: "customerName",
      title: t("D"),
    },
    {
      key: "E",
      dataIndex: "shipmentType",
      title: t("E"),
    },
    {
      key: "F",
      dataIndex: "unitType",
      title: t("F"),
    },
    {
      key: "G",
      dataIndex: "origin",
      title: t("G"),
    },
    {
      key: "H",
      dataIndex: "destination",
      title: t("H"),
    },
    {
      key: "I",
      dataIndex: "licensePlate",
      title: t("I"),
    },
    {
      key: "J",
      dataIndex: "driver1Name",
      title: t("J"),
      render: (_value: string | null) => _value ?? "-",
    },
    {
      key: "K",
      dataIndex: "driver2Name",
      title: t("K"),
      render: (_value: string | null) => _value ?? "-",
    },
    {
      key: "L",
      dataIndex: "expenseTransferred",
      title: t("L"),
      render: (_value: string) =>
        _value ? `Rp.${NUMBER_FORMAT(_value)}` : "-",
      fixed: "right",
    },
    {
      key: "M",
      dataIndex: "totalExpense",
      title: t("M"),
      render: (_value: string) =>
        _value ? `Rp.${NUMBER_FORMAT(_value)}` : "-",
      fixed: "right",
    },
    {
      key: "Z",
      title: t("Z"),
      align: "center",
      fixed: "right",
      render: (_record: any) => {
        return (
          <Row justify="center" gutter={[8, 4]}>
            <Col>
              <Link
                id="link-add-empty-miles"
                href={`/administration-management/expense-refund/${_record.shipmentId}?shipmentExpenseId=${_record.shipmentExpenseId}`}
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
          </Row>
        );
      },
    },
  ];
};

export const ColumnsSummaryRoute = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "additionalExpense.table",
  });

  return [
    {
      title: t("summaryColumn.type"),
      dataIndex: "type",
      key: "type",
      truncate: true,
      align: "left",
    },
    {
      title: t("summaryColumn.location"),
      dataIndex: "location",
      key: "location",
      truncate: true,
    },
    {
      title: t("summaryColumn.address"),
      dataIndex: "address",
      key: "address",
      truncate: true,
    },
    {
      title: t("summaryColumn.province"),
      dataIndex: "province",
      key: "province",
      truncate: true,
    },
    {
      title: t("summaryColumn.city"),
      dataIndex: "city",
      key: "city",
      truncate: true,
    },
    {
      title: t("summaryColumn.district"),
      dataIndex: "district",
      key: "district",
      truncate: true,
    },
    {
      title: t("summaryColumn.area"),
      dataIndex: "area",
      key: "area",
      truncate: true,
      align: "left",
    },
  ];
};
