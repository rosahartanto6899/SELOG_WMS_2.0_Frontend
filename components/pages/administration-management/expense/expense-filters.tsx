/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import FilterDropdown from "@sera-components/filter-dropdown";
import { RootState } from "@sera-redux";
import { shipmentTypesActions } from "@sera-redux/slices/shipment-types.slice";
import { AutoCompleteType } from "@sera-types/base.type";
import {
  BusinessAreaState,
  businessAreaTypes,
} from "@sera-types/business-area.type";
import { expenseTypes, FilterParams } from "@sera-types/expense-monitoring";
import { LoadingState } from "@sera-types/loading.type";
import {
  masterDataTypes,
  ShipmentTypesState,
} from "@sera-types/master-data.type";
import { Col, Row } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface ExpenseFiltersProps {
  params: FilterParams;
  onChangeFilter: (_payload: FilterParams) => void;

  loading: LoadingState;
  businessAreas: BusinessAreaState;
  shipmentTypes: ShipmentTypesState;
  getShipmentTypes: typeof shipmentTypesActions.getShipmentTypesFetch;
}

const ExpenseFilters = ({
  params,
  onChangeFilter,
  loading,
  businessAreas,
  shipmentTypes,
  getShipmentTypes,
}: ExpenseFiltersProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "admExpense.filters",
  });

  const IS_LOADING =
    loading[expenseTypes.GET_SUMMARY] ||
    loading[expenseTypes.GET_SUMMARY_EXPENSES] ||
    loading[expenseTypes.GET_SHIPMENT_EXPENSES];

  useEffect(() => {
    getShipmentTypes();
  }, []);

  return (
    <Row gutter={[8, 4]}>
      <Col>
        <FilterDropdown
          buttonLabel={t("0")}
          options={
            (businessAreas?.dropdownBusinessAreas?.data?.map((_item) => ({
              label: _item?.name,
              value: _item?.id,
            })) as AutoCompleteType[]) ?? []
          }
          selectedValues={params?.branchId}
          onChange={(_value: string[]) => {
            onChangeFilter({ branchId: _value });
          }}
          loading={
            IS_LOADING || loading[businessAreaTypes.GET_DROPDOWN_BUSINESS_AREAS]
          }
          disabled={
            IS_LOADING || loading[businessAreaTypes.GET_DROPDOWN_BUSINESS_AREAS]
          }
        />
      </Col>

      <Col>
        <FilterDropdown
          buttonLabel={t("1")}
          options={
            (shipmentTypes?.data?.map((_item) => ({
              label: _item?.name,
              value: _item?.id,
            })) as AutoCompleteType[]) ?? []
          }
          selectedValues={params?.shipmentType}
          onChange={(_value: string[]) => {
            onChangeFilter({ shipmentType: _value });
          }}
          loading={IS_LOADING || loading[masterDataTypes.GET_SHIPMENT_TYPES]}
          disabled={IS_LOADING || loading[masterDataTypes.GET_SHIPMENT_TYPES]}
        />
      </Col>
    </Row>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  businessAreas: state.businessAreas,
  shipmentTypes: state.shipmentTypes,
});

const mapDispatchToProps = {
  getShipmentTypes: shipmentTypesActions.getShipmentTypesFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(ExpenseFilters);
