/* eslint-disable react-hooks/exhaustive-deps */
import Card from "@sera-components/card";
import RsFormBuilder from "@sera-components/rs-form-builder";
import Table from "@sera-components/table";
import { ChildConfig } from "@sera-libraries/types/formBuilderType";
import { RootState } from "@sera-redux";
import {
  CustomerContractMaterials,
  CustomerContractState,
} from "@sera-types/customer-contract.type";
import { DATE_FORMAT } from "@sera-utils/constants/common";
import { FormConfigHandler } from "@sera-utils/data-manipulator";
import { Divider, FormInstance } from "antd";
import { isEmpty } from "lodash";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import { ColumnsListMaterial } from "./customer-contract-props-table";

interface CustomerContractFormProps {
  type: "create" | "detail" | "update";
  form: FormInstance;
  loading: boolean;
  onSubmit: () => void;

  customerContracts: CustomerContractState;
}

const CustomerContractForm = ({
  type,
  form,
  loading,
  onSubmit,

  customerContracts,
}: CustomerContractFormProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "customerContract",
  });

  const FORM_CONFIG: ChildConfig[] = [
    {
      id: "cmdId",
      type: "text",
      name: "cmdId",
      label: t("form.input.cmdId.label"),
      placeholder: t("form.input.cmdId.placeholder"),
    },
    {
      id: "customerName",
      type: "text",
      name: "customerName",
      label: t("form.input.customerName.label"),
      placeholder: t("form.input.customerName.placeholder"),
    },
    {
      id: "contractNo",
      type: "text",
      name: "contractNo",
      label: t("form.input.contractNo.label"),
      placeholder: t("form.input.contractNo.placeholder"),
    },
    {
      id: "quotationSalesDocument",
      type: "text",
      name: "quotationSalesDocument",
      label: t("form.input.quotationSalesDocument.label"),
      placeholder: t("form.input.quotationSalesDocument.placeholder"),
    },
    {
      id: "quotationValidFromDate",
      type: "text",
      name: "quotationValidFromDate",
      label: t("form.input.quotationValidFromDate.label"),
      placeholder: t("form.input.quotationValidFromDate.placeholder"),
    },
    {
      id: "quotationValidToDate",
      type: "text",
      name: "quotationValidToDate",
      label: t("form.input.quotationValidToDate.label"),
      placeholder: t("form.input.quotationValidToDate.placeholder"),
    },
    {
      id: "quotationCreatedOn",
      type: "text",
      name: "quotationCreatedOn",
      label: t("form.input.quotationCreatedOn.label"),
      placeholder: t("form.input.quotationCreatedOn.placeholder"),
    },
    {
      id: "quotationCreatedBy",
      type: "text",
      name: "quotationCreatedBy",
      label: t("form.input.quotationCreatedBy.label"),
      placeholder: t("form.input.quotationCreatedBy.placeholder"),
    },
    {
      id: "startDate",
      type: "text",
      name: "startDate",
      label: t("form.input.startDate.label"),
      placeholder: t("form.input.startDate.placeholder"),
    },
    {
      id: "endDate",
      type: "text",
      name: "endDate",
      label: t("form.input.endDate.label"),
      placeholder: t("form.input.endDate.placeholder"),
    },
    {
      id: "createdDate",
      type: "text",
      name: "createdDate",
      label: t("form.input.createdDate.label"),
      placeholder: t("form.input.createdDate.placeholder"),
    },
    {
      id: "createdBy",
      type: "text",
      name: "createdBy",
      label: t("form.input.createdBy.label"),
      placeholder: t("form.input.createdBy.placeholder"),
    },
  ];

  useEffect(() => {
    form.resetFields();
  }, []);

  useEffect(() => {
    const _data = customerContracts?.detailContract?.data;
    if (isEmpty(_data)) return;

    form.setFieldsValue({
      ..._data,
      createdDate: DATE_FORMAT(_data?.createdDate),
      endDate: DATE_FORMAT(_data?.endDate),
      quotationCreatedOn: DATE_FORMAT(_data?.quotationCreatedOn),
      quotationValidFromDate: DATE_FORMAT(_data?.quotationValidFromDate),
      quotationValidToDate: DATE_FORMAT(_data?.quotationValidToDate),
      startDate: DATE_FORMAT(_data?.startDate),
    });
  }, [customerContracts?.detailContract?.data]);

  return (
    <Card title={t("form.title.detail")}>
      <RsFormBuilder
        name="form-customer"
        layout="vertical"
        form={form}
        type={type}
        configs={FormConfigHandler(FORM_CONFIG, type === "detail")}
        onFinish={onSubmit}
        loading={loading}
        disabled={loading}
        isHideFormButton
      />

      <Divider />

      <Card>
        <Table
          title={t("table.material.title")}
          columns={ColumnsListMaterial()}
          dataSource={customerContracts?.detailContract?.data?.materials ?? []}
          rowKey={(row: CustomerContractMaterials) => `${row.vehicleTypeId}`}
          scroll={{ x: "max-content" }}
          loading={loading}
        />
      </Card>
    </Card>
  );
};

const mapStateToProps = (state: RootState) => ({
  customerContracts: state.customerContracts,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CustomerContractForm);
