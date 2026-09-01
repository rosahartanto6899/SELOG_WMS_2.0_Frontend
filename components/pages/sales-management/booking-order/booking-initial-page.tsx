import { InsertRowAboveOutlined, MedicineBoxOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import CarouselInsightSkeletons from "@sera-components/carousel/carousel-insights";
import FilterDropdown from "@sera-components/filter-dropdown";
import { LogisWalletIcon, Plus } from "@sera-components/icons";
import Input from "@sera-components/input";
import Modal from "@sera-components/modal";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import MessageHandler from "@sera-libraries/message-handler";
import {
  getBookingOrderAutoCompleteClear,
  getBookingOrderAutoCompleteFetch,
  getBookingOrderClear,
  getBookingOrderFetch,
  getBookingOrderSummaryClear,
  getBookingOrderSummaryFetch,
  getDropdownBusinessAreasClear,
  getDropdownBusinessAreasFetch,
  updateBookingOrderStatusClear,
  updateBookingOrderStatusFetch,
  useAppDispatch,
  useAppSelector,
} from "@sera-redux";
import { AutoCompleteType, BaseType } from "@sera-types/base.type";
import {
  BookingOrderRecord,
  BookingOrderSummaryPayload,
  bookingOrderTypes,
} from "@sera-types/booking-order.type";
import { ROUTE } from "@sera-utils/constants/routes";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Col, Divider, Row } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import useGetPermission from "../hooks/useGetPermission";
import BookingOrderCard from "./booking-card";
import BookingOrderFilters from "./booking-filters";
import {
  APPROVAL_STATUS_OPTIONS,
  Columns,
  SearchByOptions,
} from "./booking-props-table";

