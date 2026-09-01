import { Skeleton, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { DefaultRecordType } from "rc-table/lib/interface";
import React from "react";

import styles from "./skeleton-table.module.scss";

type ISkeletonTableProps = {
  title?: any;
  style?: React.CSSProperties;
  columns?: ColumnsType<DefaultRecordType>;
  rows?: number;
};

const SkeletonTable = ({
  title,
  style,
  columns,
  rows,
}: ISkeletonTableProps) => {
  const cols = columns?.map((c: any) => {
    const title = () => (
      <Skeleton.Button active size="small" block shape="round" />
    );
    const render = () => (
      <Skeleton.Button active size="small" block shape="round" />
    );
    const width = c.width ? c.width : undefined;
    return { title, render, width };
  });

  const dataSource = Array.from({ length: rows || 10 }, (v, k) => {
    const key = k + 1;
    return { key };
  });

  return (
    <Table
      className={styles["sera-skeleton-table"]}
      style={style}
      title={title}
      dataSource={dataSource}
      columns={cols}
      pagination={false}
    />
  );
};

export default SkeletonTable;
