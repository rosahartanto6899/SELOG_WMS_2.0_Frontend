import Card from "@sera-components/card";
import { UnitParams } from "@sera-types/expense-refund.type";
import { Flex } from "antd";
import React, { useState } from "react";

import GlobalFilters from "./global-filters";
import ListSummary from "./list-summary";
import ListTable from "./list-table";

const DEFAULT_PARAMS: UnitParams = {
  branchId: [],
  shipmentType: [],
};

const InitialPage = () => {
  const [params, setParams] = useState<UnitParams>(DEFAULT_PARAMS);

  const onChangeFilter = (_value: UnitParams) => {
    setParams((_prev) => ({ ..._prev, ..._value }));
  };

  return (
    <Flex gap={24} vertical>
      <Card.Filter>
        <GlobalFilters params={params} onChangeFilter={onChangeFilter} />
      </Card.Filter>

      <Card>
        <ListSummary params={params} />
      </Card>

      <Card>
        <ListTable params={params} />
      </Card>
    </Flex>
  );
};

export default InitialPage;
