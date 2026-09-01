/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EyeOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import { DeleteOutlined, EditOutlined } from "@sera-components/icons";
import {
  CustomerLocation,
  OperationDay,
} from "@sera-types/customer-location.type";
import { ROUTE } from "@sera-utils/constants/routes";
import useCheckPermission from "@sera-utils/hooks/useCheckPermission";
import PermissionUtils from "@sera-utils/permission-utils";
import { Col, Row, Tooltip } from "antd";
import Link from "next/link";
import { useTranslation } from "react-i18next";

interface ColumnsProps {
  onDeleteAction?: (record: any) => void;
}

const menuCustomerLocation: any = PermissionUtils().getAccessMenuPermission(
  `/sales-management/customer-locations`,
);

export const actionBranch = {
  isCreate: menuCustomerLocation?.data?.isCreate || false,
  isUpdate: menuCustomerLocation?.data?.isUpdate || false,
  isDelete: menuCustomerLocation?.data?.isDelete || false,
};

export const CUSTOMER_LOCATION_DEFAULT_UNCHECK = ["operationDays"];

export const SearchByOptions = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "customerLocation.table.options",
  });

  return [{ label: t("0"), value: "name" }];
};

export const Columns = ({ onDeleteAction }: ColumnsProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "customerLocation.table",
  });
  const { isUpdate, isDelete, isRead } = useCheckPermission({
    menuLink: ROUTE.SALES_MANAGEMENT.CUSTOMER_LOCATION,
  });

  return [
    {
      title: "No.",
      key: "no",
      render: (_: never, record: CustomerLocation) => (
        <Row justify="center">
          <Col>{record.no}</Col>
        </Row>
      ),
      fixed: "left",
      width: 60,
      exception: true,
    },
    {
      title: t("column.customer"),
      dataIndex: ["customer", "name"],
      key: "customer.name",
      fixed: "left",
      width: 160,
      ellipsis: true,
      render: (_: never, record: CustomerLocation) => {
        const text = record.customer?.name ?? "-";
        return (
          <Tooltip title={text}>
            <div
              style={{
                maxWidth: 200,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {text}
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: t("column.name"),
      dataIndex: "name",
      key: "name",
      sorter: true,
      width: 175,
      fixed: "left",
      truncate: true,
    },
    {
      title: t("column.address"),
      dataIndex: "address",
      key: "address",
      width: 210,
      truncate: true,
    },
    {
      title: t("column.province"),
      dataIndex: ["province", "name"],
      key: "province.name",
      width: 210,
      ellipsis: true,
      render: (_: never, record: CustomerLocation) => {
        const text = record.province?.name ?? "-";
        return (
          <Tooltip title={text}>
            <div
              style={{
                maxWidth: 200,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {text}
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: t("column.city"),
      dataIndex: ["city", "name"],
      key: "city.name",
      width: 210,
      ellipsis: true,
      render: (_: never, record: CustomerLocation) => {
        const text = record.city?.name ?? "-";
        return (
          <Tooltip title={text}>
            <div
              style={{
                maxWidth: 200,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {text}
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: t("column.district"),
      dataIndex: ["district", "name"],
      key: "district.name",
      width: 210,
      ellipsis: true,
      render: (_: never, record: CustomerLocation) => {
        const text = record.district?.name ?? "-";
        return (
          <Tooltip title={text}>
            <div
              style={{
                maxWidth: 200,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {text}
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: t("column.area"),
      dataIndex: "area",
      key: "area",
      width: 130,
      truncate: true,
    },
    {
      title: t("column.coordinate"),
      dataIndex: "coordinate",
      key: "coordinate",
      width: 160,
      truncate: true,
    },
    {
      title: t("column.operationDays"),
      dataIndex: "operationDays",
      key: "operationDays",
      width: 230,
      render: (_: never, record: CustomerLocation) => {
        const operationDays = record.operationDays ?? [];

        if (operationDays.length === 0) return "-";

        const dayOrder = [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ];

        const sorted = [...operationDays].sort(
          (a, b) =>
            dayOrder.indexOf(a.day ?? "") - dayOrder.indexOf(b.day ?? ""),
        );

        const formatHours = (item: OperationDay) => {
          if (!item.isOpened) return "Closed";
          const open = item.openedHour?.slice(0, 5) ?? "";
          const close = item.closedHour?.slice(0, 5) ?? "";
          return `${open} - ${close}`;
        };

        const grouped: { days: string; hours: string }[] = [];

        let start: string | null = null;
        let end: string | null = null;
        let prevHours: string | null = null;

        sorted.forEach((item) => {
          const currentDay = item.day ?? "";
          const hours = formatHours(item);

          if (hours !== prevHours) {
            if (start && end) {
              grouped.push({
                days: start === end ? start : `${start} - ${end}`,
                hours: prevHours ?? "",
              });
            }
            start = currentDay;
            end = currentDay;
          } else {
            end = currentDay;
          }

          prevHours = hours;
        });

        if (start && end && prevHours !== null) {
          grouped.push({
            days: start === end ? start : `${start} - ${end}`,
            hours: prevHours,
          });
        }

        return (
          <div>
            {grouped.map((g, idx) => (
              <div key={idx}>
                <strong>{g.days}</strong>: {g.hours}
              </div>
            ))}
          </div>
        );
      },
    },
    {
      title: t("column.actions"),
      key: "operation",
      fixed: "right",
      exception: true,
      width: 120,
      hidden: !isUpdate && !isDelete && !isRead,
      render: (_: never, record: CustomerLocation) => (
        <Row justify="center" gutter={[8, 0]}>
          {isRead ? (
            <Col>
              <Link
                id="link-detail-location"
                href={`${ROUTE.SALES_MANAGEMENT.CUSTOMER_LOCATION}/${record.id}`}
                passHref
              >
                <Button
                  id="read-button"
                  size="small"
                  tooltip={t("button.read.tooltip")}
                  type="link"
                  icon={<EyeOutlined />}
                />
              </Link>
            </Col>
          ) : null}
          {isUpdate ? (
            <Col>
              <Link
                id="link-edit-location"
                href={`${ROUTE.SALES_MANAGEMENT.CUSTOMER_LOCATION}/edit/${record.id}`}
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

          {isDelete && onDeleteAction ? (
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
