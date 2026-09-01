import Card from "@sera-components/card";
import { Flex } from "antd";
import React, { useState } from "react";

import EmptyMilesFilters from "./empty-miles-filters";
import EmptyMilesSummary from "./empty-miles-summary";
import EmptyMilesTable from "./empty-miles-table";

const DEFAULT_PARAMS: any = {};

const EmptyMilesInitialPage = () => {
  const [params, setParams] = useState<any>(DEFAULT_PARAMS);

  const onChangeFilter = (_value: any) => {
    setParams(_value);
  };

  return (
    <Flex gap={24} vertical>
      <Card.Filter>
        <EmptyMilesFilters data={params} onChangeFilter={onChangeFilter} />
      </Card.Filter>

      <Card>
        <EmptyMilesSummary />
      </Card>

      <Card>
        <EmptyMilesTable />
      </Card>
    </Flex>
  );
};

export default EmptyMilesInitialPage;
