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
import { RootState } from "@sera-redux";
import { vehicleTypeActions } from "@sera-redux/slices/vehicle-type.slice";
import { BaseType } from "@sera-types/base.type";
import { LoadingState } from "@sera-types/loading.type";
import {
  VehicleType,
  VehicleTypeState,
  vehicleTypeTypes,
} from "@sera-types/vehicle-type.type";
// import useErrorHandler from "@sera-utils/hooks/useErrorHandler"; // Disabled for demo
import { Col, Row } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import useGetPermissionMasterData from "../hooks/useGetPermission";
import { Columns, SearchByOptions } from "./master-vehicle-type-props-table";

interface VehicleTypesProps {
  loading: LoadingState;
  vehicleTypes: VehicleTypeState;
  getVehicleTypes: typeof vehicleTypeActions.getVehicleTypesFetch;
  getVehicleTypesAutoComplete: typeof vehicleTypeActions.getVehicleTypesAutoCompleteFetch;
  deleteVehicleType: typeof vehicleTypeActions.deleteVehicleTypeFetch;
  // getVehicleTypesAutoCompleteClear: typeof vehicleTypeActions.getVehicleTypesAutoCompleteClear; // Commented out as it's not used
  getVehicleTypeDetailClear: typeof vehicleTypeActions.getVehicleTypeDetailClear;
  createNewVehicleTypeClear: typeof vehicleTypeActions.createNewVehicleTypeClear;
  updateVehicleTypeClear: typeof vehicleTypeActions.updateVehicleTypeClear;
  deleteVehicleTypeClear: typeof vehicleTypeActions.deleteVehicleTypeClear;
}

