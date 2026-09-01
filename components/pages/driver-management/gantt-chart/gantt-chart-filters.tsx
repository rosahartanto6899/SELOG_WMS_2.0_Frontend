/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import FilterDropdown from "@sera-components/filter-dropdown";
import { RootState } from "@sera-redux";
import { AutoCompleteType } from "@sera-types/base.type";
import {
  BusinessAreaState,
  businessAreaTypes,
} from "@sera-types/business-area.type";
import { GanttChartParams } from "@sera-types/driver-gantt-chart.type";
import { LoadingState } from "@sera-types/loading.type";
import {
  DriverStatusState,
  IEmployeeStatusState,
  masterDataTypes,
  ShipmentTypesState,
} from "@sera-types/master-data.type";
import { Col, Row } from "antd";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface GanttChartFiltersProps {
  data: GanttChartParams;
  onChangeFilter: (_payload: GanttChartParams) => void;

  loading: LoadingState;
  shipmentTypes: ShipmentTypesState;
  employeeStatus: IEmployeeStatusState;
  driverStatus: DriverStatusState;
  businessAreas: BusinessAreaState;
}

const GanttChartFilters = ({
  data,
  onChangeFilter,
  loading,
  shipmentTypes,
  employeeStatus,
  driverStatus,
  businessAreas,
}: GanttChartFiltersProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "driverGanttChart.table.filter",
  });

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
          loading={loading[businessAreaTypes.GET_DROPDOWN_BUSINESS_AREAS]}
          disabled={loading[businessAreaTypes.GET_DROPDOWN_BUSINESS_AREAS]}
        />
      </Col>

      <Col>
        <FilterDropdown
          buttonLabel={t("shipmentType")}
          options={
            (shipmentTypes?.data?.map((_item) => ({
              label: _item?.name?.toUpperCase(),
              value: _item?.name?.toUpperCase(),
            })) as AutoCompleteType[]) ?? []
          }
          selectedValues={data?.shipmentType}
          onChange={(_value: string[]) => {
            onChangeFilter({ shipmentType: _value });
          }}
          loading={loading[masterDataTypes.GET_SHIPMENT_TYPES]}
          disabled={loading[masterDataTypes.GET_SHIPMENT_TYPES]}
        />
      </Col>

      <Col>
        <FilterDropdown
          buttonLabel={t("employeeStatus")}
          options={
            (employeeStatus?.data?.map((_item) => ({
              label: _item?.name?.toUpperCase(),
              value: _item?.name?.toUpperCase(),
            })) as AutoCompleteType[]) ?? []
          }
          selectedValues={data?.employeeStatus}
          onChange={(_value: string[]) => {
            onChangeFilter({ employeeStatus: _value });
          }}
          loading={loading[masterDataTypes.GET_EMPLOYEE_STATUS]}
          disabled={loading[masterDataTypes.GET_EMPLOYEE_STATUS]}
        />
      </Col>

      <Col>
        <FilterDropdown
          buttonLabel={t("driverStatus")}
          options={
            (driverStatus?.data?.map((_item) => ({
              label: _item?.name?.toUpperCase(),
              value: _item?.id,
            })) as AutoCompleteType[]) ?? []
          }
          selectedValues={data?.driverStatus}
          onChange={(_value: string[]) => {
            onChangeFilter({ driverStatus: _value });
          }}
          loading={loading[masterDataTypes.GET_DRIVER_STATUS]}
          disabled={loading[masterDataTypes.GET_DRIVER_STATUS]}
        />
      </Col>
    </Row>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  shipmentTypes: state.shipmentTypes,
  employeeStatus: state.employeeStatus,
  driverStatus: state.driverStatus,
  businessAreas: state.businessAreas,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(GanttChartFilters);
