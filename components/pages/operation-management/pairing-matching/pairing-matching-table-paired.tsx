/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { InsertRowAboveOutlined } from "@ant-design/icons";
import FilterDropdown from "@sera-components/filter-dropdown";
import Input from "@sera-components/input";
import Modal from "@sera-components/modal";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import Typography from "@sera-components/typography";
import MessageHandler from "@sera-libraries/message-handler";
import {
  DEFAULT_SEARCH_PAIRED,
  masterDataActions,
  pairingMatchingActions,
  RootState,
} from "@sera-redux";
import { AutoCompleteType, BaseType } from "@sera-types/base.type";
import { LoadingState } from "@sera-types/loading.type";
import { MasterDataState, masterDataTypes } from "@sera-types/master-data.type";
import {
  CapacityPaired,
  PairingMatchingState,
  pairingMatchingTypes,
  UnitParams,
} from "@sera-types/pairing-matching";
import { Col, Row } from "antd";
import { isEmpty } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import {
  ColumnsPaired,
  PairedSearchByOptions,
  UNCHECK_PAIRED_KEYS,
} from "./pairing-matching-props-table";
import TableHistory from "./pairing-matching-table-history";

const AUTOCOMPLETE = { searchBy: DEFAULT_SEARCH_PAIRED, page: 1, limit: 10 };

interface TablePairedProps {
  params: UnitParams;
  loading: LoadingState;
  pairingMatching: PairingMatchingState;
  masterData: MasterDataState;
  getCapacityPaired: typeof pairingMatchingActions.getCapacityPairedFetch;
  getACCapacityPaired: typeof pairingMatchingActions.getACCapacityPairedFetch;
  getACCapacityPairedClear: typeof pairingMatchingActions.getACCapacityPairedClear;
  pairingConfirm: typeof pairingMatchingActions.pairingConfirmFetch;
  pairingConfirmClear: typeof pairingMatchingActions.pairingConfirmClear;
  getShipmentConfirmationStatuses: typeof masterDataActions.getShipmentConfirmationStatusesFetch;
}

