/* eslint-disable react-hooks/exhaustive-deps */
import CardSummary, {
  CardSummaryDataProps,
} from "@sera-components/card/card-summary";
import { LogisTarget } from "@sera-components/icons";
import { pairingMatchingActions, RootState } from "@sera-redux";
import { LoadingState } from "@sera-types/loading.type";
import {
  PairingMatchingState,
  pairingMatchingTypes,
  UnitParams,
} from "@sera-types/pairing-matching";
import { NUMBER_FORMAT } from "@sera-utils/constants/common";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface PairingMatchingSummaryProps {
  params: UnitParams;
  loading: LoadingState;
  pairingMatching: PairingMatchingState;
  getSummary: typeof pairingMatchingActions.getSummaryFetch;
}

const PairingMatchingSummary = ({
  params,
  loading,
  pairingMatching,
  getSummary,
}: PairingMatchingSummaryProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "pairingMatching.summary.fields",
  });

  const DATA = useMemo(() => {
    const _data = pairingMatching?.getSummary?.data;

    return [
      {
        label: t("0"),
        value: NUMBER_FORMAT(_data?.totalShipment),
        variant: "info",
      },
      {
        label: t("1"),
        value: NUMBER_FORMAT(_data?.unassigned),
        variant: "success",
      },
      {
        label: t("2"),
        value: NUMBER_FORMAT(_data?.repaired),
        variant: "warning",
      },
      {
        label: t("3"),
        value: NUMBER_FORMAT(_data?.onPairing),
        variant: "info",
      },
      {
        label: t("4"),
        value: NUMBER_FORMAT(_data?.assigned),
        variant: "error",
      },
    ]?.map((_item) => ({
      ..._item,
      icon: <LogisTarget />,
    })) as CardSummaryDataProps[];
  }, [pairingMatching?.getSummary?.data]);

  useEffect(() => {
    getSummary({ ...params });
  }, [params]);

  return (
    <CardSummary
      data={DATA}
      loading={loading[pairingMatchingTypes.GET_SUMMARY]}
      height={150}
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  pairingMatching: state.pairingMatching,
});

const mapDispatchToProps = {
  getSummary: pairingMatchingActions.getSummaryFetch,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PairingMatchingSummary);
