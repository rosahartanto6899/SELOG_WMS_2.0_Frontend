/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Card from "@sera-components/card";
import { businessAreaActions } from "@sera-redux";
import { FilterParams } from "@sera-types/expense-monitoring";
import { Flex } from "antd";
import { useEffect, useState } from "react";
import { connect } from "react-redux";

import ExpenseFilters from "./expense-filters";
import ExpenseSummary from "./expense-summary";
import ExpenseTableShipment from "./expense-table-shipment";
import ExpenseTableSummary from "./expense-table-summary";

const DEFAULT_PARAMS: FilterParams = {
  branchId: [],
  shipmentType: [],
};

interface ExpenseInitialPageProps {
  getDropdownBusinessAreas: typeof businessAreaActions.getDropdownBusinessAreasFetch;
}

const ExpenseInitialPage = ({
  getDropdownBusinessAreas,
}: ExpenseInitialPageProps) => {
  const [params, setParams] = useState<any>(DEFAULT_PARAMS);

  const onChangeFilter = (_value: any) => {
    setParams((_prev: any) => ({ ..._prev, ..._value }));
  };

  useEffect(() => {
    getDropdownBusinessAreas({});
  }, []);

  return (
    <Flex gap={24} vertical>
      <Card.Filter>
        <ExpenseFilters params={params} onChangeFilter={onChangeFilter} />
      </Card.Filter>

      <Card>
        <ExpenseSummary params={params} />
      </Card>

      <Card>
        <ExpenseTableSummary params={params} />
      </Card>

      <Card>
        <ExpenseTableShipment params={params} />
      </Card>
    </Flex>
  );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  getDropdownBusinessAreas: businessAreaActions.getDropdownBusinessAreasFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(ExpenseInitialPage);
