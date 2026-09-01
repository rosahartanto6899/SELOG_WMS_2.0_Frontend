/* eslint-disable react-hooks/exhaustive-deps */
import Button from "@sera-components/button";
import Card from "@sera-components/card";
import Error404 from "@sera-components/error-boundary/Error404";
import {
  customerActions,
  customerContractActions,
  customerLocationActions,
  customerRouteActions,
  RootState,
} from "@sera-redux";
import {
  CustomerRouteState,
  customerRouteTypes,
} from "@sera-types/customer-route.type";
import { LoadingState } from "@sera-types/loading.type";
import Utils from "@sera-utils/utils";
import { Col, Form, FormInstance, Row } from "antd";
import { isEmpty } from "lodash";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import CustomerRouteFormDetail from "./customer-route-form-detail";
import CustomerRouteFormHeader from "./customer-route-form-header";

const PAYLOAD = { page: 1, limit: 10 };

interface CustomerRouteFormProps {
  type: "create" | "detail" | "update";
  form: FormInstance;
  loading?: boolean;
  onSubmit?: () => void;

  loadingState: LoadingState;
  customerRoutes: CustomerRouteState;
  getCustomers: typeof customerActions.getCustomersFetch;
  getContracts: typeof customerContractActions.getContractsFetch;
  getDetailContract: typeof customerContractActions.getDetailContractFetch;
  getCustomerLocations: typeof customerLocationActions.getCustomerLocationsFetch;
  getDropdownTollUsages: typeof customerRouteActions.getDropdownTollUsagesFetch;
}

const CustomerRouteForm = ({
  type,
  form,
  loading,
  onSubmit,

  loadingState,
  customerRoutes,
  getCustomers,
  getContracts,
  getDetailContract,
  getCustomerLocations,
  getDropdownTollUsages,
}: CustomerRouteFormProps) => {
  const router = useRouter();
  const { t } = useTranslation(undefined, { keyPrefix: "customerRoute.form" });

  const onGoBack = () => {
    Utils().onGoBack(router, "/sales-management/customer-route");
  };

  const IS_LOADING =
    loadingState[customerRouteTypes.GET_DROPDOWN_LEAD_TIME_TYPES] ||
    loadingState[customerRouteTypes.GET_DROPDOWN_TOLL_USAGES];

  useEffect(() => {
    form.resetFields();

    getDropdownTollUsages();

    if (type === "detail") return;

    getCustomers(PAYLOAD);
  }, []);

  useEffect(() => {
    const _data = customerRoutes?.detailCustomerRoute?.data;
    const _tollUsage = customerRoutes?.dropdownTollUsages?.data;

    if (type === "create" || isEmpty(_data)) return;

    if (_data?.header?.customerName) {
      getContracts({
        ...PAYLOAD,
        customerId: _data?.header?.customerId,
      });

      getCustomerLocations({
        ...PAYLOAD,
        customerId: _data?.header?.customerId,
      });
    }

    if (_data?.header?.contractId) {
      getDetailContract({ id: _data?.header?.contractId });
    }

    const ROUTES = {
      routeCode: _data?.header?.routeCode,
      revenue: _data?.header?.revenuePerShipment,
      cost: _data?.header?.cost,
      leadtimeValueGroup: "required",
      leadtimeValue: _data?.header?.leadtimeValue,
      qtyDriver: _data?.header?.qtyDriver,
      leadtimeType: _data?.header?.leadtimeType === "Days",
      tollUsage: _data?.header?.tollUsage as unknown,
      details: _data?.details?.map((_item) => ({
        routeActivityType: _item?.routeActivityType === "Unloading",
        address: _item?.locationAddress || " ",
        province: _item?.locationProvince || " ",
        city: _item?.locationCity || " ",
        district: _item?.locationDistrict || " ",
        ...(type === "update"
          ? {
              id: _item?.customerRouteDetailId,
              customerLocation: _item?.locationId,
              customerLocationId: _item?.locationName,
            }
          : { customerLocationId: _item?.locationName }),
      })),
    };

    if (type === "detail" && !isEmpty(_tollUsage)) {
      ROUTES.tollUsage =
        _tollUsage?.find((_item) => _item?.id === _data?.header?.tollUsage)
          ?.name ?? "";
    }

    form.setFieldsValue({
      customerId: _data?.header?.customerName,
      quotationURL: _data?.header?.quotationURL,
      routes: [ROUTES],
      ...(type === "update"
        ? {
            contractNo: _data?.header?.contractId,
            vehicleTypeId: _data?.header?.vehicleTypeId,
          }
        : {
            contractNo: _data?.header?.contractNo,
            vehicleTypeId: _data?.header?.vehicleTypeName,
          }),
    });
  }, [
    customerRoutes?.detailCustomerRoute?.data,
    customerRoutes?.dropdownTollUsages?.data,
  ]);

  if (!isEmpty(customerRoutes?.detailCustomerRoute?.error)) return <Error404 />;

  return (
    <Card
      {...(type === "create" ? { title: t("title.create") } : {})}
      {...(type === "detail" ? { title: t("title.read") } : {})}
      {...(type === "update" ? { title: t("title.edit") } : {})}
    >
      <Form
        name="form-customer-route"
        layout="vertical"
        form={form}
        autoComplete="off"
        disabled={IS_LOADING || loading}
        initialValues={{
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
        }}
      >
        <CustomerRouteFormHeader type={type} form={form} />

        <Row gutter={16} style={{ marginTop: 24 }}>
          <Col xs={24} sm={24} md={24}>
            <CustomerRouteFormDetail type={type} form={form} />
          </Col>
        </Row>

        <Row justify="end" gutter={[8, 8]} style={{ margin: "2rem 0" }}>
          <Col>
            <Button
              id="cancel"
              className="ant-btn-custom secondary"
              onClick={onGoBack}
              disabled={loading}
            >
              {t("button.cancel")}
            </Button>
          </Col>

          {type !== "detail" ? (
            <Col>
              <Button
                id="save"
                type="primary"
                htmlType="submit"
                className="ant-btn-custom primary"
                loading={loading}
                onClick={onSubmit}
              >
                {t("button.save")}
              </Button>
            </Col>
          ) : null}
        </Row>
      </Form>
    </Card>
  );
};

const mapStateToProps = (state: RootState) => ({
  loadingState: state.loading,
  customerRoutes: state.customerRoutes,
});

const mapDispatchToProps = {
  getCustomers: customerActions.getCustomersFetch,
  getContracts: customerContractActions.getContractsFetch,
  getDetailContract: customerContractActions.getDetailContractFetch,
  getCustomerLocations: customerLocationActions.getCustomerLocationsFetch,
  getDropdownTollUsages: customerRouteActions.getDropdownTollUsagesFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerRouteForm);
