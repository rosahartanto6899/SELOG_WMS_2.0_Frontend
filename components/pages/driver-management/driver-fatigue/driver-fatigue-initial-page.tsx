import { InsertRowAboveOutlined } from "@ant-design/icons";
import FilterCard from "@sera-components/card";
import CarouselInsightSkeletons from "@sera-components/carousel/carousel-insights";
import FilterDropdown from "@sera-components/filter-dropdown";
import { LogisUserMultiple } from "@sera-components/icons";
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import { AutoCompleteType } from "@sera-types/base.type";
import { ISummaryPayload } from "@sera-types/driver-fatigue.type";
import FormatUtils from "@sera-utils/format";
import { Card, Col, Row, Typography } from "antd";
import dayjs from "dayjs";
import { omit } from "lodash";
import React, { useEffect, useReducer, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  Columns,
  DRIVER_FATIGUE_DEFAULT_UNCHECK,
} from "./driver-fatigue-props-table";
import FatigueCard from "./fatigue-card";
import useDriverFatigue from "./hooks/useDriverFatigue";

export interface FILTER_PROPS_BOOKING_ORDER {
  branchId?: string[];
  shipmentType?: string[];
}

export type TFIlterSearch =
  | "recommendation"
  | "driverName"
  | "fatigueLevel"
  | "healthResult";

