/* eslint-disable react-hooks/exhaustive-deps */
import Table from "@sera-components/table";
import { pairingMatchingActions, RootState } from "@sera-redux";
import { LoadingState } from "@sera-types/loading.type";
import {
  PairingHistoryList,
  PairingMatchingState,
  pairingMatchingTypes,
} from "@sera-types/pairing-matching";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import { ColumnsHistory } from "./pairing-matching-props-table";

interface TableHistoryProps {
  capacityId?: string;
  loading: LoadingState;
  pairingMatching: PairingMatchingState;
  getPairingHistoryFetch: typeof pairingMatchingActions.getPairingHistoryFetch;
  getPairingHistoryClear: typeof pairingMatchingActions.getPairingHistoryClear;
}

const TableHistory = ({
  capacityId,
  loading,
  pairingMatching,
  getPairingHistoryFetch,
  getPairingHistoryClear,
}: TableHistoryProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "pairingMatching.table.history",
  });

  useEffect(() => {
    getPairingHistoryClear();
  }, []);

  useEffect(() => {
    if (!capacityId) return;
    getPairingHistoryFetch({ id: capacityId });
  }, [capacityId]);

  return (
    <Table
      title={t("title")}
      columns={ColumnsHistory()}
      dataSource={
        pairingMatching?.getPairingHistory?.data?.history?.map(
          (_item, _index) => ({ ..._item, no: _index + 1 }),
        ) ?? []
      }
      rowKey={(row: PairingHistoryList) => `${row.no}`}
      scroll={{ x: "max-content" }}
      loading={loading[pairingMatchingTypes.GET_PAIRING_HISTORY]}
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  pairingMatching: state.pairingMatching,
});

const mapDispatchToProps = {
  getPairingHistoryFetch: pairingMatchingActions.getPairingHistoryFetch,
  getPairingHistoryClear: pairingMatchingActions.getPairingHistoryClear,
};

export default connect(mapStateToProps, mapDispatchToProps)(TableHistory);
