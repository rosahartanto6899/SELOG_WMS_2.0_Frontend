/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { InsertRowAboveOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import FilterDropdown from "@sera-components/filter-dropdown";
import Input from "@sera-components/input";
import Modal from "@sera-components/modal";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import MessageHandler from "@sera-libraries/message-handler";
import { AutoCompleteType, BaseType } from "@sera-types/base.type";
import {
  Demands,
  PairingRepairPayload,
  UnitParams,
} from "@sera-types/pairing-matching-ops";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Col, DatePicker, Row, Space } from "antd";
import { includes } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import usePairingMatchingOps from "./hooks/usePairingMatchingOps";
import PairingMatchingConfirm from "./pairing-matching-confirm";
import PairingMatchingConfirmRepair from "./pairing-matching-confirm-repair";
import {
  ColumnsDemands,
  UNCHECK_DEMANDS_KEYS,
} from "./pairing-matching-props-table";
import TableHistory from "./pairing-matching-table-history";
// import { dummyDemands } from "./dummy";

const DEFAULT_SEARCH = "bookingCode";
const AUTOCOMPLETE = { searchBy: DEFAULT_SEARCH, page: 1, limit: 10 };

interface TableDemandsProps {
  data: Record<string, any>;
  onSelectData: (_value: any, _index?: number) => void;
  params: UnitParams;
  isSkipFetch: boolean;
  setIsSkipFetch: (args: boolean) => void;
}

const dropdownFilter = ["status"];

