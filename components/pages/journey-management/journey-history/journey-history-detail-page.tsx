/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Error404 from "@sera-components/error-boundary/Error404";
import { RootState } from "@sera-redux";
import { journeyHistoryActions } from "@sera-redux/slices/journey-history.slice";
import { JourneyHistoryState } from "@sera-types/journey-history.type";
import { Flex } from "antd";
import { isEmpty } from "lodash";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { connect } from "react-redux";

import JourneyHistoryForm from "./journey-history-form";
import JourneyHistoryTableJourney from "./journey-history-table-journey";

interface JourneyHistoryDetailShipmentProps {
  journeyHistory: JourneyHistoryState;
  getJourneyDetail: typeof journeyHistoryActions.getJourneyDetailFetch;
}

const JourneyHistoryDetailShipment = ({
  journeyHistory,
  getJourneyDetail,
}: JourneyHistoryDetailShipmentProps) => {
  const router = useRouter();

  const { id } = router.query;

  useEffect(() => {
    if (!id || typeof id !== "string") return;
    getJourneyDetail({ id });
  }, [id]);

  if (!isEmpty(journeyHistory?.getJourneyDetail?.error)) return <Error404 />;

  return (
    <Flex vertical gap={24}>
      <JourneyHistoryForm />

      <JourneyHistoryTableJourney />
    </Flex>
  );
};

const mapStateToProps = (state: RootState) => ({
  journeyHistory: state.journeyHistory,
});

const mapDispatchToProps = {
  getJourneyDetail: journeyHistoryActions.getJourneyDetailFetch,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(JourneyHistoryDetailShipment);
