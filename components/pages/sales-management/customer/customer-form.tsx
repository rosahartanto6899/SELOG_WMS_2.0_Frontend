/* eslint-disable react-hooks/exhaustive-deps */
import Card from "@sera-components/card";
import RsFormBuilder from "@sera-components/rs-form-builder";
import Table from "@sera-components/table";
import { ChildConfig } from "@sera-libraries/types/formBuilderType";
import { customerActions, RootState } from "@sera-redux";
import { BusinessAreaState } from "@sera-types/business-area.type";
import {
  CustomerContact,
  CustomerSales,
  CustomerState,
  customerTypes,
} from "@sera-types/customer.type";
import { LoadingState } from "@sera-types/loading.type";
import { FormConfigHandler } from "@sera-utils/data-manipulator";
import { setFormErrorHandle } from "@sera-utils/error-handler";
import { Col, Divider, FormInstance, Row } from "antd";
import { isEmpty } from "lodash";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import CustomerFormSales from "./customer-form-sales";
import { ContactColumns, SalesColumns } from "./customer-props-table";

interface ActionFormProps {
  type: "detail" | "update";
  form: FormInstance;
  loading: boolean;
  onSubmit: () => void;

  loadingState: LoadingState;
  businessAreas: BusinessAreaState;
  customers: CustomerState;
  getDropdownAddReq: typeof customerActions.getDropdownAddReqFetch;
  getDropdownPOD: typeof customerActions.getDropdownPODFetch;
  deleteSales: typeof customerActions.deleteSalesFetch;
}

const ActionForm = ({
  type,
  form,
  loading,
  onSubmit,

  loadingState,
  customers,
  getDropdownAddReq,
  getDropdownPOD,
  deleteSales,
}: ActionFormProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: "customer.form" });

  const messageRequired = t("message.required");

  const FORM_CONFIG: ChildConfig[] = [
    {
      id: "cmd",
      type: "text",
      name: "cmd",
      label: t("input.cmd.label"),
      disabled: true,
    },
    {
      id: "name",
      type: "text",
      name: "name",
      label: t("input.name.label"),
      disabled: true,
    },
    {
      id: "street",
      type: "text",
      name: "street",
      label: t("input.street.label"),
      disabled: true,
    },
    {
      id: "city",
      type: "text",
      name: "city",
      label: t("input.city.label"),
      disabled: true,
    },
    {
      id: "phone",
      type: "text",
      name: "phone",
      label: t("input.phone.label"),
      disabled: true,
    },
    {
      id: "email",
      type: "text",
      name: "email",
      label: t("input.email.label"),
      disabled: true,
    },
    {
      id: "industry",
      type: "text",
      name: "industry",
      label: t("input.industry.label"),
      disabled: true,
    },
    {
      id: "category",
      type: "text",
      name: "category",
      label: t("input.category.label"),
      disabled: true,
    },
    {
      id: "termOfPayment",
      type: "text",
      name: "termOfPayment",
      label: t("input.termOfPayment.label"),
      disabled: true,
    },
    {
      id: "status",
      type: "text",
      name: "status",
      label: t("input.status.label"),
      disabled: true,
    },
    {
      id: "additionalRequests",
      type: "checkbox",
      name: "additionalRequests",
      label: t("input.additionalRequests.label"),
      columns: { xs: 24, md: 12, xl: 8 },
      options: customers?.dropdownAddReq?.data?.map((_item) => ({
        value: _item?.id,
        label: _item?.name,
      })),
      loading: loadingState[customerTypes.GET_DROPDOWN_ADD_REQ],
    },
    {
      id: "isPhysicalPOD",
      type: "checkbox",
      name: "isPhysicalPOD",
      label: t("input.pod.label"),
      columns: { xs: 24, md: 12, xl: 8 },
      options: customers?.dropdownPOD?.data?.map((_item) => ({
        value: _item?.id,
        label: _item?.name,
      })),
      rules: [{ required: true, message: messageRequired }],
      loading: loadingState[customerTypes.GET_DROPDOWN_POD],
    },
  ];

  useEffect(() => {
    form.resetFields();

    getDropdownAddReq();
    getDropdownPOD();
  }, []);

  useEffect(() => {
    const _data = customers?.detailCustomer?.data;
    if (isEmpty(_data)) return;

    form.setFieldsValue({
      ..._data,
      isPhysicalPOD: [
        _data?.isPhysicalPOD ? "physical-pod" : null,
        _data?.isEPOD ? "e-pod" : null,
      ],
    });
  }, [customers.detailCustomer.data]);

  useEffect(() => {
    setFormErrorHandle(form, customers?.updateCustomer?.error);
  }, [customers?.updateCustomer?.error]);

  return (
    <Card
      {...(type === "detail" ? { title: t("title.read") } : {})}
      {...(type === "update" ? { title: t("title.edit") } : {})}
    >
      <RsFormBuilder
        name="form-customer"
        layout="vertical"
        form={form}
        type={type}
        configs={FormConfigHandler(FORM_CONFIG, type === "detail")}
        onFinish={onSubmit}
        loading={loading}
        disabled={loading}
        isHideFormButton={type === "detail"}
      />

      <Divider />

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            {type === "update" ? (
              <Col span={24}>
                <CustomerFormSales />
              </Col>
            ) : null}

            <Table
              title={t("sales.table.title")}
              columns={SalesColumns({
                isRead: type === "detail",
                onDeleteAction: (_id) => deleteSales({ id: _id }),
              })}
              dataSource={customers?.customerSales?.data ?? []}
              total={customers?.customerSales?.options?.totalData || 0}
              current={customers?.customerSales?.options?.page || 1}
              pageSize={customers?.customerSales?.options?.limit || 10}
              rowKey={(row: CustomerSales) => `${row.no}`}
              onPageChange={() => {}}
              scroll={{ x: "max-content" }}
              loading={
                loadingState[customerTypes.GET_CUSTOMER_SALES] ||
                loadingState[customerTypes.DELETE_SALES]
              }
            />
          </Card>
        </Col>

        <Col span={24}>
          <Card>
            <Table
              title={t("contact.table.title")}
              columns={ContactColumns()}
              dataSource={customers?.customerContacts?.data ?? []}
              total={customers?.customerContacts?.options?.totalData || 0}
              current={customers?.customerContacts?.options?.page || 1}
              pageSize={customers?.customerContacts?.options?.limit || 10}
              rowKey={(row: CustomerContact) => `${row.no}`}
              onPageChange={() => {}}
              scroll={{ x: "max-content" }}
              loading={loadingState[customerTypes.GET_CUSTOMER_CONTACTS]}
            />
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

const mapStateToProps = (state: RootState) => ({
  loadingState: state.loading,
  businessAreas: state.businessAreas,
  customers: state.customers,
});

const mapDispatchToProps = {
  getDropdownAddReq: customerActions.getDropdownAddReqFetch,
  getDropdownPOD: customerActions.getDropdownPODFetch,
  deleteSales: customerActions.deleteSalesFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionForm);
