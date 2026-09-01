/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "@sera-components/button";
import Card from "@sera-components/card";
import Error404 from "@sera-components/error-boundary/Error404";
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import {
  cityActions,
  customerActions,
  districtActions,
  provinceActions,
  useAppDispatch,
  useAppSelector,
} from "@sera-redux";
import { AutoCompleteType } from "@sera-types/base.type";
import { setFormErrorHandle } from "@sera-utils/error-handler";
import {
  Col,
  Divider,
  Flex,
  Form,
  FormInstance,
  Row,
  Space,
  Switch,
  TimePicker,
} from "antd";
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface ActionFormProps {
  isRead?: boolean;
  type: "create" | "detail" | "update";
  form: FormInstance;
  onSubmit?: () => void;
}

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const PAYLOAD = { page: 1, limit: 10 };

const CustomerLocationForm = (props: ActionFormProps) => {
  const { isRead, type, form, onSubmit } = props;
  const { t } = useTranslation(undefined, {
    keyPrefix: "customerLocation.form",
  });

  const requiredMessage = t("input.message");
  const dispatch = useAppDispatch();
  const watchOperationDays = Form.useWatch("operationDays", form);

  const { customerLocations, customers, provinces, cities, districts } =
    useAppSelector((state) => state);

  const [dataDropdownProvinces, setDataDropdownProvinces] = useState<
    AutoCompleteType[]
  >([]);
  const [dataDropdownCities, setDataDropdownCities] = useState<
    AutoCompleteType[]
  >([]);
  const [dataDropdownDistricts, setDataDropdownDistricts] = useState<
    AutoCompleteType[]
  >([]);
  const [dataDropdownCustomers, setDataDropdownCustomers] = useState<
    AutoCompleteType[]
  >([]);
  const handlerSelectProvince = (value?: string) => {
    form.resetFields(["cityId", "districtId", "area"]);

    if (value) {
      dispatch(
        cityActions.getDropdownCitiesFetch({
          provinceId: value,
          page: 0,
          limit: 0,
        }),
      );
    } else {
      dispatch(cityActions.getDropdownCitiesClear());
      dispatch(districtActions.getDropdownDistrictsClear());
    }
  };
  const handlerSelectCity = (value?: string) => {
    form.resetFields(["districtId", "area"]);
    if (value) {
      dispatch(
        districtActions.getDropdownDistrictsFetch({
          cityId: value,
          page: 0,
          limit: 0,
        }),
      );
    } else {
      dispatch(districtActions.getDropdownDistrictsClear());
    }
  };
  const handlerSelectDistrict = (value?: string) => {
    form.resetFields(["area"]);
    if (districts.dropdownDistricts.data) {
      const selectedDistrict = districts.dropdownDistricts.data.find(
        (district) => district.id === value,
      );
      if (selectedDistrict) {
        form.setFieldValue("area", selectedDistrict.area);
      }
    }
  };

  /** ✅ Set error messages */
  useEffect(() => {
    setFormErrorHandle(form, customerLocations?.error);
  }, [customerLocations?.error]);

  /** ✅ Load data detail (UPDATE MODE ONLY) */
  useEffect(() => {
    const detail = customerLocations?.customerLocationDetail?.data;
    if (!detail || type === "create") return;

    const {
      name,
      address,
      area,
      coordinate,
      province,
      city,
      district,
      customerName,
      operationDays,
    } = detail;

    form.setFieldsValue({
      name,
      address,
      area,
      coordinate,
      provinceId: province?.id,
      cityId: city?.id,
      districtId: district?.id,
      customerId: customerName,
      operationDays: operationDays
        ?.slice()
        .sort((a: any, b: any) => {
          return DAYS_OF_WEEK.indexOf(a.day) - DAYS_OF_WEEK.indexOf(b.day);
        })
        .map((day: any) => ({
          id: day.id,
          day: day.day,
          isOpened: !!day.isOpened,
          openedHour: day.openedHour,
          closedHour: day.closedHour,
        })),
    });
    if (province?.id) {
      dispatch(
        cityActions.getDropdownCitiesFetch({
          provinceId: province?.id,
          page: 0,
          limit: 0,
        }),
      );
    }

    if (city?.id) {
      dispatch(
        districtActions.getDropdownDistrictsFetch({
          cityId: city?.id,
          page: 0,
          limit: 0,
        }),
      );
    }
  }, [customerLocations.customerLocationDetail.data, type]);

  /** ▪ Dropdown Provinces */
  useEffect(() => {
    setDataDropdownProvinces(
      [...(provinces.dropdownProvinces.data ?? [])]
        .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""))
        .map((province) => ({
          label: province.name,
          value: province.id,
        })),
    );
  }, [provinces.dropdownProvinces.data]);

  /** ▪ Dropdown Cities */
  useEffect(() => {
    setDataDropdownCities(
      [...(cities.dropdownCities.data ?? [])]
        .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""))
        .map((city) => ({
          label: city.name,
          value: city.id,
        })),
    );
  }, [cities.dropdownCities.data]);

  /** ▪ Dropdown Districts */
  useEffect(() => {
    setDataDropdownDistricts(
      [...(districts.dropdownDistricts.data ?? [])]
        .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""))
        .map((district) => ({
          label: district.name,
          value: district.id,
        })),
    );
  }, [districts.dropdownDistricts.data]);

  /** ▪ Dropdown Customers */
  useEffect(() => {
    setDataDropdownCustomers(
      customers?.data?.list?.map((customer) => ({
        label: customer.name,
        value: customer.id,
      })) ?? [],
    );
  }, [customers.data.list]);

  useEffect(() => {
    if (type !== "create") return;

    const defaultOperationDays = DAYS_OF_WEEK.map((day) => ({
      day,
      isOpened: true,
      openedHour: "08:00:00",
      closedHour: "17:00:00",
    }));

    form.setFieldValue("operationDays", defaultOperationDays);
  }, [type]);

  useEffect(() => {
    dispatch(customerActions.getCustomersFetch(PAYLOAD));
    dispatch(provinceActions.getDropdownProvincesFetch());
  }, []);

  if (!isEmpty(customerLocations.customerLocationDetail.error)) {
    return <Error404 />;
  }

  return (
    <Card
      title={
        isRead
          ? t("title.read")
          : type === "create"
            ? t("title.add")
            : t("title.edit")
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        autoComplete="off"
        disabled={isRead}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="name"
              label={t("input.name.label")}
              rules={[
                {
                  required: type !== "detail",
                  message: requiredMessage,
                },
                // {
                //   pattern: /^[A-Za-z\s]+$/,
                //   message: t("input.alphabetOnly"),
                // },
              ]}
            >
              <Input
                placeholder={t("input.name.placeholder")}
                maxLength={50}
                showCount
                onChange={(e) => {
                  const val = e.target.value;
                  // .replace(/[^A-Za-z\s]/g, "");
                  form.setFieldValue("name", val);
                }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="address"
              label={t("input.address.label")}
              rules={[
                {
                  required: type !== "detail",
                  message: requiredMessage,
                },
              ]}
            >
              <Input
                placeholder={t("input.address.placeholder")}
                maxLength={200}
                showCount
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="provinceId"
              label={t("input.province.label")}
              rules={[
                {
                  required: type !== "detail",
                  message: requiredMessage,
                },
              ]}
            >
              <Select
                placeholder={t("input.province.placeholder")}
                options={dataDropdownProvinces}
                onChange={(value) => handlerSelectProvince(value)}
                showSearch
                optionFilterProp="label"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="cityId"
              label={t("input.city.label")}
              rules={[
                {
                  required: type !== "detail",
                  message: requiredMessage,
                },
              ]}
            >
              <Select
                disabled={dataDropdownCities.length === 0 || isRead}
                placeholder={t("input.city.placeholder")}
                options={dataDropdownCities}
                onChange={(value) => handlerSelectCity(value)}
                showSearch
                optionFilterProp="label"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="districtId"
              label={t("input.district.label")}
              rules={[
                {
                  required: type !== "detail",
                  message: requiredMessage,
                },
              ]}
            >
              <Select
                disabled={dataDropdownDistricts.length === 0 || isRead}
                placeholder={t("input.district.placeholder")}
                options={dataDropdownDistricts}
                onChange={(value) => handlerSelectDistrict(value)}
                showSearch
                optionFilterProp="label"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item name="area" label={t("input.area.label")}>
              <Input disabled placeholder={t("input.area.placeholder")} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="coordinate"
              label={t("input.coordinate.label")}
              normalize={(value) => value?.trim().replace(/\s+/g, "") || ""}
              rules={[
                {
                  required: type !== "detail",
                  message: requiredMessage,
                },
                {
                  pattern: /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/,
                  message: t("input.coordinate.formatValidation"),
                },
              ]}
            >
              <Input
                placeholder="e.g., -6.2088,106.8456"
                onBlur={(e) => {
                  const trimmedValue = e.target.value
                    .trim()
                    .replace(/\s+/g, "");
                  form.setFieldValue("coordinate", trimmedValue);
                }}
              />
            </Form.Item>
          </Col>

          {/* Customer ID */}
          <Col xs={24} sm={12}>
            <Form.Item
              name="customerId"
              label={t("input.customerId.label")}
              rules={[
                {
                  required: type !== "detail",
                  message: requiredMessage,
                },
              ]}
            >
              <Select
                placeholder={t("input.customerId.placeholder")}
                options={dataDropdownCustomers}
                allowClear
                filterOption={false}
                showSearch
                onSearch={(_value) => {
                  dispatch(
                    customerActions.getCustomersFetch({
                      ...PAYLOAD,
                      search: _value,
                      searchBy: "name",
                    }),
                  );
                }}
                onClear={() => {
                  dispatch(customerActions.getCustomersFetch(PAYLOAD));
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider />
        <Form.Item name="operationDays" label={t("input.operationDays.title")}>
          <div style={{ marginBottom: "24px" }}>
            {(watchOperationDays ?? []).map((dayData: any, index: number) => {
              const isOpened = !!dayData?.isOpened;

              return (
                <Row
                  key={index}
                  gutter={[16, 16]}
                  style={{
                    padding: "12px",
                    marginBottom: "12px",
                    backgroundColor: "#fafafa",
                    borderRadius: "4px",
                    border: "1px solid #f0f0f0",
                  }}
                >
                  {/* Hidden ID (only update mode) */}
                  {type === "update" && (
                    <Form.Item name={["operationDays", index, "id"]} noStyle>
                      <input type="hidden" />
                    </Form.Item>
                  )}

                  {/* SWITCH */}
                  <Col xs={24} sm={16}>
                    <Flex align="center" style={{ height: "100%" }}>
                      <Space>
                        <Form.Item
                          name={["operationDays", index, "isOpened"]}
                          valuePropName="checked"
                          noStyle
                        >
                          <Switch
                            checkedChildren="Opened"
                            unCheckedChildren="Closed"
                            onChange={(checked) => {
                              form.setFieldValue(
                                ["operationDays", index, "isOpened"],
                                checked,
                              );
                            }}
                          />
                        </Form.Item>
                        <strong>{dayData.day}</strong>
                      </Space>
                    </Flex>
                  </Col>

                  {/* OPEN TIME */}
                  <Col xs={24} sm={4}>
                    <Form.Item
                      name={["operationDays", index, "openedHour"]}
                      label={t("input.operationDays.openedHour.label")}
                      rules={[
                        {
                          required: type !== "detail" ? isOpened : false,
                          message: requiredMessage,
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value) return Promise.resolve();

                            const closed = getFieldValue([
                              "operationDays",
                              index,
                              "closedHour",
                            ]);
                            if (!closed) return Promise.resolve();

                            const openedTime = dayjs(value, "HH:mm:ss");
                            const closedTime = dayjs(closed, "HH:mm:ss");

                            if (openedTime.isAfter(closedTime)) {
                              return Promise.reject(
                                t("input.operationDays.openedHour.validation"),
                              );
                            }

                            return Promise.resolve();
                          },
                        }),
                      ]}
                      getValueProps={(val) => {
                        if (!val) return { value: null };
                        const d = dayjs(val, "HH:mm:ss", true);
                        if (d.isValid()) return { value: d };
                        const s = dayjs(val, "HH:mm", true);
                        return { value: s.isValid() ? s : null };
                      }}
                      getValueFromEvent={(time: any) =>
                        time ? time.format("HH:mm:ss") : null
                      }
                    >
                      <TimePicker
                        inputReadOnly
                        style={{ borderRadius: 20 }}
                        disabled={!isOpened || isRead}
                        format="HH:mm"
                        placeholder={!isOpened ? "-" : "08:00"}
                      />
                    </Form.Item>
                  </Col>

                  {/* CLOSE TIME */}
                  <Col xs={24} sm={4}>
                    <Form.Item
                      label={t("input.operationDays.closedHour.label")}
                      name={["operationDays", index, "closedHour"]}
                      rules={[
                        {
                          required: type !== "detail" ? isOpened : false,
                          message: requiredMessage,
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value) return Promise.resolve();

                            const opened = getFieldValue([
                              "operationDays",
                              index,
                              "openedHour",
                            ]);
                            if (!opened) return Promise.resolve();

                            const closedTime = dayjs(value, "HH:mm:ss");
                            const openedTime = dayjs(opened, "HH:mm:ss");

                            if (closedTime.isBefore(openedTime)) {
                              return Promise.reject(
                                t("input.operationDays.closedHour.validation"),
                              );
                            }

                            return Promise.resolve();
                          },
                        }),
                      ]}
                      getValueProps={(val) => {
                        if (!val) return { value: null };
                        const d = dayjs(val, "HH:mm:ss", true);
                        if (d.isValid()) return { value: d };
                        const s = dayjs(val, "HH:mm", true);
                        return { value: s.isValid() ? s : null };
                      }}
                      getValueFromEvent={(time: any) =>
                        time ? time.format("HH:mm:ss") : null
                      }
                    >
                      <TimePicker
                        inputReadOnly
                        style={{ borderRadius: 20 }}
                        disabled={!isOpened || isRead}
                        format="HH:mm"
                        placeholder={!isOpened ? "-" : "08:00"}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              );
            })}
          </div>
        </Form.Item>

        {/* Submit */}
        {!isRead && (
          <Row justify="end" gutter={[8, 8]}>
            <Col>
              <Button
                id="save"
                type="primary"
                htmlType="submit"
                className="ant-btn-custom primary"
              >
                {t("button.save")}
              </Button>
            </Col>
          </Row>
        )}
      </Form>
    </Card>
  );
};

export default CustomerLocationForm;
