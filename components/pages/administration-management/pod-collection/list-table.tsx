import { InsertRowAboveOutlined } from "@ant-design/icons";
import FilterDropdown from "@sera-components/filter-dropdown";
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import { AutoCompleteType, BaseType } from "@sera-types/base.type";
import { UnitParams } from "@sera-types/expense-refund.type";
// import { UnitParams } from "@sera-types/tracking-tracking.type";
import { Col, Row } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import usePodCollection from "./hooks/usePodCollection";
import { ColumnsList, UNCHECK_KEYS } from "./list-props-table";

// const DUMMY = [
//   {
//     id: "BE854775-408C-415D-B357-E3DC3A5F2A0C",
//     shipmentNo: "SLIYF5WRSAC",
//     podStatus: "Cancelled",
//     bookingOrderNo: "BO20260131001",
//     customerName: "CV Indo Makmur",
//     shipmentType: "Ritase",
//     origin: "TENGAH",
//     destination: "TENGAH",
//     licensePlate: "AG6666LF",
//     driver1: {
//       id: "627B0F88-A74E-4E68-AF48-7FA5283B4AD9",
//       name: "Rengoku Kyujiro",
//     },
//     driver2: {
//       id: "5DBDE3AB-02F9-47F0-A41C-8BA818AC26AE",
//       name: "Tomioka Gyu",
//     },
//     expenseStatus: null,
//     expenseTransferred: false,
//     totalExpense: 0,
//   },
//   {
//     id: "1F08B1B5-955A-4E02-B592-91BEBDAA3B46",
//     shipmentNo: "SLIF7SCE7PA",
//     podStatus: "Unassigned",
//     bookingOrderNo: "BO20260131001",
//     customerName: "CV Indo Makmur",
//     shipmentType: "Ritase",
//     origin: "TENGAH",
//     destination: "TENGAH",
//     licensePlate: null,
//     driver1: null,
//     driver2: null,
//     expenseStatus: null,
//     expenseTransferred: false,
//     totalExpense: 0,
//   },
//   {
//     id: "41976511-A9B0-4927-B775-95DFB4DA88CF",
//     shipmentNo: "SLIKVDMTVCR",
//     podStatus: "Unassigned",
//     bookingOrderNo: "BO20260131001",
//     customerName: "CV Indo Makmur",
//     shipmentType: "Ritase",
//     origin: "TENGAH",
//     destination: "TENGAH",
//     licensePlate: null,
//     driver1: null,
//     driver2: null,
//     expenseStatus: null,
//     expenseTransferred: false,
//     totalExpense: 0,
//   },
//   {
//     id: "FDDF79AF-4800-45E0-A4A1-B443DC43B235",
//     shipmentNo: "SLIJXG2DHW7",
//     podStatus: "Unassigned",
//     bookingOrderNo: "BO20260131001",
//     customerName: "CV Indo Makmur",
//     shipmentType: "Ritase",
//     origin: "TENGAH",
//     destination: "TENGAH",
//     licensePlate: null,
//     driver1: null,
//     driver2: null,
//     expenseStatus: null,
//     expenseTransferred: false,
//     totalExpense: 0,
//   },
//   {
//     id: "C3DD1882-3588-4698-89C2-D8F9F8346F52",
//     shipmentNo: "SLIL1DH8XXD",
//     podStatus: "Open",
//     bookingOrderNo: "BO20260131001",
//     customerName: "CV Indo Makmur",
//     shipmentType: "Ritase",
//     origin: "TENGAH",
//     destination: "TENGAH",
//     licensePlate: "AG6666LF",
//     driver1: {
//       id: "627B0F88-A74E-4E68-AF48-7FA5283B4AD9",
//       name: "Rengoku Kyujiro",
//     },
//     driver2: {
//       id: "5DBDE3AB-02F9-47F0-A41C-8BA818AC26AE",
//       name: "Tomioka Gyu",
//     },
//     expenseStatus: "Additional Expense Requested",
//     expenseTransferred: false,
//     totalExpense: 0,
//   },
//   {
//     id: "8AA026B9-C525-49C3-BFE8-C38B927B0DFC",
//     shipmentNo: "SLIZUH5RGJL",
//     podStatus: "Unassigned",
//     bookingOrderNo: "BO20251224001",
//     customerName: "CV Indo Makmur",
//     shipmentType: "Ritase",
//     origin: "TENGAH",
//     destination: "TENGAH",
//     licensePlate: null,
//     driver1: null,
//     driver2: null,
//     expenseStatus: null,
//     expenseTransferred: false,
//     totalExpense: 0,
//   },
//   {
//     id: "E2F51C82-C569-46CD-B1AA-D4C1F0F46E48",
//     shipmentNo: "SLI73GUEEFK",
//     podStatus: "Unassigned",
//     bookingOrderNo: "BO20251208002",
//     customerName: "CV Indo Makmur",
//     shipmentType: "Ritase",
//     origin: "TENGAH",
//     destination: null,
//     licensePlate: null,
//     driver1: null,
//     driver2: null,
//     expenseStatus: null,
//     expenseTransferred: false,
//     totalExpense: 0,
//   },
//   {
//     id: "94D2AC29-3D93-4585-BBDA-72AA4F538090",
//     shipmentNo: "SLI1SMUST68",
//     podStatus: "Unassigned",
//     bookingOrderNo: "DRF20251210001",
//     customerName: "CV Indo Makmur",
//     shipmentType: "Ritase",
//     origin: "TENGAH",
//     destination: "TENGAH",
//     licensePlate: "B7003LA",
//     driver1: {
//       id: "E2E43AEF-9224-467D-AA5D-65AE64EFC7D3",
//       name: "LINA AGUSTINA",
//     },
//     driver2: {
//       id: "1F5FE09C-173C-4937-B882-770FF77EB3CC",
//       name: "FIRDAUS NANDA P",
//     },
//     expenseStatus: null,
//     expenseTransferred: false,
//     totalExpense: 0,
//   },
//   {
//     id: "5DD56918-1D4B-45DD-9C07-CC601BCE2886",
//     shipmentNo: "SLIV5RXRM7T",
//     podStatus: "Unassigned",
//     bookingOrderNo: "DRF20251210001",
//     customerName: "CV Indo Makmur",
//     shipmentType: "Ritase",
//     origin: "TENGAH",
//     destination: "TENGAH",
//     licensePlate: null,
//     driver1: null,
//     driver2: null,
//     expenseStatus: null,
//     expenseTransferred: false,
//     totalExpense: 0,
//   },
//   {
//     id: "65347634-4A67-4D89-ADBB-E08D2FCFA8FC",
//     shipmentNo: "SLIB1Z5KHPQ",
//     podStatus: "Unassigned",
//     bookingOrderNo: "BO20251210001",
//     customerName: "CV Indo Makmur",
//     shipmentType: "Ritase",
//     origin: "TENGAH",
//     destination: "TENGAH",
//     licensePlate: null,
//     driver1: null,
//     driver2: null,
//     expenseStatus: null,
//     expenseTransferred: false,
//     totalExpense: 0,
//   },
// ];

