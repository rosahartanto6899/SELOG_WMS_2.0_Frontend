/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-prototype-builtins */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-param-reassign */
import {
  CheckOutlined,
  CloseOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import type { TableProps } from "antd";
import { Form, Input, Spin, Table, Tooltip } from "antd";
import { ColumnsType } from "antd/lib/table";
import classNames from "classnames";
import ResizeObserver from "rc-resize-observer";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { VariableSizeGrid as Grid } from "react-window";

import Button from "../button";
import { Refresh } from "../icons";
import styles from "./table.module.scss";

export interface VirtualColumnType<
  RecordType extends object,
> extends ColumnsType<RecordType> {
  render: any;
}
export interface VirtualTableProps<
  RecordType extends object,
> extends TableProps<RecordType> {
  columns?: any;
  onSubmitEdit: any;
  handleRetryCreate: any;
  upperCaseValue?: boolean;
  onSubmitting?: boolean;
}

const VirtualTable = <RecordType extends object>(
  props: VirtualTableProps<RecordType>,
) => {
  const {
    columns,
    scroll,
    onSubmitEdit,
    dataSource,
    handleRetryCreate,
    upperCaseValue,
    onSubmitting = false,
  } = props;
  const { t } = useTranslation();
  const [tableWidth, setTableWidth] = useState(0);
  const [editing, setEditing] = useState({
    state: false,
    dataIndex: "",
    rowIndex: -1,
  });
  const [form] = Form.useForm();

  const widthColumnCount = columns!.filter(({ width }: any) => !width).length;
  const mergedColumns = columns!.map((column: any) => {
    if (column.width) {
      return column;
    }

    return {
      ...column,
      width: Math.floor(tableWidth / widthColumnCount),
    };
  });

  const gridRef = useRef<any>();
  const [connectObject] = useState<any>(() => {
    const obj = {};
    Object.defineProperty(obj, "scrollLeft", {
      get: () => {
        if (gridRef.current) {
          return gridRef.current?.state?.scrollLeft;
        }
        return null;
      },
      set: (scrollLeft: number) => {
        if (gridRef.current) {
          gridRef.current.scrollTo({ scrollLeft });
        }
      },
    });

    return obj;
  });

  const resetVirtualGrid = () => {
    gridRef.current?.resetAfterIndices({
      columnIndex: 0,
      shouldForceUpdate: true,
    });
  };

  useEffect(() => resetVirtualGrid, [tableWidth]);

  const renderVirtualList = (
    rawData: object[],
    { scrollbarSize, ref, onScroll }: any,
  ) => {
    ref.current = connectObject;
    const totalHeight = rawData.length * 40;

    const toggleEdit = (dataIndex: string, rowIndex: number) => {
      setEditing({
        state: !editing.state,
        dataIndex,
        rowIndex,
      });

      if (
        dataIndex !== "" &&
        rowIndex !== -1 &&
        dataSource &&
        dataSource.length > 0
      ) {
        const dataRow: any = dataSource[rowIndex];
        if (dataRow.hasOwnProperty(dataIndex)) {
          form.setFieldValue(`${dataIndex}[${rowIndex}]`, dataRow[dataIndex]);
        }
      }
    };

    const getIconStatus = (
      status: string,
      isActionRow: boolean,
      rowIndex: number,
    ) => {
      function getDataSourceRow() {
        return dataSource && dataSource.length > 0
          ? dataSource[rowIndex]
          : null;
      }

      if (isActionRow) {
        if (status === "fail") {
          const rand = rowIndex;
          return (
            <Button
              id={`retry-${rand}`}
              variant="icon-blue"
              icon={<Refresh />}
              onClick={() =>
                getDataSourceRow() && handleRetryCreate(getDataSourceRow())
              }
              disabled={onSubmitting}
            >
              Retry
            </Button>
          );
        }

        return status;
      }

      switch (status) {
        case "progress":
          return (
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            />
          );
        case "success":
          return <CheckOutlined style={{ color: "#1CA841" }} />;
        case "fail":
          return <CloseOutlined style={{ color: "#F52C48" }} />;
        default:
          return null;
      }
    };

    return (
      <Form form={form} component={false}>
        <Grid
          ref={gridRef}
          className="virtual-grid"
          columnCount={mergedColumns.length}
          columnWidth={(index: number) => {
            const { width } = mergedColumns[index];
            return totalHeight > Number(scroll!.y! ?? 0) &&
              index === mergedColumns.length - 1
              ? (width as number) - scrollbarSize - 1
              : (width as number);
          }}
          height={scroll!.y as number}
          rowCount={rawData.length}
          rowHeight={() => 40}
          width={tableWidth}
          onScroll={({ scrollLeft }: { scrollLeft: number }) => {
            onScroll({ scrollLeft });
          }}
        >
          {({
            columnIndex,
            rowIndex,
            style,
          }: {
            columnIndex: number;
            rowIndex: number;
            style: React.CSSProperties;
          }) => {
            const rowTemplate = (mergedColumns as any)[columnIndex];
            const rowData = rawData[rowIndex] as any;
            const isRender = !!rowTemplate.render;
            const isTruncate = rowTemplate.truncate;
            const isEditable = rowTemplate.editable;
            const isIconStatus = rowTemplate.iconStatus;
            const dataColumn = rowData[rowTemplate.dataIndex];
            const isActionRow = rowTemplate.actionRow;
            const isError =
              rowData.fields &&
              rowData.fields.length > 0 &&
              rowData.fields.includes(rowTemplate.dataIndex);

            if (isRender) {
              return (
                <div
                  className={classNames("virtual-table-cell", {
                    "virtual-table-cell-last":
                      columnIndex === mergedColumns.length - 1,
                    error: isError,
                  })}
                  style={{
                    ...style,
                    padding: "0 1.6rem",
                    borderBottom: "1px solid rgba(0,0,0,.06)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {rowTemplate.render(rowData)}
                </div>
              );
            }
            if (isEditable) {
              if (
                editing.state &&
                editing.dataIndex === rowTemplate.dataIndex &&
                editing.rowIndex === rowIndex
              ) {
                return (
                  <div
                    className={classNames("virtual-table-cell", {
                      "virtual-table-cell-last":
                        columnIndex === mergedColumns.length - 1,
                      error: isError,
                    })}
                    style={{
                      ...style,
                      padding: "0 1.6rem",
                      borderBottom: "1px solid rgba(0,0,0,.06)",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Tooltip title={t("global.table.tooltip.save")}>
                      <Form.Item
                        style={{ margin: 0 }}
                        name={`${rowTemplate.dataIndex}[${rowIndex}]`}
                        // rules={[
                        //   {
                        //     required: true,
                        //     message: `This field is required.`,
                        //   },
                        // ]}
                        rules={rowTemplate.rules}
                      >
                        <Input
                          id={`${rowTemplate.dataIndex}-${rowIndex}`}
                          name={`${rowTemplate.dataIndex}[${rowIndex}]`}
                          onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                            if (upperCaseValue) {
                              e.target.value = e.target.value.toUpperCase();
                            }
                          }}
                          onPressEnter={(e) => {
                            onSubmitEdit(e);
                            toggleEdit("", -1);
                          }}
                          onBlur={(e) => {
                            onSubmitEdit(e);
                            toggleEdit("", -1);
                          }}
                        />
                      </Form.Item>
                    </Tooltip>
                  </div>
                );
              }
              return (
                <div
                  className={classNames("virtual-table-cell", {
                    "virtual-table-cell-last":
                      columnIndex === mergedColumns.length - 1,
                    error: isError,
                  })}
                  style={{
                    ...style,
                    padding: "0 1.6rem",
                    borderBottom: "1px solid rgba(0,0,0,.06)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Tooltip title={t("global.table.tooltip.edit")}>
                    <div
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                      }}
                      onClick={() =>
                        toggleEdit(rowTemplate.dataIndex, rowIndex)
                      }
                      onKeyDown={() =>
                        toggleEdit(rowTemplate.dataIndex, rowIndex)
                      }
                    >
                      {isIconStatus || isActionRow
                        ? getIconStatus(dataColumn, isActionRow, rowIndex)
                        : dataColumn}
                    </div>
                  </Tooltip>
                </div>
              );
            }

            return (
              <div
                className={classNames("virtual-table-cell", {
                  "virtual-table-cell-last":
                    columnIndex === mergedColumns.length - 1,
                  error: isError,
                })}
                style={{
                  ...style,
                  padding: "0 1.6rem",
                  borderBottom: "1px solid rgba(0,0,0,.06)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Tooltip
                  title={isTruncate && !isIconStatus ? dataColumn : null}
                >
                  {isTruncate ? (
                    <div
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {isIconStatus || isActionRow
                        ? getIconStatus(dataColumn, isActionRow, rowIndex)
                        : dataColumn}
                    </div>
                  ) : (
                    <div>
                      {isIconStatus || isActionRow
                        ? getIconStatus(dataColumn, isActionRow, rowIndex)
                        : dataColumn}
                    </div>
                  )}
                </Tooltip>
              </div>
            );
          }}
        </Grid>
      </Form>
    );
  };

  return (
    <ResizeObserver
      onResize={({ width }) => {
        setTableWidth(width);
      }}
    >
      <Table
        {...props}
        className={`${styles["sera-table"]} virtual-table`}
        columns={mergedColumns}
        pagination={false}
        components={
          {
            body: renderVirtualList,
          } as any
        }
      />
    </ResizeObserver>
  );
};

export default VirtualTable;
