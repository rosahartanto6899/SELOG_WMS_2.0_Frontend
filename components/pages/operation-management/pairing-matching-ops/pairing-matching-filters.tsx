/* eslint-disable @typescript-eslint/no-explicit-any */
import FilterDropdown from "@sera-components/filter-dropdown";
import { UnitParams } from "@sera-types/pairing-matching-ops";
import { Col, Row } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import usePairingMatchingOps from "./hooks/usePairingMatchingOps";

interface PairingMatchingFiltersProps {
  onChangeFilter: (_payload: any) => void;
  params: UnitParams;
}

const PairingMatchingFilters = ({
  params,
  onChangeFilter,
}: PairingMatchingFiltersProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "pairingMatchingOps.filters",
  });

  const {
    queries: { fetchBranch, fetchArea, fetchUnitType },
    data: { branchList, shipmentTypes, areaList, unitTypes },
    loading: {
      loadingBranch,
      loadingShipmentType,
      loadingArea,
      loadingUnitTypes,
    },
  } = usePairingMatchingOps();

  useEffect(() => {
    fetchBranch();
    fetchArea();
    fetchUnitType();
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
          options={areaList.map((_item) => ({
            label: _item?.name,
            value: _item?.id,
          }))}
          selectedValues={params?.area}
          onChange={(_value: string[]) => {
            onChangeFilter({ area: _value });
          }}
          loading={loadingArea}
          disabled={loadingArea}
        />
      </Col>

      <Col>
        <FilterDropdown
          buttonLabel={t("2")}
          options={
            unitTypes?.data?.map((e) => ({ label: e.name, value: e.id })) ?? []
          }
          selectedValues={params?.unitTypeId}
          onChange={(_value: string[]) => {
            onChangeFilter({ unitTypeId: _value });
          }}
          loading={loadingUnitTypes}
          disabled={loadingUnitTypes}
        />
      </Col>
      <Col>
        <FilterDropdown
          buttonLabel={t("3")}
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

export default PairingMatchingFilters;
