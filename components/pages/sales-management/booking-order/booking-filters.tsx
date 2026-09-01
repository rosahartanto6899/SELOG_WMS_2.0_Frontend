import FilterDropdown from "@sera-components/filter-dropdown";
import { useAppSelector } from "@sera-redux";
import { BookingOrderSummaryPayload } from "@sera-types/booking-order.type";
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

interface BookingFilterProps {
  filter?: BookingOrderSummaryPayload;
  onChangeFilter: (v: string[], type: string) => void;
}

const BookingOrderFilters = ({
  filter,
  onChangeFilter,
}: BookingFilterProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: "bookingOrder" });
  const {
    dropdownBusinessAreas: { data },
  } = useAppSelector((state) => state.businessAreas);
  const branches = data.map((v) => ({ label: v.name, value: v.id }));
  return (
    <Row gutter={[8, 4]} style={{ marginBottom: "2rem" }}>
      <Col>
        <FilterDropdown
          buttonLabel={t("table.filter.branch")}
          options={branches}
          selectedValues={filter?.branchId ?? []}
          onChange={(v) => onChangeFilter(v, "branchId")}
          loading={false}
          disabled={false}
        />
      </Col>
      <Col>
        <FilterDropdown
          buttonLabel={t("table.filter.shipmentType")}
          options={SHIPMENT_TYPE_OPTIONS}
          selectedValues={filter?.shipmentType ?? []}
          onChange={(v) => onChangeFilter(v, "shipmentType")}
          loading={false}
          disabled={false}
        />
      </Col>
    </Row>
  );
};

export default BookingOrderFilters;
