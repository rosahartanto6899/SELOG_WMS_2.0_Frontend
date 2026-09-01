import React from "react";

export interface TableProps<T extends object> {
  data: T[];
  loading: boolean;
  total: number;
  current: number;
  pageSize: number;
  title: string;
  onPageChange: (current: number, limit: number) => void;
  onTableChange: (_pagination: any, _filters: any, sorter: any) => void;
  columns: any[];
  rowKey: keyof T;
  isCustomSearch?: boolean;
  customActions?: React.ReactNode;
  customSearch?: React.ReactNode;
  additionalActions?: React.ReactNode;
}
