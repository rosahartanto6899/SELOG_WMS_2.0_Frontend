/* eslint-disable @typescript-eslint/no-explicit-any */
import Card from "@sera-components/card";
import Empty from "@sera-components/empty";
import StatusTag from "@sera-components/status-tag";
import {
  outstandingIncomingActions,
  useAppDispatch,
  useAppSelector,
} from "@sera-redux";
import { outstandingIncomingTypes } from "@sera-types/outstanding-incoming.type";
import FormatUtils from "@sera-utils/format";
import { Descriptions, Space, Table, Tabs, Tag } from "antd";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import styles from "./outstanding-incoming.module.scss";

const OutstandingIncomingDetail = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation(undefined, {
    keyPrefix: "planIncoming.outstandingIncoming.detail",
  });

  const {
    detail: { data: header, history },
  } = useAppSelector((state) => state.outstandingIncoming);
  const loading = useAppSelector(
    (state) =>
      state.loading[outstandingIncomingTypes.GET_OUTSTANDING_INCOMING_DETAIL],
  );

  useEffect(() => {
    if (id) {
      dispatch(
        outstandingIncomingActions.getOutstandingIncomingDetailFetch({
          id: String(id),
        }),
      );
    }
    return () => {
      dispatch(outstandingIncomingActions.getOutstandingIncomingDetailClear());
    };
  }, [id]);

  const toDate = (v?: string | null) =>
    v ? FormatUtils().dateTimeTransform(v) : "-";

  const detailColumns = [
    {
      title: t("detail.materialCode"),
      dataIndex: "materialCode",
      key: "materialCode",
    },
    {
      title: t("detail.materialName"),
      dataIndex: "materialName",
      key: "materialName",
      truncate: true,
    },
    {
      title: t("detail.materialBrand"),
      dataIndex: "materialBrand",
      key: "materialBrand",
    },
    { title: t("detail.uom"), dataIndex: "uom", key: "uom", width: 80 },
    {
      title: t("detail.poQty"),
      dataIndex: "poQty",
      key: "poQty",
      width: 90,
      align: "right" as const,
      className: styles["tabular-nums"],
    },
    {
      title: t("detail.partialQty"),
      dataIndex: "partialQty",
      key: "partialQty",
      width: 100,
      align: "right" as const,
      className: styles["tabular-nums"],
    },
    {
      title: t("detail.binningQty"),
      dataIndex: "binningQty",
      key: "binningQty",
      width: 100,
      align: "right" as const,
      className: styles["tabular-nums"],
    },
    {
      title: t("detail.binningDate"),
      dataIndex: "binningDate",
      key: "binningDate",
      render: (v: string | null) => toDate(v),
    },
    {
      title: t("detail.description"),
      dataIndex: "description",
      key: "description",
      truncate: true,
    },
  ];

  const historyColumns = [
    { title: t("history.status"), dataIndex: "status", key: "status" },
    {
      title: t("history.date"),
      dataIndex: "date",
      key: "date",
      render: (v: string | null) => toDate(v),
    },
    { title: t("history.pic"), dataIndex: "pic", key: "pic" },
    {
      title: t("history.leadtime"),
      dataIndex: "leadtime",
      key: "leadtime",
      align: "right" as const,
      className: styles["tabular-nums"],
      render: (v: number | null) =>
        v == null ? "-" : `${v} ${t("history.minutes")}`,
    },
    {
      title: t("history.createdBy"),
      dataIndex: "createdBy",
      key: "createdBy",
    },
  ];

  return (
    <Card>
      <Tabs
        items={[
          {
            key: "detail",
            label: t("tabs.detail"),
            children: (
              <>
                <Descriptions size="small" bordered column={2}>
                  <Descriptions.Item label={t("detail.deliveryNoteNo")}>
                    {header?.deliveryNoteNo ?? "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label={t("detail.poNo")}>
                    {header?.poNo ?? "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label={t("detail.customerName")}>
                    {header?.customerName ?? "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label={t("detail.warehouseName")}>
                    {header?.warehouseName ?? "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label={t("detail.supplierName")}>
                    {header?.supplierName ?? "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label={t("detail.status")}>
                    <Space size={4}>
                      <StatusTag
                        value={header?.status ?? "-"}
                        fallback="default"
                      />
                      {header?.isHold ? <Tag color="warning">HOLD</Tag> : null}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label={t("detail.description")}>
                    {header?.description ?? "-"}
                  </Descriptions.Item>
                </Descriptions>
                <Table
                  className="mt-4"
                  size="small"
                  rowKey="id"
                  loading={loading}
                  locale={{ emptyText: <Empty /> }}
                  dataSource={header?.details ?? []}
                  columns={detailColumns}
                  pagination={false}
                  scroll={{ x: 900 }}
                />
              </>
            ),
          },
          {
            key: "history",
            label: t("tabs.history"),
            children: (
              <Table
                size="small"
                rowKey="id"
                loading={loading}
                locale={{ emptyText: <Empty /> }}
                dataSource={history ?? []}
                columns={historyColumns}
                pagination={false}
              />
            ),
          },
        ]}
      />
    </Card>
  );
};

export default OutstandingIncomingDetail;