const DriverFatigueInitialPage = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "driverFatigue" });
  const COLUMN_KEYS = Columns()?.filter((_item) => !_item?.exception);

  const [showColumns, setShowColumns] = useState<string[]>(
    COLUMN_KEYS?.map((_item) => _item?.key)?.filter(
      (_key) => !DRIVER_FATIGUE_DEFAULT_UNCHECK.includes(_key),
    ),
  );

  const {
    queries: {
      fetchSummary,
      fetchBranch,
      fetchShipmentType,
      fetchEmployeeStatus,
      fetchFatiguList,
      fetchFatigueFilter,
    },
    data: {
      summary,
      dropdownBusinessAreas,
      shipmentTypeData,
      employeeStatusData,
      fatigueList,
      filterOption,
    },
    loading: {
      loadingBranch,
      loadingShipmentType,
      loadingSummary,
      loadingEmployeeStatus,
      loadingFatigueList,
      loadingFilterOption,
    },
    pagination,
  } = useDriverFatigue();

  const [stateSelectedFilterData, dispatchSelectedFilterData] = useReducer(
    (curr: ISummaryPayload, acc: ISummaryPayload) => ({
      ...curr,
      ...acc,
    }),
    { "branchId[]": [], "shipmentType[]": [], "employeeStatus[]": [] },
  );

  const [selectedFilter, setSelectedFilter] =
    useState<TFIlterSearch>("driverName");

  const [filterSelectedValue, setFilterSelectedValue] = useState(null);

  const onPageChangeListener = (current: number, limit: number) =>
    fetchFatiguList({ ...stateSelectedFilterData, limit, page: current });

  const onTableChangeListener = (
    _pagination: any,
    _filters: any,
    sorter: any,
  ) => {
    fetchFatiguList({
      ...stateSelectedFilterData,
      page: pagination?.page ?? 0,
      limit: pagination?.limit ?? 0,
      sort: sorter.order === "ascend" ? "asc" : "desc",
      order: sorter.field,
    });
  };

  useEffect(() => {
    fetchSummary();
    fetchBranch();
    fetchShipmentType();
    fetchEmployeeStatus();
    fetchFatiguList({
      limit: pagination?.limit ?? 10,
      page: pagination?.page ?? 1,
    });
    fetchFatigueFilter();
  }, []);

  return (
    <Row style={{ flexDirection: "column" }} gutter={[16, 16]}>
      <Col span={24}>
        <Row gutter={[16, 16]} style={{ flexDirection: "column" }}>
          <Col>
            <Row
              gutter={[16, 16]}
              justify={"space-between"}
              style={{ alignItems: "center" }}
            >
              <Col>
                <FilterCard.Filter>
                  <Row gutter={[16, 16]}>
                    <Col>
                      <FilterDropdown
                        buttonLabel={t("filters.branch")}
                        options={dropdownBusinessAreas.data.map((branch) => ({
                          label: branch.name,
                          value: branch.id,
                        }))}
                        selectedValues={stateSelectedFilterData["branchId[]"]}
                        onChange={(e) => {
                          dispatchSelectedFilterData({ "branchId[]": e });
                          fetchSummary({
                            ...stateSelectedFilterData,
                            "branchId[]": e,
                          });
                          fetchFatiguList({
                            ...omit(pagination, ["totalData", "totalPage"]),
                            ...stateSelectedFilterData,
                            "branchId[]": e,
                          });
                        }}
                        loading={loadingBranch}
                        disabled={loadingBranch}
                      />
                    </Col>
                    <Col>
                      <FilterDropdown
                        buttonLabel={t("filters.employeeStatus")}
                        options={employeeStatusData.map((status) => ({
                          label: status.name,
                          value: status.name,
                        }))}
                        selectedValues={
                          stateSelectedFilterData["employeeStatus[]"]
                        }
                        onChange={(e) => {
                          dispatchSelectedFilterData({ "employeeStatus[]": e });
                          fetchSummary({
                            ...stateSelectedFilterData,
                            "employeeStatus[]": e,
                          });
                          fetchFatiguList({
                            ...omit(pagination, ["totalData", "totalPage"]),
                            ...stateSelectedFilterData,
                            "employeeStatus[]": e,
                          });
                        }}
                        loading={loadingEmployeeStatus}
                        disabled={loadingEmployeeStatus}
                      />
                    </Col>
                    <Col>
                      <FilterDropdown
                        buttonLabel={t("filters.shipmentType")}
                        options={shipmentTypeData.map((type) => ({
                          label: type.name,
                          value: type.id,
                        }))}
                        selectedValues={
                          stateSelectedFilterData["shipmentType[]"]
                        }
                        onChange={(e) => {
                          dispatchSelectedFilterData({ "shipmentType[]": e });
                          fetchSummary({
                            ...stateSelectedFilterData,
                            "shipmentType[]": e,
                          });
                          fetchFatiguList({
                            ...omit(pagination, ["totalData", "totalPage"]),
                            ...stateSelectedFilterData,
                            "shipmentType[]": e,
                          });
                        }}
                        loading={loadingShipmentType}
                        disabled={loadingShipmentType}
                      />
                    </Col>
                  </Row>
                </FilterCard.Filter>
              </Col>
              <Col>
                <Typography.Title level={5}>
                  <span style={{ fontWeight: "normal" }}>
                    {t("table.card.period")}
                  </span>
                  {` : ${dayjs().format("MMMM YYYY")}`}
                </Typography.Title>
              </Col>
            </Row>
          </Col>
          <Col>
            <Card>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Row gutter={[16, 16]}>
                    <Col span={24}>
                      <CarouselInsightSkeletons>
                        <Col className="gutter-row">
                          <FatigueCard
                            label={t("table.card.totalOfDriver")}
                            icon={<LogisUserMultiple />}
                            value={FormatUtils().formatInputCurrency(
                              (summary.totalDrivers ?? 0).toString(),
                            )}
                            cardBg="primaryMain"
                            avatarBg="primarySecond"
                            loading={Boolean(loadingSummary)}
                          />
                        </Col>
                        <Col className="gutter-row">
                          <FatigueCard
                            label={t("table.card.low")}
                            icon={<LogisUserMultiple />}
                            value={FormatUtils().formatInputCurrency(
                              (summary.fatigueSummary?.low ?? 0).toString(),
                            )}
                            cardBg="successMain"
                            avatarBg="successSubtle"
                            loading={Boolean(loadingSummary)}
                          />
                        </Col>

                        <Col className="gutter-row">
                          <FatigueCard
                            label={t("table.card.medium")}
                            icon={<LogisUserMultiple />}
                            value={FormatUtils().formatInputCurrency(
                              (summary.fatigueSummary?.medium ?? 0).toString(),
                            )}
                            cardBg="warningMain"
                            avatarBg="warningSubtle"
                            loading={Boolean(loadingSummary)}
                          />
                        </Col>
                        <Col className="gutter-row">
                          <FatigueCard
                            label={t("table.card.high")}
                            icon={<LogisUserMultiple />}
                            value={FormatUtils().formatInputCurrency(
                              (summary.fatigueSummary?.high ?? 0).toString(),
                            )}
                            cardBg="dangerMain"
                            avatarBg="dangerSubtle"
                            loading={Boolean(loadingSummary)}
                          />
                        </Col>
                      </CarouselInsightSkeletons>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Card>
          <Table
            title={t("table.title")}
            columns={Columns()?.filter(
              (_item) => _item?.exception || showColumns?.includes(_item?.key),
            )}
            loading={loadingFatigueList}
            dataSource={fatigueList}
            total={pagination?.totalData ?? 0}
            current={pagination?.page}
            pageSize={pagination?.limit ?? 10}
            // loading={loading[bookingOrderTypes.GET_BOOKING_ORDER]}
            rowKey={"no"}
            scroll={{ x: "max-content" }}
            multipleDelete={false}
            onPageChange={onPageChangeListener}
            onTableChange={onTableChangeListener}
            // rowClassName={(_record) => {
            //   switch (_record?.fatigueLevel) {
            //     case "low":
            //       return "data-safe";
            //     case "medium":
            //       return "data-warning";
            //     case "high":
            //       return "data-error";
            //   }
            //   return "";
            // }}
            isCustomSearch
            customSearch={
              <Row align="middle" gutter={[8, 4]}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <Select
                    style={{ width: "100%" }}
                    id="driver-search"
                    defaultValue={"driverName"}
                    onChange={(value: TFIlterSearch) => {
                      setFilterSelectedValue(null);
                      setSelectedFilter(value);
                    }}
                    disabled={loadingFilterOption}
                    onClear={() => null}
                    allowClear={false}
                    loading={loadingFilterOption}
                    value={selectedFilter}
                  >
                    {filterOption.map((opt) => (
                      <Select.Option key={opt.value} value={opt.value}>
                        {opt.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Col>

                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  {selectedFilter === "driverName" ? (
                    <Input.Search
                      loading={false}
                      placeholder={t("table.search.placeholder")}
                      autoCompleteItems={[]}
                      onSearch={(e) =>
                        fetchFatiguList({
                          ...stateSelectedFilterData,
                          searchBy: "driverName",
                          search: e,
                          page: 1,
                          limit: pagination?.limit ?? 10,
                        })
                      }
                      onClear={() =>
                        fetchFatiguList({
                          ...stateSelectedFilterData,
                          page: 1,
                          limit: pagination?.limit ?? 10,
                        })
                      }
                    />
                  ) : (
                    <Select
                      style={{ width: 180 }}
                      id="driver-search"
                      onChange={(e) => {
                        setFilterSelectedValue(e);
                        fetchFatiguList({
                          ...stateSelectedFilterData,
                          search: e,
                          searchBy: selectedFilter,
                          page: 1,
                          limit: pagination?.limit ?? 10,
                        });
                      }}
                      onClear={() =>
                        fetchFatiguList({
                          ...stateSelectedFilterData,
                          page: 1,
                          limit: pagination?.limit ?? 10,
                        })
                      }
                      allowClear={true}
                      value={filterSelectedValue}
                    >
                      {filterOption
                        .find((e) => e.value === selectedFilter)
                        ?.options?.map((opt) => (
                          <Select.Option key={opt.value} value={opt.value}>
                            {opt.label}
                          </Select.Option>
                        ))}
                    </Select>
                  )}
                </Col>
              </Row>
            }
            showActions
            actions={
              <Col>
                <FilterDropdown
                  buttonLabel={t("button.config")}
                  icon={<InsertRowAboveOutlined />}
                  options={
                    (COLUMN_KEYS?.map((_item) => ({
                      label: _item?.title,
                      value: _item?.key,
                    })) as AutoCompleteType[]) ?? []
                  }
                  selectedValues={showColumns}
                  onChange={(_value: string[]) => {
                    setShowColumns(_value);
                  }}
                  onReset={() => {
                    setShowColumns(COLUMN_KEYS?.map((_item) => _item?.key));
                  }}
                />
              </Col>
            }
          />
        </Card>
      </Col>
    </Row>
  );
};

export default DriverFatigueInitialPage;
