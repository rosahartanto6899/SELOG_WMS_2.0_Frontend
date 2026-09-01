import { InsertRowAboveOutlined } from "@ant-design/icons";
import FilterDropdown from "@sera-components/filter-dropdown";
import Input from "@sera-components/input";
import Modal from "@sera-components/modal";
import {
  Columns,
  SearchByOptions,
} from "@sera-components/pages/operation-management/approval-booking-order/approval-booking-props-table";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import MessageHandler from "@sera-libraries/message-handler";
import {
  approvalBookingOrderActions,
  businessAreaActions,
  useAppDispatch,
  useAppSelector,
} from "@sera-redux";
import {
  approvalBookingOrderTypes,
  ApprovalBookingRecord,
} from "@sera-types/approval-booking-order.type";
import { AutoCompleteType, BaseType } from "@sera-types/base.type";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Col, Flex, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import ApprovalBookingOrderFilter, {
  FilterStateProps,
} from "./approval-booking-filters";
import ModalConfirmationApprovalBookingOrder from "./approval-booking-order-modal-confirmation";
import ApprovalBookingSummary from "./approval-booking-summary";

const INIT_SEARCH_BY = "bookingCode";

interface ModalDataProps {
  data: ApprovalBookingRecord | null;
  open: boolean;
}

