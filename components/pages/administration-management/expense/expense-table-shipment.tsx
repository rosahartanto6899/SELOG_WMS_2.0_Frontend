/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { InsertRowAboveOutlined } from "@ant-design/icons";
import FilterDropdown from "@sera-components/filter-dropdown";
import Input from "@sera-components/input";
import Modal from "@sera-components/modal";
import RsFormBuilder from "@sera-components/rs-form-builder";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import MessageHandler from "@sera-libraries/message-handler";
import { ChildConfig } from "@sera-libraries/types/formBuilderType";
import { RootState } from "@sera-redux";
import {
  DEFAULT_SEARCH,
  expenseActions,
} from "@sera-redux/slices/expense-monitoring.slice";
import { AutoCompleteType, BaseType } from "@sera-types/base.type";
import {
  ExpenseState,
  expenseTypes,
  FilterParams,
  ShipmentExpenses,
} from "@sera-types/expense-monitoring";
import { LoadingState } from "@sera-types/loading.type";
import {
  DEFAULT_FORMAT_DATE,
  FORMAT_DATE_TIME,
} from "@sera-utils/constants/common";
import { setFormErrorHandle } from "@sera-utils/error-handler";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Col, Form, Row } from "antd";
import { isEmpty } from "lodash";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import {
  ColumnsShipment,
  ShipmentSearchByOptions,
  UNCHECK_SHIPMENT_KEYS,
} from "./expense-props-table";

const AUTOCOMPLETE = { searchBy: "", page: 1, limit: 10 };

interface TableShipmentProps {
  params: FilterParams;
  loading: LoadingState;
  expenseMonitoring: ExpenseState;
  getShipmentExpenses: typeof expenseActions.getShipmentExpensesFetch;
  getACShipmentExpenses: typeof expenseActions.getACShipmentExpensesFetch;
  getACShipmentExpensesClear: typeof expenseActions.getACShipmentExpensesClear;
  updateTermin1Date: typeof expenseActions.updateTermin1DateFetch;
  updateTermin1DateClear: typeof expenseActions.updateTermin1DateClear;
}

