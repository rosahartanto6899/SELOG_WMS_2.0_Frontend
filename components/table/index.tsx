/* eslint-disable no-unused-vars */

import { useIsMobileView } from "@sera-utils/hooks/useIsMobileView";
import {
  Button,
  CheckboxProps,
  Col,
  Pagination,
  Row,
  Table as AntdTable,
  TablePaginationConfig,
  Typography,
} from "antd";
import { PaginationProps } from "antd/es/pagination";
import {
  ExpandableConfig,
  RowSelectionType,
  TableRowSelection,
} from "antd/es/table/interface";
import { DefaultOptionType } from "antd/lib/select";
import { FilterValue, GetRowKey, SorterResult } from "antd/lib/table/interface";
import { DefaultRecordType, RowClassName } from "rc-table/lib/interface";
import React, { ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { TableColumn } from "../../utils/types";
import { Delete } from "../icons";
import Input from "../input";
import Skeleton from "../skeleton";
import styles from "./table.module.scss";

export interface TableProps {
  columns?: TableColumn | any;
  dataSource?: readonly object[];
  rowKey?: string | GetRowKey<object>;
  className?: string;
  rowClassName?: string | RowClassName<DefaultRecordType>;
  loading?: boolean;
  loadingRender?: boolean;
  loadingRows?: number;
  pageSize?: number;
  total?: number;
  current?: number;
  title?: string;
  actions?: ReactNode;
  search?: boolean;
  isCustomSearch?: boolean;
  customSearch?: any;
  searchByOptions?: { label: string; value: string }[];
  searchByPlaceholder?: string;
  autoCompleteItems?: DefaultOptionType[] | any;
  multipleDelete?: boolean;
  multipleSelect?: boolean;
  showHeader?: boolean;
  scroll?: {
    x?: string | number | true;
    y?: string | number;
  } & {
    scrollToFirstRowOnChange?: boolean;
  };
  onTableChange?: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<object> | any[],
    extra: unknown,
  ) => void;
  showPagination?: boolean;
  showTitle?: boolean;
  // showSearch?: boolean;
  showActions?: boolean;
  onPageChange?: (page: number, pageSize: number) => void;
  onShowSizeChange?: (current: number, size: number) => void;
  onSearching?: (searchingValue: string, searchBy: string) => void;
  onClearSearch?: (event: React.ChangeEventHandler<HTMLInputElement>) => void;
  onSearchChange?: (search?: string, searchBy?: string) => void;
  onSelectedRowsChange?: (key: React.Key[]) => void;
  onDeleteSelectedRows?: (key: React.Key[]) => void;
  defaultExpandAllRows?: boolean;
  onClearAutoComplete?: (state?: any, action?: any) => void;
  additionalHeader?: ReactNode;
  additionalInformation?: ReactNode;
  getCheckboxProps?: (
    record: object,
  ) => Partial<Omit<CheckboxProps, "defaultChecked" | "checked">>;
  rowSelectionCheck?: TableRowSelection<any>;
  rowSelectionType?: RowSelectionType;
  expandProps?: ExpandableConfig<object>;
  showSizeChanger?: boolean;
  bordered?: boolean;
  onRowClick?: (record: any, index?: number) => void;
  showLessItems?: boolean;
}

const defaultProps = {
  loading: false,
  loadingRender: false,
  pageSize: 10,
  search: false,
  searchByOptions: [],
  multipleDelete: false,
  showHeader: true,
  showPagination: true,
  showTitle: true,
  showActions: true,
  defaultExpandAllRows: false,
  isCustomSearch: false,
  customSearch: null,
};

