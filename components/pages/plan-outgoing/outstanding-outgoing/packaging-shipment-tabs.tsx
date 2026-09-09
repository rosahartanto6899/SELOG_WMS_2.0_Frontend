/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { CheckOutlined, EyeOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import Table from "@sera-components/table";
import OutstandingOutgoingApi from "@sera-libraries/api/outstanding-outgoing";
import { Empty } from "antd";
import { message, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  PackagingColumns,
  ShipmentColumns,
} from "./outstanding-outgoing-props-table";
import PackagingByShipmentModal from "./packaging-by-shipment-modal";
import PoByPackagingModal from "./po-by-packaging-modal";

interface TabProps {
  customerCode: string | null;
  warehouseCode: string | null;
  /** fetch ulang saat tab aktif (pane antd dipertahankan) */
  active?: boolean;
  onChanged?: () => void;
}

const emptyOr = (ok: boolean, node: React.ReactNode, text: string) =>
  ok ? node : <Empty description={text} />;

/** Tab Packaging — multi-select → Ready To Ship (1 ShipmentNo per grup,
 *  parity btnDocumentShipment legacy); klik baris → popup PO per packaging. */
export const PackagingTab = ({
  customerCode,
  warehouseCode,
  active = true,
  onChanged,
}: TabProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "planOutgoing.outstandingOutgoing",
  });
  const columns = PackagingColumns(); // hook di render body (bukan useMemo)
  const [rows, setRows] = useState<any[] | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [poNo, setPoNo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = () => {
    if (!customerCode || !warehouseCode) return;
    OutstandingOutgoingApi()
      .retrievePackagings({ customerCode, warehouseCode })
      .then((resp: any) => setRows(resp?.data?.data ?? []))
      .catch(() => setRows([]));
  };

  useEffect(() => {
    setRows(null);
    setSelectedIds([]);
  }, [customerCode, warehouseCode]);

  useEffect(() => {
    if (active) load();
  }, [active, customerCode, warehouseCode]);

  if (!customerCode || !warehouseCode)
    return <Empty description={t("table.selectWarehouse")} />;

  const selectedRows = (rows ?? []).filter((r: any) =>
    selectedIds.includes(r.id),
  );
  const selectedPackagingNos = [
    ...new Set(selectedRows.map((r: any) => r.packagingNo)),
  ];

  const doReadyToShip = () => {
    if (!selectedPackagingNos.length) {
      message.error(t("table.selectInfo"));
      return;
    }
    const destinations = new Set(
      selectedRows.map((r: any) => r.customerDestination ?? ""),
    );
    if (destinations.size > 1) {
      message.error(t("packaging.destinationMismatch"));
      return;
    }
    Modal.confirm({
      title: (
        <span
          dangerouslySetInnerHTML={{
            __html: t("confirm.status", {
              status: `<strong>Ready To Ship</strong>`,
            }),
          }}
        />
      ),
      content: t("confirm.warning"),
      okText: t("confirm.yes"),
      cancelText: t("confirm.no"),
      okButtonProps: { danger: true },
      onOk: async () => {
        setLoading(true);
        try {
          const resp =
            await OutstandingOutgoingApi().readyToShip(selectedPackagingNos);
          const no = (resp as any)?.data?.data?.shipmentNo ?? "-";
          Modal.success({
            title: t("shipment.createdTitle"),
            content: (
              <span
                dangerouslySetInnerHTML={{
                  __html: t("shipment.created", {
                    no: `<strong>${no}</strong>`,
                  }),
                }}
              />
            ),
          });
          setSelectedIds([]);
          load();
          onChanged?.();
        } catch (error: any) {
          const body: any = error?.response?.data ?? error?.data ?? {};
          message.error(body?.message ?? body?.data?.message ?? "Failed");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div>
        <Button
          type="primary"
          icon={<CheckOutlined />}
          disabled={!selectedIds.length}
          loading={loading}
          onClick={doReadyToShip}
        >
          {t("shipment.button")}
        </Button>
      </div>
      <Table
        columns={[
          ...columns,
          {
            title: "",
            key: "view",
            width: 70,
            render: (_: any, row: any) => (
              <Button
                icon={<EyeOutlined />}
                onClick={() => setPoNo(row.packagingNo)}
              />
            ),
          },
        ]}
        dataSource={rows ?? []}
        loading={rows === null}
        rowKey="id"
        scroll={{ x: "max-content" }}
        search
        multipleSelect
        onSelectedRowsChange={(keys) => setSelectedIds(keys as string[])}
      />
      <PoByPackagingModal packagingNo={poNo} onClose={() => setPoNo(null)} />
    </div>
  );
};

/** Tab Shipment — klik baris → popup packaging per shipment. */
export const ShipmentTab = ({
  customerCode,
  warehouseCode,
  active = true,
}: TabProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "planOutgoing.outstandingOutgoing",
  });
  const columns = ShipmentColumns();
  const [rows, setRows] = useState<any[] | null>(null);
  const [shipNo, setShipNo] = useState<string | null>(null);

  useEffect(() => {
    if (!active || !customerCode || !warehouseCode) return;
    OutstandingOutgoingApi()
      .retrieveShipments({ customerCode, warehouseCode })
      .then((resp: any) => setRows(resp?.data?.data ?? []))
      .catch(() => setRows([]));
  }, [active, customerCode, warehouseCode]);

  return (
    <>
      {emptyOr(
        !!customerCode && !!warehouseCode,
        <Table
          columns={[
            ...columns,
            {
              title: "",
              key: "view",
              width: 70,
              render: (_: any, row: any) => (
                <Button
                  icon={<EyeOutlined />}
                  onClick={() => setShipNo(row.shipmentNo)}
                />
              ),
            },
          ]}
          dataSource={rows ?? []}
          loading={rows === null}
          rowKey="shipmentNo"
          scroll={{ x: "max-content" }}
          search
        />,
        t("table.selectWarehouse"),
      )}
      <PackagingByShipmentModal
        shipmentNo={shipNo}
        onClose={() => setShipNo(null)}
      />
    </>
  );
};
