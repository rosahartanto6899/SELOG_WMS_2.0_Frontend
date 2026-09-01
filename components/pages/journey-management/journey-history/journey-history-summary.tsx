/* eslint-disable react-hooks/exhaustive-deps */
import CardSummary, {
  CardSummaryDataProps,
} from "@sera-components/card/card-summary";
import { LogisCurvy } from "@sera-components/icons";
import { RootState } from "@sera-redux";
import { journeyHistoryActions } from "@sera-redux/slices/journey-history.slice";
import {
  FilterParams,
  JourneyHistoryState,
  journeyHistoryType,
} from "@sera-types/journey-history.type";
import { LoadingState } from "@sera-types/loading.type";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface JourneyHistorySummaryProps {
  params: FilterParams;

  loading: LoadingState;
  journeyHistory: JourneyHistoryState;
  getSummary: typeof journeyHistoryActions.getSummaryFetch;
}

const JourneyHistorySummary = ({
  params,
  loading,
  journeyHistory,
  getSummary,
}: JourneyHistorySummaryProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "journeyHistory.summary",
  });

  const DATA = useMemo(() => {
    const _data = journeyHistory?.getSummary?.data;

    return [
      {
        label: t("fields.0"),
        value: _data?.totalShipment ?? "0",
        variant: "info",
      },
      {
        label: t("fields.1"),
        value: _data?.delayed ?? "0",
        variant: "error",
      },
      {
        label: t("fields.2"),
        value: _data?.ontime ?? "0",
        variant: "success",
      },
      {
        label: t("fields.3"),
        value: _data?.early ?? "0",
        variant: "warning",
      },
    ]?.map((_item) => ({
      ..._item,
      icon: <LogisCurvy />,
    })) as CardSummaryDataProps[];
  }, [journeyHistory?.getSummary?.data]);

  useEffect(() => {
    getSummary({ ...params });
  }, [params]);

  return (
    <CardSummary
      data={DATA}
      loading={loading[journeyHistoryType.GET_SUMMARY]}
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  journeyHistory: state.journeyHistory,
});

const mapDispatchToProps = {
  getSummary: journeyHistoryActions.getSummaryFetch,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(JourneyHistorySummary);
