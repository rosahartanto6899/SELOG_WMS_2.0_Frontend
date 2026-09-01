/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import FilterDropdown from "@sera-components/filter-dropdown";
import { customerRouteActions, RootState } from "@sera-redux";
import {
  CustomerRouteState,
  customerRouteTypes,
} from "@sera-types/customer-route.type";
import { FilterParams, jmpTypes } from "@sera-types/jmp.type";
import { LoadingState } from "@sera-types/loading.type";
import { Col, Row } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface JMPFiltersProps {
  params: FilterParams;
  onChangeFilter: (_payload: FilterParams) => void;

  loading: LoadingState;
  customerRoutes: CustomerRouteState;
  getDropdownTollUsages: typeof customerRouteActions.getDropdownTollUsagesFetch;
}

const JMPFilters = ({
  params,
  onChangeFilter,
  loading,
  customerRoutes,
  getDropdownTollUsages,
}: JMPFiltersProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "jmp",
  });

  const IS_LOADING =
    loading[jmpTypes.GET_SUMMARY] || loading[jmpTypes.GET_JMP_LIST];

  useEffect(() => {
    getDropdownTollUsages();
  }, []);

  return (
    <Row gutter={[8, 4]}>
      <Col>
        <FilterDropdown
          buttonLabel={t("filters.0")}
          options={[
            { value: 1, label: t("filters_options.specificCustomer.1") },
            { value: 0, label: t("filters_options.specificCustomer.0") },
          ]}
          selectedValues={params?.specificCustomer}
          onChange={(_value: string[]) => {
            onChangeFilter({ specificCustomer: _value });
          }}
          loading={IS_LOADING || false}
          disabled={IS_LOADING || false}
        />
      </Col>

      <Col>
        <FilterDropdown
          buttonLabel={t("filters.1")}
          options={
            customerRoutes?.dropdownTollUsages?.data?.map((_item) => ({
              label: _item?.name,
              value: _item?.id,
            })) ?? []
          }
          selectedValues={params?.tollUsage}
          onChange={(_value: string[]) => {
            onChangeFilter({ tollUsage: _value });
          }}
          loading={
            IS_LOADING || loading[customerRouteTypes.GET_DROPDOWN_TOLL_USAGES]
          }
          disabled={
            IS_LOADING || loading[customerRouteTypes.GET_DROPDOWN_TOLL_USAGES]
          }
        />
      </Col>
    </Row>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  customerRoutes: state.customerRoutes,
});

const mapDispatchToProps = {
  getDropdownTollUsages: customerRouteActions.getDropdownTollUsagesFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(JMPFilters);
