import { InsertRowAboveOutlined } from "@ant-design/icons";
import Card from "@sera-components/card";
import FilterDropdown from "@sera-components/filter-dropdown";
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import {
  businessAreaActions,
  journeySupportActions,
  masterDataActions,
  useAppDispatch,
  useAppSelector,
} from "@sera-redux";
import { AutoCompleteType, BaseType } from "@sera-types/base.type";
import { journeySupportTypes } from "@sera-types/journey-support.type";
import { Col, Flex, Row } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import JourneySupportFilter, {
  FilterStateProps,
} from "./journey-support-filter";
import { Columns, SearchByOptions } from "./journey-support-props-table";
import JourneySupportSummary from "./journey-support-summary";

const INIT_SEARCH_BY = "shipmentNo";

const JourneySupportList = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(undefined, {
    keyPrefix: "journeySupport",
  });

  const { data, options, autoComplete } = useAppSelector(
    (state) => state.journeySupport,
  );

  const { getJourneyStatuses } = useAppSelector((state) => state.masterData);

  const loading = useAppSelector((state) => state.loading);

  const COLUMN_KEYS = Columns({})?.filter((_item) => !_item?.exception);
  const [showColumns, setShowColumns] = useState<string[]>(
    COLUMN_KEYS.filter((item) => !item.exclude).map((_item) => _item.key),
  );

  const [filter, setFilter] = useState<FilterStateProps>({
    branchId: undefined,
    shipmentType: undefined,
  });
  const [searchBy, setSearchBy] = useState(INIT_SEARCH_BY);

  const [journeySupportListOptions, setJourneySupportListOptions] = useState<
    BaseType & { [key: string]: any }
  >({
    page: 1,
    limit: 10,
    // order: "createdAt",
    // sort: "asc",
  });

  console.log(journeySupportListOptions);

  const [
    journeySupportAutoCompleteOptions,
    setJourneySupportAutoCompleteOptions,
  ] = useState<BaseType>({
    searchBy: INIT_SEARCH_BY,
    page: 1,
    limit: 10,
  });

  const onChangeFilter = (val: string[], type: string) => {
    setFilter((prev) => {
      const _filter = {
        ...prev,
        [type]: val?.length ? val : undefined,
      };
      setJourneySupportListOptions((prevState) => {
        const _params = {
          ...prevState,
          ..._filter,
          page: 1,
        };
        return _params;
      });

      return _filter;
    });
  };

  const onPageChangeListener = (current: number, limit: number) => {
    setJourneySupportListOptions((prevState) => ({
      ...prevState,
      page: current,
      limit,
    }));
  };

  const onTableChangeListener = (
    _pagination: any,
    _filters: any,
    sorter: any,
  ) => {
    if (sorter) {
      setJourneySupportListOptions((prevState) => ({
        ...prevState,
        order: sorter.field,
        sort: sorter.order === "ascend" ? "asc" : ("desc" as string),
      }));
    }
  };

  const onSearchChangeListener = (search?: string, searchBy?: string) => {
    setJourneySupportListOptions((prevState: BaseType) => ({
      ...prevState,
      search,
      searchBy,
      page: 1,
    }));
  };

  const onSearchingChangeListener = (search?: string) => {
    setJourneySupportAutoCompleteOptions((prevState: BaseType) => ({
      ...prevState,
      search,
    }));
  };

  const onClearSearchListener = () => {
    setJourneySupportListOptions((prevState: BaseType) => ({
      ...prevState,
      search: null,
    }));
  };

  const handlerSelectSearchBy = (value?: string) => {
    setSearchBy(value!);
    setJourneySupportListOptions((prevState: BaseType) => {
      if (prevState.search) {
        return {
          ...prevState,
          search: null,
        };
      }

      return prevState;
    });

    setJourneySupportAutoCompleteOptions((prevState: BaseType) => {
      if (prevState.search) {
        return {
          ...prevState,
          search: null,
        };
      }

      return prevState;
    });

    dispatch(journeySupportActions.getJourneySupportAutoCompleteClear());
  };

  useEffect(() => {
    dispatch(journeySupportActions.getSummaryJourneySupportFetch(filter));

    return () => {
      dispatch(journeySupportActions.getSummaryJourneySupportClear());
    };
  }, [filter]);

  useEffect(() => {
    dispatch(businessAreaActions.getDropdownBusinessAreasFetch({}));
    return () => {
      dispatch(businessAreaActions.getDropdownBusinessAreasClear());
    };
  }, []);

  useEffect(() => {
    dispatch(masterDataActions.getJourneyStatusesFetch());

    return () => {
      dispatch(masterDataActions.getJourneyStatusesClear());
    };
  }, []);

  useEffect(() => {
    dispatch(
      journeySupportActions.getJourneySupportFetch({
        ...journeySupportListOptions,
        ...filter,
        searchBy: journeySupportListOptions?.search ? searchBy : undefined,
        search: journeySupportListOptions?.search || undefined,
      }),
    );

    return () => {
      dispatch(journeySupportActions.getJourneySupportClear());
    };
  }, [journeySupportListOptions, filter]);

  useEffect(() => {
    if (journeySupportAutoCompleteOptions.search) {
      dispatch(
        journeySupportActions.getJourneySupportAutoCompleteFetch({
          ...journeySupportAutoCompleteOptions,
          ...filter,
          searchBy,
        }),
      );
    }

    return () => {
      dispatch(journeySupportActions.getJourneySupportAutoCompleteClear());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [journeySupportAutoCompleteOptions, searchBy]);

  return (
    <Flex gap={16} vertical>
      <Card.Filter>
        <JourneySupportFilter filter={filter} onChangeFilter={onChangeFilter} />
      </Card.Filter>

      <Card>
        <JourneySupportSummary />
      </Card>

      <Card>
        <Table
          title={t("table.title")}
          columns={Columns({
            statuses: getJourneyStatuses?.data ?? [],
          })?.filter(
            (_item) => _item?.exception || showColumns?.includes(_item?.key),
          )}
          dataSource={data}
          loading={loading[journeySupportTypes.GET_JOURNEY_SUPPORT]}
          total={options?.totalData ?? 0}
          current={options?.page ?? 1}
          pageSize={options?.limit ?? 10}
          rowKey="no"
          scroll={{ x: "max-content" }}
          onPageChange={onPageChangeListener}
          onTableChange={onTableChangeListener}
          isCustomSearch
          customSearch={
            <Row align="middle" gutter={[8, 4]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Select
                  style={{ width: "100%" }}
                  id="customer-search"
                  defaultValue={searchBy}
                  placeholder={t("table.search.placeholder")}
                  onChange={(value) => handlerSelectSearchBy(value)}
                  onClear={() => handlerSelectSearchBy("")}
                  allowClear={false}
                >
                  {SearchByOptions().map((opt) => (
                    <Select.Option key={opt.value} value={opt.value}>
                      {opt.label}
                    </Select.Option>
                  ))}
                </Select>
              </Col>

              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Input.Search
                  loading={false}
                  placeholder={t("table.search.placeholder")}
                  autoCompleteItems={autoComplete?.data}
                  onSearch={(search) =>
                    onSearchChangeListener(
                      search,
                      journeySupportAutoCompleteOptions.searchBy ?? searchBy,
                    )
                  }
                  onSearching={(searching) =>
                    onSearchingChangeListener(searching)
                  }
                  onClear={onClearSearchListener}
                  value={journeySupportAutoCompleteOptions.search ?? ""}
                />
              </Col>
            </Row>
          }
          actions={
            <Row gutter={[16, 4]}>
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
    </Flex>
  );
};

export default JourneySupportList;
