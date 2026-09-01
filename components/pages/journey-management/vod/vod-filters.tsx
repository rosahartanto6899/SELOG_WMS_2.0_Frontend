/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import FilterDropdown from "@sera-components/filter-dropdown";
import { businessAreaActions, masterDataActions, RootState } from "@sera-redux";
import { AutoCompleteType } from "@sera-types/base.type";
import {
  BusinessAreaState,
  businessAreaTypes,
} from "@sera-types/business-area.type";
import { LoadingState } from "@sera-types/loading.type";
import { MasterDataState, masterDataTypes } from "@sera-types/master-data.type";
import { ListParams, vodTypes } from "@sera-types/voice-of-driver.type";
import { Col, Row } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface VoDFiltersProps {
  params: ListParams;
  onChangeFilter: (_payload: ListParams) => void;

  loading: LoadingState;
  businessAreas: BusinessAreaState;
  masterData: MasterDataState;
  getDropdownBusinessAreas: typeof businessAreaActions.getDropdownBusinessAreasFetch;
  getVoDStatuses: typeof masterDataActions.getVoDStatusesFetch;
  getVoDTypes: typeof masterDataActions.getVoDTypesFetch;
}

const VoDFilters = ({
  params,
  onChangeFilter,
  loading,
  businessAreas,
  masterData,
  getDropdownBusinessAreas,
  getVoDStatuses,
  getVoDTypes,
}: VoDFiltersProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "vod.filters",
  });

  const IS_LOADING =
    loading[vodTypes.GET_SUMMARY] || loading[vodTypes.GET_VOD_LIST];

  useEffect(() => {
    getDropdownBusinessAreas({ show: "all" });
    getVoDStatuses();
    getVoDTypes();
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
            (masterData?.getVoDStatuses?.data?.map((_item) => ({
              label: _item?.name,
              value: _item?.name,
            })) as AutoCompleteType[]) ?? []
          }
          selectedValues={params?.status}
          onChange={(_value: string[]) => {
            onChangeFilter({ status: _value });
          }}
          loading={IS_LOADING || loading[masterDataTypes.GET_VOD_STATUSES]}
          disabled={IS_LOADING || loading[masterDataTypes.GET_VOD_STATUSES]}
        />
      </Col>

      <Col>
        <FilterDropdown
          buttonLabel={t("2")}
          options={
            (masterData?.getVoDTypes?.data?.map((_item) => ({
              label: _item?.name,
              value: _item?.id,
            })) as AutoCompleteType[]) ?? []
          }
          selectedValues={params?.voiceType}
          onChange={(_value: string[]) => {
            onChangeFilter({ voiceType: _value });
          }}
          loading={IS_LOADING || loading[masterDataTypes.GET_VOD_TYPES]}
          disabled={IS_LOADING || loading[masterDataTypes.GET_VOD_TYPES]}
        />
      </Col>
    </Row>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  businessAreas: state.businessAreas,
  masterData: state.masterData,
});

const mapDispatchToProps = {
  getDropdownBusinessAreas: businessAreaActions.getDropdownBusinessAreasFetch,
  getVoDStatuses: masterDataActions.getVoDStatusesFetch,
  getVoDTypes: masterDataActions.getVoDTypesFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(VoDFilters);
