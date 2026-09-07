/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrinterOutlined } from "@ant-design/icons";
import Table from "@sera-components/table";
import { OutstandingIncomingDetail } from "@sera-types/outstanding-incoming.type";
import { Button, Col, Input, message, Modal, Row, Select } from "antd";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import MaterialSearch from "./material-search";
import styles from "./outstanding-incoming.module.scss";
import { isValidBarcode, upcaSvg } from "./upc-a";

interface Props {
  open: boolean;
  headerId: string | null;
  details: OutstandingIncomingDetail[];
  loading?: boolean;
  onClose: () => void;
  onDone: () => void;
}

/**
 * Barcode Labeling — list material ala QI (pagination + search by) dengan
 * checkbox utk memilih material yang di-print. Ukuran label & perilaku
 * print parity WMS_CoreApp printbarcode.css: grid 7cm, label 6×2cm,
 * auto window.print() lalu tab tertutup.
 */
const BarcodeLabelingForm = (props: Props) => {
  const { open, details, loading, onClose, onDone } = props;
  const { t } = useTranslation(undefined, {
    keyPrefix: "planIncoming.outstandingIncoming.barcodeLabeling",
  });

  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [search, setSearch] = useState("");
  const [searchBy, setSearchBy] = useState("materialCode");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return details;
    return details.filter((r) =>
      String((r as any)[searchBy] ?? "")
        .toLowerCase()
        .includes(q),
    );
  }, [details, search, searchBy]);

  const paged = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page, pageSize],
  );

  const columns = useMemo(
    () => [
      {
        title: t("materialCode"),
        dataIndex: "materialCode",
        key: "materialCode",
        ellipsis: true,
      },
      {
        title: t("materialName"),
        dataIndex: "materialName",
        key: "materialName",
        ellipsis: true,
      },
      {
        title: t("materialBrand"),
        dataIndex: "materialBrand",
        key: "materialBrand",
        width: 120,
        ellipsis: true,
      },
      {
        title: t("barcode"),
        dataIndex: "materialBarcode",
        key: "materialBarcode",
        width: 140,
        ellipsis: true,
      },
      {
        title: t("poQty"),
        dataIndex: "poQty",
        key: "poQty",
        width: 90,
        className: styles["tabular-nums"],
      },
      {
        title: t("partialQty"),
        dataIndex: "partialQty",
        key: "partialQty",
        width: 100,
        className: styles["tabular-nums"],
      },
      {
        title: t("binningQty"),
        dataIndex: "binningQty",
        key: "binningQty",
        width: 100,
        className: styles["tabular-nums"],
      },
      { title: t("uom"), dataIndex: "uom", key: "uom", width: 70 },
    ],
    [t],
  );

  const closeAll = () => {
    setSelectedKeys([]);
    setSearch("");
    setPage(1);
    onClose();
    onDone();
  };

  /** Print parity legacy: tab baru, grid label 6×2cm / kolom 7cm, auto-print. */
  const print = () => {
    const items = details.filter(
      (d) => selectedKeys.includes(d.id) && isValidBarcode(d.materialBarcode),
    );
    if (items.length === 0) {
      message.warning(t("noValid"));
      return;
    }
    const labels = items
      .map(
        (d) =>
          `<div class="label"><img src="data:image/svg+xml;utf8,${encodeURIComponent(
            upcaSvg(d.materialBarcode!),
          )}" alt="${d.materialCode}" /><label class="lblMaterialCode">${
            d.materialCode ?? ""
          }</label></div>`,
      )
      .join("");
    const win = window.open();
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>Print Barcodes</title>
<style>
  body { margin: 0; padding: 0; background: #fff; }
  #printContent { display: grid; grid-template-columns: repeat(auto-fill, 7cm);
    grid-auto-rows: 3cm; width: 100%; }
  .label { margin: 4mm auto; width: 6cm; height: 2cm; display: flex;
    flex-direction: column; justify-content: center; align-items: center;
    text-align: center; box-sizing: border-box; page-break-inside: avoid; }
  .lblMaterialCode { margin-top: 1px; font: 9px sans-serif; }
  .label img { width: 100%; height: 80%; object-fit: cover; margin: 0; padding: 0; }
  @media print { #printContent { gap: 2mm; margin: 0; } }
</style></head><body><div id="printContent">${labels}</div>
<script>setTimeout(function(){window.print();},300);window.onafterprint=function(){window.close();};</script>
</body></html>`);
    win.document.close();
    setSelectedKeys([]);
  };

  return (
    <Modal
      open={open}
      title={t("title")}
      onCancel={closeAll}
      footer={null}
      width={1100}
      styles={{ body: { paddingTop: 16 } }}
      destroyOnClose
    >
      <Row justify="end" gutter={[8, 8]} wrap style={{ marginBottom: 12 }}>
        <Col>
          <Button
            type="primary"
            icon={<PrinterOutlined />}
            disabled={selectedKeys.length === 0}
            onClick={print}
          >
            {t("print", { count: selectedKeys.length })}
          </Button>
        </Col>
      </Row>

      <Table
        rowKey="id"
        showTitle={false}
        showActions={false}
        columns={columns as any}
        dataSource={paged.map((d, i) => ({
          ...d,
          no: (page - 1) * pageSize + i + 1,
        }))}
        loading={loading}
        scroll={{ x: "max-content" }}
        total={filtered.length}
        current={page}
        pageSize={pageSize}
        onPageChange={(p) => setPage(p)}
        onShowSizeChange={(_, s) => {
          setPageSize(s);
          setPage(1);
        }}
        multipleSelect
        onSelectedRowsChange={setSelectedKeys}
        getCheckboxProps={(record: any) => ({
          disabled: !isValidBarcode(record?.materialBarcode),
        })}
        isCustomSearch
        customSearch={
          <MaterialSearch
            id="bl"
            searchBy={searchBy}
            onSearchBy={(value) => {
              setSearchBy(value);
              setSearch("");
              setPage(1);
            }}
            placeholder={t("searchPlaceholder")}
            onSearchValue={(v) => {
              setSearch(v);
              setPage(1);
            }}
            options={["materialCode", "materialName", "materialBrand"].map(
              (k) => ({ value: k, label: t(k) }),
            )}
          />
        }
      />
    </Modal>
  );
};

export default BarcodeLabelingForm;