const MasterVehicleTypes = ({
  loading,
  vehicleTypes,
  getVehicleTypes,
  deleteVehicleType,
  getVehicleTypesAutoComplete,
  // getVehicleTypesAutoCompleteClear, // Commented out as it's not used
  getVehicleTypeDetailClear,
  createNewVehicleTypeClear,
  updateVehicleTypeClear,
  deleteVehicleTypeClear,
}: VehicleTypesProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: "vehicleType" });
  const { isCreate } = useGetPermissionMasterData("vehicle-type");
  // Error handlers disabled since API calls are disabled for demo
  // const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
  //   useErrorHandler("/pages/master-data/vehicle-type/index");

  const [vehicleTypesListOptions, setVehicleTypesListOptions] =
    useState<BaseType>({
      page: 1,
      limit: vehicleTypes.options?.limit ?? 10,
      order: "name",
      sort: "asc",
    });
  const [vehicleTypesAutoCompleteOptions, setVehicleTypesAutoCompleteOptions] =
    useState<BaseType>({
      searchBy: "name",
      page: 1,
      limit: 10,
    });

  const [selectedVehicleType, setSelectedVehicleType] = useState<{
    id: string;
    name: string;
  }>({ id: "", name: "" });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  const onPageChangeListener = (current: number, limit: number) => {
    setVehicleTypesListOptions((prevState) => ({
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
      setVehicleTypesListOptions((prevState) => ({
        ...prevState,
        order: sorter.field,
        sort: sorter.order === "ascend" ? "asc" : ("desc" as string),
      }));
    }
  };

  const onSearchChangeListener = (search?: string, searchBy?: string) => {
    setVehicleTypesListOptions((prevState: BaseType) => ({
      ...prevState,
      search,
      searchBy,
      page: 1,
    }));
  };

  const onSearchingChangeListener = (search?: string, searchBy?: string) => {
    setVehicleTypesAutoCompleteOptions((prevState: BaseType) => ({
      ...prevState,
      searchBy: searchBy ?? prevState.searchBy,
      search,
    }));
  };

  const onClearSearchListener = () => {
    setVehicleTypesListOptions((prevState: BaseType) => ({
      ...prevState,
      search: null,
    }));
  };

  const showDeleteModal = (obj: any) => {
    setShowDeleteConfirm(true);
    setSelectedVehicleType(obj);
  };

  const handlerSelectSearchBy = (value?: string) => {
    setVehicleTypesListOptions((prevState: BaseType) => ({
      ...prevState,
      search: null,
      searchBy: value,
    }));

    setVehicleTypesAutoCompleteOptions((prevState: BaseType) => ({
      ...prevState,
      searchBy: value,
      search: null,
    }));

    // getVehicleTypesAutoCompleteClear();
  };

  useEffect(() => {
    getVehicleTypeDetailClear();
  }, [getVehicleTypeDetailClear]);

  useEffect(() => {
    try {
      getVehicleTypes(vehicleTypesListOptions);
    } catch (error: any) {
      console.error("Error fetching vehicle types:", error);
    }
  }, [vehicleTypesListOptions, getVehicleTypes]);

  useEffect(() => {
    if (vehicleTypesAutoCompleteOptions.search) {
      try {
        getVehicleTypesAutoComplete(vehicleTypesAutoCompleteOptions);
      } catch (error: any) {
        console.error("Error fetching vehicle types autocomplete:", error);
      }
    }
  }, [vehicleTypesAutoCompleteOptions, getVehicleTypesAutoComplete]);

  useEffect(() => {
    const { name } = vehicleTypes.createNewVehicleType;
    if (name) {
      MessageHandler().success(
        `${t("toast.create.prevText")} "${name}" ${t("toast.create.postText")}`,
      );
      createNewVehicleTypeClear();
    }
  }, [vehicleTypes.createNewVehicleType, createNewVehicleTypeClear, t]);

  useEffect(() => {
    const { name } = vehicleTypes.updateVehicleType;
    if (name) {
      MessageHandler().success(
        `${t("toast.update.prevText")} "${name}" ${t("toast.update.postText")}`,
      );
      updateVehicleTypeClear();
    }
  }, [vehicleTypes.updateVehicleType, updateVehicleTypeClear, t]);

  useEffect(() => {
    const { name } = vehicleTypes.deleteVehicleType;
    if (name) {
      MessageHandler().success({
        title: name,
        content: t("toast.delete.postText"),
      });
      deleteVehicleTypeClear();
      setShowDeleteConfirm(false);
    } else {
      deleteVehicleTypeClear();
      setShowDeleteConfirm(false);
    }
  }, [vehicleTypes.deleteVehicleType, deleteVehicleTypeClear, t]);

  return (
    <>
      <Table
        title={t("table.title")}
        columns={Columns({
          onDeleteAction: (record) => {
            showDeleteModal({
              id: record.id,
              name: record.name,
              options: vehicleTypesListOptions,
            });
          },
        })}
        dataSource={vehicleTypes?.data ?? []}
        current={vehicleTypes.options?.page}
        total={vehicleTypes.options?.totalData ?? 0}
        rowKey={(row: VehicleType) => `${row.id}`}
        loading={loading[vehicleTypeTypes.GET_VEHICLE_TYPES]}
        scroll={{ x: 1000 }}
        multipleDelete={false}
        pageSize={vehicleTypes.options?.limit}
        onPageChange={onPageChangeListener}
        onTableChange={onTableChangeListener}
        isCustomSearch
        customSearch={
          <Row align="middle" gutter={[8, 4]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Select
                id="master-vehicle-type-search"
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
                  loading[vehicleTypeTypes.GET_VEHICLE_TYPES_AUTOCOMPLETE]
                }
                placeholder={t("table.search.placeholder")}
                autoCompleteItems={vehicleTypes.autoComplete?.data}
                onSearch={(search) =>
                  onSearchChangeListener(
                    search,
                    vehicleTypesListOptions.searchBy ?? "name",
                  )
                }
                onSearching={(searching) =>
                  onSearchingChangeListener(searching)
                }
                onClear={onClearSearchListener}
                value={vehicleTypesListOptions.search ?? ""}
              />
            </Col>
          </Row>
        }
        actions={
          <Row gutter={8}>
            {isCreate ? (
              <Col span={24}>
                <Link
                  id="link-add-vehicle-type"
                  href="/master-data/vehicle-type/add"
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
        cancelText={t("modal.delete.cancelText")}
        okButtonProps={{
          disabled: loading[vehicleTypeTypes.DELETE_VEHICLE_TYPE],
          loading: loading[vehicleTypeTypes.DELETE_VEHICLE_TYPE],
        }}
        cancelButtonProps={{
          disabled: loading[vehicleTypeTypes.DELETE_VEHICLE_TYPE],
        }}
        onOk={() =>
          deleteVehicleType({
            id: selectedVehicleType.id,
            name: selectedVehicleType.name,
            options: vehicleTypesListOptions,
          })
        }
        onCancel={() => setShowDeleteConfirm(false)}
      >
        <Typography.Text>{t("modal.delete.subtitle")} </Typography.Text>
        <Typography.Text strong>{selectedVehicleType.name}</Typography.Text>
      </Modal.Confirm>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  vehicleTypes: state.vehicleTypes,
});

const mapDispatchToProps = {
  getVehicleTypes: vehicleTypeActions.getVehicleTypesFetch,
  getVehicleTypesAutoComplete:
    vehicleTypeActions.getVehicleTypesAutoCompleteFetch,
  deleteVehicleType: vehicleTypeActions.deleteVehicleTypeFetch,
  // getVehicleTypesAutoCompleteClear: vehicleTypeActions.getVehicleTypesAutoCompleteClear, // Commented out as it's not used
  getVehicleTypeDetailClear: vehicleTypeActions.getVehicleTypeDetailClear,
  createNewVehicleTypeClear: vehicleTypeActions.createNewVehicleTypeClear,
  updateVehicleTypeClear: vehicleTypeActions.updateVehicleTypeClear,
  deleteVehicleTypeClear: vehicleTypeActions.deleteVehicleTypeClear,
};

export default connect(mapStateToProps, mapDispatchToProps)(MasterVehicleTypes);
