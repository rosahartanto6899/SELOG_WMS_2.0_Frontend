/* eslint-disable react-hooks/exhaustive-deps */
import CardSummary, {
  CardSummaryDataProps,
} from "@sera-components/card/card-summary";
import { LogisCurvy } from "@sera-components/icons";
import { RootState } from "@sera-redux";
import { jmpActions } from "@sera-redux/slices/jmp.slice";
import { FilterParams, JMPState, jmpTypes } from "@sera-types/jmp.type";
import { LoadingState } from "@sera-types/loading.type";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface JMPSummaryProps {
  params: FilterParams;

  loading: LoadingState;
  jmp: JMPState;
  getSummary: typeof jmpActions.getSummaryFetch;
}

const JMPSummary = ({ params, loading, jmp, getSummary }: JMPSummaryProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "jmp.summary",
  });

  const DATA = useMemo(() => {
    const _data = jmp?.getSummary?.data;

    return [
      {
        label: t("fields.0"),
        value: _data?.totalJMP ?? "",
        variant: "info",
      },
      {
        label: t("fields.1"),
        value: _data?.toll ?? "",
        variant: "error",
      },
      {
        label: t("fields.2"),
        value: _data?.nonToll ?? "",
        variant: "success",
      },
      {
        label: t("fields.3"),
        value: _data?.combine ?? "",
        variant: "warning",
      },
    ]?.map((_item) => ({
      ..._item,
      icon: <LogisCurvy />,
    })) as CardSummaryDataProps[];
  }, [jmp?.getSummary?.data]);

  useEffect(() => {
    getSummary({ ...params });
  }, [params]);

  return <CardSummary data={DATA} loading={loading[jmpTypes.GET_SUMMARY]} />;
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  jmp: state.jmp,
});

const mapDispatchToProps = {
  getSummary: jmpActions.getSummaryFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(JMPSummary);
