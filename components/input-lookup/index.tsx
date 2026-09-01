import { SearchOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import Table from "@sera-components/table";
import { BaseType } from "@sera-types/base.type";
import { TableColumn } from "@sera-utils/types";
import { Input, Modal, Space } from "antd";
import { TableRowSelection } from "antd/es/table/interface";
import React, { useEffect, useRef, useState } from "react";

import styles from "./input-lookup.module.scss";

export interface OnChangeLookUpProps<T extends object> {
  key: React.Key;
  row: T | null;
}
interface InputLookUpProps<T extends object> {
  title: string;
  type?: "radio" | "checkbox";
  rowKey: keyof T;
  data: readonly T[];
  dataOptions?: BaseType;
  fieldValue: string;
  columns: TableColumn | any;
  disabled?: boolean;
  placeholder: string;
  asValue?: keyof T;
  disabledValue?: string[];
  onAsyncChange?: (key: string, row?: T) => Promise<void>;
  onChange: ({ key, row }: OnChangeLookUpProps<T>) => void;
  getData?: (options: BaseType) => void;
  loading?: boolean;
  showSizeChanger?: boolean;
  placeholderSearch?: string;
  searchByData?: string;
  handleClearData?: () => void;
  additionalInformationRender?: () => JSX.Element | null;
  initialValue?: { key: string; rows: T | null };
}

function InputLookUp<T extends object>({
  title,
  type = "radio",
  asValue,
  rowKey,
  data,
  columns,
  placeholder,
  disabledValue,
  onChange,
  getData,
  loading,
  fieldValue,
  dataOptions,
  placeholderSearch,
  showSizeChanger = true,
  searchByData,
  handleClearData,
  additionalInformationRender,
  initialValue,
  onAsyncChange,
  disabled,
}: InputLookUpProps<T>) {
  const [open, setOpen] = useState(false);
  const prevKeys = useRef<React.Key[] | null>(null);
  const prevRows = useRef<T | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<T | null>(null);
  const [options, setOptions] = useState<BaseType>({
    page: 1,
    limit: 5,
  });
  const [search, setSearch] = useState("");

  const onPageChangeListener = (current: number, limit: number) => {
    setOptions((prevState) => {
      const params = {
        ...prevState,
        page: current,
        limit,
      };
      getData?.(params);
      return params;
    });
  };

  const onSearchListener = (search?: string) => {
    setSearch(search ?? "");
    setOptions((prevState) => {
      const params = {
        ...prevState,
        search,
        searchBy: searchByData,
      };
      getData?.(params);
      return params;
    });
  };

  const rowSelection: TableRowSelection<T> = {
    type,
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: T[]) => {
      setSelectedRows(selectedRows[0]);
      setSelectedRowKeys(selectedRowKeys);
      onAsyncChange?.(selectedRowKeys[0] as string, selectedRows[0]);
    },
    getCheckboxProps: (record: T) => {
      if (!disabledValue?.length) return { disabled: false };
      const _disabled = disabledValue.includes(record[rowKey] as string);
      return {
        disabled: _disabled,
      };
    },
  };

  const handleOpen = () => {
    setOpen((prev) => !prev);

    if (getData) {
      getData(options);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSearch("");
    handleClearData?.();
    setOptions({ page: dataOptions?.page ?? 1, limit: 5 });
  };

  const handleChange = () => {
    onChange({ key: selectedRowKeys[0], row: selectedRows });
    prevKeys.current = selectedRowKeys;
    prevRows.current = selectedRows;
    handleClose();
  };

  useEffect(() => {
    if (initialValue?.key && initialValue.rows) {
      setSelectedRowKeys([initialValue.key]);
      setSelectedRows(initialValue.rows);
      prevKeys.current = [initialValue.key];
      prevRows.current = initialValue.rows;
    }
  }, [initialValue]);

  useEffect(() => {
    setSelectedRowKeys(prevKeys.current || []);
    setSelectedRows(prevRows.current);
  }, [open]);

  const handleClear = () => {
    setSelectedRowKeys([]);
    setSelectedRows(null);

    // reset refs
    prevKeys.current = null;
    prevRows.current = null;
  };

  useEffect(() => {
    if (!fieldValue) {
      handleClear();
    }
  }, [fieldValue]);

  return (
    <>
      <Space.Compact block>
        <Input
          readOnly
          value={
            asValue
              ? selectedRows && selectedRows === prevRows.current
                ? (selectedRows[asValue] as string)
                : ""
              : selectedRowKeys[0]
          }
          placeholder={placeholder}
        />
        <Button
          icon={<SearchOutlined />}
          style={{
            borderRadius: "0rem 7rem 7rem 0rem",
            height: "3.5rem",
          }}
          onClick={handleOpen}
        />
      </Space.Compact>

      <Modal
        open={open}
        centered
        width={"85%"}
        onOk={handleChange}
        onCancel={handleClose}
        okButtonProps={{ disabled }}
        closable
      >
        <Table
          rowKey={rowKey as string}
          dataSource={data}
          columns={columns}
          title={title}
          total={dataOptions?.totalData ?? 0}
          current={dataOptions?.page ?? 1}
          pageSize={dataOptions?.limit ?? 10}
          showSizeChanger={showSizeChanger}
          onPageChange={onPageChangeListener}
          loading={loading}
          isCustomSearch={!!searchByData}
          customSearch={
            <Input.Search
              loading={false}
              placeholder={placeholderSearch || title}
              onSearch={(search) => onSearchListener(search)}
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
          }
          key={`${type}-${open ? "open" : "closed"}`}
          multipleSelect
          rowSelectionType="radio"
          rowClassName={(record) => {
            if (!disabledValue) return "";
            const r = record as T;
            const disabled = disabledValue.includes(r[rowKey] as string);
            if (disabled) return styles["table-row-disabled"];
            return "";
          }}
          scroll={{ x: "max-content" }}
          additionalInformation={additionalInformationRender?.()}
          rowSelectionCheck={rowSelection}
        />
      </Modal>
    </>
  );
}
export default InputLookUp;
