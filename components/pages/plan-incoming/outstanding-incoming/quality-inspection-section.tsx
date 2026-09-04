/* eslint-disable @typescript-eslint/no-explicit-any */
import OutstandingIncomingApi from "@sera-libraries/api/outstanding-incoming";
import {
  FilterResultRow,
  OutstandingIncomingDetail,
} from "@sera-types/outstanding-incoming.type";
import {
  Button,
  Card,
  Input,
  InputNumber,
  message,
  Select,
  Space,
  Table,
} from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * B5 → B6 — Quality Inspection: lookup DN (filter-result), lalu edit
 * partialQty + description per materialCode.
 */
const QualityInspectionSection = (props: {
  customerCode?: string;
  warehouseCodes: string[];
  onDone?: () => void;
}) => {
  const { customerCode, warehouseCodes, onDone } = props;
  const { t } = useTranslation(undefined, {
    keyPrefix: "planIncoming.outstandingIncoming.qi",
  });
  const [dnRows, setDnRows] = useState<FilterResultRow[]>([]);
  const [searchParam, setSearchParam] = useState("DeliveryNoteNo|");
  const [selectedDn, setSelectedDn] = useState<string | null>(null);
  const [headerId, setHeaderId] = useState<string | null>(null);
  const [details, setDetails] = useState<OutstandingIncomingDetail[]>([]);
  const InputNumberCell = (props: {
    value: number;
    onChange: (v: number | null) => void;
  }) => (
    <InputNumber
      min={0}
      value={props.value}
      onChange={props.onChange}
      style={{ width: "100%" }}
    />
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customerCode && warehouseCodes.length) {
      OutstandingIncomingApi()
        .retrieveFilterResult({ customerCode, warehouseCodes, searchParam })
        .then((data) => setDnRows(data ?? []))
        .catch(() => setDnRows([]));
    }
  }, [customerCode, warehouseCodes, searchParam]);

  const onSelectDn = async (deliveryNoteNo: string) => {
    setSelectedDn(deliveryNoteNo);
    // find header id via the detail modal? — by-material is not available here;
    // the filter-result row carries no id, so fetch it via the Q2 detail lookup per header
    // simple solution: the FE loads the header via the list endpoint with a DN filter
    setLoading(true);
    try {
      const resp: any = await OutstandingIncomingApi().retrieveList({
        page: 1,
        limit: 1,
        deliveryNoteNoFilter: deliveryNoteNo,
      });
      const row = resp?.data?.data?.[0];
      if (!row) {
        message.warning(t("notFound"));
        setHeaderId(null);
        setDetails([]);
        return;
      }
      setHeaderId(row.id);
      const detail = await OutstandingIncomingApi().retrieveDetailTyped(row.id);
      setDetails(detail.details ?? []);
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    if (!headerId) return;
    const items = details.map((d) => ({
      materialCode: d.materialCode,
      partialQty: d.partialQty ?? 0,
      description: d.description ?? undefined,
    }));
    try {
      await OutstandingIncomingApi().saveQualityInspection(headerId, items);
      message.success(t("saved"));
      onDone?.();
    } catch {
      message.error(t("failed"));
    }
  };

  return (
    <Card title={t("title")}>
      <Space direction="vertical" style={{ width: "100%" }} size={16}>
        <Space wrap>
          <Input.Search
            style={{ width: 320 }}
            placeholder={t("searchDn")}
            onSearch={(v) => setSearchParam(`DeliveryNoteNo|${v}`)}
          />
          <Select
            style={{ width: 320 }}
            placeholder={t("selectDn")}
            showSearch
            value={selectedDn}
            onChange={onSelectDn}
            options={dnRows.map((r) => ({
              value: r.deliveryNoteNo ?? "",
              label: `${r.deliveryNoteNo} — ${r.poNo}`,
            }))}
          />
        </Space>
        {selectedDn && (
          <>
            <Table
              size="small"
              rowKey="id"
              loading={loading}
              dataSource={details}
              pagination={false}
              columns={[
                { title: t("materialCode"), dataIndex: "materialCode" },
                { title: t("materialName"), dataIndex: "materialName" },
                {
                  title: t("partialQty"),
                  dataIndex: "partialQty",
                  render: (_: any, row: OutstandingIncomingDetail) => (
                    <InputNumberCell
                      value={row.partialQty ?? 0}
                      onChange={(v) =>
                        setDetails((prev) =>
                          prev.map((d) =>
                            d.id === row.id ? { ...d, partialQty: v ?? 0 } : d,
                          ),
                        )
                      }
                    />
                  ),
                },
                {
                  title: t("description"),
                  dataIndex: "description",
                  render: (_: any, row: OutstandingIncomingDetail) => (
                    <Input.TextArea
                      rows={1}
                      value={row.description ?? ""}
                      onChange={(e) =>
                        setDetails((prev) =>
                          prev.map((d) =>
                            d.id === row.id
                              ? { ...d, description: e.target.value }
                              : d,
                          ),
                        )
                      }
                    />
                  ),
                },
              ]}
            />
            <Button type="primary" onClick={save}>
              {t("save")}
            </Button>
          </>
        )}
      </Space>
    </Card>
  );
};

export default QualityInspectionSection;
