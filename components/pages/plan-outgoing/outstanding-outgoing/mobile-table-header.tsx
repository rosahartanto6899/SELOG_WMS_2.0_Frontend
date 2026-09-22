/* eslint-disable @typescript-eslint/no-explicit-any */
import { MoreOutlined, SearchOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import Select from "@sera-components/select";
import { Drawer, Dropdown, Input as AntdInput, Space } from "antd";
import { DatePicker } from "antd";
import React, { useState } from "react";

interface Props {
  /** Judul h3 (row 1) — opsional bila kartu sudah punya judul */
  title?: string;
  selectId: string;
  searchFilterLabel: string;
  placeholder: string;
  searchBy: string;
  searchByOptions: { value: string; label: string }[];
  currentSearch?: string;
  onSelectSearchBy: (value?: string) => void;
  onSearch: (search?: string) => void;
  /** CTA block (row 3) — pola tombol Input Outgoing tab DN List */
  action?: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
    loading?: boolean;
  };
  /** Menu ⋯ (kanan judul) — aksi sekunder/bulk */
  menu?: {
    ariaLabel?: string;
    items: any[];
    onClick: ({ key }: { key: string }) => void;
  };
  /** searchBy dengan nilai range tanggal (bukan teks) — mis. "poDate"
   *  di report incoming/outgoing */
  rangeKey?: string;
  rangeValue?: [any, any];
  onRangeChange?: (values: any) => void;
  /** searchBy dengan nilai pilihan tetap (bukan teks bebas) — mis.
   *  "isInternal" di user management: Internal/External */
  enumKey?: string;
  enumOptions?: { value: string; label: string }[];
}

/** Header mobile + drawer Search bottom-sheet — pola tab DN List
 *  (judul → Search & Filter → CTA block) untuk tab DN Items / Packaging /
 *  Shipment yang tanpa kolom-manager & bulk-aksi. */
const MobileTableHeader = ({
  title,
  selectId,
  searchFilterLabel,
  placeholder,
  searchBy,
  searchByOptions,
  currentSearch,
  onSelectSearchBy,
  onSearch,
  action,
  menu,
  rangeKey,
  rangeValue,
  onRangeChange,
  enumKey,
  enumOptions,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");

  const apply = () => {
    onSearch(draft || undefined);
    setOpen(false);
  };

  const reset = () => {
    setDraft("");
    onSearch(undefined);
    setOpen(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        width: "100%",
      }}
    >
      {(title || menu) && (
        <div
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {title && (
            <h3
              style={{
                fontSize: "1.7rem",
                fontWeight: 600,
                margin: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {title}
            </h3>
          )}
          {menu && (
            <Dropdown menu={{ items: menu.items, onClick: menu.onClick }}>
              <Button
                aria-label={menu.ariaLabel ?? "more"}
                icon={<MoreOutlined />}
              />
            </Dropdown>
          )}
        </div>
      )}

      <Button
        block
        icon={<SearchOutlined />}
        onClick={() => {
          setDraft(currentSearch ?? "");
          setOpen(true);
        }}
      >
        {searchFilterLabel}
      </Button>

      {action && (
        <Button
          block
          type="primary"
          icon={action.icon}
          disabled={action.disabled}
          loading={action.loading}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}

      <Drawer
        title={searchFilterLabel}
        placement="bottom"
        height="auto"
        open={open}
        onClose={() => setOpen(false)}
        styles={{
          content: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          },
        }}
        footer={
          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={reset}>Reset</Button>
            <Button type="primary" onClick={apply}>
              Search
            </Button>
          </Space>
        }
      >
        <div
          aria-hidden
          style={{
            background: "#d0d5dd",
            borderRadius: 999,
            height: 4,
            margin: "0 auto 12px",
            width: 36,
          }}
        />
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          <Select
            style={{ width: "100%" }}
            id={selectId}
            value={searchBy}
            placeholder={placeholder}
            onChange={(value) => {
              onSelectSearchBy(value);
              setDraft("");
            }}
            onClear={() => onSelectSearchBy("")}
            allowClear={false}
          >
            {searchByOptions.map((opt) => (
              <Select.Option key={opt.value} value={opt.value}>
                {opt.label}
              </Select.Option>
            ))}
          </Select>
          {searchBy === rangeKey && onRangeChange ? (
            // range tanggal — langsung apply saat dipilih (parity desktop)
            <DatePicker.RangePicker
              style={{ width: "100%" }}
              value={rangeValue}
              allowEmpty={[false, false]}
              onChange={onRangeChange}
            />
          ) : searchBy === enumKey && enumOptions ? (
            // nilai tetap (enum) — langsung apply saat dipilih
            <Select
              style={{ width: "100%" }}
              placeholder={placeholder}
              value={draft || undefined}
              allowClear={false}
              onChange={(value?: string) => {
                setDraft(value ?? "");
                onSearch(value || undefined);
              }}
            >
              {enumOptions.map((opt) => (
                <Select.Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Select.Option>
              ))}
            </Select>
          ) : (
            <>
              {/* sera Input tidak sinkron saat value direset ke "" — pakai antd
              Input mentah; submit via tombol Search di footer drawer */}
              <AntdInput
                allowClear
                prefix={<SearchOutlined />}
                style={{ width: "100%" }}
                placeholder={placeholder}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onPressEnter={apply}
              />
            </>
          )}
        </Space>
      </Drawer>
    </div>
  );
};

export default MobileTableHeader;
