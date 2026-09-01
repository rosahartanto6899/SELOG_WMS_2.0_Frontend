/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import FilterDropdown from "@sera-components/filter-dropdown";
import {
  businessAreaActions,
  RootState,
  vehicleTypeActions,
} from "@sera-redux";
import { shipmentTypesActions } from "@sera-redux/slices/shipment-types.slice";
import { AutoCompleteType } from "@sera-types/base.type";
import {
  BusinessAreaState,
  businessAreaTypes,
} from "@sera-types/business-area.type";
import { LoadingState } from "@sera-types/loading.type";
import {
  masterDataTypes,
  ShipmentTypesState,
} from "@sera-types/master-data.type";
import {
  GetStockPayload,
  stockManagementTypes,
} from "@sera-types/stock-management.type";
import { vehicleGroupTypes } from "@sera-types/vehicle-group.type";
import { VehicleTypeState } from "@sera-types/vehicle-type.type";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Col, Row } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface StockManagementFiltersProps {
  data: GetStockPayload;
  onChangeFilter: (_payload: GetStockPayload) => void;

  loading: LoadingState;
  businessAreas: BusinessAreaState;
  vehicleTypes: VehicleTypeState;
  shipmentTypes: ShipmentTypesState;
  getDropdownBusinessAreas: typeof businessAreaActions.getDropdownBusinessAreasFetch;
  getDropdownVehicleTypes: typeof vehicleTypeActions.getDropdownVehicleTypesFetch;
  getShipmentTypes: typeof shipmentTypesActions.getShipmentTypesFetch;
}

const StockManagementFilters = ({
  data,
  onChangeFilter,
  loading,
  businessAreas,
  vehicleTypes,
  shipmentTypes,
  getDropdownBusinessAreas,
  getDropdownVehicleTypes,
  getShipmentTypes,
}: StockManagementFiltersProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "stockManagement.table.filter",
  });

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/fleet-management/stock-management/filter");

  const IS_LOADING =
    loading[stockManagementTypes.GET_STOCK] ||
    loading[stockManagementTypes.GET_SUMMARY];

  useEffect(() => {
    try {
      getDropdownBusinessAreas({});
      getDropdownVehicleTypes({});
      getShipmentTypes();
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 0, error);
      else sendErrorHandler("useEffect", 0, error?.data?.message);
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

      <Col>
        <FilterDropdown
          buttonLabel={t("shipmentType")}
          options={
            (shipmentTypes?.data?.map((_item) => ({
              label: _item?.name,
              value: _item?.id,
            })) as AutoCompleteType[]) ?? []
          }
          selectedValues={data?.shipmentType}
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
  vehicleTypes: state.vehicleTypes,
  shipmentTypes: state.shipmentTypes,
});

const mapDispatchToProps = {
  getDropdownBusinessAreas: businessAreaActions.getDropdownBusinessAreasFetch,
  getDropdownVehicleTypes: vehicleTypeActions.getDropdownVehicleTypesFetch,
  getShipmentTypes: shipmentTypesActions.getShipmentTypesFetch,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StockManagementFilters);