const BookingOrderInitialPage = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "bookingOrder" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.loading);
  const { data, autoComplete, summary, updateStatusBooking, options } =
    useAppSelector((state) => state.bookingOrder);
  const [filter, setFilter] = useState<BookingOrderSummaryPayload>({
    branchId: undefined,
    shipmentType: undefined,
  });
  const [searchBy, setSearchBy] = useState("bookingOrderNo");
  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/sales-management/booking-order/index");

  const { isCreate } = useGetPermission("booking-order");

  const COLUMN_KEYS = Columns({})?.filter((_item) => !_item?.exception);
  const [showColumns, setShowColumns] = useState<string[]>(
    COLUMN_KEYS?.map((_item) => _item?.key),
  );

  const [modalDelete, setModalDelete] = useState<{
    show: boolean;
    data: BookingOrderRecord | null;
  }>({
    show: false,
    data: null,
  });

  const [bookingOrderListOptions, setBookingOrderListOptions] = useState<
    BaseType & { [key: string]: any }
  >({
    page: 1,
    limit: 10,
    // order: "",
    // sort: "desc",
  });

  const [bookingOrderAutoCompleteOptions, setBookingOrderAutoCompleteOptions] =
    useState<BaseType>({
      // searchBy: "createdAt",
      page: 1,
      limit: 10,
    });

  const onDeleteBookingOrder = (record: BookingOrderRecord) => {
    setModalDelete({ show: true, data: record });
  };

  const handleDeleteOrder = () => {
    if (modalDelete?.data?.id) {
      dispatch(
        updateBookingOrderStatusFetch({
          id: modalDelete.data.id,
          status: "Cancelled",
        }),
      );
    }
  };

  const onPageChangeListener = (current: number, limit: number) => {
    setBookingOrderListOptions((prevState) => ({
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
      setBookingOrderListOptions((prevState) => ({
        ...prevState,
        order: sorter.field,
        sort: sorter.order === "ascend" ? "asc" : ("desc" as string),
      }));
    }
  };

  const onSearchChangeListener = (search?: string, searchBy?: string) => {
    setBookingOrderListOptions((prevState: BaseType) => ({
      ...prevState,
      search,
      searchBy,
      page: 1,
    }));
  };

  const onSearchingChangeListener = (search?: string) => {
    setBookingOrderAutoCompleteOptions((prevState: BaseType) => ({
      ...prevState,
      search,
    }));
  };

  const onClearSearchListener = () => {
    setBookingOrderListOptions((prevState: BaseType) => ({
      ...prevState,
      search: null,
    }));
  };

  const handlerSelectSearchBy = (value?: string) => {
    setSearchBy(value!);
    setBookingOrderListOptions((prevState: BaseType) => {
      if (prevState.search) {
        return {
          ...prevState,
          search: null,
        };
      }

      return prevState;
    });

    setBookingOrderAutoCompleteOptions((prevState: BaseType) => {
      if (prevState.search) {
        return {
          ...prevState,
          search: null,
        };
      }

      return prevState;
    });

    dispatch(getBookingOrderAutoCompleteClear());
  };

  const onChangeFilter = (val: string[], type: string) => {
    setFilter((prev) => {
      const _filter = {
        ...prev,
        [type]: val?.length ? val : undefined,
      };
      setBookingOrderListOptions((prevState) => {
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

  const handleSelectApprovalStatus = (value?: string) => {
    setBookingOrderListOptions((prev) => ({
      ...prev,
      search: value,
    }));
  };

  useEffect(() => {
    dispatch(getDropdownBusinessAreasFetch({}));

    return () => {
      dispatch(getBookingOrderClear());
      dispatch(getBookingOrderAutoCompleteClear());
      dispatch(getDropdownBusinessAreasClear());
    };
  }, []);

  useEffect(() => {
    dispatch(getBookingOrderSummaryFetch(filter));

    return () => {
      dispatch(getBookingOrderSummaryClear());
    };
  }, [filter]);

  useEffect(() => {
    try {
      dispatch(getBookingOrderFetch({ ...bookingOrderListOptions, searchBy }));
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 154, error);
      else sendErrorHandler("useEffect", 155, error?.data?.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingOrderListOptions]);

  useEffect(() => {
    try {
      if (bookingOrderAutoCompleteOptions.search)
        dispatch(
          getBookingOrderAutoCompleteFetch({
            ...bookingOrderAutoCompleteOptions,
            searchBy,
          }),
        );
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 164, error);
      else sendErrorHandler("useEffect", 165, error?.data?.message);
    }

    return () => {
      dispatch(getBookingOrderAutoCompleteClear());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingOrderAutoCompleteOptions]);

  useEffect(() => {
    if (updateStatusBooking?.data?.id) {
      MessageHandler().success(
        t("table.cancelMessage", {
          value: modalDelete.data?.bookingCode,
        }),
      );
      setModalDelete({ show: false, data: null });

      dispatch(getBookingOrderFetch({ ...bookingOrderListOptions, searchBy }));
      dispatch(getBookingOrderSummaryFetch(filter));
      dispatch(updateBookingOrderStatusClear());
    }
  }, [updateStatusBooking]);

  return (
    <>
      <BookingOrderFilters filter={filter} onChangeFilter={onChangeFilter} />
      {/* BOOKING ORDER CARD */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <CarouselInsightSkeletons>
            <Col className="gutter-row" span={24}>
              <BookingOrderCard
                label={t("table.card.totalOrder")}
                icon={<LogisWalletIcon />}
                value={summary.data.totalOrder}
                cardBg="primaryMain"
                avatarBg="primarySecond"
                loading={loading[bookingOrderTypes.GET_BOOKING_ORDER_SUMMARY]}
              />
            </Col>
            <Col className="gutter-row" span={24}>
              <BookingOrderCard
                label={t("table.card.orderConfirmed")}
                icon={<LogisWalletIcon />}
                value={summary.data.totalConfirmed}
                cardBg="successMain"
                avatarBg="successSubtle"
                loading={loading[bookingOrderTypes.GET_BOOKING_ORDER_SUMMARY]}
              />
            </Col>
            <Col className="gutter-row" span={24}>
              <BookingOrderCard
                label={t("table.card.orderRejected")}
                icon={<LogisWalletIcon />}
                value={summary.data.totalRejected}
                cardBg="dangerMain"
                avatarBg="dangerSubtle"
                loading={loading[bookingOrderTypes.GET_BOOKING_ORDER_SUMMARY]}
              />
            </Col>
            <Col className="gutter-row" span={24}>
              <BookingOrderCard
                label={t("table.card.orderRequest")}
                icon={<LogisWalletIcon />}
                value={summary.data.totalRequested}
                cardBg="warningMain"
                avatarBg="warningSubtle"
                loading={loading[bookingOrderTypes.GET_BOOKING_ORDER_SUMMARY]}
              />
            </Col>
          </CarouselInsightSkeletons>
        </Col>
      </Row>
      <Divider />
      {/* BOOKING ORDER LIST */}
      <Table
        title={t("table.title")}
        columns={Columns({ onDel: onDeleteBookingOrder })?.filter(
          (_item) => _item?.exception || showColumns?.includes(_item?.key),
        )}
        dataSource={data}
        total={options?.totalData ?? 0}
        current={options?.page ?? 1}
        pageSize={options?.limit ?? 10}
        loading={loading[bookingOrderTypes.GET_BOOKING_ORDER]}
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
              {searchBy === "approvalStatus" ? (
                <Select
                  placeholder={t("table.search.approvalStatusPlaceholder")}
                  onChange={(value) => handleSelectApprovalStatus(value)}
                  onClear={() => handleSelectApprovalStatus(undefined)}
                >
                  {APPROVAL_STATUS_OPTIONS.map((opt) => (
                    <Select.Option key={opt.value} value={opt.value}>
                      {opt.label}
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
                      bookingOrderAutoCompleteOptions.searchBy ?? searchBy,
                    )
                  }
                  onSearching={(searching) =>
                    onSearchingChangeListener(searching)
                  }
                  onClear={onClearSearchListener}
                  value={bookingOrderAutoCompleteOptions.search ?? ""}
                />
              )}
            </Col>
          </Row>
        }
        actions={
          <Row gutter={[16, 4]}>
            {isCreate && (
              <>
                <Col>
                  <Button
                    type="primary"
                    icon={<Plus />}
                    onClick={() =>
                      router.push(`${ROUTE.SALES_MANAGEMENT.BOOKING_ORDER}/add`)
                    }
                  >
                    {t("table.button.add")}
                  </Button>
                </Col>
                <Col>
                  <Button
                    type="primary"
                    icon={<MedicineBoxOutlined />}
                    onClick={() =>
                      router.push(
                        `${ROUTE.SALES_MANAGEMENT.BOOKING_ORDER}/add?shipmentType=drop`,
                      )
                    }
                  >
                    {t("table.button.addDropBase")}
                  </Button>
                </Col>
              </>
            )}

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

      <Modal.Confirm
        type="danger"
        open={modalDelete.show}
        title={t("modal.delete.title", {
          value: modalDelete.data?.bookingCode,
        })}
        okText={t("modal.delete.ok")}
        onOk={handleDeleteOrder}
        loading={loading[bookingOrderTypes.UPDATE_BOOKING_ORDER_STATUS]}
        onCancel={() => setModalDelete({ show: false, data: null })}
      >
        <span>{t("modal.delete.subtitle")}</span>
      </Modal.Confirm>
    </>
  );
};

export default BookingOrderInitialPage;
