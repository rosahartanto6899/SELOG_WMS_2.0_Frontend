import { InsertRowAboveOutlined } from "@ant-design/icons";
import FilterCard from "@sera-components/card";
import CarouselInsightSkeletons from "@sera-components/carousel/carousel-insights";
import FilterDropdown from "@sera-components/filter-dropdown";
import { LogisUserMultiple } from "@sera-components/icons";
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import { AutoCompleteType } from "@sera-types/base.type";
import { ISummaryPayload } from "@sera-types/driver-performance.type";
import FormatUtils from "@sera-utils/format";
// import { useAppDispatch, useAppSelector } from "@sera-redux";
import { Card, Col, Row, Typography } from "antd";
import dayjs from "dayjs";
import { omit } from "lodash";
// import { useRouter } from "next/router";
import React, { useEffect, useReducer, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  Columns,
  DRIVER_PERFORMANCE_DEFAULT_UNCHECK,
  filterOptions,
} from "./driver-performance-props-table";
import useDriverPerformance from "./hooks/useDriverPerformance";
import PerformanceCard from "./performance-card";

export interface FILTER_PROPS_BOOKING_ORDER {
  branchId?: string[];
  shipmentType?: string[];
}

export type TFIlterSearch = "grade" | "employeeName";

const DriverPerformanceInitialPage = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "driverPerformance" });
  // const router = useRouter();
  // const dispatch = useAppDispatch();
  // const loading = useAppSelector((state) => state.loading);

  const {
    data: {
      dropdownBusinessAreas,
      employeeStatusData,
      shipmentTypeData,
      summary,
      performanceList,
    },
    queries: {
      fetchBranch,
      fetchEmployeeStatus,
      fetchShipmentType,
      fetchSummary,
      fetchPerformanceList,
    },
    loading: {
      loadingBranch,
      loadingShipmentType,
      loadingEmployeeStatus,
      loadingSummary,
      loadingPerformanceList,
    },
    pagination,
  } = useDriverPerformance();

  const [selectedFilter, setSelectedFilter] =
    useState<TFIlterSearch>("employeeName");
  const [filterSelectedValue, setFilterSelectedValue] = useState(null);

  const [stateSelectedFilterData, dispatchSelectedFilterData] = useReducer(
    (curr: ISummaryPayload, acc: ISummaryPayload) => ({
      ...curr,
      ...acc,
    }),
    { "branchId[]": [], "shipmentType[]": [], "employeeStatus[]": [] },
  );

  const COLUMN_KEYS = Columns()?.filter((_item) => !_item?.exception);

  const [showColumns, setShowColumns] = useState<string[]>(
    COLUMN_KEYS?.map((_item) => _item?.key)?.filter(
      (_key) => !DRIVER_PERFORMANCE_DEFAULT_UNCHECK.includes(_key),
    ),
  );

  const onPageChangeListener = (current: number, limit: number) =>
    fetchPerformanceList({ ...stateSelectedFilterData, limit, page: current });

  const onTableChangeListener = (
    _pagination: any,
    _filters: any,
    sorter: any,
  ) =>
    fetchPerformanceList({
      ...stateSelectedFilterData,
      page: pagination?.page ?? 0,
      limit: pagination?.limit ?? 0,
      sort: sorter.order === "ascend" ? "asc" : "desc",
      order: sorter.field,
    });

  useEffect(() => {
    fetchBranch();
    fetchEmployeeStatus();
    fetchShipmentType();
    fetchSummary();
    fetchPerformanceList({
      limit: pagination?.limit ?? 10,
      page: pagination?.page ?? 1,
    });
  }, []);

  return (
    <Row style={{ flexDirection: "column" }} gutter={[16, 16]}>
      <Col>
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
                          fetchPerformanceList({
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
                          fetchPerformanceList({
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
                          fetchPerformanceList({
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
          <Col span={24}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <CarouselInsightSkeletons>
                  <Col>
                    <PerformanceCard
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
                  <Col>
                    <PerformanceCard
                      label={`${t("table.card.grade")} A`}
                      icon={<LogisUserMultiple />}
                      value={FormatUtils().formatInputCurrency(
                        (summary.performanceSummary.A ?? 0).toString(),
                      )}
                      cardBg="successMain"
                      avatarBg="successSubtle"
                      loading={Boolean(loadingSummary)}
                    />
                  </Col>
                  <Col>
                    <PerformanceCard
                      label={`${t("table.card.grade")} B`}
                      icon={<LogisUserMultiple />}
                      value={FormatUtils().formatInputCurrency(
                        (summary.performanceSummary.B ?? 0).toString(),
                      )}
                      cardBg="warningMain"
                      avatarBg="warningSubtle"
                      loading={Boolean(loadingSummary)}
                    />
                  </Col>
                  <Col>
                    <PerformanceCard
                      label={`${t("table.card.grade")} C`}
                      icon={<LogisUserMultiple />}
                      value={FormatUtils().formatInputCurrency(
                        (summary.performanceSummary.C ?? 0).toString(),
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
      </Col>
      <Col>
        <Card>
          <Table
            title={t("table.title")}
            columns={Columns()?.filter(
              (_item) => _item?.exception || showColumns?.includes(_item?.key),
            )}
            dataSource={performanceList}
            total={pagination?.totalData ?? 0}
            current={pagination?.page}
            pageSize={pagination?.limit ?? 10}
            loading={loadingPerformanceList}
            rowKey={"no"}
            scroll={{ x: "max-content" }}
            multipleDelete={false}
            onPageChange={onPageChangeListener}
            onTableChange={onTableChangeListener}
            isCustomSearch
            customSearch={
              <Row align="middle" gutter={[8, 4]}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <Select
                    style={{ width: "100%" }}
                    id="driver-search"
                    defaultValue={"employeeName"}
                    onChange={(value: TFIlterSearch) => {
                      setFilterSelectedValue(null);
                      setSelectedFilter(value);
                    }}
                    onClear={() => null}
                    allowClear={false}
                  >
                    {filterOptions.map((opt) => (
                      <Select.Option key={opt.value} value={opt.value}>
                        {opt.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Col>

                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  {selectedFilter === "employeeName" ? (
                    <Input.Search
                      loading={false}
                      placeholder={t("table.search.placeholder")}
                      autoCompleteItems={[]}
                      onSearch={(e) =>
                        fetchPerformanceList({
                          ...stateSelectedFilterData,
                          searchBy: "employeeName",
                          search: e,
                          page: 1,
                          limit: pagination?.limit ?? 10,
                        })
                      }
                      onClear={() =>
                        fetchPerformanceList({
                          ...stateSelectedFilterData,
                          page: 1,
                          limit: pagination?.limit ?? 10,
                        })
                      }
                      value={""}
                    />
                  ) : (
                    <Select
                      style={{ width: 180 }}
                      id="driver-search"
                      onChange={(e) => {
                        setFilterSelectedValue(e);
                        fetchPerformanceList({
                          ...stateSelectedFilterData,
                          search: e,
                          searchBy: selectedFilter,
                          page: 1,
                          limit: pagination?.limit ?? 10,
                        });
                      }}
                      onClear={() =>
                        fetchPerformanceList({
                          ...stateSelectedFilterData,
                          page: 1,
                          limit: pagination?.limit ?? 10,
                        })
                      }
                      value={filterSelectedValue}
                    >
                      {filterOptions
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

export default DriverPerformanceInitialPage;
