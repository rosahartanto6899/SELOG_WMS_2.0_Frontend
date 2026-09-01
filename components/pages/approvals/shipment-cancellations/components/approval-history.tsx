import Table from "@sera-components/table";
import { useAppSelector } from "@sera-redux";
import { shipmentCancellationsTypes } from "@sera-types/shipment-cancellations.type";
import React from "react";

import { ColumnsApprovalHistory } from "../shipment-cancellations-props-table";

const ApprovalHistory = () => {
  const {
    approvalHistory: { data: approvalHistoryData },
  } = useAppSelector((state) => state.shipmentCancellations);
  const loading = useAppSelector((state) => state.loading);

  return (
    <Table
      columns={ColumnsApprovalHistory()}
      scroll={{
        x: "max-content",
        y: approvalHistoryData?.length > 10 ? 55 * 5 : undefined,
      }}
      loading={loading[shipmentCancellationsTypes.GET_APPROVAL_HISTORY]}
      dataSource={approvalHistoryData}
      showTitle={false}
      isCustomSearch={false}
      showActions={false}
      showPagination={false}
    />
  );
};

export default ApprovalHistory;