const TableShipment = ({
  params,
  loading,
  expenseMonitoring,
  getShipmentExpenses,
  getACShipmentExpenses,
  getACShipmentExpensesClear,
  updateTermin1Date,
  updateTermin1DateClear,
}: TableShipmentProps) => {
  const [form] = Form.useForm();
  const { t } = useTranslation(undefined, {
    keyPrefix: "admExpense.table.shipment",
  });

  const COLUMN_KEYS = ColumnsShipment({})?.filter((_item) => !_item?.exception);
  const messageRequired = t("form.message.required");

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/expense-monitoring/table-shipment");

  const [showColumns, setShowColumns] = useState<string[]>(
    COLUMN_KEYS?.map((_item) => _item?.key)?.filter(
      (_key) => !UNCHECK_SHIPMENT_KEYS.includes(_key),
    ),
  );
  const [isSkipFetch, setIsSkipFetch] = useState(false);
  const [options, setOptions] = useState<BaseType>({ page: 1, limit: 10 });
  const [autoComplete, setAutoComplete] = useState<BaseType>(AUTOCOMPLETE);
  const [selectedData, setSelectedData] = useState<ShipmentExpenses | null>(
    null,
  );

  const FORM_CONFIG = [
    {
      id: "termin1TransferDate",
      type: "date",
      name: "termin1TransferDate",
      label: t("form.input.termin1TransferDate.label"),
      placeholder: t("form.input.termin1TransferDate.placeholder"),
      rules: [{ required: true, message: messageRequired }],
      format: FORMAT_DATE_TIME,
      startDate: moment().format(DEFAULT_FORMAT_DATE),
      endDate: moment(selectedData?.termin1TransferDate).format(
        DEFAULT_FORMAT_DATE,
      ),
    },
  ] as ChildConfig[];

  const onChangePagination = (_current: number, _limit: number) => {
    setOptions((_prev) => ({ ..._prev, page: _current, limit: _limit }));
  };

  const onChangeSearchBy = (_value?: string) => {
    setIsSkipFetch(true);

    setOptions((_prev) => ({ ..._prev, searchBy: _value, search: null }));
    setAutoComplete((_prev) => ({ ..._prev, searchBy: _value, search: null }));

    getACShipmentExpensesClear();
  };

  const onHandleSearch = (_search?: string) => {
    setOptions((_prev) => ({
      ..._prev,
      searchBy: _prev?.searchBy || DEFAULT_SEARCH,
      search: _search || null,
      page: 1,
    }));
  };

  const onHandleSearching = (_search?: string) => {
    setAutoComplete((_prev) => ({
      ..._prev,
      searchBy: _prev?.searchBy || DEFAULT_SEARCH,
      search: _search || null,
      page: 1,
    }));
  };

  const onHandleClearSearch = () => {
    setOptions((_prev) => ({ ..._prev, search: null }));
  };

  const onHandleUpdateTermin1Date = () => {
    form
      .validateFields()
      .then((_values) => {
        try {
          updateTermin1Date({ id: selectedData?.id, ..._values });
        } catch (_error: any) {
          sendErrorHandlerApi(
            "onHandleUpdateTermin1Date",
            34,
            isApiResponse(_error) ? _error : _error?.data?.message,
          );
        }
      })
      .catch((_error: any) => {
        const messageHandler = MessageHandler();
        const errorHandler = messageHandler.error({ content: t("message") });

        sendErrorHandler(
          "onHandleUpdateTermin1Date",
          34,
          isApiResponse(_error) ? _error : "Validation form not pass",
          errorHandler,
        );
      });
  };

  useEffect(() => {
    getACShipmentExpensesClear();
  }, []);

  useEffect(() => {
    if (isSkipFetch) return setIsSkipFetch(false);
    getShipmentExpenses({ ...options, ...params });
  }, [options, params]);

  useEffect(() => {
    if (autoComplete.search) {
      getACShipmentExpenses({ ...autoComplete });
    }
  }, [autoComplete]);

  const renderFilter = useMemo(() => {
    return (
      <Input.Search
        id={`${options?.searchBy}-search`}
        key={`${options?.searchBy}-search`}
        value={options?.search ?? undefined}
        style={{ width: 172 }}
        loading={loading[expenseTypes.GET_AC_SHIPMENT_EXPENSES]}
        placeholder={t(`placeholder.${options?.searchBy ?? "default"}`)}
        autoCompleteItems={expenseMonitoring?.getACShipmentExpenses?.data ?? []}
        onSearch={(_search) => onHandleSearch(_search)}
        onSearching={(_search) => onHandleSearching(_search)}
        onClear={onHandleClearSearch}
      />
    );
  }, [options?.searchBy, expenseMonitoring?.getACShipmentExpenses?.data]);

  useEffect(() => {
    const _data = expenseMonitoring?.updateTermin1Date?.data;
    if (isEmpty(_data)) return;

    setSelectedData(null);
    MessageHandler().success(t("toast.update"));
    updateTermin1DateClear();

    try {
      getShipmentExpenses({ ...options, ...params });
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 69, error);
      else sendErrorHandler("useEffect", 69, error?.data?.message);
    }
  }, [expenseMonitoring?.updateTermin1Date?.data]);

  useEffect(() => {
    setFormErrorHandle(form, expenseMonitoring?.updateTermin1Date?.error);
  }, [expenseMonitoring?.updateTermin1Date?.error]);

  return (
    <>
      <Table
        title={t("title")}
        columns={ColumnsShipment({
          onUpdate: (_value) => setSelectedData(_value),
        })?.filter(
          (_item) => _item?.exception || showColumns?.includes(_item?.key),
        )}
        dataSource={expenseMonitoring?.getShipmentExpenses?.data ?? []}
        total={expenseMonitoring?.getShipmentExpenses?.options?.totalData ?? 0}
        current={expenseMonitoring?.getShipmentExpenses?.options?.page ?? 1}
        pageSize={expenseMonitoring?.getShipmentExpenses?.options?.limit ?? 10}
        rowKey="no"
        onPageChange={onChangePagination}
        scroll={{ x: "max-content" }}
        loading={loading[expenseTypes.GET_SHIPMENT_EXPENSES]}
        isCustomSearch
        customSearch={
          <Row align="middle" gutter={[8, 8]}>
            <Col xs={24} md={12}>
              <Select
                id="expense-search"
                style={{ width: 172 }}
                defaultValue={DEFAULT_SEARCH}
                options={ShipmentSearchByOptions()}
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
        title={t("form.title")}
        open={Boolean(selectedData)}
        closable
        destroyOnClose
        onCancel={() => setSelectedData(null)}
      >
        <RsFormBuilder
          name="form-unit-activities"
          layout="vertical"
          fullWidth
          form={form}
          type="update"
          configs={FORM_CONFIG}
          onFinish={onHandleUpdateTermin1Date}
          onCancel={() => setSelectedData(null)}
          loading={loading[expenseTypes.UPDATE_TERMIN1_DATE]}
          disabled={loading[expenseTypes.UPDATE_TERMIN1_DATE]}
        />
      </Modal>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  expenseMonitoring: state.expenseMonitoring,
});

const mapDispatchToProps = {
  getShipmentExpenses: expenseActions.getShipmentExpensesFetch,
  getACShipmentExpenses: expenseActions.getACShipmentExpensesFetch,
  getACShipmentExpensesClear: expenseActions.getACShipmentExpensesClear,
  updateTermin1Date: expenseActions.updateTermin1DateFetch,
  updateTermin1DateClear: expenseActions.updateTermin1DateClear,
};

export default connect(mapStateToProps, mapDispatchToProps)(TableShipment);