const Table: React.FC<TableProps> = (props: TableProps) => {
  const {
    onSelectedRowsChange,
    onDeleteSelectedRows,
    onSearchChange,
    columns,
    showTitle,
    search,
    showActions,
    title,
    loading = false,
    loadingRender,
    searchByPlaceholder,
    searchByOptions,
    autoCompleteItems,
    onClearSearch,
    onSearching,
    actions,
    className = "",
    rowClassName = "",
    dataSource,
    rowKey,
    showHeader,
    scroll,
    onTableChange,
    loadingRows,
    pageSize,
    multipleDelete,
    multipleSelect,
    showPagination,
    total,
    current,
    onPageChange,
    onShowSizeChange,
    defaultExpandAllRows,
    onClearAutoComplete,
    isCustomSearch,
    customSearch,
    additionalHeader,
    getCheckboxProps,
    rowSelectionCheck,
    rowSelectionType,
    expandProps,
    showSizeChanger = true,
    additionalInformation,
    bordered = false,
    onRowClick = () => {},
    showLessItems,
  } = props;
  const { t } = useTranslation();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const isMobile = useIsMobileView();

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
    if (onSelectedRowsChange) onSelectedRowsChange(selectedRowKeys);
  };

  const rowSelection: TableRowSelection<object> = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps,
    selections: [
      AntdTable.SELECTION_ALL,
      AntdTable.SELECTION_INVERT,
      AntdTable.SELECTION_NONE,
      {
        key: "odd",
        text: "Select Odd Row",
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter(
            (_, index) => index % 2 === 0,
          );
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: "even",
        text: "Select Even Row",
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter(
            (_, index) => index % 2 !== 0,
          );
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };

  const onMultipleDeleteSelectedListener = () => {
    if (onDeleteSelectedRows) onDeleteSelectedRows(selectedRowKeys);
  };

  const onSearchChangeListener = (
    search?: string,
    event?: React.ChangeEventHandler<HTMLInputElement>,
    searchBy?: string,
  ) => {
    if (onSearchChange) onSearchChange(search, searchBy);
  };

  // Added feature to truncate string and show the tooltip
  const mapColumns = (_cols: any[]): any[] => {
    return _cols?.map((_item: any) => {
      const _current = { ..._item, fixed: !isMobile ? _item.fixed : undefined };

      if (_item.children && Array.isArray(_item.children)) {
        _current.children = mapColumns(_item.children);
      }

      if (_item.truncate && _item.width) {
        _current.render = (text: string, record: any) => (
          <Typography.Text
            style={{ width: _item.width }}
            ellipsis={{ tooltip: record[_item.dataIndex] || text }}
          >
            {record[_item.dataIndex] ?? text ?? ""}
          </Typography.Text>
        );
      }

      return _current;
    });
  };

  const modifiedColumns = mapColumns(columns);

  useEffect(() => {
    if (dataSource) {
      setSelectedRowKeys([]);
    }
  }, [dataSource]);

  const itemRender: PaginationProps["itemRender"] = (
    _,
    type,
    originalElement,
  ) => {
    if (type === "prev") {
      return <span id="prev-page">{originalElement}</span>;
    }
    if (type === "next") {
      return <span id="next-page">{originalElement}</span>;
    }
    if (type === "page") {
      return <span id="go-to-page">{originalElement}</span>;
    }
    if (type === "jump-prev") {
      return <span id="jump-prev-page">{originalElement}</span>;
    }
    if (type === "jump-next") {
      return <span id="jump-next-page">{originalElement}</span>;
    }
    return originalElement;
  };

  return (
    <div className={styles["sera-table-wrapper"]}>
      {(showTitle || search || showActions) && (
        <div className={styles["sera-table-wrapper__header"]}>
          {/* Header */}
          <Row gutter={[4, 4]} align="middle">
            <Col flex="auto">
              <Row align="middle" gutter={[16, 4]}>
                {showTitle && (
                  <Col>
                    <h3 className={styles["sera-table-wrapper-header-title"]}>
                      {title}
                    </h3>
                  </Col>
                )}
                {search && (
                  <Col>
                    <Input.Search
                      loading={loading}
                      placeholder="Search in table"
                      searchByPlaceholder={searchByPlaceholder}
                      searchByOptions={searchByOptions}
                      autoCompleteItems={autoCompleteItems}
                      onSearch={onSearchChangeListener}
                      onClear={onClearSearch}
                      onSearching={onSearching}
                      onClearAutoComplete={onClearAutoComplete}
                    />
                  </Col>
                )}
                {isCustomSearch && <Col>{customSearch}</Col>}
              </Row>
            </Col>
            {showActions && (
              <Col flex="auto">
                <Row justify="end">
                  <Col>{actions}</Col>
                  {selectedRowKeys.length > 0 && (
                    <Col>
                      <Button
                        id="delete-selected"
                        type="text"
                        danger
                        onClick={onMultipleDeleteSelectedListener}
                        icon={<Delete />}
                      >
                        Delete Selected{" "}
                        <span>
                          &nbsp;{selectedRowKeys.length}/{total}
                        </span>
                      </Button>
                    </Col>
                  )}
                </Row>
              </Col>
            )}
          </Row>
          {additionalHeader}
        </div>
      )}

      {loading && (
        <div className={styles["sera-table-wrapper__loading"]}>
          {/* Skeleton Loading */}
          <Skeleton.Table columns={columns} rows={loadingRows ?? pageSize} />
        </div>
      )}

      {loadingRender === false && (
        <div
          className={
            loading
              ? styles["sera-table-wrapper-table-loading"]
              : styles["sera-table-wrapper-table"]
          }
        >
          {/* Table */}
          <AntdTable
            className={`${styles["sera-table"]} ${className}`}
            rowClassName={rowClassName}
            dataSource={dataSource}
            columns={modifiedColumns}
            rowKey={rowKey}
            pagination={false}
            showHeader={showHeader}
            onRow={(_record, _rowIndex) => {
              return {
                onClick: (_event) => {
                  _event?.preventDefault();
                  onRowClick(_record, _rowIndex);
                },
              };
            }}
            rowSelection={
              multipleSelect
                ? { type: rowSelectionType ?? "checkbox", ...rowSelectionCheck }
                : multipleDelete
                  ? rowSelection
                  : undefined
            }
            scroll={scroll}
            onChange={onTableChange}
            expandable={expandProps || { defaultExpandAllRows }}
            bordered={bordered}
          />
        </div>
      )}

      {additionalInformation}

      <div className={styles["sera-table-wrapper__footer"]}>
        {/* Footer */}
        <Row>
          <Col flex="auto">
            <Row justify="end">
              <Col id="table-pagination">
                {showPagination && !!total && !loading && (
                  <Pagination
                    pageSize={pageSize}
                    showTotal={(total) =>
                      `Total ${total} ${total > 1 ? t("global.table.items") : t("global.table.item")}`
                    }
                    total={total}
                    current={current}
                    onChange={(curent, pageSize) => {
                      onPageChange?.(curent, pageSize);
                      setSelectedRowKeys([]);
                    }}
                    pageSizeOptions={[10, 20, 50, 100]}
                    locale={{ page: "" }}
                    onShowSizeChange={onShowSizeChange}
                    showSizeChanger={showSizeChanger}
                    size={window.innerWidth < 576 ? "small" : "default"}
                    showLessItems={showLessItems}
                    itemRender={itemRender}
                  />
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
};

Table.defaultProps = defaultProps;

export default Table;
