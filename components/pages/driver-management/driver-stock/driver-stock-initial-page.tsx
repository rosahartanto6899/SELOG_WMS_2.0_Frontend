import { InsertRowAboveOutlined } from "@ant-design/icons";
import Card from "@sera-components/card";
import FilterDropdown from "@sera-components/filter-dropdown";
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import MessageHandler from "@sera-libraries/message-handler";
import { AutoCompleteType } from "@sera-types/base.type";
import {
  ISummaryPayload,
  IUpdateNotePayload,
} from "@sera-types/driver-stock.type";
import { Col, Flex, Row } from "antd";
import { isEmpty, isNil, omit } from "lodash";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import styles from "./driver-stock.module.scss";
import DriverStockFilters from "./driver-stock-filters";
import {
  Columns,
  ColumnsInOut,
  ColumnsSummary,
  DRIVER_STOCK_DEFAULT_UNCHECK,
} from "./driver-stock-props-table";
import useDriverStock from "./hooks/useDriverStock";
import ModalNotes from "./modal-notes";

export type TFIlterSearch =
  | "employeeName"
  | "employeeStatus"
  | "contractStatus"
  | "fatigueStatus";

const DriverStocks = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "driverStock",
  });
  const COLUMN_KEYS = Columns({})?.filter((_item) => !_item?.exception);

  const {
    queries: { fetchSummary, fetchList, fetchFilter, updateNotes },
    data: { summary, inAndOut, listData, filterOption },
    loading: {
      loadingSummary,
      loadingList,
      loadingFilterOption,
      loadingUpdateNote,
    },
    pagination,
  } = useDriverStock();

  const [selectedFilter, setSelectedFilter] =
    useState<TFIlterSearch>("employeeName");
  const [filterSelectedValue, setFilterSelectedValue] = useState(null);

  const [driverStockData, setDriverStockData] =
    useState<IUpdateNotePayload | null>(null);

  const [params, setParams] = useState<ISummaryPayload>({
    "branchId[]": [],
    "shipmentType[]": [],
  });
  const [searchType, setSearchType] = useState<string>("textBox");
  const [showColumns, setShowColumns] = useState<string[]>(
    COLUMN_KEYS?.map((_item) => _item?.key)?.filter(
      (_key) => !DRIVER_STOCK_DEFAULT_UNCHECK.includes(_key),
    ),
  );

  const onChangeFilter = (_val: ISummaryPayload) => {
    setParams((_prev) => ({
      "branchId[]": _val?.["branchId[]"] ?? _prev?.["branchId[]"],
      "shipmentType[]": _val?.["shipmentType[]"] ?? _prev?.["shipmentType[]"],
    }));
    fetchSummary({
      ...params,
      ...(_val?.["branchId[]"] && { "branchId[]": _val["branchId[]"] }),
      ...(_val?.["shipmentType[]"] && {
        "shipmentType[]": _val["shipmentType[]"],
      }),
    });
    fetchList({
      ...params,
      ...(!isEmpty(filterSelectedValue) && {
        [`${selectedFilter}[]`]: filterSelectedValue,
      }),
      ...(_val?.["branchId[]"] && { "branchId[]": _val["branchId[]"] }),
      ...(_val?.["shipmentType[]"] && {
        "shipmentType[]": _val["shipmentType[]"],
      }),
    });
  };

  const handlerSelectSearchBy = (value: TFIlterSearch) => {
    setSelectedFilter(value);
    setFilterSelectedValue(null);
    setParams(omit(params, ["search", "searchBy"]));
    if (value === "employeeName") {
      setSearchType("textbox");
    } else {
      setSearchType("dropdown");
    }
  };

  const onPageChangeListener = (current: number, limit: number) =>
    fetchList({
      ...params,
      ...(!isEmpty(filterSelectedValue) && {
        [`${selectedFilter}[]`]: filterSelectedValue,
      }),
      limit,
      page: current,
    });

  const onTableChangeListener = (
    _pagination: any,
    _filters: any,
    sorter: any,
  ) =>
    fetchList({
      ...params,
      ...(!isEmpty(filterSelectedValue) && {
        [selectedFilter]: filterSelectedValue,
      }),
      page: pagination?.page ?? 0,
      limit: pagination?.limit ?? 0,
      sort: sorter.order === "ascend" ? "asc" : "desc",
      order: sorter.field,
    });

  const onEdit = (payload: IUpdateNotePayload) => setDriverStockData(payload);

  const onSubmitNote = (payload: { note: string }) => {
    if (!driverStockData?.id) return;
    updateNotes({ id: driverStockData.id, note: payload.note }, () => {
      setDriverStockData(null);
      MessageHandler().success(t("message.noteAdded"));
      fetchList({
        page: pagination?.page ?? 1,
        limit: pagination?.limit ?? 10,
      });
    });
  };

  useEffect(() => {
    fetchSummary({});
    fetchFilter();
    fetchList({ page: pagination?.page ?? 1, limit: pagination?.limit ?? 10 });
  }, []);

  return (
    <>
      <Flex gap={24} vertical>
        <Card.Filter>
          <DriverStockFilters data={params} onChangeFilter={onChangeFilter} />
        </Card.Filter>
        <Card>
          <Table
            title={t("summary.title")}
            columns={ColumnsSummary()}
            dataSource={summary ?? []}
            loading={loadingSummary}
            scroll={{ x: "max-content" }}
            multipleDelete={false}
            rowClassName={(_, index) => {
              return index === summary?.length - 1
                ? styles["last-row-bold"]
                : "";
            }}
          />
        </Card>
        <Card>
          <Table
            title={t("table.title")}
            columns={Columns({ onEdit })?.filter(
              (_item) => _item?.exception || showColumns?.includes(_item?.key),
            )}
            dataSource={listData ?? []}
            loading={loadingList}
            scroll={{ x: "max-content" }}
            multipleDelete={false}
            current={pagination?.page ?? 1}
            total={pagination?.totalData ?? 0}
            pageSize={pagination?.limit ?? 10}
            isCustomSearch
            onPageChange={onPageChangeListener}
            onTableChange={onTableChangeListener}
            customSearch={
              <Row align="middle" gutter={[8, 4]}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <Select
                    id="table-search-dropdown"
                    defaultValue="employeeName"
                    placeholder={t("table.search.default.placeholder")}
                    onChange={(value) => handlerSelectSearchBy(value)}
                    // onClear={() => handlerSelectSearchBy("")}
                    allowClear={false}
                    loading={loadingFilterOption || loadingList}
                    disabled={loadingFilterOption || loadingList}
                  >
                    {filterOption.map((opt) => (
                      <Select.Option key={opt.value} value={opt.value}>
                        {opt.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Col>

                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  {searchType === "dropdown" ? (
                    <Select
                      style={{ width: 180 }}
                      id="driver-search"
                      onChange={(e) => {
                        setFilterSelectedValue(e);
                        fetchList({
                          ...params,
                          // search: e,
                          // searchBy: selectedFilter,
                          [`${selectedFilter}[]`]: e,
                          page: 1,
                          limit: pagination?.limit ?? 10,
                        });
                      }}
                      onClear={() =>
                        fetchList({
                          ...params,
                          page: 1,
                          limit: pagination?.limit ?? 10,
                        })
                      }
                      loading={loadingFilterOption || loadingList}
                      disabled={loadingFilterOption || loadingList}
                      value={filterSelectedValue}
                    >
                      {filterOption
                        .find((e) => e.value === selectedFilter)
                        ?.options?.map((opt: any) => (
                          <Select.Option key={opt.value} value={opt.value}>
                            {opt.label}
                          </Select.Option>
                        ))}
                    </Select>
                  ) : (
                    <Input.Search
                      loading={Boolean(loadingFilterOption || loadingList)}
                      placeholder={t("table.search.placeholder")}
                      autoCompleteItems={[]}
                      onSearch={(e) => {
                        setParams((prev) => ({
                          ...prev,
                          searchBy: "employeeName",
                          search: e,
                        }));
                        fetchList({
                          ...params,
                          searchBy: "employeeName",
                          search: e,
                          page: 1,
                          limit: pagination?.limit ?? 10,
                        });
                      }}
                      onClear={() =>
                        fetchList({
                          ...params,
                          page: 1,
                          limit: pagination?.limit ?? 10,
                        })
                      }
                      value={""}
                      disabled={loadingFilterOption || loadingList}
                    />
                  )}
                </Col>
              </Row>
            }
            actions={
              <Row gutter={8}>
                <Col>
                  <FilterDropdown
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
                    buttonLabel="Columns"
                    icon={<InsertRowAboveOutlined />}
                  />
                </Col>
              </Row>
            }
          />
        </Card>
        <Card>
          <Table
            title={t("driverInOut.title")}
            columns={ColumnsInOut()}
            dataSource={inAndOut ?? []}
            loading={loadingSummary}
            scroll={{ x: "max-content" }}
            multipleDelete={false}
            rowClassName={(_, index) => {
              return index === inAndOut.length - 1
                ? styles["last-row-bold"]
                : "";
            }}
          />
        </Card>
      </Flex>
      <ModalNotes
        isOpen={!isNil(driverStockData)}
        note={driverStockData?.note ?? ""}
        onSubmit={onSubmitNote}
        onCancel={() => {
          setDriverStockData(null);
        }}
        loading={loadingUpdateNote}
      />
    </>
  );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DriverStocks);