const DEFAULT_SEARCH = "status";
const initialOptions = { page: 1, limit: 10 };

interface ListTableProps {
  params: UnitParams;
}

const ListTable = ({ params }: ListTableProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "podCollection.table",
  });

  const {
    queries: { fetchList },
    data: { listData },
    pagination: { listOptions },
    loading: { listLoading },
  } = usePodCollection();

  const [isSkipFetch, setIsSkipFetch] = useState(false);

  const [options, setOptions] = useState<BaseType>(initialOptions);
  const COLUMN_KEYS = ColumnsList()?.filter((_item) => !_item?.exception);
  // const [selectedFilter, setSelectedFilter] = useState(DEFAULT_SEARCH);

  const [showColumns, setShowColumns] = useState<string[]>(
    COLUMN_KEYS?.map((_item) => _item?.key)?.filter(
      (_key) => !UNCHECK_KEYS.includes(_key),
    ),
  );

  const onChangePagination = (_current: number, _limit: number) => {
    setOptions((_prev) => ({ ..._prev, page: _current, limit: _limit }));
  };

  const onChangeSearchBy = (_value?: string) => {
    // if (!_value) return setOptions(initialOptions);
    setOptions((_prev) => ({ ..._prev, searchBy: _value, search: null }));
    // setSelectedFilter(_value);

    setIsSkipFetch(true);
  };

  const onHandleSearch = (_search?: string) => {
    if (!_search && options?.searchBy)
      return setOptions({ ...initialOptions, searchBy: options?.searchBy });
    if (!_search && !options?.searchBy) return setOptions(initialOptions);

    setOptions((_prev) => ({
      ..._prev,
      searchBy: _prev?.searchBy ?? DEFAULT_SEARCH,
      search: _search,
      page: 1,
    }));
  };

  const onHandleClearSearch = () => {
    setOptions(initialOptions);
  };

  useEffect(() => {
    if (isSkipFetch) return setIsSkipFetch(false);
    fetchList({ ...options, ...params });
  }, [options, params]);

  const renderFilter = useMemo(() => {
    // if (selectedFilter === "podStatus") {
    //   return (
    //     <Select
    //       id="pod-status-search"
    //       key="pod-status-search"
    //       style={{ width: 172 }}
    //       options={[
    //         { label: "Loading", value: "1" },
    //         { label: "On Loading", value: "0" },
    //       ]}
    //       onChange={(value) => onHandleSearch(value)}
    //       allowClear={false}
    //     />
    //   );
    // }
    return (
      <Input.Search
        id={`${options?.searchBy}-search`}
        key={`${options?.searchBy}-search`}
        style={{ width: 172 }}
        loading={Boolean(false)}
        disabled={Boolean(false)}
        placeholder={"search"}
        autoCompleteItems={[]}
        onSearch={(_search) => onHandleSearch(_search)}
        onClear={onHandleClearSearch}
        value={options?.search ?? ""}
      />
    );
  }, [options?.searchBy, options?.search]);

  return (
    <Table
      title={t("title")}
      columns={ColumnsList()?.filter(
        (_item) => _item?.exception || showColumns?.includes(_item?.key),
      )}
      dataSource={listData ?? []}
      // dataSource={DUMMY}
      total={listOptions?.totalData ?? 0}
      current={listOptions?.page ?? 1}
      pageSize={listOptions?.limit ?? 10}
      onPageChange={onChangePagination}
      scroll={{ x: "max-content" }}
      loading={listLoading}
      isCustomSearch
      customSearch={
        <Row align="middle" gutter={[8, 8]}>
          <Col xs={24} md={12}>
            <Select
              id="expense-refund-search"
              style={{ width: 172 }}
              defaultValue={DEFAULT_SEARCH}
              options={[
                { label: "POD Activity", value: "status" },
                { label: "Shipment Number", value: "shipmentNo" },
                { label: "Customer Name", value: "customerName" },
              ]}
              onChange={(value) => onChangeSearchBy(value)}
              onClear={() => null}
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

export default ListTable;
