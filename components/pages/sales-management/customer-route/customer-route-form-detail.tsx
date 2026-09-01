/* eslint-disable react-hooks/exhaustive-deps */
import { DeleteTwoTone, PlusOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import Card from "@sera-components/card";
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import { RootState } from "@sera-redux";
import {
  CustomerRouteState,
  customerRouteTypes,
} from "@sera-types/customer-route.type";
import { LoadingState } from "@sera-types/loading.type";
import {
  Col,
  Divider,
  Flex,
  Form,
  FormInstance,
  Row,
  Space,
  Switch,
} from "antd";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import CustomerRouteFormDetailLocation from "./customer-route-form-detail-location";

interface CustomerRouteFormDetailProps {
  type: "create" | "detail" | "update";
  form: FormInstance;

  loading: LoadingState;
  customerRoutes: CustomerRouteState;
}

const CustomerRouteFormDetail = ({
  type,
  form,
  loading,
  customerRoutes,
}: CustomerRouteFormDetailProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: "customerRoute.form" });
  const requiredMessage = t("input.message");

  return (
    <Form.List name="routes">
      {(routeFields, { add: addRoute, remove: removeRoute }) => (
        <>
          <div style={{ display: "flex", rowGap: 16, flexDirection: "column" }}>
            {routeFields.map(({ key, name, ...restField }, routeIndex) => (
              <Card
                key={key}
                title={`${t("input.routes.label")} ${type === "create" ? routeIndex + 1 : ""}`}
                extra={
                  type !== "detail" ? (
                    <Space>
                      <Button
                        id="delete-button"
                        size="large"
                        type="dashed"
                        tooltip="Remove Route"
                        disabled={routeFields.length === 1}
                        onClick={() => removeRoute(name)}
                        danger
                        icon={
                          <DeleteTwoTone
                            twoToneColor={
                              routeFields.length > 1 ? "#eb2f96" : "#bfbfbf"
                            }
                          />
                        }
                      />
                    </Space>
                  ) : null
                }
                styles={{
                  header: { background: "#F6F9FC", color: "#3A8DDB" },
                }}
              >
                <Row gutter={16}>
                  {type !== "create" ? (
                    <Col xs={24} sm={24} md={type === "detail" ? 4 : 5}>
                      <Form.Item
                        {...restField}
                        name={[name, "routeCode"]}
                        label={t("input.routes.routeCode.label")}
                      >
                        <Input
                          placeholder={t("input.routes.routeCode.placeholder")}
                          disabled
                        />
                      </Form.Item>
                    </Col>
                  ) : null}

                  <Col xs={24} sm={24} md={type === "create" ? 6 : 4}>
                    <Form.Item
                      {...restField}
                      name={[name, "revenue"]}
                      label={t("input.routes.revenue.label")}
                      rules={[
                        {
                          required: type !== "detail",
                          message: requiredMessage,
                        },
                        {
                          validator: (_, value) => {
                            if (!value) return Promise.resolve();

                            if (
                              Number(value) < 1 ||
                              Number(value) > 1000000000
                            ) {
                              return Promise.reject(
                                new Error(
                                  "Revenue must between 1 and 999.999.999",
                                ),
                              );
                            }
                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <Input
                        type="number"
                        placeholder={t("input.routes.revenue.placeholder")}
                        onlyNumber
                        displayCurrency
                        disabled={type === "detail"}
                      />
                    </Form.Item>
                  </Col>

                  {type === "detail" && (
                    <Col xs={24} sm={24} md={4}>
                      <Form.Item
                        {...restField}
                        name={[name, "cost"]}
                        label={t("input.routes.cost.label")}
                        rules={[
                          {
                            required: type !== "detail",
                            message: requiredMessage,
                          },
                          {
                            validator: (_, value) => {
                              if (!value) return Promise.resolve();

                              if (
                                Number(value) < 1 ||
                                Number(value) > 1000000000
                              ) {
                                return Promise.reject(
                                  new Error(
                                    "Cost must between 1 and 999.999.999",
                                  ),
                                );
                              }
                              return Promise.resolve();
                            },
                          },
                        ]}
                      >
                        <Input
                          type="number"
                          placeholder={t("input.routes.cost.placeholder")}
                          onlyNumber
                          displayCurrency
                          disabled={type === "detail"}
                        />
                      </Form.Item>
                    </Col>
                  )}

                  <Col xs={24} sm={24} md={type === "create" ? 8 : 6}>
                    <Form.Item
                      {...restField}
                      name={[name, "leadtimeValueGroup"]}
                      label={t("input.routes.leadTime.label")}
                      rules={[
                        {
                          required: type !== "detail",
                          message: requiredMessage,
                        },
                      ]}
                    >
                      <Row gutter={[16, 16]} align="middle">
                        <Col xs={24} sm={24} md={16}>
                          <Form.Item
                            {...restField}
                            noStyle
                            name={[name, "leadtimeValue"]}
                            rules={[
                              {
                                required: type !== "detail",
                                message: requiredMessage,
                              },
                            ]}
                          >
                            <Input
                              type="number"
                              placeholder={t(
                                "input.routes.leadTimeValue.placeholder",
                              )}
                              onlyNumber
                              disabled={type === "detail"}
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "leadtimeType"]}
                            noStyle
                          >
                            <Switch
                              {...(type === "detail"
                                ? {
                                    checked:
                                      customerRoutes?.detailCustomerRoute?.data
                                        ?.header?.leadtimeType === "Days",
                                  }
                                : {})}
                              checkedChildren="Days"
                              unCheckedChildren="Hours"
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={24} md={type === "create" ? 4 : 3}>
                    <Form.Item
                      {...restField}
                      label={t("input.routes.qtyDriver.label")}
                      name={[name, "qtyDriver"]}
                      rules={[
                        {
                          required: type !== "detail",
                          message: requiredMessage,
                        },
                        {
                          validator: (_, value) => {
                            if (!value) return Promise.resolve();

                            if (Number(value) < 1 || Number(value) > 2) {
                              return Promise.reject(
                                new Error("Qty driver must be 1 or 2"),
                              );
                            }
                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <Input
                        type="number"
                        placeholder={t("input.routes.qtyDriver.placeholder")}
                        onlyNumber
                        disableCurrency
                        disabled={type === "detail"}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={24} md={type === "create" ? 6 : 3}>
                    <Form.Item
                      {...restField}
                      label={t("input.routes.tollUsage.label")}
                      name={[name, "tollUsage"]}
                      rules={[
                        {
                          required: type !== "detail",
                          message: requiredMessage,
                        },
                      ]}
                    >
                      {type === "detail" ? (
                        <Input id="customer-route-input-toll-usage" disabled />
                      ) : (
                        <Select
                          id="customer-route-select-toll-usage"
                          placeholder={t("input.routes.tollUsage.placeholder")}
                          options={
                            customerRoutes?.dropdownTollUsages?.data?.map(
                              (_item) => ({
                                value: _item?.id,
                                label: _item?.name,
                              }),
                            ) ?? []
                          }
                          optionFilterProp="label"
                          loading={
                            loading[customerRouteTypes.GET_DROPDOWN_TOLL_USAGES]
                          }
                          allowClear={false}
                        />
                      )}
                    </Form.Item>
                  </Col>
                </Row>

                <Divider />

                <Row gutter={[8, 8]}>
                  <Col xs={24} sm={24} md={24}>
                    <Form.Item
                      {...restField}
                      label={t("input.routes.detail.label")}
                    >
                      <CustomerRouteFormDetailLocation
                        name={name}
                        type={type}
                        form={form}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            ))}
          </div>

          {type === "create" ? (
            <Flex justify="end" align="flex-end" style={{ margin: "2rem 0" }}>
              <Button
                type="dashed"
                onClick={() => {
                  addRoute({
                    leadtimeType: false,
                    details: [
                      { routeActivityType: false },
                      { routeActivityType: true },
                    ],
                  });
                }}
                disabled={routeFields?.length >= 10}
              >
                <PlusOutlined /> Add Route
              </Button>
            </Flex>
          ) : null}
        </>
      )}
    </Form.List>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  customerRoutes: state.customerRoutes,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CustomerRouteFormDetail);
