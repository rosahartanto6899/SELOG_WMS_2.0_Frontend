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
import { serviceGroupActions } from "@sera-redux/slices/service-group.slice";
import { BaseType } from "@sera-types/base.type";
import { BusinessArea } from "@sera-types/business-area.type";
import { LoadingState } from "@sera-types/loading.type";
import {
  DeleteServiceGroupPayload,
  ServiceGroupState,
  serviceGroupTypes,
} from "@sera-types/service-group.type";
import { ROUTE } from "@sera-utils/constants/routes";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Col, Row } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import useGetPermissionMasterData from "../hooks/useGetPermission";
import { Columns, SearchByOptions } from "./service-group-props-table";

interface ServiceGroupProps {
  loading: LoadingState;
  serviceGroups: ServiceGroupState;
  getServiceGroup: typeof serviceGroupActions.getServiceGroupFetch;
  getServiceGroupAutoComplete: typeof serviceGroupActions.getServiceGroupAutoCompleteFetch;
  getServiceGroupAutoCompleteClear: typeof serviceGroupActions.getServiceGroupAutoCompleteClear;
  createServiceGroupClear: typeof serviceGroupActions.createServiceGroupClear;
  detailServiceGroupClear: typeof serviceGroupActions.detailServiceGroupClear;
  updateServiceGroupClear: typeof serviceGroupActions.updateServiceGroupClear;
  deleteServiceGroup: typeof serviceGroupActions.deleteServiceGroupFetch;
  deleteServiceGroupClear: typeof serviceGroupActions.deleteServiceGroupClear;
}

