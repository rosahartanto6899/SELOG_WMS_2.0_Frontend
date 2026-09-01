/* eslint-disable react-hooks/exhaustive-deps */
import CardSummary, {
  CardSummaryDataProps,
} from "@sera-components/card/card-summary";
import { LogisTruck } from "@sera-components/icons";
import { RootState } from "@sera-redux";
import { LoadingState } from "@sera-types/loading.type";
import {
  UnitActivityState,
  unitActivityTypes,
} from "@sera-types/unit-activity";
import { NUMBER_FORMAT } from "@sera-utils/constants/common";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface UnitActivitiesSummaryProps {
  loading: LoadingState;
  unitActivity: UnitActivityState;
}

const UnitActivitiesSummary = ({
  loading,
  unitActivity,
}: UnitActivitiesSummaryProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: "unitActivities" });

  const DATA = useMemo(() => {
    const _data = unitActivity?.getSummary?.data?.vehicleUnitData;

    return [
      {
        label: t("summary.field.total"),
        value: NUMBER_FORMAT(_data?.total),
        variant: "info",
      },
      {
        label: t("summary.field.planned"),
        value: NUMBER_FORMAT(_data?.planned),
        variant: "sub-info",
      },
      {
        label: t("summary.field.inProgress"),
        value: NUMBER_FORMAT(_data?.inProgress),
        variant: "success",
      },
      {
        label: t("summary.field.delayed"),
        value: NUMBER_FORMAT(_data?.delayed),
        variant: "error",
      },
      {
        label: t("summary.field.finishingUp"),
        value: NUMBER_FORMAT(_data?.finishingUp),
        variant: "warning",
      },
    ]?.map((_item) => ({
      ..._item,
      icon: <LogisTruck />,
    })) as CardSummaryDataProps[];
  }, [unitActivity?.getSummary?.data?.vehicleUnitData]);

  return (
    <CardSummary
      title={t("summary.title")}
      data={DATA}
      loading={loading[unitActivityTypes.GET_SUMMARY]}
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  unitActivity: state.unitActivity,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnitActivitiesSummary);
