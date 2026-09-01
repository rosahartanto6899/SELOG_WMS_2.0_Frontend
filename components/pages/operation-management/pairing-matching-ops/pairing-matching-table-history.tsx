import Table from "@sera-components/table";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import usePairingMatchingOps from "./hooks/usePairingMatchingOps";
import { ColumnsHistory } from "./pairing-matching-props-table";

const TableHistory = ({ shipmentId }: { shipmentId: string | null }) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "pairingMatchingOps.table.history",
  });

  const {
    queries: { fetchPairingHistory },
    data: { pairingHistoryData },
    loading: { loadingPairingHistory },
  } = usePairingMatchingOps();

  useEffect(() => {
    if (shipmentId) fetchPairingHistory({ id: shipmentId });
  }, [shipmentId]);

  return (
    <Table
      title={t("title")}
      columns={ColumnsHistory()}
      dataSource={
        pairingHistoryData?.history?.map((_item, _index) => ({
          ..._item,
          no: _index + 1,
        })) ?? []
      }
      // rowKey={(row: Unit) => `${row.no}`}
      scroll={{ x: "max-content" }}
      loading={loadingPairingHistory}
    />
  );
};

export default TableHistory;
