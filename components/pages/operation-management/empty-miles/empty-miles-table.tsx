import { InsertRowAboveOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import FilterDropdown from "@sera-components/filter-dropdown";
import { Plus } from "@sera-components/icons";
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import { AutoCompleteType, BaseType } from "@sera-types/base.type";
import { Col, Row } from "antd";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  ColumnsList,
  DriversSearchByOptions,
  UNCHECK_LIST,
} from "./empty-miles-props-table";

const DEFAULT_SEARCH = "A";

const EmptyMilesTable = () => {
  const DATA = [
    {
      no: 1,
      A: "Status 1",
      B: "Created date 1",
      C: "Created by 1",
      D: "EM code 1",
      E: "Branch 1",
      F: "Journey date 1",
      G: "Unit type 1",
      H: "Qty driver 1",
      I: "License plate 1",
      J: "Driver VK/VD 1",
      K: "Drive ID 1",
      L: "Driver 1",
      M: "Driver phone 1",
      N: "Driver VK/VD 2",
      O: "Drive ID 2",
      P: "Driver 2",
      Q: "Driver phone 2",
      R: "Origin 1",
      S: "Destination 1",
      T: "Classification 1",
      U: "Reason 1",
      V: "Fuel cost 1",
      W: "Toll & parking 1",
      X: "Incentive KM 1",
      Y: "Incentive daily 1",
      AA: "Harbor crossing 1",
      BB: "Expenses amount 1",
      CC: "Expedition card 1",
    },
    {
      no: 2,
      A: "Status 2",
      B: "Created date 2",
      C: "Created by 2",
      D: "EM code 2",
      E: "Branch 2",
      F: "Journey date 2",
      G: "Unit type 2",
      H: "Qty driver 2",
      I: "License plate 2",
      J: "Driver VK/VD 1 2",
      K: "Drive ID 1 2",
      L: "Driver 1 2",
      M: "Driver phone 1 2",
      N: "Driver VK/VD 2 2",
      O: "Drive ID 2 2",
      P: "Driver 2 2",
      Q: "Driver phone 2 2",
      R: "Origin 2",
      S: "Destination 2",
      T: "Classification 2",
      U: "Reason 2",
      V: "Fuel cost 2",
      W: "Toll & parking 2",
      X: "Incentive KM 2",
      Y: "Incentive daily 2",
      AA: "Harbor crossing 2",
      BB: "Expenses amount 2",
      CC: "Expedition card 2",
    },
    {
      no: 3,
      A: "Status 3",
      B: "Created date 3",
      C: "Created by 3",
      D: "EM code 3",
      E: "Branch 3",
      F: "Journey date 3",
      G: "Unit type 3",
      H: "Qty driver 3",
      I: "License plate 3",
      J: "Driver VK/VD 1 3",
      K: "Drive ID 1 3",
      L: "Driver 1 3",
      M: "Driver phone 1 3",
      N: "Driver VK/VD 2 3",
      O: "Drive ID 2 3",
      P: "Driver 2 3",
      Q: "Driver phone 2 3",
      R: "Origin 3",
      S: "Destination 3",
      T: "Classification 3",
      U: "Reason 3",
      V: "Fuel cost 3",
      W: "Toll & parking 3",
      X: "Incentive KM 3",
      Y: "Incentive daily 3",
      AA: "Harbor crossing 3",
      BB: "Expenses amount 3",
      CC: "Expedition card 3",
    },
  ];

  const { t } = useTranslation(undefined, {
    keyPrefix: "emptyMiles.table",
  });

  const COLUMN_KEYS = ColumnsList()?.filter((_item) => !_item?.exception);

  const [showColumns, setShowColumns] = useState<string[]>(
    COLUMN_KEYS?.map((_item) => _item?.key)?.filter(
      (_key) => !UNCHECK_LIST.includes(_key),
    ),
  );

  const [options, setOptions] = useState<BaseType>({ page: 1, limit: 10 });

  const onChangePagination = (_current: number, _limit: number) => {
    setOptions((_prev) => ({ ..._prev, page: _current, limit: _limit }));
  };

  const onChangeSearchBy = (_value?: string) => {
    setOptions((_prev) => ({ ..._prev, searchBy: _value, search: null }));

    // TODO: Clear Auto Complete
  };

  const onHandleSearch = (_search?: string) => {
    setOptions((_prev) => ({
      ..._prev,
      searchBy: _prev?.searchBy ?? DEFAULT_SEARCH,
      search: _search,
      page: 1,
    }));
  };

  const onHandleSearching = (_search?: string) => {
    // setAutoComplete((_prev) => ({
    //   ..._prev,
    //   searchBy: _prev?.searchBy ?? DEFAULT_SEARCH,
    //   search: _search,
    //   page: 1,
    // }));
  };

  const onHandleClearSearch = () => {
    setOptions((_prev) => ({ ..._prev, search: null }));
  };

  const renderFilter = useMemo(() => {
    return (
      <Input.Search
        id={`${options?.searchBy}-search`}
        key={`${options?.searchBy}-search`}
        style={{ width: 172 }}
        loading={false}
        placeholder={"search"}
        autoCompleteItems={[]}
        onSearch={(_search) => onHandleSearch(_search)}
        onSearching={(_search) => onHandleSearching(_search)}
        onClear={onHandleClearSearch}
      />
    );
  }, [options?.searchBy]);

  return (
    <Table
      title={t("title")}
      columns={ColumnsList()}
      dataSource={DATA ?? []}
      total={DATA?.length}
      current={1}
      pageSize={10}
      onPageChange={onChangePagination}
      scroll={{ x: "max-content" }}
      loading={false}
      isCustomSearch
      customSearch={
        <Row align="middle" gutter={[8, 8]}>
          <Col xs={24} md={12}>
            <Select
              id="empty-miles-drivers-search"
              style={{ width: 172 }}
              defaultValue="A"
              options={DriversSearchByOptions()}
              onChange={(value) => onChangeSearchBy(value)}
              onClear={() => onChangeSearchBy("")}
              allowClear={false}
            />
          </Col>

          <Col xs={24} md={12}>
            {renderFilter}
          </Col>
        </Row>
      }
      showActions
      actions={
        <Row gutter={[12, 12]}>
          <Col>
            <Link
              id="link-add-empty-miles"
              href="/operation-management/empty-miles/add"
              passHref
            >
              <Button
                id="action-add"
                type="primary"
                disabled={false}
                icon={<Plus />}
                style={{ width: "100%" }}
              >
                {t("button.add")}
              </Button>
            </Link>
          </Col>
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
        </Row>
      }
    />
  );
};

export default EmptyMilesTable;
