/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import Button from "@sera-components/button";
import { Plus } from "@sera-components/icons";
import Input from "@sera-components/input";
import Modal from "@sera-components/modal";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import Typography from "@sera-components/typography";
import MessageHandler from "@sera-libraries/message-handler";
import { locationActions, RootState } from "@sera-redux";
import { BaseType } from "@sera-types/base.type";
import { LoadingState } from "@sera-types/loading.type";
import {
  Location,
  LocationState,
  locationTypes,
} from "@sera-types/location.type";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Col, Row } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import useGetPermissionMasterData from "../hooks/useGetPermission";
import { Columns, SearchByOptions } from "./master-locations-props-table";

interface LocationsProps {
  loading: LoadingState;
  locations: LocationState;
  getLocations: typeof locationActions.getLocationsFetch;
  getLocationsAutoComplete: typeof locationActions.getLocationsAutoCompleteFetch;
  deleteLocation: typeof locationActions.deleteLocationFetch;
  getLocationsAutoCompleteClear: typeof locationActions.getLocationsAutoCompleteClear;
  getLocationDetailClear: typeof locationActions.getLocationDetailClear;
  createNewLocationClear: typeof locationActions.postCreateNewLocationClear;
  updateLocationClear: typeof locationActions.postUpdateLocationClear;
  deleteLocationClear: typeof locationActions.postDeleteLocationClear;
}

const MasterLocations = ({
  loading,
  locations,
  getLocations,
  deleteLocation,
  getLocationsAutoComplete,
  getLocationsAutoCompleteClear,
  getLocationDetailClear,
  createNewLocationClear,
  updateLocationClear,
  deleteLocationClear,
}: LocationsProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: "location" });
  const { isCreate } = useGetPermissionMasterData("locations");
  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/master-data/locations/index");

  const [locationsListOptions, setLocationsListOptions] = useState<BaseType>({
    page: 1,
    limit: locations.options?.limit ?? 10,
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

    getLocationsAutoCompleteClear();
  };

  const showDeleteModal = (obj: any) => {
    setShowDeleteConfirm(true);
    setSelectedLocation(obj);
  };

  useEffect(() => {
    getLocationDetailClear();
  }, []);

  useEffect(() => {
    try {
      getLocations(locationsListOptions);
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 154, error);
      else sendErrorHandler("useEffect", 155, error?.data?.message);
    }
  }, [locationsListOptions]);

  useEffect(() => {
    try {
      if (locationsAutoCompleteOptions.search)
        getLocationsAutoComplete(locationsAutoCompleteOptions);
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 164, error);
      else sendErrorHandler("useEffect", 165, error?.data?.message);
    }
  }, [locationsAutoCompleteOptions]);

  useEffect(() => {
    const { name } = locations.postCreateNewLocation;
    if (name) {
      MessageHandler().success(
        `${t("toast.create.prevText")} “${name}” ${t("toast.create.postText")}`,
      );
      createNewLocationClear();
    }
  }, [locations.postCreateNewLocation]);

  useEffect(() => {
    const { name } = locations.postUpdateLocation;
    if (name) {
      MessageHandler().success(
        `${t("toast.update.prevText")} “${name}” ${t("toast.update.postText")}`,
      );
      updateLocationClear();
    }
  }, [locations.postUpdateLocation]);

  useEffect(() => {
    const { name } = locations.postDeleteLocation;
    if (name) {
      MessageHandler().success({
        title: name,
        content: t("toast.delete.postText"),
      });
      deleteLocationClear();
    }
  }, [locations.postDeleteLocation]);

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
        })}
        dataSource={locations?.data ?? []}
        current={locations.options?.page}
        total={locations.options?.totalData ?? 0}
        rowKey={(row: Location) => `${row.no}`}
        loading={loading[locationTypes.GET_LOCATIONS]}
        scroll={{ x: 1000 }}
        multipleDelete={false}
        pageSize={locations.options?.limit}
        onPageChange={onPageChangeListener}
        onTableChange={onTableChangeListener}
        isCustomSearch
        customSearch={
          <Row align="middle" gutter={[8, 4]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Select
                id="master-location-search"
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
                loading={loading[locationTypes.GET_LOCATIONS_AUTOCOMPLETE]}
                placeholder={t("table.search.placeholder")}
                autoCompleteItems={locations.autoComplete?.data}
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
              <Col span={24}>
                <Link
                  id="link-add-branch"
                  href="/master-data/locations/add"
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
          disabled: loading[locationTypes.DELETE_LOCATION],
          loading: loading[locationTypes.DELETE_LOCATION],
        }}
        cancelButtonProps={{
          disabled: loading[locationTypes.DELETE_LOCATION],
        }}
        onOk={() => {
          deleteLocation({
            id: selectedLocation.id,
            name: selectedLocation.name,
            options: locationsListOptions,
          });
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

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  locations: state.locations,
});

const mapDispatchToProps = {
  getLocations: locationActions.getLocationsFetch,
  getLocationsAutoComplete: locationActions.getLocationsAutoCompleteFetch,
  deleteLocation: locationActions.deleteLocationFetch,
  getLocationsAutoCompleteClear: locationActions.getLocationsAutoCompleteClear,
  getLocationDetailClear: locationActions.getLocationDetailClear,
  createNewLocationClear: locationActions.postCreateNewLocationClear,
  updateLocationClear: locationActions.postUpdateLocationClear,
  deleteLocationClear: locationActions.postDeleteLocationClear,
};

export default connect(mapStateToProps, mapDispatchToProps)(MasterLocations);
