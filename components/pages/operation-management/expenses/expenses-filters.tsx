import FilterDropdown from "@sera-components/filter-dropdown";
import { useAppSelector } from "@sera-redux";
import { ExpensesFilterStateProps } from "@sera-types/expenses.type";
import { Col, Row } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

const SHIPMENT_TYPE_OPTIONS = [
  {
    label: "Ritase",
    value: "Ritase",
  },
  {
    label: "Dedicated",
    value: "Dedicated",
  },
];

interface FilterProps {
  filter?: ExpensesFilterStateProps;
  onChangeFilter: (v: string[], type: string) => void;
}

const ExpensesFilter = ({ filter, onChangeFilter }: FilterProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "expenses",
  });

  const { dropdownBusinessAreas } = useAppSelector(
    (state) => state.businessAreas,
  );

  const { dropdownVehicleTypes } = useAppSelector(
    (state) => state.vehicleTypes,
  );
  const branchOptions = dropdownBusinessAreas.data.map((v) => ({
    label: v.name,
    value: v.id,
  }));
  const unitTypeOptions = dropdownVehicleTypes.data.map((v) => ({
    label: v.name,
    value: v.id,
  }));

  return (
    <Row gutter={[8, 4]}>
      <Col>
        <FilterDropdown
          buttonLabel={t("filter.branch")}
          options={branchOptions}
          selectedValues={filter?.branchId ?? []}
          onChange={(v) => onChangeFilter(v, "branchId")}
          loading={false}
          disabled={false}
        />
      </Col>
      <Col>
        <FilterDropdown
          buttonLabel={t("filter.shipmentType")}
          options={SHIPMENT_TYPE_OPTIONS}
          selectedValues={filter?.shipmentType ?? []}
          onChange={(v) => onChangeFilter(v, "shipmentType")}
          loading={false}
          disabled={false}
        />
      </Col>
      <Col>
        <FilterDropdown
          buttonLabel={t("filter.unitType")}
          options={unitTypeOptions}
          selectedValues={filter?.unitTypeId ?? []}
          onChange={(v) => onChangeFilter(v, "unitTypeId")}
          loading={false}
          disabled={false}
        />
      </Col>
    </Row>
  );
};

export default ExpensesFilter;
