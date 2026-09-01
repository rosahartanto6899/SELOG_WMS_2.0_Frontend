/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import FilterDropdown from "@sera-components/filter-dropdown";
import {
  businessAreaActions,
  RootState,
  vehicleTypeActions,
} from "@sera-redux";
import { AutoCompleteType } from "@sera-types/base.type";
import {
  BusinessAreaState,
  businessAreaTypes,
} from "@sera-types/business-area.type";
import { LoadingState } from "@sera-types/loading.type";
import { unitActivityTypes, UnitParams } from "@sera-types/unit-activity";
import { vehicleGroupTypes } from "@sera-types/vehicle-group.type";
import { VehicleTypeState } from "@sera-types/vehicle-type.type";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Col, Row } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface UnitActivitiesFilterProps {
  data: UnitParams;
  onChangeFilter: (_payload: UnitParams) => void;

  loading: LoadingState;
  businessAreas: BusinessAreaState;
  vehicleTypes: VehicleTypeState;
  getDropdownBusinessAreas: typeof businessAreaActions.getDropdownBusinessAreasFetch;
  getDropdownVehicleTypes: typeof vehicleTypeActions.getDropdownVehicleTypesFetch;
}

const UnitActivitiesFilter = ({
  data,
  onChangeFilter,
  loading,
  businessAreas,
  vehicleTypes,
  getDropdownBusinessAreas,
  getDropdownVehicleTypes,
}: UnitActivitiesFilterProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "unitActivities.table.filter",
  });

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/fleet-management/unit-activities/filter");

  const IS_LOADING =
    loading[unitActivityTypes.GET_UNIT] ||
    loading[unitActivityTypes.GET_SUMMARY];

  useEffect(() => {
    try {
      getDropdownBusinessAreas({});
      getDropdownVehicleTypes({});
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 55, error);
      else sendErrorHandler("useEffect", 55, error?.data?.message);
    }
  }, []);

  return (
    <Row gutter={[8, 4]}>
      <Col>
        <FilterDropdown
          buttonLabel={t("branch")}
          options={
            (businessAreas?.dropdownBusinessAreas?.data?.map((_item) => ({
              label: _item?.name,
              value: _item?.id,
            })) as AutoCompleteType[]) ?? []
          }
          selectedValues={data?.branchId}
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
          buttonLabel={t("unitType")}
          options={
            (vehicleTypes?.dropdownVehicleTypes?.data?.map((_item) => ({
              label: _item?.name,
              value: _item?.id,
            })) as AutoCompleteType[]) ?? []
          }
          selectedValues={data?.unitTypeId}
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
  businessAreas: state.businessAreas,
  vehicleTypes: state.vehicleTypes,
});

const mapDispatchToProps = {
  getDropdownBusinessAreas: businessAreaActions.getDropdownBusinessAreasFetch,
  getDropdownVehicleTypes: vehicleTypeActions.getDropdownVehicleTypesFetch,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnitActivitiesFilter);
