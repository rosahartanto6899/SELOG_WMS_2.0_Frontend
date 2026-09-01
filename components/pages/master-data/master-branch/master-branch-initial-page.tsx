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
import { businessAreaActions, RootState } from "@sera-redux";
import { BaseType } from "@sera-types/base.type";
import {
  BusinessArea,
  BusinessAreaState,
  businessAreaTypes,
} from "@sera-types/business-area.type";
import { LoadingState } from "@sera-types/loading.type";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Col, Row } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import useGetPermissionMasterData from "../hooks/useGetPermission";
import { Columns, SearchByOptions } from "./master-branch-props-table";

interface BranchesProps {
  loading: LoadingState;
  businessAreas: BusinessAreaState;
  getBusinessAreas: typeof businessAreaActions.getBusinessAreasFetch;
  getBusinessAreasAutoComplete: typeof businessAreaActions.getBusinessAreasAutoCompleteFetch;
  deleteBusinessArea: typeof businessAreaActions.deleteBusinessAreaFetch;
  getBusinessAreasAutoCompleteClear: typeof businessAreaActions.getBusinessAreasAutoCompleteClear;
  getBusinessAreaDetailClear: typeof businessAreaActions.getBusinessAreaDetailClear;
  createNewBusinessAreaClear: typeof businessAreaActions.createNewBusinessAreaClear;
  updateBusinessAreaClear: typeof businessAreaActions.updateBusinessAreaClear;
  deleteBusinessAreaClear: typeof businessAreaActions.deleteBusinessAreaClear;
}

