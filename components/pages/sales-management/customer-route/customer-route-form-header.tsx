/* eslint-disable simple-import-sort/imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  DownloadOutlined,
  LoadingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import Button from "@sera-components/button";
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import Typography from "@sera-components/typography";
import MessageHandler from "@sera-libraries/message-handler";
import {
  customerActions,
  customerContractActions,
  customerLocationActions,
  customerRouteActions,
  RootState,
} from "@sera-redux";
import {
  CustomerContractState,
  customerContractTypes,
} from "@sera-types/customer-contract.type";
import {
  CustomerRouteState,
  customerRouteTypes,
} from "@sera-types/customer-route.type";
import { CustomerState, customerTypes } from "@sera-types/customer.type";
import { LoadingState } from "@sera-types/loading.type";
import { Col, Form, FormInstance, Row, Spin, Upload } from "antd";
import { RcFile, UploadFile } from "antd/es/upload";
import { isEmpty } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

const PAYLOAD = { page: 1, limit: 10 };

interface CustomerRouteFormHeaderProps {
  type: "create" | "detail" | "update";
  form: FormInstance;

  loading: LoadingState;
  customers: CustomerState;
  customerContracts: CustomerContractState;
  customerRoutes: CustomerRouteState;
  getCustomers: typeof customerActions.getCustomersFetch;
  getContracts: typeof customerContractActions.getContractsFetch;
  getDetailContract: typeof customerContractActions.getDetailContractFetch;
  getCustomerLocations: typeof customerLocationActions.getCustomerLocationsFetch;
  uploadQuotation: typeof customerRouteActions.uploadQuotationFetch;
  downloadQuotation: typeof customerRouteActions.downloadQuotationFetch;
  getContractsClear: typeof customerContractActions.getContractsClear;
  getDetailContractClear: typeof customerContractActions.getDetailContractClear;
  getCustomerLocationsClear: typeof customerLocationActions.getCustomerLocationsClear;
  uploadQuotationClear: typeof customerRouteActions.uploadQuotationClear;
}

const CustomerRouteFormHeader = ({
  type,
  form,
  loading,
  customers,
  customerContracts,
  customerRoutes,
  getCustomers,
  getContracts,
  getDetailContract,
  getCustomerLocations,
  uploadQuotation,
  downloadQuotation,
  getContractsClear,
  getDetailContractClear,
  getCustomerLocationsClear,
  uploadQuotationClear,
}: CustomerRouteFormHeaderProps) => {
  const router = useRouter();
  const { t } = useTranslation(undefined, { keyPrefix: "customerRoute.form" });
  const requiredMessage = t("input.message");

  const { id } = router.query;

  const [activeCustomer, setActiveCustomer] = useState("");
  const [activeContract, setActiveContract] = useState("");

  const [file, setFile] = useState<RcFile | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const onHandleBeforeUpload = (file: any) => {
    setFile(null);
    setFileList([]);

    const isValidSize = file.size / 1024 / 1024 < 5;

    if (!isValidSize) {
      MessageHandler().error({ content: "File size must be less than 5MB!" });
      return Upload.LIST_IGNORE;
    }

    setFile(file);
    uploadQuotation({ file });
    return false;
  };

  const onHandleDownload = (file: any) => {
    if (loading[customerRouteTypes.DONWLOAD_QUOTATION]) return;

    downloadQuotation({
      id: id as string,
      fileName: file?.url.split("/").pop() || "",
    });
  };

  useEffect(() => {
    const _data = customerRoutes?.detailCustomerRoute?.data;
    if (type === "create" || isEmpty(_data)) return;

    if (type === "update") {
      setActiveCustomer(_data?.header?.customerId ?? "");
      setActiveContract(_data?.header?.contractId ?? "");
    }

    setFileList([
      {
        uid: "",
        name: _data?.header?.quotationURL?.split("/").pop() || "",
        status: "done",
        url: _data?.header?.quotationURL,
        originFileObj: undefined,
      },
    ]);
  }, [customerRoutes?.detailCustomerRoute?.data]);

  useEffect(() => {
    const _data = customerRoutes?.uploadQuotation?.data;
    if (isEmpty(_data)) return;

    if (file) setFileList([file]);
    form.setFieldValue("quotationURL", _data?.quotationURL);
    uploadQuotationClear();
  }, [customerRoutes?.uploadQuotation?.data]);

  useEffect(() => {
    const _error = customerRoutes?.uploadQuotation?.error;
    if (isEmpty(_error)) return;

    form.resetFields(["quotationURL"]);
    uploadQuotationClear();
  }, [customerRoutes?.uploadQuotation?.error]);

  return (
    <Row gutter={16}>
      <Col xs={24} sm={24} md={6}>
        <Form.Item
          name="customerId"
          label={t("input.customerId.label")}
          rules={[{ required: type === "create", message: requiredMessage }]}
        >
          {type === "detail" ? (
            <Input id="customerId" disabled />
          ) : (
            <Select
              id="customer-route-select-customer-id"
              placeholder={t("input.customerId.placeholder")}
              filterOption={false}
              options={
                customers?.data?.list?.map((_item) => ({
                  value: _item?.id,
                  label: _item?.name,
                })) ?? []
              }
              disabled={
                type === "update" ||
                loading[customerRouteTypes.GET_DETAIL_CUSTOMER_ROUTE]
              }
              onSearch={(_value) => {
                getCustomers({ ...PAYLOAD, searchBy: "name", search: _value });
              }}
              onClear={() => getCustomers(PAYLOAD)}
              onChange={(_value) => {
                setActiveCustomer(_value);
                setActiveContract("");

                getContractsClear();
                getDetailContractClear();
                getCustomerLocationsClear();

                form.resetFields(["routes", "contractNo", "vehicleTypeId"]);
                form.setFieldsValue({
                  routes: [
                    {
                      leadtimeValueGroup: "required",
                      leadtimeType: false,
                      details: [
                        { routeActivityType: false },
                        { routeActivityType: true },
                      ],
                    },
                  ],
                });

                getContracts({ ...PAYLOAD, customerId: _value });
                getCustomerLocations({ ...PAYLOAD, customerId: _value });
              }}
              notFoundContent={
                loading[customerTypes.GET_CUSTOMERS] ? (
                  <Spin size="small" />
                ) : (
                  <Typography.Text variant="muted" fontSize={12}>
                    No results found
                  </Typography.Text>
                )
              }
              allowClear={false}
            />
          )}
        </Form.Item>
      </Col>

      <Col xs={24} sm={24} md={6}>
        <Form.Item
          name="contractNo"
          label={t("input.contractNo.label")}
          rules={[{ required: type !== "detail", message: requiredMessage }]}
        >
          {type === "detail" ? (
            <Input id="contractNo" disabled />
          ) : (
            <Select
              id="customer-route-select-contract-no"
              placeholder={t("input.contractNo.placeholder")}
              filterOption={false}
              options={
                customerContracts?.data?.map((_item) => ({
                  value: _item?.id,
                  label: _item?.contractNo,
                })) ?? []
              }
              disabled={!Boolean(activeCustomer)}
              onSearch={(_value) => {
                getContracts({
                  ...PAYLOAD,
                  searchBy: "contractNo",
                  search: _value,
                  customerId: activeCustomer,
                });
              }}
              onChange={(_value) => {
                setActiveContract(_value);

                getDetailContractClear();

                form.resetFields(["vehicleTypeId"]);

                getDetailContract({ id: _value });
              }}
              notFoundContent={
                loading[customerContractTypes.GET_CONTRACTS] ? (
                  <Spin size="small" />
                ) : (
                  <Typography.Text variant="muted" fontSize={12}>
                    No results found
                  </Typography.Text>
                )
              }
              allowClear={false}
            />
          )}
        </Form.Item>
      </Col>

      <Col xs={24} sm={24} md={6}>
        <Form.Item
          name="vehicleTypeId"
          label={t("input.vehicleTypeId.label")}
          rules={[{ required: type !== "detail", message: requiredMessage }]}
        >
          {type === "detail" ? (
            <Input id="vehicleTypeId" disabled />
          ) : (
            <Select
              id="customer-route-select-vehicle-type-id"
              placeholder={t("input.vehicleTypeId.placeholder")}
              options={
                customerContracts?.detailContract?.data?.materials?.map(
                  (_item) => ({
                    value: _item?.vehicleTypeId,
                    label: _item?.vehicleTypeName,
                  }),
                ) ?? []
              }
              optionFilterProp="label"
              disabled={!Boolean(activeContract)}
              notFoundContent={
                loading[customerContractTypes.GET_DETAIL_CONTRACT] ? (
                  <Spin size="small" />
                ) : (
                  <Typography.Text variant="muted" fontSize={12}>
                    No results found
                  </Typography.Text>
                )
              }
            />
          )}
        </Form.Item>
      </Col>

      <Col xs={24} sm={24} md={6}>
        <Form.Item
          name="quotationURL"
          label={t("input.quotationFile.label")}
          rules={[{ required: type !== "detail", message: requiredMessage }]}
        >
          <Upload
            accept=".pdf,.jpg,.jpeg,.png"
            fileList={fileList}
            maxCount={1}
            beforeUpload={onHandleBeforeUpload}
            showUploadList={{
              showRemoveIcon: false,
              showDownloadIcon: type !== "create",
              downloadIcon: () => {
                if (loading[customerRouteTypes.DONWLOAD_QUOTATION]) {
                  return <LoadingOutlined style={{ fontSize: 16 }} />;
                }

                return <DownloadOutlined style={{ fontSize: 16 }} />;
              },
            }}
            onPreview={() => {}}
            onDownload={onHandleDownload}
            disabled={loading[customerRouteTypes.UPLOAD_QUOTATION]}
          >
            <Button
              icon={<UploadOutlined />}
              disabled={type === "detail"}
              loading={loading[customerRouteTypes.UPLOAD_QUOTATION]}
            >
              Click to Upload
            </Button>
          </Upload>
        </Form.Item>
      </Col>
    </Row>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  customers: state.customers,
  customerContracts: state.customerContracts,
  customerRoutes: state.customerRoutes,
});

const mapDispatchToProps = {
  getCustomers: customerActions.getCustomersFetch,
  getContracts: customerContractActions.getContractsFetch,
  getDetailContract: customerContractActions.getDetailContractFetch,
  getCustomerLocations: customerLocationActions.getCustomerLocationsFetch,
  uploadQuotation: customerRouteActions.uploadQuotationFetch,
  downloadQuotation: customerRouteActions.downloadQuotationFetch,
  getContractsClear: customerContractActions.getContractsClear,
  getDetailContractClear: customerContractActions.getDetailContractClear,
  getCustomerLocationsClear: customerLocationActions.getCustomerLocationsClear,
  uploadQuotationClear: customerRouteActions.uploadQuotationClear,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CustomerRouteFormHeader);
