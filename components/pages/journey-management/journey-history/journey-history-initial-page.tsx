/* eslint-disable @typescript-eslint/no-explicit-any */
import Card from "@sera-components/card";
import { FilterParams } from "@sera-types/journey-history.type";
import { Flex } from "antd";
import { useState } from "react";
import { connect } from "react-redux";

import JourneyHistoryFilters from "./journey-history-filters";
import JourneyHistorySummary from "./journey-history-summary";
import JourneyHistoryTableShipment from "./journey-history-table-shipment";

const DEFAULT_PARAMS: FilterParams = {
  branchId: [],
  shipmentType: [],
  month: [],
};

const JourneyHistoryInitialPage = () => {
  const [params, setParams] = useState<FilterParams>(DEFAULT_PARAMS);

  const onChangeFilter = (_value: FilterParams) => {
    setParams((_prev) => ({ ..._prev, ..._value }));
  };

  return (
    <Flex gap={24} vertical>
      <Card.Filter>
        <JourneyHistoryFilters
          params={params}
          onChangeFilter={onChangeFilter}
        />
      </Card.Filter>

      <Card>
        <JourneyHistorySummary params={params} />
      </Card>

      <Card>
        <JourneyHistoryTableShipment params={params} />
      </Card>
    </Flex>
  );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(JourneyHistoryInitialPage);