const MasterBranches = ({
  loading,
  businessAreas,
  getBusinessAreas,
  deleteBusinessArea,
  getBusinessAreasAutoComplete,
  getBusinessAreasAutoCompleteClear,
  getBusinessAreaDetailClear,
  createNewBusinessAreaClear,
  updateBusinessAreaClear,
  deleteBusinessAreaClear,
}: BranchesProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: "businessArea" });
  const { isCreate } = useGetPermissionMasterData("master-branch");
  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/master-data/master-branch/index");

  const [branchesListOptions, setBranchesListOptions] = useState<BaseType>({
    page: 1,
    limit: businessAreas.options?.limit ?? 10,
    order: "name",
    sort: "asc",
  });
  const [branchesAutoCompleteOptions, setBranchesAutoCompleteOptions] =
    useState<BaseType>({
      searchBy: "name",
      page: 1,
      limit: 10,
    });

  const [selectedBranch, setSelectedBranch] = useState<{
    id: string;
    code: string;
    name: string;
  }>({ id: "", code: "", name: "" });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  const onPageChangeListener = (current: number, limit: number) => {
    setBranchesListOptions((prevState) => ({
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
      setBranchesListOptions((prevState) => ({
        ...prevState,
        order: sorter.field,
        sort: sorter.order === "ascend" ? "asc" : ("desc" as string),
      }));
    }
  };

  const onSearchChangeListener = (search?: string, searchBy?: string) => {
    setBranchesListOptions((prevState: BaseType) => ({
      ...prevState,
      search,
      searchBy,
      page: 1,
    }));
  };

  const onSearchingChangeListener = (search?: string, searchBy?: string) => {
    setBranchesAutoCompleteOptions((prevState: BaseType) => ({
      ...prevState,
      searchBy: searchBy ?? prevState.searchBy,
      search,
    }));
  };

  const onClearSearchListener = () => {
    setBranchesListOptions((prevState: BaseType) => ({
      ...prevState,
      search: null,
    }));
  };

  const showDeleteModal = (obj: any) => {
    setShowDeleteConfirm(true);
    setSelectedBranch(obj);
  };

  const handlerSelectSearchBy = (value?: string) => {
    setBranchesListOptions((prevState: BaseType) => ({
      ...prevState,
      search: null,
      searchBy: value,
    }));

    setBranchesAutoCompleteOptions((prevState: BaseType) => ({
      ...prevState,
      searchBy: value,
      search: null,
    }));

    getBusinessAreasAutoCompleteClear();
  };

  useEffect(() => {
    getBusinessAreaDetailClear();
  }, []);

  useEffect(() => {
    try {
      getBusinessAreas(branchesListOptions);
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 136, error);
      else sendErrorHandler("useEffect", 136, error?.data?.message);
    }
  }, [branchesListOptions]);

  useEffect(() => {
    try {
      if (branchesAutoCompleteOptions.search)
        getBusinessAreasAutoComplete(branchesAutoCompleteOptions);
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 145, error);
      else sendErrorHandler("useEffect", 145, error?.data?.message);
    }
  }, [branchesAutoCompleteOptions]);

  useEffect(() => {
    const { name } = businessAreas.createNewBusinessArea;
    if (name) {
      MessageHandler().success(
        `${t("toast.create.prevText")} “${name}” ${t("toast.create.postText")}`,
      );
      createNewBusinessAreaClear();
    }
  }, [businessAreas.createNewBusinessArea]);

  useEffect(() => {
    const { name } = businessAreas.updateBusinessArea;
    if (name) {
      MessageHandler().success(
        `${t("toast.update.prevText")} “${name}” ${t("toast.update.postText")}`,
      );
      updateBusinessAreaClear();
    }
  }, [businessAreas.updateBusinessArea]);

  useEffect(() => {
    const { name } = businessAreas.deleteBusinessArea;
    if (name) {
      MessageHandler().success({
        title: name,
        content: t("toast.delete.postText"),
      });
      deleteBusinessAreaClear();
    }
  }, [businessAreas.deleteBusinessArea]);

  return (
    <>
      <Table
        title={t("table.title")}
        columns={Columns({
          onDeleteAction: (record) => {
            showDeleteModal({
              id: record.id,
              name: record.name,
              options: branchesListOptions,
            });
          },
        })}
        dataSource={businessAreas?.data ?? []}
        current={businessAreas.options?.page}
        total={businessAreas.options?.totalData ?? 0}
        rowKey={(row: BusinessArea) => `${row.no}`}
        loading={loading[businessAreaTypes.GET_BUSINESS_AREAS]}
        scroll={{ x: 1000 }}
        multipleDelete={false}
        pageSize={businessAreas.options?.limit}
        onPageChange={onPageChangeListener}
        onTableChange={onTableChangeListener}
        isCustomSearch
        customSearch={
          <Row align="middle" gutter={[8, 4]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Select
                id="master-branch-search"
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
                  loading[businessAreaTypes.GET_BUSINESS_AREAS_AUTOCOMPLETE]
                }
                placeholder={t("table.search.placeholder")}
                autoCompleteItems={businessAreas.autoComplete?.data}
                onSearch={(search) =>
                  onSearchChangeListener(
                    search,
                    branchesListOptions.searchBy ?? "name",
                  )
                }
                onSearching={(searching) =>
                  onSearchingChangeListener(searching)
                }
                onClear={onClearSearchListener}
                value={branchesListOptions.search ?? ""}
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
                  href="/master-data/master-branch/add"
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
          disabled: loading[businessAreaTypes.DELETE_BUSINESS_AREA],
          loading: loading[businessAreaTypes.DELETE_BUSINESS_AREA],
        }}
        cancelButtonProps={{
          disabled: loading[businessAreaTypes.DELETE_BUSINESS_AREA],
        }}
        onOk={() => {
          deleteBusinessArea({
            id: selectedBranch.id,
            name: selectedBranch.name,
            options: branchesListOptions,
          });
          setShowDeleteConfirm(false);
        }}
        onCancel={() => setShowDeleteConfirm(false)}
      >
        <Typography.Text>{t("modal.delete.subtitle")} </Typography.Text>
        <Typography.Text strong>{selectedBranch.name}</Typography.Text>
      </Modal.Confirm>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  businessAreas: state.businessAreas,
});

const mapDispatchToProps = {
  getBusinessAreas: businessAreaActions.getBusinessAreasFetch,
  getBusinessAreasAutoComplete:
    businessAreaActions.getBusinessAreasAutoCompleteFetch,
  deleteBusinessArea: businessAreaActions.deleteBusinessAreaFetch,
  getBusinessAreasAutoCompleteClear:
    businessAreaActions.getBusinessAreasAutoCompleteClear,
  getBusinessAreaDetailClear: businessAreaActions.getBusinessAreaDetailClear,
  createNewBusinessAreaClear: businessAreaActions.createNewBusinessAreaClear,
  updateBusinessAreaClear: businessAreaActions.updateBusinessAreaClear,
  deleteBusinessAreaClear: businessAreaActions.deleteBusinessAreaClear,
};

export default connect(mapStateToProps, mapDispatchToProps)(MasterBranches);
