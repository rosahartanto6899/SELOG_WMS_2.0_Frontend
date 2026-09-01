import FilterDropdown from "@sera-components/filter-dropdown";
import { Col, Row } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

import { FilterProps } from "./order-status-initial-page";

const TYPE_OF_SHIPMENTS_OPTIONS = [
  {
    label: "Ritase",
    value: "Ritase",
  },
  {
    label: "Dedicated",
    value: "Dedicated",
  },
];

interface OrderStatusFiltersProps {
  filter: FilterProps;
  onChangeFilter: (v: string[], type: keyof FilterProps) => void;
}

const OrderStatusFilters = ({
  filter,
  onChangeFilter,
}: OrderStatusFiltersProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: "orderStatus" });
  return (
    <Row gutter={[8, 4]}>
      <Col>
        <FilterDropdown
          buttonLabel={t("table.filter.shipmentType")}
          options={TYPE_OF_SHIPMENTS_OPTIONS}
          selectedValues={filter.shipmentType ?? []}
          onChange={(v) => onChangeFilter(v, "shipmentType")}
          loading={false}
          disabled={false}
        />
      </Col>
    </Row>
  );
};

export default OrderStatusFilters;
