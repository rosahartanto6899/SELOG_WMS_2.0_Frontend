import { InsertRowAboveOutlined } from "@ant-design/icons";
import FilterDropdown from "@sera-components/filter-dropdown";
import Table from "@sera-components/table";
import { AutoCompleteType } from "@sera-types/base.type";
import { Col, Row } from "antd";
import React, { useState } from "react";

import { TableProps } from "./data-table.type";

function DataTable<T extends object>({
  data,
  loading,
  total,
  title,
  current,
  pageSize,
  onPageChange,
  onTableChange,
  isCustomSearch = true,
  customSearch,
  columns,
  rowKey,
  customActions,
  additionalActions,
}: TableProps<T>) {
  const COLUMN_KEYS = columns?.filter((_item) => !_item?.exception);
  const [showColumns, setShowColumns] = useState<string[]>(
    COLUMN_KEYS.filter((item) => !item.exclude).map((_item) => _item.key),
  );

  return (
    <Table
      title={title}
      columns={columns.filter(
        (_item) => _item?.exception || showColumns?.includes(_item?.key),
      )}
      dataSource={data}
      total={total}
      current={current}
      pageSize={pageSize}
      loading={loading}
      rowKey={rowKey as string}
      scroll={{ x: "max-content" }}
      onPageChange={onPageChange}
      onTableChange={onTableChange}
      isCustomSearch={isCustomSearch}
      customSearch={customSearch}
      actions={
        customActions ?? (
          <Row gutter={[16, 4]}>
            {additionalActions}
            <Col>
              <FilterDropdown
                options={
                  (COLUMN_KEYS?.map((_item) => ({
                    label: _item?.title,
                    value: _item?.key,
                  })) as AutoCompleteType[]) ?? []
                }
                selectedValues={showColumns}
                onChange={(_value: string[]) => {
                  setShowColumns(_value);
                }}
                onReset={() => {
                  setShowColumns(COLUMN_KEYS?.map((_item) => _item?.key));
                }}
                buttonLabel="Columns"
                icon={<InsertRowAboveOutlined />}
              />
            </Col>
          </Row>
        )
      }
    />
  );
}

export default DataTable;
