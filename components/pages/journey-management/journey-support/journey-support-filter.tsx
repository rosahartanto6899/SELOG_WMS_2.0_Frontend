import FilterDropdown from "@sera-components/filter-dropdown";
import { useAppSelector } from "@sera-redux";
import { Col, Row } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

export interface FilterStateProps {
  shipmentType?: string[];
  branchId?: string[];
}

interface FilterProps {
  filter?: FilterStateProps;
  onChangeFilter: (v: string[], type: string) => void;
}

const SHIPMENT_TYPE = [
  {
    label: "Ritase",
    value: "Ritase",
  },
  {
    label: "Dedicated",
    value: "Dedicated",
  },
];

const JourneySupportFilter = ({ filter, onChangeFilter }: FilterProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "journeySupport",
  });
  const {
    dropdownBusinessAreas: { data },
  } = useAppSelector((state) => state.businessAreas);
  const branches = data.map((v) => ({ label: v.name, value: v.id }));
  return (
    <Row gutter={[8, 4]} style={{ marginBottom: "2rem" }}>
      <Col>
        <FilterDropdown
          buttonLabel={t("filter.branch")}
          options={branches}
          selectedValues={filter?.branchId ?? []}
          onChange={(v) => onChangeFilter(v, "branchId")}
          loading={false}
          disabled={false}
        />
      </Col>
      <Col>
        <FilterDropdown
          buttonLabel={t("filter.shipmentType")}
          options={SHIPMENT_TYPE}
          selectedValues={filter?.shipmentType ?? []}
          onChange={(v) => onChangeFilter(v, "shipmentType")}
          loading={false}
          disabled={false}
        />
      </Col>
    </Row>
  );
};

export default JourneySupportFilter;
