/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import FilterDropdown from "@sera-components/filter-dropdown";
import { customerActions, RootState } from "@sera-redux";
import { AutoCompleteType } from "@sera-types/base.type";
import {
  CustomerParams,
  CustomerState,
  customerTypes,
} from "@sera-types/customer.type";
import { LoadingState } from "@sera-types/loading.type";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Col, Row } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface CustomerFiltersProps {
  data: CustomerParams;
  onChangeFilter: (_payload: CustomerParams) => void;

  loading: LoadingState;
  customers: CustomerState;
  getDropdownIndustries: typeof customerActions.getDropdownCustomerIndustriesFetch;
  getDropdownStatuses: typeof customerActions.getDropdownCustomerStatusesFetch;
  getDropdownCategories: typeof customerActions.getDropdownCustomerCategoriesFetch;
}

const CustomerFilters = ({
  data,
  onChangeFilter,
  loading,
  customers,
  getDropdownIndustries,
  getDropdownStatuses,
  getDropdownCategories,
}: CustomerFiltersProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "customer.table.filter",
  });

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/sales-management/customer-data/filter");

  const IS_LOADING = loading[customerTypes.GET_CUSTOMERS];

  useEffect(() => {
    try {
      getDropdownCategories({});
      getDropdownIndustries({});
      getDropdownStatuses({});
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 0, error);
      else sendErrorHandler("useEffect", 0, error?.data?.message);
    }
  }, []);

  return (
    <Row gutter={[8, 4]}>
      <Col>
        <FilterDropdown
          buttonLabel={t("category")}
          options={
            (customers?.dropdownCustomerCategories?.data?.map((_item) => ({
              label: _item?.name,
              value: _item?.name,
            })) as AutoCompleteType[]) ?? []
          }
          selectedValues={data?.category}
          onChange={(_value: string[]) => {
            onChangeFilter({ category: _value });
          }}
          loading={
            IS_LOADING ||
            loading[customerTypes.GET_DROPDOWN_CUSTOMER_CATEGORIES]
          }
          disabled={
            IS_LOADING ||
            loading[customerTypes.GET_DROPDOWN_CUSTOMER_CATEGORIES]
          }
        />
      </Col>

      <Col>
        <FilterDropdown
          buttonLabel={t("industry")}
          options={
            (customers?.dropdownCustomerIndustries?.data?.map((_item) => ({
              label: _item?.name,
              value: _item?.name,
            })) as AutoCompleteType[]) ?? []
          }
          selectedValues={data?.industry}
          onChange={(_value: string[]) => {
            onChangeFilter({ industry: _value });
          }}
          loading={
            IS_LOADING ||
            loading[customerTypes.GET_DROPDOWN_CUSTOMER_INDUSTRIES]
          }
          disabled={
            IS_LOADING ||
            loading[customerTypes.GET_DROPDOWN_CUSTOMER_INDUSTRIES]
          }
        />
      </Col>

      <Col>
        <FilterDropdown
          buttonLabel={t("status")}
          options={
            (customers?.dropdownCustomerStatuses?.data?.map((_item) => ({
              label: _item?.name,
              value: _item?.name,
            })) as AutoCompleteType[]) ?? []
          }
          selectedValues={data?.status}
          onChange={(_value: string[]) => {
            onChangeFilter({ status: _value });
          }}
          loading={
            IS_LOADING || loading[customerTypes.GET_DROPDOWN_CUSTOMER_STATUSES]
          }
          disabled={
            IS_LOADING || loading[customerTypes.GET_DROPDOWN_CUSTOMER_STATUSES]
          }
        />
      </Col>
    </Row>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  customers: state.customers,
});

const mapDispatchToProps = {
  getDropdownCategories: customerActions.getDropdownCustomerCategoriesFetch,
  getDropdownIndustries: customerActions.getDropdownCustomerIndustriesFetch,
  getDropdownStatuses: customerActions.getDropdownCustomerStatusesFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerFilters);