const TableDemands = ({
  data,
  onSelectData,
  params,
  isSkipFetch,
  setIsSkipFetch,
}: TableDemandsProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "pairingMatchingOps.table.demands",
  });

  const { t: tA } = useTranslation(undefined, {
    keyPrefix: "pairingMatchingOps.table.demands",
  });

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/operation-management/pairing-matching-ops/index");

  const COLUMN_KEYS = ColumnsDemands({})?.filter((_item) => !_item?.exception);

  const [selectedDemandFilter, setSelectedDemandFilter] =
    useState(DEFAULT_SEARCH);

  const [selectedData, setSelectedData] = useState<Demands | null>(null);

  const [showColumns, setShowColumns] = useState<string[]>(
    COLUMN_KEYS?.map((_item) => _item?.key)?.filter(
      (_key) => !UNCHECK_DEMANDS_KEYS.includes(_key),
    ),
  );

  const [options, setOptions] = useState<BaseType>({
    page: 1,
    limit: 10,
  });
  const [autoComplete, setAutoComplete] = useState<BaseType>(AUTOCOMPLETE);
  const [activeModal, setActiveModal] = useState("");

  const {
    queries: { fetchDemands, fetchDemandFilter, fetchSummary },
    mutations: { postPairingConfirm, postPairingRepair },
    data: { demandList, filterDemands },
    loading: {
      loadingDemands,
      loadingShipmentType,
      loadingPairingConfirm,
      loadingShipmentDetail,
    },
    pagination: { demandsOptions },
  } = usePairingMatchingOps();

  const onChangePagination = (_current: number, _limit: number) => {
    setOptions((_prev) => ({ ..._prev, page: _current, limit: _limit }));
  };

  const onChangeSearchBy = (_value: string) => {
    setIsSkipFetch(true);

    setSelectedDemandFilter(_value);
    setOptions((_prev) => ({ ..._prev, searchBy: _value, search: null }));
    setAutoComplete((_prev) => ({ ..._prev, searchBy: _value, search: null }));

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
    setAutoComplete((_prev) => ({
      ..._prev,
      searchBy: _prev?.searchBy ?? DEFAULT_SEARCH,
      search: _search,
      page: 1,
    }));
  };

  const onHandleClearSearch = () => {
    setOptions((_prev) => ({ ..._prev, search: null }));
  };

  const onHandleActions = (
    type: "repair" | "confirm" | "history",
    _record: Demands,
  ) => {
    setSelectedData(_record ?? null);
    setActiveModal(type.toUpperCase());
  };

  useEffect(() => {
    if (isSkipFetch) return setIsSkipFetch(false);

    try {
      // TODO: Get Data
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 117, error);
      else sendErrorHandler("useEffect", 117, error?.data?.message);
    }
  }, [options]);

  useEffect(() => {
    try {
      if (autoComplete.search) {
        // TODO: Get Data Auto Complete
      }
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 128, error);
      else sendErrorHandler("useEffect", 128, error?.data?.message);
    }
  }, [autoComplete]);

  useEffect(() => {
    if (isSkipFetch) return setIsSkipFetch(false);
    fetchDemands({ ...options, ...params });
  }, [options, params]);

  const renderFilter = useMemo(() => {
    if (options?.searchBy === "pickupDate") {
      return (
        <DatePicker
          id={`${options?.searchBy}-search`}
          key={`${options?.searchBy}-search`}
          style={{ width: 172, borderRadius: 20 }}
          onChange={(_value) => onHandleSearch(_value?.format("YYYY-MM-DD"))}
        />
      );
    }

    if (
      selectedDemandFilter &&
      includes(dropdownFilter, selectedDemandFilter)
    ) {
      return (
        <Select
          style={{ width: 180 }}
          id="filter-search"
          onChange={(e) =>
            setOptions((_prev) => ({
              ..._prev,
              searchBy: selectedDemandFilter,
              search: e,
            }))
          }
          allowClear={false}
          value={options.search}
        >
          {filterDemands
            .find((e) => e.value === selectedDemandFilter)
            ?.options?.map((opt) => (
              <Select.Option
                disabled={opt.value === "Paired"}
                key={opt.value}
                value={opt.value}
              >
                {opt.label}
              </Select.Option>
            ))}
        </Select>
      );
    }
    return (
      <Input.Search
        id={`${options?.searchBy}-search`}
        key={`${options?.searchBy}-search`}
        style={{ width: 172 }}
        loading={false}
        placeholder={"Search"}
        autoCompleteItems={[]}
        onSearch={(_search) => onHandleSearch(_search)}
        onSearching={(_search) => onHandleSearching(_search)}
        onClear={onHandleClearSearch}
      />
    );
  }, [options?.searchBy, options.search, filterDemands]);

  useEffect(() => {
    fetchDemandFilter();
  }, []);

  return (
    <>
      <Table
        title={t("title")}
        columns={ColumnsDemands({
          onClick: (type, record) => onHandleActions(type, record),
        })?.filter(
          (_item) => _item?.exception || showColumns?.includes(_item?.key),
        )}
        dataSource={demandList ?? []}
        // dataSource={dummyDemands}
        total={demandsOptions?.totalData ?? 0}
        current={demandsOptions?.page ?? 1}
        pageSize={demandsOptions?.limit ?? 10}
        rowKey={(row: any) => `${row?.no}`}
        onPageChange={onChangePagination}
        onRowClick={onSelectData}
        scroll={{ x: "max-content" }}
        loading={loadingDemands}
        rowClassName={(_record) => {
          if (_record?.id === data?.id) return "data-selected";
          return "";
        }}
        isCustomSearch
        customSearch={
          <Row align="middle" gutter={[8, 8]}>
            <Col xs={24} md={12}>
              <Select
                id="pairing-matching-demands-search"
                style={{ width: 172 }}
                defaultValue={DEFAULT_SEARCH}
                onChange={(value) => onChangeSearchBy(value)}
                onClear={() => onChangeSearchBy("")}
                allowClear={false}
                loading={loadingShipmentType}
              >
                {filterDemands.map((opt) => (
                  <Select.Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Select.Option>
                ))}
              </Select>
            </Col>

            <Col xs={24} md={12}>
              {renderFilter}
            </Col>
          </Row>
        }
        actions={
          <Row gutter={[16, 4]}>
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
      <Modal
        open={includes(["REPAIR"], activeModal.toUpperCase())}
        closable
        onCancel={() => setActiveModal("")}
        destroyOnClose
      >
        <PairingMatchingConfirmRepair
          onCancel={() => setActiveModal("")}
          licensePlate={selectedData?.licensePlate}
          driverName1={selectedData?.driver1}
          driverName2={selectedData?.driver2}
          qtyDriver={selectedData?.qtyDriver ?? 1}
          onFinish={(body: PairingRepairPayload) =>
            selectedData?.id &&
            postPairingRepair({ id: selectedData?.id, ...body }, () => {
              MessageHandler().success(tA("toast.repair"));
              setActiveModal("");
              fetchDemands({ ...options, ...params });
              fetchSummary(params);
            })
          }
        />
      </Modal>
      <Modal
        open={activeModal === "HISTORY"}
        closable
        width={1000}
        onCancel={() => setActiveModal("")}
        destroyOnClose
      >
        <TableHistory shipmentId={selectedData?.id ?? null} />
      </Modal>

      <Modal.Confirm
        type="warning"
        open={activeModal === "CONFIRM"}
        title={t("alert.titleConfirm")}
        okText={t("alert.okBtn")}
        okButtonProps={{
          disabled: loadingPairingConfirm || loadingShipmentDetail,
          loading: loadingPairingConfirm || loadingShipmentDetail,
        }}
        cancelButtonProps={{
          disabled: loadingPairingConfirm || loadingShipmentDetail,
          loading: loadingPairingConfirm || loadingShipmentDetail,
        }}
        styles={{
          footer: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
        footer={
          <Space align="center">
            <Button
              type="primary"
              disabled={loadingPairingConfirm || loadingShipmentDetail}
              onClick={() =>
                selectedData?.id &&
                postPairingConfirm({ id: selectedData?.id }, () => {
                  MessageHandler().success(tA("toast.confirm"));
                  setActiveModal("");
                  fetchDemands({ ...options, ...params });
                  fetchSummary(params);
                })
              }
            >
              {t("button.confirm")}
            </Button>
            <Button
              disabled={loadingPairingConfirm || loadingShipmentDetail}
              onClick={() => {
                setActiveModal("");
              }}
            >
              {t("button.cancel")}
            </Button>
          </Space>
        }
        // onOk={() =>
        //   selectedData?.id &&
        //   postPairingConfirm({ id: selectedData?.id }, () => {
        //     MessageHandler().success(tA("toast.confirm"));
        //     setActiveModal("");
        //     fetchDemands({ ...options, ...params });
        //   })
        // }
        onCancel={() => setActiveModal("")}
      >
        <PairingMatchingConfirm data={selectedData} />
      </Modal.Confirm>
    </>
  );
};

export default TableDemands;
