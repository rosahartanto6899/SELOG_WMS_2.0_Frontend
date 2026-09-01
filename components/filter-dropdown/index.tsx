/* eslint-disable react-hooks/exhaustive-deps */
import {
  CaretDownOutlined,
  FilterTwoTone,
  SearchOutlined,
} from "@ant-design/icons";
import { AutoCompleteType } from "@sera-types/base.type";
import { Badge, Button, Checkbox, Dropdown, Input, Menu, Space } from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";

interface FilterDropdownProps {
  buttonLabel?: string;
  icon?: React.ReactNode;
  options: AutoCompleteType[];
  selectedValues?: string[];
  onChange?: (values: string[]) => void;
  onReset?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  buttonLabel = "Filter",
  icon = <FilterTwoTone />,
  options,
  selectedValues = [],
  onChange,
  onReset,
  loading = false,
  disabled = false,
}) => {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [triggerWidth, setTriggerWidth] = useState<number>();
  const [checkedValues, setCheckedValues] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const prevValuesRef = useRef<string[]>([]);

  const handleChange = (checked: boolean, value: string) => {
    setCheckedValues((prev) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value),
    );
  };

  const handleApply = () => {
    setOpen(false);
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
      setOpen(false);
    } else {
      setCheckedValues([]);
    }
    setSearchTerm("");
  };

  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;
    return options.filter((opt) =>
      String(opt.label ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    );
  }, [options, searchTerm]);

  useEffect(() => {
    if (!open) {
      const prev = prevValuesRef.current;
      const current = checkedValues;
      const changed =
        prev.length !== current.length ||
        prev.some((v) => !current.includes(v)) ||
        current.some((v) => !prev.includes(v));

      if (changed && onChange) {
        onChange(current);
        prevValuesRef.current = current;
      }
    }
  }, [open]);

  useEffect(() => {
    setCheckedValues(selectedValues);
    prevValuesRef.current = selectedValues;
  }, [selectedValues]);

  useEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth + 100);
    }
  }, []);

  const menu = (
    <Menu>
      <Menu.Item key="search" disabled style={{ cursor: "default" }}>
        <Input
          size="small"
          placeholder="Search..."
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
        />
      </Menu.Item>

      <Menu.Item key="checkboxes" disabled style={{ cursor: "default" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            maxHeight: 200,
            overflowY: "auto",
            paddingRight: 4,
            width: "100%",
          }}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <Checkbox
                key={opt.value}
                checked={
                  opt.value != null && checkedValues.includes(String(opt.value))
                }
                onChange={(e) =>
                  handleChange(e.target.checked, String(opt.value))
                }
              >
                {opt.label}
              </Checkbox>
            ))
          ) : (
            <div style={{ textAlign: "center", color: "#999", fontSize: 12 }}>
              No results found
            </div>
          )}
        </div>
      </Menu.Item>

      <Menu.Divider />

      <Menu.Item key="actions" disabled style={{ cursor: "default" }}>
        <Space style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button size="small" onClick={handleReset}>
            Reset
          </Button>
          <Button size="small" type="primary" onClick={handleApply}>
            Apply
          </Button>
        </Space>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown
      overlay={menu}
      trigger={["click"]}
      open={open}
      onOpenChange={(val) => setOpen(val)}
      getPopupContainer={(trigger) => trigger.parentElement || document.body}
      overlayStyle={{
        minWidth: triggerWidth,
      }}
    >
      <Badge
        count={checkedValues.length}
        size="small"
        style={{
          backgroundColor: checkedValues.length ? "#1677ff" : "#d9d9d9",
        }}
      >
        <Button
          icon={icon}
          loading={loading}
          disabled={disabled}
          ref={triggerRef}
        >
          {buttonLabel} <CaretDownOutlined />
        </Button>
      </Badge>
    </Dropdown>
  );
};

export default FilterDropdown;
