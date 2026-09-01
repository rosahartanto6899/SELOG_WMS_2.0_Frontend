/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { InsertRowAboveOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import FilterDropdown from "@sera-components/filter-dropdown";
import { Plus } from "@sera-components/icons";
import Input from "@sera-components/input";
import Modal from "@sera-components/modal";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import Typography from "@sera-components/typography";
import MessageHandler from "@sera-libraries/message-handler";
import {
  customerLocationActions,
  useAppDispatch,
  useAppSelector,
} from "@sera-redux";
import { AutoCompleteType, BaseType } from "@sera-types/base.type";
import {
  CustomerLocation,
  customerLocationTypes,
} from "@sera-types/customer-location.type";
import { locationTypes } from "@sera-types/location.type";
import { ROUTE } from "@sera-utils/constants/routes";
import useCheckPermission from "@sera-utils/hooks/useCheckPermission";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Col, Row } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  Columns,
  CUSTOMER_LOCATION_DEFAULT_UNCHECK,
  SearchByOptions,
} from "./customer-location-props-table";

const CustomerLocationInitialPage = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "customerLocation" });

  const COLUMN_KEYS = Columns({})?.filter((_item) => !_item?.exception);
  const { isCreate } = useCheckPermission({
    menuLink: ROUTE.SALES_MANAGEMENT.CUSTOMER_LOCATION,
  });
  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/sales-management/customer-location/index");

  const dispatch = useAppDispatch();

  const { loading, customerLocations } = useAppSelector((state) => state);
  const [showColumns, setShowColumns] = useState<string[]>(
    COLUMN_KEYS?.map((_item) => _item?.key)?.filter(
      (_key) => !CUSTOMER_LOCATION_DEFAULT_UNCHECK.includes(_key),
    ),
  );
  const [locationsListOptions, setLocationsListOptions] = useState<BaseType>({
    page: 1,
    limit: customerLocations.options?.limit ?? 10,
    order: "name",
    sort: "asc",
  });

  const [locationsAutoCompleteOptions, setLocationsAutoCompleteOptions] =
    useState<BaseType>({
      searchBy: "name",
      page: 1,
      limit: 10,
    });

  const [selectedLocation, setSelectedLocation] = useState<{
    id: string;
    code: string;
    name: string;
  }>({ id: "", code: "", name: "" });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  const onPageChangeListener = (current: number, limit: number) => {
    setLocationsListOptions((prevState) => ({
      ...prevState,
      page: current,
      limit,
    }));
  };

  const onTableChangeListener = (
    pagination: any,
    filters: any,
    sorter: any,
  ) => {
    if (sorter) {
      setLocationsListOptions((prevState) => ({
        ...prevState,
        order: sorter.field,
        sort: sorter.order === "ascend" ? "asc" : ("desc" as string),
      }));
    }
  };

  const onSearchChangeListener = (search?: string, searchBy?: string) => {
    setLocationsListOptions((prevState: BaseType) => ({
      ...prevState,
      search,
      searchBy,
      page: 1,
    }));
  };

  const onSearchingChangeListener = (search?: string) => {
    setLocationsAutoCompleteOptions((prevState: BaseType) => ({
      ...prevState,
      search,
    }));
  };

  const onClearSearchListener = () => {
    setLocationsListOptions((prevState: BaseType) => ({
      ...prevState,
      search: null,
    }));
  };

  const handlerSelectSearchBy = (value?: string) => {
    setLocationsListOptions((prevState: BaseType) => ({
      ...prevState,
      search: null,
      searchBy: value,
    }));

    setLocationsAutoCompleteOptions((prevState: BaseType) => ({
      ...prevState,
      searchBy: value,
      search: null,
    }));

    dispatch(customerLocationActions.getCustomerLocationsAutoCompleteClear());
  };

  const showDeleteModal = (obj: any) => {
    setShowDeleteConfirm(true);
    setSelectedLocation(obj);
  };

  useEffect(() => {
    dispatch(customerLocationActions.getCustomerLocationDetailClear());
  }, []);

  useEffect(() => {
    try {
      dispatch(
        customerLocationActions.getCustomerLocationsFetch(locationsListOptions),
      );
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 154, error);
      else sendErrorHandler("useEffect", 155, error?.data?.message);
    }
  }, [locationsListOptions]);

  useEffect(() => {
    try {
      if (locationsAutoCompleteOptions.search)
        dispatch(
          customerLocationActions.getCustomerLocationsAutoCompleteFetch(
            locationsAutoCompleteOptions,
          ),
        );
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 164, error);
      else sendErrorHandler("useEffect", 165, error?.data?.message);
    }
  }, [locationsAutoCompleteOptions]);

  useEffect(() => {
    const { name } = customerLocations.postCreateNewCustomerLocation;
    if (name) {
      MessageHandler().success(
        `${t("toast.create.prevText")} “${name}” ${t("toast.create.postText")}`,
      );
      dispatch(customerLocationActions.postCreateNewCustomerLocationClear());
    }
  }, [customerLocations.postCreateNewCustomerLocation]);

  useEffect(() => {
    const { name } = customerLocations.postUpdateCustomerLocation;
    if (name) {
      MessageHandler().success(
        `${t("toast.update.prevText")} “${name}” ${t("toast.update.postText")}`,
      );
      dispatch(customerLocationActions.postUpdateCustomerLocationClear());
    }
  }, [customerLocations.postUpdateCustomerLocation]);

  useEffect(() => {
    const { name } = customerLocations.postDeleteCustomerLocation;
    if (name) {
      MessageHandler().success({
        title: name,
        content: t("toast.delete.postText"),
      });
      dispatch(customerLocationActions.postDeleteCustomerLocationClear());
    }
  }, [customerLocations.postDeleteCustomerLocation]);
  return (
    <>
      <Table
        title={t("table.title")}
        columns={Columns({
          onDeleteAction: (record) => {
            showDeleteModal({
              id: record.id,
              name: record.name,
              options: locationsListOptions,
            });
          },
        })?.filter(
          (_item) => _item?.exception || showColumns?.includes(_item?.key),
        )}
        dataSource={customerLocations?.data ?? []}
        current={customerLocations.options?.page}
        total={customerLocations.options?.totalData ?? 0}
        rowKey={(row: CustomerLocation) => `${row.no}`}
        loading={loading[locationTypes.GET_LOCATIONS]}
        scroll={{ x: 1000 }}
        multipleDelete={false}
        pageSize={customerLocations.options?.limit}
        onPageChange={onPageChangeListener}
        onTableChange={onTableChangeListener}
        isCustomSearch
        customSearch={
          <Row align="middle" gutter={[8, 4]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Select
                id="sales-customer-location-search"
                defaultValue="name"
                placeholder={t("table.search.default.placeholder")}
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
                loading={
                  loading[
                    customerLocationTypes.GET_CUSTOMER_LOCATIONS_AUTOCOMPLETE
                  ]
                }
                placeholder={t("table.search.placeholder")}
                autoCompleteItems={customerLocations.autoComplete?.data}
                onSearch={(search) =>
                  onSearchChangeListener(
                    search,
                    locationsListOptions.searchBy ?? "name",
                  )
                }
                onSearching={(searching) =>
                  onSearchingChangeListener(searching)
                }
                onClear={onClearSearchListener}
                value={locationsListOptions.search ?? ""}
              />
            </Col>
          </Row>
        }
        actions={
          <Row gutter={8}>
            {isCreate ? (
              <Col>
                <Link
                  id="link-add-customer-location"
                  href="/sales-management/customer-location/add"
                  passHref
                >
                  <Button
                    id="action-add"
                    type="primary"
                    disabled={false}
                    icon={<Plus />}
                    style={{ width: "100%" }}
                  >
                    {t("table.button.add")}
                  </Button>
                </Link>
              </Col>
            ) : null}
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
        open={showDeleteConfirm}
        title={t("modal.delete.title")}
        okText={t("modal.delete.ok")}
        cancelText={t("modal.delete.cancel")}
        okButtonProps={{
          disabled: loading[customerLocationTypes.DELETE_CUSTOMER_LOCATION],
          loading: loading[customerLocationTypes.DELETE_CUSTOMER_LOCATION],
        }}
        cancelButtonProps={{
          disabled: loading[customerLocationTypes.DELETE_CUSTOMER_LOCATION],
        }}
        onOk={() => {
          dispatch(
            customerLocationActions.deleteCustomerLocationFetch({
              id: selectedLocation.id,
              name: selectedLocation.name,
              options: locationsListOptions,
            }),
          );
          setShowDeleteConfirm(false);
        }}
        onCancel={() => setShowDeleteConfirm(false)}
      >
        <Typography.Text>{t("modal.delete.subtitle")} </Typography.Text>
        <Typography.Text strong>{selectedLocation.name}</Typography.Text>
      </Modal.Confirm>
    </>
  );
};
export default CustomerLocationInitialPage;
