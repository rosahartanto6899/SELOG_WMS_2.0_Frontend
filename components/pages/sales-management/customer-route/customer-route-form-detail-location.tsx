/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  DeleteTwoTone,
  DownCircleTwoTone,
  PlusOutlined,
  UpCircleTwoTone,
} from "@ant-design/icons";
import Button from "@sera-components/button";
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import Typography from "@sera-components/typography";
import { customerLocationActions, RootState } from "@sera-redux";
import {
  CustomerLocationState,
  customerLocationTypes,
} from "@sera-types/customer-location.type";
import { CustomerRouteState } from "@sera-types/customer-route.type";
import { LoadingState } from "@sera-types/loading.type";
import { Col, Flex, Form, FormInstance, Row, Spin, Switch } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

const PAYLOAD = { page: 1, limit: 10 };

interface CustomerRouteFormDetailLocationProps {
  name: number;
  type: string;
  form: FormInstance;
  loading: LoadingState;
  customerLocations: CustomerLocationState;
  customerRoutes: CustomerRouteState;
  getCustomerLocations: typeof customerLocationActions.getCustomerLocationsFetch;
}

const CustomerRouteFormDetailLocation = ({
  name,
  type,
  form,
  loading,
  customerLocations,
  customerRoutes,
  getCustomerLocations,
}: CustomerRouteFormDetailLocationProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "customerRoute.form",
  });
  const requiredMessage = t("input.message");

  const [isTrigger, setIsTrigger] = useState(true);

  useEffect(() => {
    if (!isTrigger) return;

    const _details = form.getFieldValue(["routes", name, "details"]) || [];
    if (!_details.length) return;

    _details.forEach((_: any, index: number) => {
      form.setFieldValue(
        ["routes", name, "details", index, "routeActivityType"],
        index === 0
          ? false
          : index === _details.length - 1
            ? true
            : (_details[index]?.routeActivityType ?? false),
      );
    });

    setIsTrigger(false);
  }, [isTrigger]);

  return (
    <Form.List name={[name, "details"]}>
      {(
        detailFields,
        { add: addDetail, remove: removeDetail, move: moveDetail },
      ) => {
        return (
          <div style={{ display: "flex", flexDirection: "column", rowGap: 16 }}>
            {detailFields.map(
              (
                { key: stopKey, name: stopName, ...restStopField },
                stopIndex,
              ) => (
                <Row gutter={[8, 8]} key={stopKey}>
                  <Form.Item
                    {...restStopField}
                    name={[stopName, "id"]}
                    preserve
                    noStyle
                  />

                  <Form.Item
                    {...restStopField}
                    name={[stopName, "customerLocation"]}
                    preserve
                    noStyle
                  />

                  <Col xs={24} sm={24} md={6}>
                    <Form.Item
                      {...restStopField}
                      label={t("input.routes.detail.customerLocationId.label")}
                    >
                      <Row gutter={[8, 8]} align="middle">
                        <Col xs={24} md={10}>
                          <Form.Item
                            {...restStopField}
                            name={[stopName, "routeActivityType"]}
                          >
                            <Switch
                              {...(type === "detail"
                                ? {
                                    checked:
                                      customerRoutes?.detailCustomerRoute?.data
                                        ?.details?.[stopIndex]
                                        ?.routeActivityType === "Unloading",
                                  }
                                : {})}
                              disabled={
                                stopIndex === 0 ||
                                stopIndex === detailFields?.length - 1
                              }
                              checkedChildren="Destination"
                              unCheckedChildren="Origin"
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} md={14}>
                          <Form.Item
                            {...restStopField}
                            name={[stopName, "customerLocationId"]}
                            rules={[
                              {
                                required: type !== "detail",
                                message: requiredMessage,
                              },
                            ]}
                          >
                            {type === "detail" ? (
                              <Input id="customerLocationId" disabled />
                            ) : (
                              <Select
                                placeholder={t(
                                  "input.routes.detail.customerLocationId.placeholder",
                                )}
                                filterOption={false}
                                options={
                                  customerLocations?.data?.map((_item) => ({
                                    value: _item?.id,
                                    label: _item?.name,
                                  })) ?? []
                                }
                                loading={
                                  loading[
                                    customerLocationTypes.GET_CUSTOMER_LOCATIONS
                                  ]
                                }
                                onSearch={(_value) => {
                                  getCustomerLocations({
                                    ...PAYLOAD,
                                    customerId:
                                      form.getFieldValue("customerId"),
                                    searchBy: "name",
                                    search: _value,
                                  });
                                }}
                                onClear={() => {
                                  getCustomerLocations({
                                    ...PAYLOAD,
                                    customerId:
                                      form.getFieldValue("customerId"),
                                  });
                                }}
                                onChange={(_value) => {
                                  const _data = customerLocations?.data?.find(
                                    (_item) => _item?.id === _value,
                                  );

                                  [
                                    {
                                      key: "customerLocation",
                                      value: _data?.id,
                                    },
                                    {
                                      key: "customerLocationId",
                                      value: _data?.name,
                                    },
                                    {
                                      key: "address",
                                      value: _data?.address,
                                    },
                                    {
                                      key: "province",
                                      value: _data?.province?.name,
                                    },
                                    {
                                      key: "city",
                                      value: _data?.city?.name,
                                    },
                                    {
                                      key: "district",
                                      value: _data?.district?.name,
                                    },
                                  ]?.forEach((_item) => {
                                    form.setFieldValue(
                                      [
                                        "routes",
                                        name,
                                        "details",
                                        stopName,
                                        _item?.key,
                                      ],
                                      _item?.value,
                                    );
                                  });

                                  getCustomerLocations({
                                    ...PAYLOAD,
                                    customerId:
                                      form.getFieldValue("customerId"),
                                  });
                                }}
                                notFoundContent={
                                  loading[
                                    customerLocationTypes
                                      .CREATE_CUSTOMER_LOCATION
                                  ] ? (
                                    <Spin size="small" />
                                  ) : (
                                    <Typography.Text
                                      variant="muted"
                                      fontSize={12}
                                    >
                                      No results found
                                    </Typography.Text>
                                  )
                                }
                                allowClear={false}
                              />
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={24} md={type === "detail" ? 6 : 4}>
                    <Form.Item
                      {...restStopField}
                      label={t("input.routes.detail.address.label")}
                      name={[stopName, "address"]}
                    >
                      <Input
                        placeholder={t(
                          "input.routes.detail.address.placeholder",
                        )}
                        disabled
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={24} md={4}>
                    <Form.Item
                      {...restStopField}
                      label={t("input.routes.detail.province.label")}
                      name={[stopName, "province"]}
                    >
                      <Input
                        placeholder={t(
                          "input.routes.detail.province.placeholder",
                        )}
                        disabled
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={24} md={4}>
                    <Form.Item
                      {...restStopField}
                      label={t("input.routes.detail.city.label")}
                      name={[stopName, "city"]}
                    >
                      <Input
                        placeholder={t("input.routes.detail.city.placeholder")}
                        disabled
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={24} md={4}>
                    <Form.Item
                      {...restStopField}
                      label={t("input.routes.detail.district.label")}
                      name={[stopName, "district"]}
                    >
                      <Input
                        placeholder={t(
                          "input.routes.detail.district.placeholder",
                        )}
                        disabled
                      />
                    </Form.Item>
                  </Col>

                  {type !== "detail" ? (
                    <Col xs={24} sm={24} md={2}>
                      <Flex
                        justify="center"
                        align="flex-end"
                        style={{ height: "100%" }}
                        gap="small"
                      >
                        <DeleteTwoTone
                          twoToneColor={
                            detailFields.length > 2 ? "#eb2f96" : "#bfbfbf"
                          }
                          onClick={() => {
                            if (detailFields.length > 2) {
                              removeDetail(stopName);
                              setIsTrigger(true);
                            }
                          }}
                          style={{
                            fontSize: 20,
                            marginBottom: 18,
                            cursor:
                              detailFields.length > 2 ? "pointer" : "no-drop",
                          }}
                        />

                        <UpCircleTwoTone
                          twoToneColor={stopIndex > 0 ? "#52c41a" : "#bfbfbf"}
                          onClick={() => {
                            if (stopIndex > 0) {
                              moveDetail(stopIndex, stopIndex - 1);
                              setIsTrigger(true);
                            }
                          }}
                          style={{
                            fontSize: 20,
                            marginBottom: 18,
                            cursor: stopIndex > 0 ? "pointer" : "no-drop",
                          }}
                        />

                        <DownCircleTwoTone
                          twoToneColor={
                            stopIndex < detailFields.length - 1
                              ? "#52c41a"
                              : "#bfbfbf"
                          }
                          onClick={() => {
                            if (stopIndex < detailFields.length - 1) {
                              moveDetail(stopIndex, stopIndex + 1);
                              setIsTrigger(true);
                            }
                          }}
                          style={{
                            fontSize: 20,
                            marginBottom: 18,
                            cursor:
                              stopIndex < detailFields.length - 1
                                ? "pointer"
                                : "no-drop",
                          }}
                        />
                      </Flex>
                    </Col>
                  ) : null}
                </Row>
              ),
            )}

            {type !== "detail" ? (
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => addDetail({ routeActivityType: true })}
                >
                  <PlusOutlined /> Add Detail
                </Button>
              </Form.Item>
            ) : null}
          </div>
        );
      }}
    </Form.List>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  customerLocations: state.customerLocations,
  customerRoutes: state.customerRoutes,
});

const mapDispatchToProps = {
  getCustomerLocations: customerLocationActions.getCustomerLocationsFetch,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CustomerRouteFormDetailLocation);
