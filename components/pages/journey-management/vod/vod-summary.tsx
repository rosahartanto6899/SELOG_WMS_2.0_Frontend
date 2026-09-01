/* eslint-disable react-hooks/exhaustive-deps */
import CardSummary, {
  CardSummaryDataProps,
} from "@sera-components/card/card-summary";
import { LogisCurvy } from "@sera-components/icons";
import { RootState } from "@sera-redux";
import { vodActions } from "@sera-redux/slices/voice-of-driver.slice";
import { LoadingState } from "@sera-types/loading.type";
import {
  ListParams,
  VoDState,
  vodTypes,
} from "@sera-types/voice-of-driver.type";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface VoDSummaryProps {
  params: ListParams;

  loading: LoadingState;
  vod: VoDState;
  getSummary: typeof vodActions.getSummaryFetch;
}

const VoDSummary = ({ params, loading, vod, getSummary }: VoDSummaryProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "vod.summary",
  });

  const DATA = useMemo(() => {
    const _data = vod?.getSummary?.data;

    return [
      {
        label: t("fields.0"),
        value: _data?.summary?.total ?? "0",
        variant: "info",
      },
      {
        label: t("fields.1"),
        value: _data?.summary?.open ?? "0",
        variant: "error",
      },
      {
        label: t("fields.2"),
        value: _data?.summary?.onProgress ?? "0",
        variant: "success",
      },
      {
        label: t("fields.3"),
        value: _data?.summary?.closed ?? "0",
        variant: "warning",
      },
    ]?.map((_item) => ({
      ..._item,
      icon: <LogisCurvy />,
    })) as CardSummaryDataProps[];
  }, [vod?.getSummary?.data]);

  useEffect(() => {
    getSummary({ ...params });
  }, [params]);

  return <CardSummary data={DATA} loading={loading[vodTypes.GET_SUMMARY]} />;
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  vod: state.vod,
});

const mapDispatchToProps = {
  getSummary: vodActions.getSummaryFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(VoDSummary);