const ApprovalBookingOrderList = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "approvalBookingOrder",
  });

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/operation-management/approval-booking-order/index");
  const [approvalBookingOrderListOptions, setApprovalBookingOrderListOptions] =
    useState<BaseType & { [key: string]: any }>({
      page: 1,
      limit: 10,
      // order: "createdAt",
      // sort: "asc",
    });

  const dispatch = useAppDispatch();
  const { data, options, autoComplete, summary, confirmationStatus } =
    useAppSelector((state) => state.approvalBookingOrder);

  const loading = useAppSelector((state) => state.loading);

  const [
    approvalBookingOrderAutoCompleteOptions,
    setApprovalBookingOrderAutoCompleteOptions,
  ] = useState<BaseType>({
    searchBy: INIT_SEARCH_BY,
    page: 1,
    limit: 10,
  });
  const [filter, setFilter] = useState<FilterStateProps>({
    branchId: undefined,
    shipmentType: undefined,
  });
  const [searchBy, setSearchBy] = useState(INIT_SEARCH_BY);
  const [modalData, setModalData] = useState<ModalDataProps>({
    open: false,
    data: null,
  });

  const COLUMN_KEYS = Columns()?.filter((_item) => !_item?.exception);
  const [showColumns, setShowColumns] = useState<string[]>(
    COLUMN_KEYS.filter((item) => !item.exclude).map((_item) => _item.key),
  );

  const onChangeFilter = (val: string[], type: string) => {
    setFilter((prev) => {
      const _filter = {
        ...prev,
        [type]: val?.length ? val : undefined,
      };
      setApprovalBookingOrderListOptions((prevState) => {
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
    setApprovalBookingOrderListOptions((prevState) => ({
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
      setApprovalBookingOrderListOptions((prevState) => ({
        ...prevState,
        order: sorter.field,
        sort: sorter.order === "ascend" ? "asc" : ("desc" as string),
      }));
    }
  };

  const onSearchChangeListener = (search?: string, searchBy?: string) => {
    setApprovalBookingOrderListOptions((prevState: BaseType) => ({
      ...prevState,
      search,
      searchBy,
      page: 1,
    }));
  };

  const onSearchingChangeListener = (search?: string) => {
    setApprovalBookingOrderAutoCompleteOptions((prevState: BaseType) => ({
      ...prevState,
      search,
    }));
  };

  const onClearSearchListener = () => {
    setApprovalBookingOrderListOptions((prevState: BaseType) => ({
      ...prevState,
      search: null,
    }));
  };

  const handlerSelectSearchBy = (value?: string) => {
    setSearchBy(value!);
    setApprovalBookingOrderListOptions((prevState: BaseType) => {
      if (prevState.search) {
        return {
          ...prevState,
          search: null,
        };
      }

      return prevState;
    });

    setApprovalBookingOrderAutoCompleteOptions((prevState: BaseType) => {
      if (prevState.search) {
        return {
          ...prevState,
          search: null,
        };
      }

      return prevState;
    });

    dispatch(
      approvalBookingOrderActions.getApprovalBookingOrderAutoCompleteClear(),
    );
  };

  const handleModalData = (record: ApprovalBookingRecord, value: string) => {
    const isReq = record.confirmationStatus.toLowerCase() === "requested";
    const numVal = Number(value);
    if (!isReq && record.fulfill >= numVal) {
      return MessageHandler().error(t("msgMinimumFulfilledQty"));
    }
    setModalData({ open: true, data: { ...record, fulfill: Number(value) } });
  };

  const handleUpdateFulfill = () => {
    const callback = () => {
      MessageHandler().success(
        t("modal.updateFulfill.message", {
          value: modalData.data?.bookingCode,
        }),
      );
      setModalData({ open: false, data: null });

      dispatch(
        approvalBookingOrderActions.getApprovalBookingOrderFetch({
          ...approvalBookingOrderListOptions,
          searchBy,
        }),
      );
      dispatch(approvalBookingOrderActions.updateApprovalBookingOrderClear());
    };
    if (modalData.data?.id) {
      dispatch(
        approvalBookingOrderActions.updateApprovalBookingOrderFetch({
          id: modalData.data.id,
          fulfill: Number(modalData.data.fulfill),
          note: modalData.data.notes,
          callback,
        }),
      );
    }
  };

  const handleSelectConfirmationStatus = (value?: string) => {
    setApprovalBookingOrderListOptions((prev) => ({
      ...prev,
      search: value,
    }));
  };

  useEffect(() => {
    dispatch(businessAreaActions.getDropdownBusinessAreasFetch({}));
    dispatch(approvalBookingOrderActions.getConfirmationStatusFetch());

    return () => {
      dispatch(approvalBookingOrderActions.getApprovalBookingOrderClear());
      dispatch(
        approvalBookingOrderActions.getApprovalBookingOrderAutoCompleteClear(),
      );
      dispatch(businessAreaActions.getDropdownBusinessAreasClear());
      dispatch(approvalBookingOrderActions.getConfirmationStatusClear());
    };
  }, []);

  useEffect(() => {
    dispatch(
      approvalBookingOrderActions.getApprovalBookingOrderSummaryFetch(filter),
    );

    return () => {
      dispatch(
        approvalBookingOrderActions.getApprovalBookingOrderSummaryClear(),
      );
    };
  }, [filter]);

  useEffect(() => {
    try {
      dispatch(
        approvalBookingOrderActions.getApprovalBookingOrderFetch({
          ...approvalBookingOrderListOptions,
          searchBy: approvalBookingOrderListOptions.search
            ? searchBy
            : undefined,
        }),
      );
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 154, error);
      else sendErrorHandler("useEffect", 155, error?.data?.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [approvalBookingOrderListOptions]);

  useEffect(() => {
    try {
      if (approvalBookingOrderAutoCompleteOptions.search)
        dispatch(
          approvalBookingOrderActions.getApprovalBookingOrderAutoCompleteFetch({
            ...approvalBookingOrderAutoCompleteOptions,
            searchBy,
          }),
        );
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 164, error);
      else sendErrorHandler("useEffect", 165, error?.data?.message);
    }

    return () => {
      dispatch(
        approvalBookingOrderActions.getApprovalBookingOrderAutoCompleteClear(),
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [approvalBookingOrderAutoCompleteOptions]);

  return (
    <>
      <ApprovalBookingOrderFilter
        filter={filter}
        onChangeFilter={onChangeFilter}
      />
      <Flex gap={16} vertical>
        <ApprovalBookingSummary data={summary.data} />
        <Table
          title={t("table.title")}
          columns={Columns(handleModalData)?.filter(
            (_item) => _item?.exception || showColumns?.includes(_item?.key),
          )}
          dataSource={data}
          total={options?.totalData ?? 0}
          current={options?.page ?? 1}
          pageSize={options?.limit ?? 10}
          loading={
            loading[approvalBookingOrderTypes.GET_APPROVAL_BOOKING_ORDER]
          }
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
                {searchBy === "confirmationStatus" ? (
                  <Select
                    placeholder={t(
                      "table.search.confirmationStatusPlaceholder",
                    )}
                    onChange={(value) => handleSelectConfirmationStatus(value)}
                    onClear={() => handleSelectConfirmationStatus(undefined)}
                    style={{ minWidth: "20rem" }}
                  >
                    {confirmationStatus?.data?.map((opt) => (
                      <Select.Option key={opt.id} value={opt.name}>
                        {opt.name}
                      </Select.Option>
                    ))}
                  </Select>
                ) : (
                  <Input.Search
                    loading={false}
                    placeholder={t("table.search.placeholder")}
                    autoCompleteItems={autoComplete?.data}
                    onSearch={(search) =>
                      onSearchChangeListener(
                        search,
                        approvalBookingOrderAutoCompleteOptions.searchBy ??
                          searchBy,
                      )
                    }
                    onSearching={(searching) =>
                      onSearchingChangeListener(searching)
                    }
                    onClear={onClearSearchListener}
                    value={approvalBookingOrderAutoCompleteOptions.search ?? ""}
                  />
                )}
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
      </Flex>

      <Modal.Confirm
        withIcon={false}
        open={modalData.open}
        okText={"Save"}
        width={"75%"}
        destroyOnClose
        okButtonProps={{
          disabled:
            loading[approvalBookingOrderTypes.UPDATE_APPROVAL_BOOKING_ORDER],
        }}
        cancelButtonProps={{
          disabled:
            loading[approvalBookingOrderTypes.UPDATE_APPROVAL_BOOKING_ORDER],
        }}
        onOk={handleUpdateFulfill}
        styles={{
          body: { marginLeft: 0 },
        }}
        onCancel={() => {
          const isLoadingUpdate =
            loading[approvalBookingOrderTypes.UPDATE_APPROVAL_BOOKING_ORDER];
          if (!isLoadingUpdate) {
            setModalData({ open: false, data: null });
          }
        }}
      >
        <ModalConfirmationApprovalBookingOrder
          data={modalData.data!}
          onChangeNote={(value) =>
            setModalData((prev) => ({
              ...prev,
              data: prev.data ? { ...prev.data, notes: value } : null,
            }))
          }
        />
      </Modal.Confirm>
    </>
  );
};

export default ApprovalBookingOrderList;
