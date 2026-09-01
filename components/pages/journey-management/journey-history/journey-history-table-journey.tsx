/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import Card from "@sera-components/card";
import Table from "@sera-components/table";
import { RootState } from "@sera-redux";
import {
  JourneyDetailActivity,
  JourneyHistoryState,
  journeyHistoryType,
} from "@sera-types/journey-history.type";
import { LoadingState } from "@sera-types/loading.type";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import { ColumnsJourney } from "./journey-history-props-table";

interface TableJourneyProps {
  loading: LoadingState;
  journeyHistory: JourneyHistoryState;
}

const TableJourney = ({ loading, journeyHistory }: TableJourneyProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "journeyHistory.table.journey",
  });

  return (
    <Card title={t("title")}>
      <Table
        bordered
        columns={ColumnsJourney()}
        dataSource={journeyHistory?.getJourneyDetail?.data?.activities ?? []}
        rowKey={(row: JourneyDetailActivity) => `${row.id}`}
        scroll={{ x: "max-content" }}
        loading={loading[journeyHistoryType.GET_JOURNEY_DETAIL]}
      />
    </Card>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  journeyHistory: state.journeyHistory,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TableJourney);
