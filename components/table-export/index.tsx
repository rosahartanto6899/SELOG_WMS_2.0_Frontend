/* eslint-disable no-unused-vars */
import { DownloadOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import Table from "@sera-components/table";
import { ExportLog, exportLogTypes } from "@sera-types/export-log.type";
import { LoadingState } from "@sera-types/loading.type";
import FormatUtils from "@sera-utils/format";
import { Col, Row } from "antd";
import React from "react";

type LoadingDownloadState = {
  isLoading: boolean;
  id: string;
};

interface ExportListHistoryProps {
  loading: LoadingState;
  loadingDownload: LoadingDownloadState;
  handleDownloadExport: (fileUrl: string, id: string) => Promise<void>;
  data: ExportLog[];
  feature: string;
}

const ListExportHistory = (props: ExportListHistoryProps) => {
  const { loading, loadingDownload, handleDownloadExport, data, feature } =
    props;

  const columns = [
    {
      title: "No.",
      key: "no",
      width: 60,
      render: (text: any, record: any) => (
        <Row justify="center">
          <Col>{record.no}</Col>
        </Row>
      ),
    },
    {
      title: "Exported At",
      key: "exportedAt",
      dataIndex: "exportedAt",
      width: 100,
      sorter: true,
      render: (text: any, record: any) =>
        FormatUtils().dateTimeTransform(record.exportedAt),
    },
    {
      title: "Expired At",
      key: "expiredAt",
      dataIndex: "expiredAt",
      width: 100,
      sorter: true,
      render: (text: any, record: any) =>
        FormatUtils().dateTimeTransform(record.expiredAt),
    },
    {
      title: "Actions",
      key: "operation",
      fixed: "right",
      width: 120,
      render: (text: string, record: any) => (
        <Row justify="center" gutter={[8, 0]}>
          <Col>
            <Button
              id={`button-download-file-${record.no}`}
              size="small"
              tooltip="Download File"
              type="link"
              icon={<DownloadOutlined />}
              onClick={() => handleDownloadExport(record.url, record.id)}
              loading={loadingDownload.id === record.id}
              disabled={!record.url}
            />
          </Col>
        </Row>
      ),
    },
  ];

  return (
    <div id={`${feature}-table-export-history`}>
      <Table
        showTitle={false}
        showActions={false}
        dataSource={data}
        rowKey={(row: any) => `${row.no}`}
        columns={columns}
        loading={loading[exportLogTypes.GET_EXPORT_LOG]}
      />
    </div>
  );
};

export default ListExportHistory;
