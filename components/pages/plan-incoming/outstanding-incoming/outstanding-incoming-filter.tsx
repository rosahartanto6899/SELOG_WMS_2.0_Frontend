import FilterDropdown from "@sera-components/filter-dropdown";
import {
  useAppDispatch,
  useAppSelector,
  wmsWarehouseActions,
} from "@sera-redux";
import { Col, Row } from "antd";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

export interface FilterStateProps {
  warehouseCodes?: string[];
}

interface FilterProps {
  filter?: FilterStateProps;
  onChangeFilter: (v: any, type: string) => void;
}

const OutstandingIncomingFilter = ({ filter, onChangeFilter }: FilterProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(undefined, {
    keyPrefix: "planIncoming.outstandingIncoming.filter",
  });

  const warehouses = useAppSelector(
    (state) => state.wmsWarehouses?.dropdownWarehouses?.data ?? [],
  );

  useEffect(() => {
    dispatch(wmsWarehouseActions.getDropdownWarehousesFetch());
  }, []);

  return (
    <Row gutter={[8, 4]} style={{ marginBottom: "1rem" }}>
      <Col>
        <FilterDropdown
          buttonLabel={t("warehouse")}
          options={(warehouses ?? []).map((w: any) => ({
            label: w.name,
            value: w.code,
          }))}
          selectedValues={filter?.warehouseCodes ?? []}
          onChange={(v: string[]) => onChangeFilter(v, "warehouseCodes")}
          loading={false}
          disabled={false}
        />
      </Col>
    </Row>
  );
};

export default OutstandingIncomingFilter;