const ServiceGroup = ({
  loading,
  serviceGroups,
  getServiceGroup,
  getServiceGroupAutoComplete,
  getServiceGroupAutoCompleteClear,
  createServiceGroupClear,
  detailServiceGroupClear,
  updateServiceGroupClear,
  deleteServiceGroup,
  deleteServiceGroupClear,
}: ServiceGroupProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: "serviceGroup" });

  const { isCreate } = useGetPermissionMasterData("service-group");
  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/master-data/service-group/index");

  const [serviceGroupOptions, setServiceGroupOptions] = useState<BaseType>({
    page: 1,
    limit: 10,
    order: "name",
    sort: "asc",
  });
  const [serviceGroupAutoCompleteOptions, setServiceGroupAutoCompleteOptions] =
    useState<BaseType>({
      page: 1,
      limit: 10,
      searchBy: "name",
    });
  const [selectedServiceGroup, setSelectedServiceGroup] =
    useState<DeleteServiceGroupPayload>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const onPageChangeListener = (_current: number, _limit: number) => {
    setServiceGroupOptions((_prevState) => ({
      ..._prevState,
      page: _current,
      limit: _limit,
    }));
  };

  const onTableChangeListener = (_: any, __: any, _sorter: any) => {
    if (_sorter) {
      setServiceGroupOptions((prevState: BaseType) => ({
        ...prevState,
        order: _sorter.field,
        sort: _sorter.order === "ascend" ? "asc" : ("desc" as string),
      }));
    }
  };

  const onSearchingChangeListener = (_search?: string, _searchBy?: string) => {
    setServiceGroupAutoCompleteOptions((_prevState: BaseType) => ({
      ..._prevState,
      searchBy: _searchBy || _prevState.searchBy,
      search: _search,
    }));
  };

  const onSearchChangeListener = (_search?: string, _searchBy?: string) => {
    setServiceGroupOptions((_prevState: BaseType) => ({
      ..._prevState,
      page: 1,
      searchBy: _searchBy,
      search: _search,
    }));
  };

  const onClearSearchListener = () => {
    setServiceGroupOptions((_prevState: BaseType) => ({
      ..._prevState,
      search: null,
    }));
  };

  const onHandlerSelectSearchBy = (value?: string) => {
    setServiceGroupOptions((prevState: BaseType) => ({
      ...prevState,
      search: null,
      searchBy: value,
    }));

    setServiceGroupAutoCompleteOptions((prevState: BaseType) => ({
      ...prevState,
      searchBy: value,
      search: null,
    }));

    getServiceGroupAutoCompleteClear();
  };

  const showModalDelete = (_payload: DeleteServiceGroupPayload) => {
    setShowDeleteConfirm(true);
    setSelectedServiceGroup(_payload);
  };

  useEffect(() => {
    detailServiceGroupClear();
  }, []);

  useEffect(() => {
    try {
      getServiceGroup(serviceGroupOptions);
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 0, error);
      else sendErrorHandler("useEffect", 0, error?.data?.message);
    }
  }, [serviceGroupOptions]);

  useEffect(() => {
    try {
      if (serviceGroupAutoCompleteOptions.search) {
        getServiceGroupAutoComplete(serviceGroupAutoCompleteOptions);
      }
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 0, error);
      else sendErrorHandler("useEffect", 0, error?.data?.message);
    }
  }, [serviceGroupAutoCompleteOptions]);

  useEffect(() => {
    const { name } = serviceGroups.createServiceGroup?.data;

    if (name) {
      MessageHandler().success(
        `${t("toast.create.prevText")} “${name}” ${t("toast.create.postText")}`,
      );

      createServiceGroupClear();
    }
  }, [serviceGroups.createServiceGroup]);

  useEffect(() => {
    const { name } = serviceGroups.updateServiceGroup?.data;

    if (name) {
      MessageHandler().success(
        `${t("toast.update.prevText")} “${name}” ${t("toast.update.postText")}`,
      );

      updateServiceGroupClear();
    }
  }, [serviceGroups.updateServiceGroup]);

  useEffect(() => {
    const { name } = serviceGroups.deleteServiceGroup?.data;

    if (name) {
      MessageHandler().success({
        title: name,
        content: t("toast.delete.postText"),
      });

      deleteServiceGroupClear();
    }
  }, [serviceGroups.deleteServiceGroup]);

  return (
    <>
      <Table
        title={t("table.title")}
        columns={Columns({
          onDeleteAction: (record) => {
            showModalDelete({
              id: record?.id,
              name: record?.name,
              options: serviceGroupOptions,
            });
          },
        })}
        dataSource={serviceGroups?.data ?? []}
        total={serviceGroups.options?.totalData ?? 0}
        current={serviceGroups.options?.page ?? 1}
        pageSize={serviceGroups.options?.limit ?? 10}
        rowKey={(row: BusinessArea) => `${row.no}`}
        loading={loading[serviceGroupTypes.GET_SERVICE_GROUPS]}
        scroll={{ x: "max-content" }}
        multipleDelete={false}
        onPageChange={onPageChangeListener}
        onTableChange={onTableChangeListener}
        isCustomSearch
        customSearch={
          <Row align="middle" gutter={[8, 4]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Select
                id="master-data-service-group-search"
                defaultValue="name"
                onChange={(_value) => onHandlerSelectSearchBy(_value)}
                onClear={() => onHandlerSelectSearchBy("")}
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
                  loading[serviceGroupTypes.GET_SERVICE_GROUPS_AUTOCOMPLETE]
                }
                value={serviceGroupOptions.search ?? ""}
                placeholder={t("table.search.placeholder")}
                autoCompleteItems={serviceGroups.autoComplete?.data ?? []}
                onSearching={onSearchingChangeListener}
                onSearch={(_search) => {
                  onSearchChangeListener(
                    _search,
                    serviceGroupOptions.searchBy ?? "name",
                  );
                }}
                onClear={onClearSearchListener}
              />
            </Col>
          </Row>
        }
        actions={
          <Row gutter={8}>
            {isCreate ? (
              <Col span={24}>
                <Link
                  id="link-add-service-group"
                  href={`${ROUTE.MASTER_DATA.SERVICE_GROUP}/add`}
                  passHref
                >
                  <Button
                    id="action-add"
                    type="primary"
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
          disabled: loading[serviceGroupTypes.DELETE_SERVICE_GROUP],
          loading: loading[serviceGroupTypes.DELETE_SERVICE_GROUP],
        }}
        cancelButtonProps={{
          disabled: loading[serviceGroupTypes.DELETE_SERVICE_GROUP],
        }}
        onOk={() => {
          deleteServiceGroup(selectedServiceGroup);
          setShowDeleteConfirm(false);
        }}
        onCancel={() => setShowDeleteConfirm(false)}
      >
        <Typography.Text>{t("modal.delete.subtitle")} </Typography.Text>
        <Typography.Text strong>{selectedServiceGroup?.name}</Typography.Text>
      </Modal.Confirm>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  serviceGroups: state.serviceGroups,
});

const mapDispatchToProps = {
  getServiceGroup: serviceGroupActions.getServiceGroupFetch,
  getServiceGroupAutoComplete:
    serviceGroupActions.getServiceGroupAutoCompleteFetch,
  getServiceGroupAutoCompleteClear:
    serviceGroupActions.getServiceGroupAutoCompleteClear,
  createServiceGroupClear: serviceGroupActions.createServiceGroupClear,
  detailServiceGroupClear: serviceGroupActions.detailServiceGroupClear,
  updateServiceGroupClear: serviceGroupActions.updateServiceGroupClear,
  deleteServiceGroup: serviceGroupActions.deleteServiceGroupFetch,
  deleteServiceGroupClear: serviceGroupActions.deleteServiceGroupClear,
};

export default connect(mapStateToProps, mapDispatchToProps)(ServiceGroup);
