/* eslint-disable @typescript-eslint/no-explicit-any */
import FilterDropdown from "@sera-components/filter-dropdown";
import { UnitParams } from "@sera-types/tracking-tracking.type";
import { Col, Row } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import useTracingTracking from "./hooks/useTracingTracking";

interface GlobalFiltersProps {
  onChangeFilter: (_payload: any) => void;
  params: UnitParams;
}

const GlobalFilters = ({ onChangeFilter, params }: GlobalFiltersProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "tracingAndTracking.filters",
  });

  const {
    queries: { fetchBranch, fetchShipmentType },
    data: { branchList, shipmentTypes },
    loading: { loadingBranch, loadingShipmentType },
  } = useTracingTracking();

  useEffect(() => {
    fetchBranch();
    fetchShipmentType();
  }, []);

  return (
    <Row gutter={[8, 4]}>
      <Col>
        <FilterDropdown
          buttonLabel={t("0")}
          options={branchList.data.map((e) => ({ label: e.name, value: e.id }))}
          selectedValues={params?.branchId}
          onChange={(_value: string[]) => {
            onChangeFilter({ branchId: _value });
          }}
          loading={loadingBranch}
          disabled={loadingBranch}
        />
      </Col>

      <Col>
        <FilterDropdown
          buttonLabel={t("1")}
          options={shipmentTypes.map((e) => ({ label: e.name, value: e.id }))}
          selectedValues={params?.shipmentType}
          onChange={(_value: string[]) => {
            onChangeFilter({ shipmentType: _value });
          }}
          loading={loadingShipmentType}
          disabled={loadingShipmentType}
        />
      </Col>
    </Row>
  );
};

export default GlobalFilters;
