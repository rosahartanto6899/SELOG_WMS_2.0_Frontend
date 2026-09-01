/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import FilterDropdown from "@sera-components/filter-dropdown";
import { RootState } from "@sera-redux";
import { ISummaryPayload } from "@sera-types/driver-stock.type";
import { LoadingState } from "@sera-types/loading.type";
import { Col, Row } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import useDriverStock from "./hooks/useDriverStock";

interface DriverStockFiltersProps {
  data: ISummaryPayload;
  onChangeFilter: (_payload: ISummaryPayload) => void;

  loading: LoadingState;
}

const DriverStockFilters = ({
  data,
  onChangeFilter,
}: DriverStockFiltersProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "driverStock.table.filter",
  });

  const {
    queries: { fetchBranch, fetchShipmentType },
    data: { dropdownBusinessAreas, shipmentTypeData },
    loading: { loadingBranch, loadingShipmentType },
  } = useDriverStock();

  useEffect(() => {
    fetchBranch();
    fetchShipmentType();
  }, []);

  return (
    <Row gutter={[8, 4]}>
      <Col>
        <FilterDropdown
          buttonLabel={t("branch")}
          options={dropdownBusinessAreas.data.map((branch) => ({
            label: branch.name,
            value: branch.id,
          }))}
          selectedValues={data["branchId[]"]}
          onChange={(_value: string[]) => {
            onChangeFilter({ "branchId[]": _value });
          }}
          loading={loadingBranch}
          disabled={loadingBranch}
        />
      </Col>

      <Col>
        <FilterDropdown
          buttonLabel={t("shipmentType")}
          options={shipmentTypeData.map((type) => ({
            label: type.name,
            value: type.id,
          }))}
          selectedValues={data["shipmentType[]"]}
          onChange={(_value: string[]) => {
            onChangeFilter({ "shipmentType[]": _value });
          }}
          loading={loadingShipmentType}
          disabled={loadingShipmentType}
        />
      </Col>
    </Row>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DriverStockFilters);
