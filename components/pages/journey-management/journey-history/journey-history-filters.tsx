/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import FilterDropdown from "@sera-components/filter-dropdown";
import { businessAreaActions, RootState } from "@sera-redux";
import { shipmentTypesActions } from "@sera-redux/slices/shipment-types.slice";
import { AutoCompleteType } from "@sera-types/base.type";
import {
  BusinessAreaState,
  businessAreaTypes,
} from "@sera-types/business-area.type";
import {
  FilterParams,
  journeyHistoryType,
} from "@sera-types/journey-history.type";
import { LoadingState } from "@sera-types/loading.type";
import {
  masterDataTypes,
  ShipmentTypesState,
} from "@sera-types/master-data.type";
import { Col, Row } from "antd";
import dayjs from "dayjs";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface JourneyHistoryFiltersProps {
  params: FilterParams;
  onChangeFilter: (_payload: FilterParams) => void;

  loading: LoadingState;
  businessAreas: BusinessAreaState;
  shipmentTypes: ShipmentTypesState;
  getDropdownBusinessAreas: typeof businessAreaActions.getDropdownBusinessAreasFetch;
  getShipmentTypes: typeof shipmentTypesActions.getShipmentTypesFetch;
}

const JourneyHistoryFilters = ({
  params,
  onChangeFilter,
  loading,
  businessAreas,
  shipmentTypes,
  getDropdownBusinessAreas,
  getShipmentTypes,
}: JourneyHistoryFiltersProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "journeyHistory.filters",
  });

  const IS_LOADING =
    loading[journeyHistoryType.GET_SUMMARY] ||
    loading[journeyHistoryType.GET_JOURNEY_LIST];

  const FILTER_MONTH = useMemo(() => {
    return Array.from({ length: 3 }).map((_, i) => {
      const date = dayjs().subtract(i, "month");
      const label = date.format("MMM YYYY");
      const value = date.format("YYYY-MM");

      return { label, value };
    });
  }, []);

  useEffect(() => {
    getDropdownBusinessAreas({});
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

      <Col>
        <FilterDropdown
          buttonLabel={t("2")}
          options={FILTER_MONTH}
          selectedValues={params?.month}
          onChange={(_value: string[]) => {
            onChangeFilter({ month: _value });
          }}
          loading={IS_LOADING || false}
          disabled={IS_LOADING || false}
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
  getDropdownBusinessAreas: businessAreaActions.getDropdownBusinessAreasFetch,
  getShipmentTypes: shipmentTypesActions.getShipmentTypesFetch,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(JourneyHistoryFilters);