const TablePaired = ({
  params,
  loading,
  pairingMatching,
  masterData,
  getCapacityPaired,
  getACCapacityPaired,
  getACCapacityPairedClear,
  pairingConfirm,
  pairingConfirmClear,
  getShipmentConfirmationStatuses,
}: TablePairedProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "pairingMatching",
  });

  const { t: tTable } = useTranslation(undefined, {
    keyPrefix: "pairingMatching.table.paired",
  });

  const COLUMN_KEYS = ColumnsPaired({})?.filter((_item) => !_item?.exception);
  const [showColumns, setShowColumns] = useState<string[]>(
    COLUMN_KEYS?.map((_item) => _item?.key)?.filter(
      (_key) => !UNCHECK_PAIRED_KEYS.includes(_key),
    ),
  );

  const [isSkipFetch, setIsSkipFetch] = useState(false);
  const [options, setOptions] = useState<BaseType>({ page: 1, limit: 10 });
  const [autoComplete, setAutoComplete] = useState<BaseType>(AUTOCOMPLETE);
  const [activeModal, setActiveModal] = useState("");
  const [selectedData, setSelectedData] = useState<CapacityPaired | null>(null);

  const onChangePagination = (_current: number, _limit: number) => {
    setOptions((_prev) => ({ ..._prev, page: _current, limit: _limit }));
  };

  const onChangeSearchBy = (_value?: string) => {
    setIsSkipFetch(true);

    setOptions((_prev) => ({ ..._prev, searchBy: _value, search: null }));
    setAutoComplete((_prev) => ({ ..._prev, searchBy: _value, search: null }));

    getACCapacityPairedClear();
  };

  const onHandleSearch = (_search?: string) => {
    setOptions((_prev) => ({
      ..._prev,
      searchBy: _prev?.searchBy ?? DEFAULT_SEARCH_PAIRED,
      search: _search || null,
      page: 1,
    }));
  };

  const onHandleSearching = (_search?: string) => {
    setAutoComplete((_prev) => ({
      ..._prev,
      searchBy: _prev?.searchBy ?? DEFAULT_SEARCH_PAIRED,
      search: _search || null,
      page: 1,
    }));
  };

  const onHandleClearSearch = () => {
    setOptions((_prev) => ({ ..._prev, search: null }));
  };

  useEffect(() => {
    getShipmentConfirmationStatuses();
    getACCapacityPairedClear();
  }, []);

  useEffect(() => {
    if (isSkipFetch) return setIsSkipFetch(false);
    getCapacityPaired({ ...options, ...params });
  }, [options, params]);

  useEffect(() => {
    if (autoComplete.search) {
      getACCapacityPaired({ ...autoComplete, ...params });
    }
  }, [autoComplete, params]);

  useEffect(() => {
    if (isEmpty(pairingMatching?.pairingProcess?.data)) return;
    getCapacityPaired({ ...options });
  }, [options, pairingMatching?.pairingProcess?.data]);

  useEffect(() => {
    if (isEmpty(pairingMatching?.pairingConfirm?.data)) return;
    MessageHandler().success(t("toast.confirm"));
    pairingConfirmClear();
    getCapacityPaired({ ...options });
  }, [options, pairingMatching?.pairingConfirm?.data]);

  const renderFilter = useMemo(() => {
    if (options?.searchBy === "confirmationStatus") {
      return (
        <Select
          id={`${options?.searchBy}-search`}
          key={`${options?.searchBy}-search`}
          style={{ width: 172 }}
          placeholder={tTable(`placeholder.${options?.searchBy ?? "default"}`)}
          options={masterData?.getShipmentConfirmationStatuses?.data?.map(
            (_status) => ({
              value: _status?.name,
              label: _status?.name,
            }),
          )}
          onChange={(_value) => onHandleSearch(_value)}
          loading={loading[masterDataTypes.GET_SHIPMENT_CONFIRMATION_STATUSES]}
          disabled={loading[masterDataTypes.GET_SHIPMENT_CONFIRMATION_STATUSES]}
          allowClear={false}
        />
      );
    }

    return (
      <Input.Search
        id={`${options?.searchBy}-search`}
        key={`${options?.searchBy}-search`}
        value={options?.search ?? undefined}
        style={{ width: 172 }}
        loading={loading[pairingMatchingTypes.GET_AC_CAPACITY_PAIRED]}
        placeholder={tTable(`placeholder.${options?.searchBy ?? "default"}`)}
        autoCompleteItems={pairingMatching?.getACCapacityPaired?.data ?? []}
        onSearch={(_search) => onHandleSearch(_search)}
        onSearching={(_search) => onHandleSearching(_search)}
        onClear={onHandleClearSearch}
      />
    );
  }, [options?.searchBy, pairingMatching?.getACCapacityPaired?.data]);

  return (
    <>
      <Table
        title={tTable("title")}
        columns={ColumnsPaired({
          loading: loading[pairingMatchingTypes.PAIRING_CONFIRM],
          onConfirm: (_record: CapacityPaired) => {
            setActiveModal("CONFIRM");
            setSelectedData(_record);
          },
          onView: (_record: CapacityPaired) => {
            setActiveModal("HISTORY");
            setSelectedData(_record);
          },
        })?.filter(
          (_item) => _item?.exception || showColumns?.includes(_item?.key),
        )}
        dataSource={pairingMatching?.getCapacityPaired?.data ?? []}
        total={pairingMatching?.getCapacityPaired?.options?.totalData ?? 0}
        current={pairingMatching?.getCapacityPaired?.options?.page ?? 1}
        pageSize={pairingMatching?.getCapacityPaired?.options?.limit ?? 10}
        rowKey={(row: CapacityPaired) => `${row.no}`}
        onPageChange={onChangePagination}
        scroll={{ x: "max-content" }}
        loading={
          loading[pairingMatchingTypes.GET_CAPACITY_PAIRED] ||
          loading[pairingMatchingTypes.PAIRING_CONFIRM]
        }
        isCustomSearch
        customSearch={
          <Row align="middle" gutter={[8, 8]}>
            <Col xs={24} md={12}>
              <Select
                id="pairing-matching-paired-search"
                style={{ width: 172 }}
                defaultValue={DEFAULT_SEARCH_PAIRED}
                options={PairedSearchByOptions()}
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
        actions={
          <Row gutter={[16, 4]}>
            <Col>
              <FilterDropdown
                buttonLabel={tTable("button.config")}
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

      <Modal.Confirm
        type="warning"
        open={activeModal === "CONFIRM"}
        title={tTable("alert.title")}
        okText={tTable("alert.okBtn")}
        onOk={() => {
          pairingConfirm({ id: selectedData?.id });
          setActiveModal("");
        }}
        onCancel={() => setActiveModal("")}
      >
        <Typography.Text>{tTable("alert.desc")}</Typography.Text>
      </Modal.Confirm>

      <Modal
        open={activeModal === "HISTORY"}
        closable
        width={1000}
        onCancel={() => setActiveModal("")}
        destroyOnClose
      >
        <TableHistory capacityId={selectedData?.id} />
      </Modal>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  pairingMatching: state.pairingMatching,
  masterData: state.masterData,
});

const mapDispatchToProps = {
  getCapacityPaired: pairingMatchingActions.getCapacityPairedFetch,
  getACCapacityPaired: pairingMatchingActions.getACCapacityPairedFetch,
  getACCapacityPairedClear: pairingMatchingActions.getACCapacityPairedClear,
  pairingConfirm: pairingMatchingActions.pairingConfirmFetch,
  pairingConfirmClear: pairingMatchingActions.pairingConfirmClear,
  getShipmentConfirmationStatuses:
    masterDataActions.getShipmentConfirmationStatusesFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(TablePaired);
