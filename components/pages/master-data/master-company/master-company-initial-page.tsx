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
import { companyActions, RootState } from "@sera-redux";
import { BaseType } from "@sera-types/base.type";
import { Company, CompanyState, companyTypes } from "@sera-types/company.type";
import { LoadingState } from "@sera-types/loading.type";
import { Col, Row } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import useGetPermissionMasterData from "../hooks/useGetPermission";
import { Columns, SearchByOptions } from "./master-company-props-table";

interface CompaniesProps {
  loading: LoadingState;
  companies: CompanyState;
  getCompanies: typeof companyActions.getCompaniesFetch;
  getCompaniesAutoComplete: typeof companyActions.getCompaniesAutoCompleteFetch;
  deleteCompany: typeof companyActions.deleteCompanyFetch;
  getCompaniesAutoCompleteClear: typeof companyActions.getCompaniesAutoCompleteClear;
  getCompanyDetailClear: typeof companyActions.getCompanyDetailClear;
  createNewCompanyClear: typeof companyActions.createNewCompanyClear;
  updateCompanyClear: typeof companyActions.updateCompanyClear;
  deleteCompanyClear: typeof companyActions.deleteCompanyClear;
}

const MasterCompanies = ({
  loading,
  companies,
  getCompanies,
  getCompaniesAutoComplete,
  deleteCompany,
  getCompaniesAutoCompleteClear,
  getCompanyDetailClear,
  createNewCompanyClear,
  updateCompanyClear,
  deleteCompanyClear,
}: CompaniesProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: "company" });
  const { isCreate } = useGetPermissionMasterData("master-company");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [companiesListOptions, setCompaniesListOptions] = useState<BaseType>({
    page: 1,
    limit: companies.options?.limit ?? 10,
    searchBy: "name",
    order: "name",
    sort: "asc",
  });
  const [companiesAutoCompleteOptions, setCompaniesAutoCompleteOptions] =
    useState<BaseType>({
      searchBy: "name",
      page: 1,
      limit: 10,
    });
  const [selectedCompany, setSelectedCompany] = useState<{
    id: string;
    code: string;
    name: string;
  }>({
    id: "",
    code: "",
    name: "",
  });

  const onPageChangeListener = (current: number, limit: number) => {
    setCompaniesListOptions((prevState: BaseType) => ({
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
      setCompaniesListOptions((prevState: BaseType) => ({
        ...prevState,
        order: sorter.field,
        sort: sorter.order === "ascend" ? "asc" : "desc",
      }));
    }
  };

  const onSearchChangeListener = (search?: string, searchBy?: string) => {
    setCompaniesListOptions((prevState: BaseType) => ({
      ...prevState,
      search,
      searchBy,
      page: 1,
    }));
  };

  const onSearchingChangeListener = (search?: string) => {
    setCompaniesAutoCompleteOptions((prevState: BaseType) => ({
      ...prevState,
      search,
    }));
  };

  const onClearSearchListener = () => {
    setCompaniesListOptions((prevState: BaseType) => ({
      ...prevState,
      search: null,
    }));
  };

  const handlerSelectSearchBy = (value?: string) => {
    setCompaniesListOptions((prevState: BaseType) => ({
      ...prevState,
      searchBy: value,
      search: null,
    }));

    setCompaniesAutoCompleteOptions((prevState: BaseType) => ({
      ...prevState,
      searchBy: value,
      search: null,
    }));

    getCompaniesAutoCompleteClear();
  };

  const showDeleteModal = (obj: {
    id?: string;
    code?: string;
    name?: string;
  }) => {
    const { id = "", code = "", name = "" } = obj;
    setShowDeleteConfirm(true);
    setSelectedCompany({ id, code, name });
  };

  const hideDeleteModal = () => {
    setShowDeleteConfirm(false);
    setSelectedCompany({ id: "", code: "", name: "" });
  };

  useEffect(() => {
    getCompanies(companiesListOptions);
  }, [companiesListOptions]);

  useEffect(() => {
    if (companiesAutoCompleteOptions.search)
      getCompaniesAutoComplete(companiesAutoCompleteOptions);
  }, [companiesAutoCompleteOptions]);

  useEffect(() => {
    const { name } = companies.createNewCompany;
    if (name) {
      MessageHandler().success(
        `${t("toast.create.prevText")} “${name}” ${t("toast.create.postText")}`,
      );
      createNewCompanyClear();
    }
  }, [companies.createNewCompany]);

  useEffect(() => {
    const { name } = companies.updateCompany;
    if (name) {
      MessageHandler().success(
        `${t("toast.update.prevText")} “${name}” ${t("toast.update.postText")}`,
      );
      updateCompanyClear();
    }
  }, [companies.updateCompany]);

  useEffect(() => {
    const { name } = companies.deleteCompany;
    if (name) {
      MessageHandler().success({
        title: name,
        content: t("toast.delete.postText"),
      });
      deleteCompanyClear();
    }
  }, [companies.deleteCompany]);

  useEffect(() => {
    if (!loading[companyTypes.DELETE_COMPANY] && showDeleteConfirm) {
      hideDeleteModal();
    }
  }, [loading[companyTypes.DELETE_COMPANY]]);

  useEffect(() => {
    getCompanyDetailClear();
  }, []);

  return (
    <>
      <Table
        title={t("table.title")}
        dataSource={companies.data}
        columns={Columns({
          onDeleteAction: (record) =>
            showDeleteModal({
              id: record.id,
              code: record.code,
              name: record.name,
            }),
        }).filter((item) => item.key)}
        current={companies.options?.page}
        pageSize={companies.options?.limit}
        total={companies.options?.totalData ?? 0}
        rowKey={(row: Company) => `${row.no}`}
        loading={loading[companyTypes.GET_COMPANIES]}
        scroll={{ x: 1000 }}
        multipleDelete={false}
        autoCompleteItems={companies.autoComplete?.data}
        onPageChange={onPageChangeListener}
        onTableChange={onTableChangeListener}
        onSearchChange={onSearchChangeListener}
        onSearching={onSearchingChangeListener}
        onClearSearch={onClearSearchListener}
        isCustomSearch
        customSearch={
          <Row align="middle" gutter={[8, 4]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Select
                id="master-data-master-company-search"
                defaultValue="Name"
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
                loading={loading[companyTypes.GET_COMPANIES]}
                placeholder={t("table.search.placeholder")}
                autoCompleteItems={companies.autoComplete?.data}
                onSearching={onSearchingChangeListener}
                onSearch={(search) =>
                  onSearchChangeListener(
                    search,
                    companiesListOptions.searchBy ?? "name",
                  )
                }
                onClear={onClearSearchListener}
                value={companiesListOptions.search ?? ""}
              />
            </Col>
          </Row>
        }
        actions={
          <Row gutter={8}>
            {isCreate ? (
              <Col span={24}>
                <Link
                  id="link-add-company"
                  href="/master-data/master-company/add"
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
        okButtonProps={{
          disabled: loading[companyTypes.DELETE_COMPANY],
          loading: loading[companyTypes.DELETE_COMPANY],
        }}
        onOk={() =>
          deleteCompany({
            id: selectedCompany.code,
            name: selectedCompany.name,
            options: companiesListOptions,
          })
        }
        cancelButtonProps={{
          disabled: loading[companyTypes.DELETE_COMPANY],
        }}
        onCancel={() => setShowDeleteConfirm(false)}
      >
        <>
          <Typography.Text>{t("modal.delete.subtitle")}</Typography.Text>{" "}
          <Typography.Text strong>
            {`"${selectedCompany.name}"`}?
          </Typography.Text>
        </>
      </Modal.Confirm>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  companies: state.companies,
});

const mapDispatchToProps = {
  getCompanies: companyActions.getCompaniesFetch,
  getCompaniesAutoComplete: companyActions.getCompaniesAutoCompleteFetch,
  deleteCompany: companyActions.deleteCompanyFetch,
  getCompaniesAutoCompleteClear: companyActions.getCompaniesAutoCompleteClear,
  getCompanyDetailClear: companyActions.getCompanyDetailClear,
  createNewCompanyClear: companyActions.createNewCompanyClear,
  updateCompanyClear: companyActions.updateCompanyClear,
  deleteCompanyClear: companyActions.deleteCompanyClear,
};

export default connect(mapStateToProps, mapDispatchToProps)(MasterCompanies);
