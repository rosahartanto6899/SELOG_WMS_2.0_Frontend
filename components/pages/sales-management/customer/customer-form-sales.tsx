/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import Button from "@sera-components/button";
import Select from "@sera-components/select";
import MessageHandler from "@sera-libraries/message-handler";
import { businessAreaActions, customerActions, RootState } from "@sera-redux";
import {
  BusinessAreaState,
  businessAreaTypes,
} from "@sera-types/business-area.type";
import { CustomerState, customerTypes } from "@sera-types/customer.type";
import { LoadingState } from "@sera-types/loading.type";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Col, Form, Row } from "antd";
import { isEmpty } from "lodash";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface CustomerFormSalesProps {
  loading: LoadingState;
  businessAreas: BusinessAreaState;
  customers: CustomerState;
  getDropdownBusinessAreas: typeof businessAreaActions.getDropdownBusinessAreasFetch;
  getDropdownSales: typeof customerActions.getDropdownSalesFetch;
  createSales: typeof customerActions.createSalesFetch;
}

const CustomerFormSales = ({
  loading,
  businessAreas,
  customers,
  getDropdownBusinessAreas,
  getDropdownSales,
  createSales,
}: CustomerFormSalesProps) => {
  const router = useRouter();
  const { t } = useTranslation(undefined, {
    keyPrefix: "customer.form.sales.form",
  });

  const [form] = Form.useForm();
  const { id } = router.query;

  const messageRequired = t("input.message.required");

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/fleet-management/unit-activity/add");

  const onHandleCreateSales = () => {
    form
      .validateFields()
      .then((_values) => {
        try {
          createSales({
            ..._values,
            customerId: id,
          });
        } catch (_error: any) {
          sendErrorHandlerApi(
            "onHandleCreateSales",
            44,
            isApiResponse(_error) ? _error : _error?.data?.message,
          );
        }
      })
      .catch((_error: any) => {
        const messageHandler = MessageHandler();
        const errorHandler = messageHandler.error({ content: t("message") });

        sendErrorHandler(
          "onHandleCreateSales",
          44,
          isApiResponse(_error) ? _error : "Validation form not pass",
          errorHandler,
        );
      });
  };

  useEffect(() => {
    form.resetFields();

    getDropdownBusinessAreas({});
    getDropdownSales();
  }, []);

  useEffect(() => {
    if (isEmpty(customers?.dropdownSales?.data)) return;

    const _data = customers?.dropdownSales?.data?.find(
      (_item) => _item.name === "Non-Commissionable",
    );

    if (_data) {
      form.setFieldsValue({
        salesDealing: _data?.id,
        salesServicing: _data?.id,
      });
    }
  }, [customers?.dropdownSales?.data]);

  useEffect(() => {
    if (!isEmpty(customers?.createSales?.data)) return;
    form.resetFields();

    if (isEmpty(customers?.dropdownSales?.data)) return;

    const _data = customers?.dropdownSales?.data?.find(
      (_item) => _item.name === "Non-Commissionable",
    );

    if (_data) {
      form.setFieldsValue({
        salesDealing: _data?.id,
        salesServicing: _data?.id,
      });
    }
  }, [customers?.createSales?.data, customers?.dropdownSales?.data]);

  return (
    <Form
      layout="vertical"
      form={form}
      disabled={
        loading[businessAreaTypes.GET_DROPDOWN_BUSINESS_AREAS] ||
        loading[customerTypes.GET_DROPDOWN_SALES] ||
        loading[customerTypes.CREATE_SALES]
      }
      onFinish={onHandleCreateSales}
    >
      <Row gutter={[16, 8]}>
        <Col xs={24} lg={7}>
          <Form.Item
            name="branchId"
            label={t("input.branchId.label")}
            rules={[{ required: true, message: messageRequired }]}
          >
            <Select
              placeholder={t("input.branchId.placeholder")}
              options={
                businessAreas?.dropdownBusinessAreas?.data?.map((_item) => ({
                  value: _item?.id,
                  label: _item?.name,
                })) ?? []
              }
              optionFilterProp="label"
              loading={loading[businessAreaTypes.GET_DROPDOWN_BUSINESS_AREAS]}
            />
          </Form.Item>
        </Col>

        <Col xs={24} lg={7}>
          <Form.Item
            name="salesDealing"
            label={t("input.salesDealing.label")}
            rules={[{ required: true, message: messageRequired }]}
          >
            <Select
              placeholder={t("input.salesDealing.placeholder")}
              options={
                customers?.dropdownSales?.data?.map((_item) => ({
                  value: _item?.id,
                  label: _item?.name,
                })) ?? []
              }
              optionFilterProp="label"
              loading={loading[customerTypes.GET_DROPDOWN_SALES]}
            />
          </Form.Item>
        </Col>

        <Col xs={24} lg={7}>
          <Form.Item
            name="salesServicing"
            label={t("input.salesServicing.label")}
            rules={[{ required: true, message: messageRequired }]}
          >
            <Select
              placeholder={t("input.salesServicing.placeholder")}
              options={
                customers?.dropdownSales?.data?.map((_item) => ({
                  value: _item?.id,
                  label: _item?.name,
                })) ?? []
              }
              optionFilterProp="label"
              loading={loading[customerTypes.GET_DROPDOWN_SALES]}
            />
          </Form.Item>
        </Col>

        <Col xs={24} lg={3}>
          <Form.Item label=" ">
            <Button
              htmlType="submit"
              type="primary"
              loading={loading[customerTypes.CREATE_SALES]}
              block
            >
              {t("button.save")}
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  businessAreas: state.businessAreas,
  customers: state.customers,
});

const mapDispatchToProps = {
  getDropdownBusinessAreas: businessAreaActions.getDropdownBusinessAreasFetch,
  getDropdownSales: customerActions.getDropdownSalesFetch,
  createSales: customerActions.createSalesFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerFormSales);
