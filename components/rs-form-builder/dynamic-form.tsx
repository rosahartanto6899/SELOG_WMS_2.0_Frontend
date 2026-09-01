import {
  DeleteTwoTone,
  DownCircleTwoTone,
  PlusOutlined,
  UpCircleTwoTone,
} from "@ant-design/icons";
import Card from "@sera-components/card";
import { DeleteOutlined } from "@sera-components/icons";
import {
  ChildConfig,
  DynamicChildConfig,
} from "@sera-libraries/types/formBuilderType";
import { Button, Col, Flex, Form, FormInstance, Row } from "antd";
import { FC } from "react";

import styles from "./rs-form-builder.module.scss";

interface DynamicFormProps {
  form: FormInstance;
  config: ChildConfig;
  isDisabled: boolean;
  renderField: (config: ChildConfig, isDisabled: boolean) => JSX.Element | null;
}

const ORDER_ICON_STYLES = (fields: any[]) => ({
  fontSize: 20,
  marginBottom: 18,
  cursor: fields.length > 1 ? "pointer" : "no-drop",
});

const DynamicForm: FC<DynamicFormProps> = ({
  form,
  config,
  isDisabled,
  renderField,
}) => {
  const dynamicConfig = config as DynamicChildConfig;

  return (
    <Form.List
      name={dynamicConfig.name}
      rules={dynamicConfig.rules}
      initialValue={[{}]}
    >
      {(fields, { add, remove, move }, { errors }) => (
        <>
          <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
            {dynamicConfig?.title ? (
              <h3 style={{ fontWeight: 600, marginLeft: 12 }}>
                {dynamicConfig?.title}
              </h3>
            ) : null}

            {fields.map(({ key, name, fieldKey, ...restField }, index) => {
              const dataItem = form.getFieldValue([dynamicConfig.name, name]);
              return (
                <Col key={key} md={24} className={styles["field-container"]}>
                  <Card
                    noShadow
                    style={{ cursor: "default", border: "1px solid #3A8DDB61" }}
                  >
                    <div key={key} className={styles["dynamic-item-container"]}>
                      {!dynamicConfig?.noHeader ? (
                        <div className={styles["card-label-container"]}>
                          <div>
                            {!dynamicConfig.hideLabel && (
                              <h4>{`${dynamicConfig.label || "Item"} ${index + 1}`}</h4>
                            )}
                          </div>
                          <div>
                            {!dynamicConfig.hideRemoveButton && (
                              <button
                                key={key}
                                type="button"
                                className={styles["button-delete"]}
                                onClick={() => {
                                  remove(name);
                                  if (dataItem?.id) {
                                    dynamicConfig.onDelete(dataItem.id);
                                  }
                                }}
                              >
                                <DeleteOutlined color="red" />
                              </button>
                            )}
                          </div>
                        </div>
                      ) : null}

                      <Row gutter={[16, 16]} align="stretch">
                        {dynamicConfig.childConfigs.map((childConfig) => (
                          <>
                            <Col
                              key={`${childConfig.name}-${index}`}
                              xs={24}
                              md={
                                childConfig.mdSize || dynamicConfig.mdSize || 12
                              }
                            >
                              <Form.Item
                                {...restField}
                                name={[name, childConfig.name]}
                                fieldKey={[fieldKey!, childConfig.name]}
                                // label={childConfig.label}
                                label={
                                  <p
                                    className={styles["custom-label-form-item"]}
                                    title={childConfig.label as string}
                                  >
                                    {childConfig.label}
                                  </p>
                                }
                                rules={childConfig.rules}
                                className={childConfig.className}
                              >
                                {renderField(childConfig, isDisabled)}
                              </Form.Item>
                            </Col>
                          </>
                        ))}

                        {dynamicConfig?.withOrder ? (
                          <Col xs={24} sm={24} md={2}>
                            <Flex
                              justify="center"
                              align="flex-end"
                              style={{ height: "100%" }}
                              gap="small"
                            >
                              <DeleteTwoTone
                                twoToneColor={
                                  fields.length > 1 ? "#eb2f96" : "#bfbfbf"
                                }
                                onClick={() => {
                                  if (fields.length > 1) remove(name);
                                }}
                                style={ORDER_ICON_STYLES(fields)}
                              />

                              <UpCircleTwoTone
                                twoToneColor={index > 0 ? "#52c41a" : "#bfbfbf"}
                                onClick={() => {
                                  if (index > 0) move(index, index - 1);
                                }}
                                style={ORDER_ICON_STYLES(fields)}
                              />

                              <DownCircleTwoTone
                                twoToneColor={
                                  index < fields.length - 1
                                    ? "#52c41a"
                                    : "#bfbfbf"
                                }
                                onClick={() => {
                                  if (index < fields.length - 1)
                                    move(index, index + 1);
                                }}
                                style={ORDER_ICON_STYLES(fields)}
                              />
                            </Flex>
                          </Col>
                        ) : null}
                      </Row>
                    </div>
                  </Card>
                </Col>
              );
            })}
            <Col span={24}>
              <div style={{ color: "#ff4d4f" }}>
                <Form.ErrorList errors={errors} />
              </div>
            </Col>
            <Col span={24}>
              {!dynamicConfig.hideAddButton && (
                <Button
                  disabled={
                    isDisabled ||
                    dynamicConfig.disableAddButton ||
                    (typeof dynamicConfig.maxChild === "number"
                      ? fields.length >= dynamicConfig?.maxChild
                      : false)
                  }
                  type="dashed"
                  onClick={() => {
                    add();
                  }}
                >
                  <PlusOutlined /> {dynamicConfig.addButtonLabel || "Add"}
                </Button>
              )}
            </Col>
          </Row>
        </>
      )}
    </Form.List>
  );
};

export default DynamicForm;
