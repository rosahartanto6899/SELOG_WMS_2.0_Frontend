/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import FilterDropdown from "@sera-components/filter-dropdown";
import {
  businessAreaActions,
  masterDataActions,
  RootState,
  vehicleTypeActions,
} from "@sera-redux";
import { AutoCompleteType } from "@sera-types/base.type";
import {
  BusinessAreaState,
  businessAreaTypes,
} from "@sera-types/business-area.type";
import { LoadingState } from "@sera-types/loading.type";
import { MasterDataState, masterDataTypes } from "@sera-types/master-data.type";
import { pairingMatchingTypes, UnitParams } from "@sera-types/pairing-matching";
import { vehicleGroupTypes } from "@sera-types/vehicle-group.type";
import { VehicleTypeState } from "@sera-types/vehicle-type.type";
import { Col, Row } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface PairingMatchingFiltersProps {
  params: UnitParams;
  onChangeFilter: (_payload: UnitParams) => void;

  loading: LoadingState;
  masterData: MasterDataState;
  businessAreas: BusinessAreaState;
  vehicleTypes: VehicleTypeState;
  getAreas: typeof masterDataActions.getAreasFetch;
  getDropdownBusinessAreas: typeof businessAreaActions.getDropdownBusinessAreasFetch;
  getDropdownVehicleTypes: typeof vehicleTypeActions.getDropdownVehicleTypesFetch;
}

const PairingMatchingFilters = ({
  params,
  onChangeFilter,
  loading,
  masterData,
  businessAreas,
  vehicleTypes,
  getAreas,
  getDropdownBusinessAreas,
  getDropdownVehicleTypes,
}: PairingMatchingFiltersProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "pairingMatching.filters",
  });

  const IS_LOADING = loading[pairingMatchingTypes.GET_SUMMARY];

  useEffect(() => {
    getAreas();
    getDropdownBusinessAreas({});
    getDropdownVehicleTypes({});
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
            (masterData?.getAreas?.data?.map((_item) => ({
              label: _item?.name,
              value: _item?.id,
            })) as AutoCompleteType[]) ?? []
          }
          selectedValues={params?.area}
          onChange={(_value: string[]) => {
            onChangeFilter({ area: _value });
          }}
          loading={IS_LOADING || loading[masterDataTypes.GET_AREAS]}
          disabled={IS_LOADING || loading[masterDataTypes.GET_AREAS]}
        />
      </Col>

      <Col>
        <FilterDropdown
          buttonLabel={t("2")}
          options={
            (vehicleTypes?.dropdownVehicleTypes?.data?.map((_item) => ({
              label: _item?.name,
              value: _item?.id,
            })) as AutoCompleteType[]) ?? []
          }
          selectedValues={params?.unitTypeId}
          onChange={(_value: string[]) => {
            onChangeFilter({ unitTypeId: _value });
          }}
          loading={
            IS_LOADING || loading[vehicleGroupTypes.GET_DROPDOWN_VEHICLE_GROUPS]
          }
          disabled={
            IS_LOADING || loading[vehicleGroupTypes.GET_DROPDOWN_VEHICLE_GROUPS]
          }
        />
      </Col>
    </Row>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  masterData: state.masterData,
  businessAreas: state.businessAreas,
  vehicleTypes: state.vehicleTypes,
});

const mapDispatchToProps = {
  getAreas: masterDataActions.getAreasFetch,
  getDropdownBusinessAreas: businessAreaActions.getDropdownBusinessAreasFetch,
  getDropdownVehicleTypes: vehicleTypeActions.getDropdownVehicleTypesFetch,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PairingMatchingFilters);
