/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteTwoTone, PlusOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import FormActions from "@sera-components/hocs/form-actions";
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import { businessAreaActions, RootState } from "@sera-redux";
import { roleActions } from "@sera-redux/slices/role.slice";
import {
  BusinessArea,
  BusinessAreaState,
  businessAreaTypes,
} from "@sera-types/business-area.type";
import { LoadingState } from "@sera-types/loading.type";
import { Role, RoleState, roleTypes } from "@sera-types/role.type";
import { UserState } from "@sera-types/user.type";
import Utils from "@sera-utils/utils";
import { Card, Col, Flex, Form, FormInstance, Row, Switch } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface ActionFormProps {
  businessAreas: BusinessAreaState;
  loadingFetch: LoadingState;
  roles: RoleState;
  users: UserState;
  getDropdownBusinessAreas: typeof businessAreaActions.getDropdownBusinessAreasFetch;
  getDropdownRoles: typeof roleActions.getDropdownRolesFetch;
  form: FormInstance;
  loading: boolean;
  onSubmit: () => void;
  isDetail?: boolean;
}

const ActionForm = ({
  businessAreas,
  loadingFetch,
  roles,
  users,
  getDropdownBusinessAreas,
  getDropdownRoles,
  form,
  loading,
  onSubmit,
  isDetail,
}: ActionFormProps) => {
  const router = useRouter();
  const { t } = useTranslation(undefined, { keyPrefix: "userManagement.form" });

  const requiredMessage = t("message.default");

  const [status, setStatus] = useState(true);
  const [dataDropdownRoles, setDataDropdownRoles] = useState<Role[]>([]);
  const [dataDropdownBusinessAreas, setDataDropdownBusinessAreas] = useState<
    BusinessArea[]
  >([]);

  // Customer list derived from warehouse dropdown (each warehouse has customer)
  const dataDropdownCustomers: { id?: string; name?: string }[] = Array.from(
    new Map(
      dataDropdownBusinessAreas
        .filter((w: any) => w.customer?.id)
        .map((w: any) => [w.customer.id, w.customer]),
    ).values(),
  );

  const warehousesByCustomer = (customerId?: string) =>
    dataDropdownBusinessAreas.filter((w: any) => w.customer?.id === customerId);

  const onGoBack = () => {
    Utils().onGoBack(router, "/user-management/users");
  };

  useEffect(() => {
    getDropdownRoles();
    getDropdownBusinessAreas({ show: "all" });

    form.setFieldValue("isActive", status);
  }, []);

  useEffect(() => {
    setDataDropdownRoles(roles.dropdownRoles.data);
  }, [roles.dropdownRoles.data]);

  useEffect(() => {
    setDataDropdownBusinessAreas(businessAreas.dropdownBusinessAreas.data);
  }, [businessAreas.dropdownBusinessAreas.data]);

  useEffect(() => {
    if (Object.keys(users.userDetail.data).length) {
      form.setFieldValue("newName", users.userDetail.data.name);
      form.setFieldValue("newEmail", users.userDetail.data.email);
      form.setFieldValue("phoneNumber", users.userDetail.data.phone);
      form.setFieldValue("nrp", users.userDetail.data.nrp);
      form.setFieldValue("isActive", users.userDetail.data.isActive);
      form.setFieldValue(
        "accessRows",
        (users.userDetail.data.roles || []).flatMap((role: any) =>
          (role.accesses || []).map((a: any) => ({
            customerId: a.customerId,
            roles: [
              {
                roleId: role.id,
                warehouses: a.warehouses,
              },
            ],
          })),
        ),
      );
      setStatus(() => !!users.userDetail.data.isActive);
    }
  }, [users.userDetail.data]);

  useEffect(() => {
    if ((users.error as any)?.data?.errors) {
      const errorData = (users.error as any).data.errors;
      const mapFieldName = (field: string): string => {
        if (field === "email") {
          return "newEmail";
        } else if (field === "name") {
          return "newName";
        } else if (field === "password") {
          return "newPassword";
        } else {
          return field;
        }
      };
      const errors = errorData.map((err: { field: any; message: any }) => ({
        name: mapFieldName(err.field),
        errors: err.message,
      }));

      form.setFields(errors);
    }
  }, [users.error]);

  return (
    <Form
      form={form}
      layout="vertical"
      disabled={loading}
      autoComplete="off"
      initialValues={{ accessRows: [{ roles: [{}] }] }}
    >
      <Card title={t("title")}>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label={status ? t("status.active") : t("status.nonActive")}
              name="isActive"
            >
              <Switch
                id="isActive"
                disabled={isDetail}
                defaultChecked
                onChange={(e) => setStatus(e)}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label={t("userName.label")}
              rules={[{ required: true, message: requiredMessage }]}
              name="newName"
            >
              <Input
                id="newName"
                placeholder={t("userName.placeholder")}
                disabled={isDetail}
                onInput={(e: any) => {
                  e.target.value = e.target.value.toUpperCase();
                }}
                showCount
                maxLength={100}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label={t("nrp.label")}
              rules={[{ required: true, message: requiredMessage }]}
              name="nrp"
            >
              <Input
                id="nrp"
                placeholder={t("nrp.placeholder")}
                disabled={isDetail}
                onInput={(e: any) => {
                  e.target.value = e.target.value.toUpperCase();
                }}
                showCount
                maxLength={100}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label={t("email.label")}
              name="newEmail"
              rules={[
                { type: "email", message: t("email.message") },
                { required: true, message: requiredMessage },
              ]}
            >
              <Input
                id="newEmail"
                placeholder={t("email.placeholder")}
                autoComplete="new-email"
                disabled={users.userDetail.data.email !== undefined || isDetail}
                showCount
                maxLength={100}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label={t("phoneNumber.label")}
              rules={[
                { message: requiredMessage },
                { min: 10, message: t("phoneNumber.messages.0") },
                { max: 15, message: t("phoneNumber.messages.1") },
                {
                  pattern: /^(62)[1-9]\d{7,12}$/,
                  message: t("phoneNumber.messages.2"),
                },
              ]}
              name="phoneNumber"
            >
              <Input
                id="phoneNumber"
                disabled={isDetail}
                placeholder={t("phoneNumber.placeholder")}
                showCount
                maxLength={15}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24} style={{ marginTop: 16 }}>
            <Form.List name="accessRows">
              {(fields, { add, remove }) => {
                return (
                  <div>
                    {fields.map(({ key, name, ...restField }, index) => {
                      const customerId = form.getFieldValue([
                        "accessRows",
                        index,
                        "customerId",
                      ]);
                      const selectedCustomer = dataDropdownCustomers.find(
                        (c: any) => c.id === customerId,
                      );
                      return (
                        <Form.Item
                          label={name === 0 ? t("roleBranch") : ""}
                          required={false}
                          key={key}
                        >
                          <Col xs={24} sm={24} md={24}>
                            <Row gutter={16}>
                              <Col xs={24} sm={24} md={12}>
                                <Form.Item
                                  {...restField}
                                  label={t("customer.label")}
                                  name={[name, "customerId"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: requiredMessage,
                                    },
                                    {
                                      validator: (_, value) => {
                                        const rows =
                                          form.getFieldValue("accessRows") ||
                                          [];
                                        const count = rows.filter(
                                          (r: any, i: number) =>
                                            i !== index &&
                                            r?.customerId === value,
                                        ).length;
                                        if (count > 0) {
                                          return Promise.reject(
                                            new Error(
                                              t("customer.messages.unique"),
                                            ),
                                          );
                                        }
                                        return Promise.resolve();
                                      },
                                    },
                                  ]}
                                >
                                  <Select
                                    id={`user-management-add-customer-${key}`}
                                    placeholder={t("customer.placeholder")}
                                    showSearch
                                    optionFilterProp="label"
                                    disabled={isDetail}
                                    onChange={() => {
                                      const rows =
                                        form.getFieldValue("accessRows") || [];
                                      if (rows[index]) {
                                        rows[index].roles = [{}];
                                        form.setFieldsValue({
                                          accessRows: rows,
                                        });
                                      }
                                    }}
                                  >
                                    {dataDropdownCustomers.map((c: any) => {
                                      const taken = (
                                        form.getFieldValue("accessRows") || []
                                      ).some(
                                        (r: any, i: number) =>
                                          i !== index && r?.customerId === c.id,
                                      );
                                      return (
                                        <Select.Option
                                          value={c.id}
                                          key={c.id}
                                          label={c.name}
                                          disabled={taken}
                                        >
                                          {c.name}
                                        </Select.Option>
                                      );
                                    })}
                                  </Select>
                                </Form.Item>
                              </Col>
                              <Col xs={24} sm={24} md={12}>
                                <Form.List name={[name, "roles"]}>
                                  {(
                                    roleFields,
                                    { add: addRole, remove: removeRole },
                                  ) => (
                                    <>
                                      {roleFields.map(
                                        (
                                          {
                                            key: roleKey,
                                            name: roleName,
                                            ...roleRest
                                          },
                                          roleIndex,
                                        ) => {
                                          return (
                                            <Row
                                              gutter={16}
                                              key={roleKey}
                                              style={{ marginBottom: 8 }}
                                            >
                                              <Col xs={24} sm={24} md={24}>
                                                <Form.Item
                                                  {...roleRest}
                                                  label={
                                                    roleIndex === 0
                                                      ? t("role.label")
                                                      : ""
                                                  }
                                                  name={[roleName, "roleId"]}
                                                  rules={[
                                                    {
                                                      required: true,
                                                      message: requiredMessage,
                                                    },
                                                    {
                                                      validator: (_, value) => {
                                                        const row =
                                                          (form.getFieldValue(
                                                            "accessRows",
                                                          ) || [])[index];
                                                        const roles =
                                                          row?.roles || [];
                                                        const count =
                                                          roles.filter(
                                                            (
                                                              r: any,
                                                              i: number,
                                                            ) =>
                                                              i !== roleIndex &&
                                                              r?.roleId ===
                                                                value,
                                                          ).length;
                                                        if (count > 0) {
                                                          return Promise.reject(
                                                            new Error(
                                                              t(
                                                                "role.messages.unique",
                                                              ),
                                                            ),
                                                          );
                                                        }
                                                        return Promise.resolve();
                                                      },
                                                    },
                                                  ]}
                                                >
                                                  <Select
                                                    id={`user-management-add-role-${roleKey}`}
                                                    placeholder={t(
                                                      "role.placeholder",
                                                    )}
                                                    showSearch
                                                    optionFilterProp="label"
                                                    loading={
                                                      loadingFetch[
                                                        roleTypes
                                                          .GET_DROPDOWN_ROLES
                                                      ]
                                                    }
                                                    disabled={
                                                      isDetail || !customerId
                                                    }
                                                  >
                                                    {dataDropdownRoles.map(
                                                      (r: any) => {
                                                        const taken = (
                                                          (form.getFieldValue(
                                                            "accessRows",
                                                          ) || [])[index]
                                                            ?.roles || []
                                                        ).some(
                                                          (
                                                            rl: any,
                                                            i: number,
                                                          ) =>
                                                            i !== roleIndex &&
                                                            rl?.roleId === r.id,
                                                        );
                                                        return (
                                                          <Select.Option
                                                            value={r.id}
                                                            key={r.id}
                                                            label={r.roleName}
                                                            disabled={taken}
                                                          >
                                                            {r.roleName}
                                                          </Select.Option>
                                                        );
                                                      },
                                                    )}
                                                  </Select>
                                                </Form.Item>
                                              </Col>
                                              <Col xs={24} sm={24} md={24}>
                                                <Form.Item
                                                  label={
                                                    roleIndex === 0
                                                      ? `${t("warehouse.label")} (${selectedCustomer?.name ?? ""})`
                                                      : ""
                                                  }
                                                  name={[
                                                    roleName,
                                                    "warehouses",
                                                  ]}
                                                  rules={[
                                                    {
                                                      required: true,
                                                      message: requiredMessage,
                                                    },
                                                  ]}
                                                >
                                                  <Select
                                                    mode="multiple"
                                                    id={`user-management-add-warehouse-${roleKey}`}
                                                    placeholder={
                                                      selectedCustomer
                                                        ? `${t("warehouse.placeholder")} (${selectedCustomer.name})`
                                                        : t(
                                                            "warehouse.placeholder",
                                                          )
                                                    }
                                                    showSearch
                                                    optionFilterProp="label"
                                                    loading={
                                                      loadingFetch[
                                                        businessAreaTypes
                                                          .GET_DROPDOWN_BUSINESS_AREAS
                                                      ]
                                                    }
                                                    disabled={
                                                      isDetail || !customerId
                                                    }
                                                    maxTagCount={2}
                                                  >
                                                    {warehousesByCustomer(
                                                      customerId,
                                                    ).map((w: any) => (
                                                      <Select.Option
                                                        value={w.id}
                                                        key={w.id}
                                                        label={w.name}
                                                      >
                                                        {w.name}
                                                      </Select.Option>
                                                    ))}
                                                  </Select>
                                                </Form.Item>
                                              </Col>
                                              {!isDetail &&
                                                roleFields.length > 1 && (
                                                  <Col xs={1} sm={1} md={1}>
                                                    <Flex
                                                      justify="center"
                                                      align="flex-end"
                                                      style={{
                                                        height: "100%",
                                                      }}
                                                    >
                                                      <DeleteTwoTone
                                                        twoToneColor="#eb2f96"
                                                        style={{
                                                          marginBottom: 20,
                                                        }}
                                                        onClick={() =>
                                                          removeRole(roleName)
                                                        }
                                                      />
                                                    </Flex>
                                                  </Col>
                                                )}
                                            </Row>
                                          );
                                        },
                                      )}
                                      {!isDetail && customerId && (
                                        <Form.Item>
                                          <Button
                                            type="dashed"
                                            onClick={() => addRole()}
                                          >
                                            <PlusOutlined />{" "}
                                            {t("button.addRole")}
                                          </Button>
                                        </Form.Item>
                                      )}
                                    </>
                                  )}
                                </Form.List>
                              </Col>
                              {!isDetail && fields.length > 1 && (
                                <Col xs={1} sm={1} md={1}>
                                  <Flex
                                    justify="center"
                                    align="flex-end"
                                    style={{ height: "100%" }}
                                  >
                                    <DeleteTwoTone
                                      disabled={isDetail}
                                      twoToneColor="#eb2f96"
                                      style={{ marginBottom: 20 }}
                                      onClick={() => {
                                        remove(name);
                                      }}
                                    />
                                  </Flex>
                                </Col>
                              )}
                            </Row>
                          </Col>
                        </Form.Item>
                      );
                    })}
                    {!isDetail && (
                      <Form.Item>
                        <Button
                          disabled={isDetail}
                          type="dashed"
                          onClick={() => {
                            add({ roles: [{}] });
                          }}
                        >
                          <PlusOutlined /> {t("button.addCustomer")}
                        </Button>
                      </Form.Item>
                    )}
                  </div>
                );
              }}
            </Form.List>
          </Col>
        </Row>
      </Card>

      {!isDetail && (
        <FormActions>
          <Row justify="end" gutter={[8, 8]}>
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
          </Row>
        </FormActions>
      )}
    </Form>
  );
};

const mapStateToProps = (state: RootState) => ({
  businessAreas: state.businessAreas,
  loadingFetch: state.loading,
  roles: state.roles,
  users: state.users,
});

const mapDispatchToProps = {
  getDropdownBusinessAreas: businessAreaActions.getDropdownBusinessAreasFetch,
  getDropdownRoles: roleActions.getDropdownRolesFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionForm);
