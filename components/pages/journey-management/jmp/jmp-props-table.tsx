/* eslint-disable @typescript-eslint/no-explicit-any */
import { EyeOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import { EditOutlined } from "@sera-components/icons";
import StatusTag from "@sera-components/status-tag";
import { ROUTE } from "@sera-utils/constants/routes";
import { Col, Row } from "antd";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import useGetPermission from "../hooks/useGetPermission";

export const UNCHECK_KEYS = [""];

export const Columns = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "jmp.table.column",
  });

  const { isUpdate } = useGetPermission("journey-management-plan");

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
      key: "jmpCode",
      dataIndex: "jmpCode",
      title: t("jmpCode"),
    },
    {
      key: "originName",
      dataIndex: "originName",
      title: t("originName"),
    },
    {
      key: "destinationName",
      dataIndex: "destinationName",
      title: t("destinationName"),
    },
    {
      key: "tollUsageCategory",
      dataIndex: ["tollUsageCategory", "name"],
      title: t("tollUsageCategory"),
    },
    {
      key: "specificCustomer",
      dataIndex: "specificCustomer",
      title: t("specificCustomer"),
      align: "center",
      render: (_record: boolean) => (
        <StatusTag
          value={t(`specificCustomer_value.${_record ? 1 : 0}`)}
          fallback={_record ? "success" : "error"}
        />
      ),
    },
    {
      key: "customer",
      dataIndex: ["customer", "name"],
      title: t("customer"),
    },
    {
      key: "action",
      dataIndex: "id",
      title: t("action"),
      fixed: "right",
      exception: true,
      render: (_record: string) => (
        <Row justify="center" gutter={[8, 4]}>
          <Col>
            <Link
              id="link-detail-jmp"
              href={`${ROUTE.JOURNEY_MANAGEMENT.JMP}/${_record}`}
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
                id="link-update-jmp"
                href={`${ROUTE.JOURNEY_MANAGEMENT.JMP}/edit/${_record}`}
                passHref
              >
                <Button
                  id="view-button"
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
  ];
};

export const SearchByOptions = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "jmp.table.options",
  });

  return [
    { label: t("0"), value: "jmpCode" },
    { label: t("1"), value: "origin" },
    { label: t("2"), value: "destination" },
  ];
};
