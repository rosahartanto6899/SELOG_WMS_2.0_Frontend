/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import "react-quill/dist/quill.snow.css";

import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import Button from "@sera-components/button";
import { UploadIcon } from "@sera-components/icons";
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import Typography from "@sera-components/typography";
import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import MessageHandler from "@sera-libraries/message-handler";
import {
  CheckboxConfig,
  ChildConfig,
  DateChildConfig,
  FormBuilderProps,
  InputChildConfig,
  SelectChildConfig,
  SwitchChildConfig,
  UploadChildConfig,
} from "@sera-libraries/types/formBuilderType";
import {
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Input as AntdInput,
  Radio,
  Row,
  Spin,
  Switch,
  Upload,
} from "antd";
import Dragger from "antd/es/upload/Dragger";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { getCsrfToken } from "next-auth/react";
import { useEffect, useState } from "react";

import DynamicForm from "./dynamic-form";
import LatLongInput from "./maps-input";
import styles from "./rs-form-builder.module.scss";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading Editor...</p>,
});

export default function RsFormBuilder({
  name,
  form,
  layout,
  autoComplete,
  onFinish,
  hideCancel,
  onCancel,
  disabled,
  configs,
  loading,
  submitText,
  cancelText,
  update,
  type,
  endpointSubmit,
  isHideFormButton,
  customFormButton,
  fullWidth,
  customWidth,
  scrollToFirstError,
  submitDisable,
  cancelDisable,
  onValuesChange,
}: FormBuilderProps) {
  const [csrfToken, setCsrfToken] = useState("");
  const [localLoading, setLocalLoading] = useState<boolean>(false);
  const [dynamicOptions, setDynamicOptions] = useState<Record<string, any[]>>(
    {},
  );
  const [localId, setLocalId] = useState<string | number>("");
  const router = useRouter();

  const fetchInitialValues = async () => {
    if (type === "update" && update) {
      try {
        const { endpoint, id } = update;
        if (update.render) {
          const response = await httpService
            .get(`${endpoint}`)
            .then((resp) => resp)
            .catch((err) => err);
          const data = response.data.data;
          const newData = update.render(data);
          setLocalId(newData.id);
          form.setFieldsValue(newData);
        } else {
          const response = await httpService
            .get(`${endpoint}/${id}`)
            .then((resp) => resp)
            .catch((err) => err);
          const data = response.data.data;
          const initialValues = configs.reduce(
            (acc, config) => {
              if (data[config.name] !== undefined) {
                acc[config.name] = data[config.name];
              }
              return acc;
            },
            {} as Record<string, any>,
          );
          form.setFieldsValue(initialValues);
        }
      } catch (error) {
        console.error("Error fetching initial values:", error);
      }
    }
  };
  const fetchOptions = async (
    config: SelectChildConfig,
    dependencyData?: Record<string, any>,
  ) => {
    if (config.dependency?.options && dependencyData) {
      const options = await config.dependency.options(dependencyData);
      setDynamicOptions((prev) => ({
        ...prev,
        [config.id]: options.data.data,
      }));
    } else if (config.options instanceof Promise) {
      const options = await config.options;
      setDynamicOptions((prev) => ({
        ...prev,
        [config.id]: options.data.data,
      }));
    } else if (Array.isArray(config.options)) {
      setDynamicOptions((prev) => ({
        ...prev,
        [config.id]: config.options as any[],
      }));
    }
  };

  const onSubmit = async (val: any) => {
    setLocalLoading(true);
    const res =
      type === "update"
        ? httpService
            .put(`${endpointSubmit}/${update?.id ?? localId}`, val)
            .then((resp) => resp)
            .catch((err) => err)
        : httpService
            .post(endpointSubmit!, val)
            .then((resp) => resp)
            .catch((err) => err);
    const data = await res;
    setLocalLoading(false);
    if (data) {
      if (data.status == 201 || data.status == 200) {
        MessageHandler().success({
          title: "Success",
          content:
            type === "update"
              ? "Data updated successfully"
              : "Create data success",
        });
      }
    }
  };

  useEffect(() => {
    configs.forEach((config) => {
      if (["select", "radio"].includes(config.type)) {
        fetchOptions(config as SelectChildConfig);
      }
    });

    if (type === "update") {
      fetchInitialValues();
    }
  }, [configs, type]);

  useEffect(() => {
    const getCsrf = async () => {
      const token = (await getCsrfToken()) ?? "";
      setCsrfToken(token);
    };
    getCsrf();
  }, []);

  const renderField = (config: ChildConfig, isDisabled = false) => {
    if (config.render) {
      return config.render();
    }

    switch (config.type) {
      case "text":
      case "email": {
        const _config = config as InputChildConfig;

        return (
          <Input
            type={config.type}
            placeholder={config.placeholder}
            autoComplete={config.autoComplete}
            disabled={loading || isDisabled || config?.disabled}
            maxLength={_config?.maxLength}
            showCount={_config?.showCount}
            readOnly={_config?.readOnly}
            suffix={_config?.suffix}
          />
        );
      }

      case "password": {
        return (
          <AntdInput.Password
            className="procurement-input password"
            placeholder={config.placeholder}
            autoComplete="new-password"
            disabled={loading || isDisabled || config?.disabled}
            iconRender={(visible) => {
              return visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />;
            }}
          />
        );
      }

      case "number": {
        const _config = config as InputChildConfig;

        return (
          <Input
            type={config.type}
            placeholder={config.placeholder}
            autoComplete={config.autoComplete}
            onlyNumber
            allowFraction={_config?.allowFraction}
            displayCurrency
            disableCurrency={_config.disableCurrency}
            disabled={loading || isDisabled || config?.disabled}
            onChange={config.onChange}
            suffix={_config.suffix}
            prefix={_config.prefix}
            suffixInner={Boolean(_config.suffix)}
          />
        );
      }

      case "maps": {
        return (
          <LatLongInput
            value={form.getFieldValue(config.name)}
            onChange={(value) => form.setFieldsValue({ [config.name]: value })}
            disabled={loading || isDisabled || config?.disabled}
          />
        );
      }

      case "select": {
        const _config = config as SelectChildConfig;
        const selectOptions =
          dynamicOptions[_config.id] || _config.options || [];

        return (
          <Select
            placeholder={config.placeholder}
            mode={_config.mode}
            maxTagCount={_config.limit}
            disabled={loading || isDisabled || _config?.disabled}
            options={selectOptions.map((option: { [x: string]: any }) => ({
              label: option[_config.labelField ?? "label"],
              value: option[_config.valueField ?? "value"],
            }))}
            labelInValue={_config.labelInValue}
            optionFilterProp="label"
            onClick={(e) => {
              const el = e.target as HTMLElement;
              if (el.closest(".ant-select-item-option")) return;
              if (_config.updateData) _config.updateData();
            }}
            onNext={_config.onNext}
            onChange={config.onChange}
            onSearch={_config.onSearch}
            onClear={_config.onClear}
            isDelayChar={_config.isDelayChar}
            notFoundContent={
              _config.loading ? (
                <Spin size="small" />
              ) : (
                <Typography.Text variant="muted" fontSize={12}>
                  No results found
                </Typography.Text>
              )
            }
          />
        );
      }

      case "checkbox": {
        const _config = config as CheckboxConfig;

        return (
          <Checkbox.Group
            onChange={_config?.onChange}
            style={{
              width: "100%",
              ...(type === "detail" ? { pointerEvents: "none" } : {}),
            }}
            disabled={loading || isDisabled || _config?.disabled}
          >
            <Row gutter={[4, 4]}>
              {_config?.loading ? (
                <Spin size="small" />
              ) : _config?.options ? (
                _config?.options?.map((_option) => (
                  <Col {..._config?.columns} key={_option?.value}>
                    <Checkbox
                      value={_option?.value}
                      disabled={!!_option?.disabled}
                    >
                      {_option?.label}
                    </Checkbox>
                  </Col>
                ))
              ) : (
                <Typography.Text variant="muted" fontSize={12}>
                  No results found
                </Typography.Text>
              )}
            </Row>
          </Checkbox.Group>
        );
      }
      case "radio": {
        const _config = config as SelectChildConfig;
        const radioOptions = dynamicOptions[_config.id] || [];

        return (
          <Radio.Group
            options={radioOptions.map((option) => ({
              label: option[_config.labelField || "label"],
              value: option[_config.valueField || "value"],
            }))}
            disabled={loading || isDisabled || config?.disabled}
          />
        );
      }

      case "date": {
        const _config = config as DateChildConfig;
        const _dateFormat = _config?.format ?? "YYYY-MM-DD";

        return (
          <DatePicker
            style={{ width: "100%", borderRadius: 20 }}
            placeholder={config.placeholder}
            format={_dateFormat}
            showTime={_dateFormat?.includes("HH:mm")}
            disabled={loading || isDisabled || config?.disabled}
            onChange={config.onChange}
            getPopupContainer={(node) => node}
            disabledDate={(current) => {
              const start = _config.startDate
                ? dayjs(_config.startDate, "YYYY-MM-DD")
                : null;

              const end = _config.endDate
                ? dayjs(_config.endDate, "YYYY-MM-DD")
                : null;

              if (!start && !end) return false;

              if (start && !end) {
                return current < start.startOf("day");
              }

              if (!start && end) {
                return current > end.endOf("day");
              }

              if (start && end) {
                return (
                  current < start.startOf("day") || current > end.endOf("day")
                );
              }

              return false;
            }}
            disabledTime={(date) => {
              if (_config.disablePastTime) {
                let now;
                if (_config.startDate) {
                  now = dayjs(_config.startDate);
                } else {
                  now = dayjs();
                }
                const isToday = date.isSame(now, "day");
                const filteredHours = Array.from(
                  { length: now.hour() },
                  (_, i) => i,
                );
                const filteredMinutes = Array.from(
                  { length: now.minute() },
                  (_, i) => i,
                );
                const filteredSeconds = Array.from(
                  { length: now.second() },
                  (_, i) => i,
                );
                return {
                  disabledHours: () => {
                    if (isToday) {
                      return filteredHours;
                    }
                    return [];
                  },
                  disabledMinutes: () => {
                    if (isToday && date.hour() === now.hour()) {
                      return filteredMinutes;
                    }
                    return [];
                  },
                  disabledSeconds: () => {
                    if (
                      isToday &&
                      date.hour() === now.hour() &&
                      date.minute() === now.minute() &&
                      !_config.isStartDate
                    ) {
                      return filteredSeconds;
                    }
                    return [];
                  },
                };
              }
              return {};
            }}
          />
        );
      }

      case "upload": {
        const uploadConfig = config as UploadChildConfig;
        const initialFileList = form.getFieldValue(config.name) || [];
        const handlePreview = async (file: any) => {
          try {
            const endpointPreview =
              uploadConfig.endpointPreview &&
              uploadConfig.endpointPreview(file.vendorBranchId, file.uid);

            if (uploadConfig.endpointUrl) {
              if (uploadConfig?.maxSize ?? 0 > 1) {
                window.open(file.url);
                return;
              }
              window.open(endpointPreview);
              return;
            }

            const response = await httpService.get(
              endpointPreview
                ? endpointPreview
                : `${apiUrl.user}/vendor-branches/${file.vendorBranchId}/documents/${file.uid}` ||
                    file.thumbUrl,
            );
            if (response.data.data.buffer?.data) {
              const bufferArray = new Uint8Array(
                response.data.data.buffer?.data,
              );
              const blob = new Blob([bufferArray], {
                type: response.data.data.mimeType || "application/pdf",
              });
              const previewUrl = URL.createObjectURL(blob);
              window.open(previewUrl, "_blank");
            } else {
              throw new Error("Buffer data is missing in the response.");
            }
          } catch (error) {
            console.error("Error fetching and displaying preview:", error);
            MessageHandler().error({
              title: "Preview Error",
              content: "Unable to load the preview for this file.",
            });
          }
        };

        return (
          <>
            {uploadConfig.renderAdditionalComponent
              ? uploadConfig.renderAdditionalComponent()
              : null}
            <Dragger
              disabled={uploadConfig.disabled}
              onRemove={uploadConfig.onRemove}
              name={uploadConfig.name}
              multiple={uploadConfig.multiple}
              maxCount={uploadConfig.maxCount}
              accept={uploadConfig.accept}
              fileList={initialFileList}
              onChange={
                uploadConfig.onChange
                  ? uploadConfig.onChange
                  : (info) => {
                      const { fileList } = info;
                      form.setFieldsValue({ [config.name]: fileList });
                    }
              }
              beforeUpload={(file) => {
                if (uploadConfig.maxSize) {
                  const isLtXMB =
                    file.size / 1024 / 1024 < uploadConfig.maxSize;
                  if (!isLtXMB) {
                    MessageHandler().error({
                      title: "File too large!",
                      content: `Please upload a file smaller than ${uploadConfig.maxSize}MB.`,
                    });
                  }
                  return isLtXMB || Upload.LIST_IGNORE;
                }
                return true;
              }}
              onPreview={handlePreview}
              customRequest={uploadConfig.customRequest}
              className="flex flex-col justify-center"
            >
              <p className="ant-upload-drag-icon flex justify-center text-primary-90">
                <UploadIcon />
              </p>
              <p className="ant-upload-text text-primary-90">
                Click or drag file to this area to upload
              </p>
              {uploadConfig.isShowSupportedFiles && (
                <p className="ant-upload-hint text-primary-90">
                  Files Supported:{" "}
                  {uploadConfig.accept
                    ?.split(",")
                    .map((val) => val.toUpperCase().replace(".", ""))
                    .join(", ")}
                </p>
              )}
              <p className="ant-upload-hint text-primary-90">
                Maximum file size is {uploadConfig.maxSize ?? 5}MB.
              </p>
            </Dragger>
          </>
        );
      }

      case "switch": {
        const _config = config as SwitchChildConfig;

        return (
          <Switch
            {...(_config?.options?.length > 1
              ? {
                  checkedChildren: _config?.options?.[0],
                  unCheckedChildren: _config?.options?.[1],
                }
              : {})}
            {...(type === "detail"
              ? {
                  checked: form.getFieldValue(_config?.name),
                }
              : {})}
            onChange={config.onChange}
            disabled={loading || isDisabled || config?.disabled}
          />
        );
      }

      case "dynamicInput": {
        return (
          <DynamicForm
            form={form}
            config={config}
            isDisabled={false}
            renderField={renderField}
          />
        );
      }

      case "textarea": {
        const _config = config as InputChildConfig;

        return (
          <AntdInput.TextArea
            autoComplete={config.autoComplete}
            autoSize={{ minRows: 4, maxRows: 6 }}
            onChange={config.onChange}
            disabled={loading || isDisabled || config?.disabled}
            maxLength={_config?.maxLength}
            showCount={_config?.showCount}
            readOnly={config?.readOnly}
          />
        );
      }

      case "rich-text": {
        return (
          <ReactQuill
            className={
              config.disabled || config?.readOnly
                ? styles["rich-text-disabled"]
                : ""
            }
            theme="snow"
            readOnly={config.disabled || config?.readOnly}
            placeholder={config.placeholder}
            modules={{
              toolbar: !(config.disabled || config?.readOnly),
            }}
          />
        );
      }

      default:
        return null;
    }
  };

  const renderFormItem = (config: ChildConfig) => {
    const { dependency, disabled } = config;
    const [dependencyCache, setDependencyCache] = useState<Record<string, any>>(
      {},
    );

    if (dependency) {
      return (
        <Col
          xs={24}
          sm={24}
          md={
            config.mdSize
              ? config.mdSize
              : config.name === "businessPhoto" ||
                  config.type === "maps" ||
                  fullWidth
                ? 24
                : 12
          }
        >
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              dependency.fields.some(
                (field) => prevValues[field] !== currentValues[field],
              )
            }
          >
            {({ getFieldValue }) => {
              const dependencyData = dependency.fields.reduce(
                (acc, field) => {
                  acc[field] = getFieldValue(field);
                  return acc;
                },
                {} as Record<string, any>,
              );

              const isVisible = dependency.visibility
                ? dependency.visibility(dependencyData)
                : true;
              const isDisabled = dependency.disabled
                ? dependency.disabled(dependencyData)
                : (disabled ?? false);
              const isRequired = dependency.required
                ? dependency.required.condition(dependencyData)
                : false;
              const dynamicLabel = dependency.label
                ? dependency.label(dependencyData)
                : config.label;

              const dependencyChanged = dependency.fields.some(
                (field) => dependencyCache[field] !== getFieldValue(field),
              );

              if (dependencyChanged) {
                setTimeout(() => {
                  setDependencyCache((prevCache) => ({
                    ...prevCache,
                    ...dependencyData,
                  }));

                  if (isVisible && !isDisabled && dependency.options) {
                    fetchOptions(config as SelectChildConfig, dependencyData);
                    form.setFieldsValue({ [config.name]: undefined });
                  }
                }, 0);
              }

              const rules = isRequired
                ? [{ required: true, message: dependency.required?.message }]
                : config.rules;

              return isVisible ? (
                <Form.Item
                  label={dynamicLabel}
                  name={config.name}
                  rules={rules}
                  className={config.className}
                >
                  {renderField(config, isDisabled)}
                </Form.Item>
              ) : null;
            }}
          </Form.Item>
        </Col>
      );
    }

    if (config.type === "upload") {
      return (
        <Col {...{ xs: 24, sm: 24, md: fullWidth ? 24 : 12, ...customWidth }}>
          <Form.Item
            key={config.id}
            label={config.label}
            name={config.name}
            rules={config.rules}
            className={config.className}
            valuePropName={(config as UploadChildConfig).valuePropName}
            validateDebounce={(config as UploadChildConfig).validateDebounce}
            getValueFromEvent={(config as UploadChildConfig).getValueFromEvent}
          >
            {renderField(config)}
          </Form.Item>
        </Col>
      );
    }

    if (config.type === "dynamicInput") {
      return (
        <Col span={24}>
          <Divider />

          {renderField(config)}
        </Col>
      );
    }

    if (config.type === "empty") {
      return <Col xs={24} sm={24} md={12} />;
    }

    return (
      <Col xs={24} sm={24} md={config.type === "maps" || fullWidth ? 24 : 12}>
        <Form.Item
          key={config.id}
          label={config.label}
          name={config.name}
          rules={config.rules}
          className={config.className}
        >
          {renderField(config)}
        </Form.Item>
      </Col>
    );
  };

  return (
    <div className={styles["form-container"]}>
      <Form
        onValuesChange={(changedValues, values) => {
          if (onValuesChange) onValuesChange(changedValues, values);
          form.setFields([{ name: Object.keys(changedValues)[0], errors: [] }]);
        }}
        scrollToFirstError={scrollToFirstError}
        name={name}
        form={form}
        layout={layout}
        autoComplete={autoComplete}
        onFinish={onFinish != null ? onFinish : onSubmit}
        disabled={disabled}
      >
        <input
          type="hidden"
          name="csrfToken"
          id="csrfToken"
          value={csrfToken}
        />
        <Row gutter={16}>
          {configs
            ?.filter((_config) => !_config?.hidden)
            ?.map((config) => renderFormItem(config))}
        </Row>
        {isHideFormButton && customFormButton ? customFormButton() : null}
        {!isHideFormButton && (
          <Row justify="end" gutter={[8, 8]} style={{ marginTop: 16 }}>
            {!hideCancel && (
              <Col>
                <Button
                  id="cancel"
                  className="ant-btn-custom secondary"
                  onClick={onCancel ? onCancel : () => router.back()}
                  disabled={
                    cancelDisable === false
                      ? false
                      : loading || localLoading || disabled || cancelDisable
                  }
                >
                  {cancelText
                    ? cancelText
                    : type !== "detail"
                      ? "Back"
                      : "Cancel"}
                </Button>
              </Col>
            )}

            {type !== "detail" ? (
              <Col>
                <Form.Item>
                  <Button
                    id="submit"
                    htmlType="submit"
                    type="primary"
                    className={styles["default-form-button"]}
                    disabled={
                      loading || localLoading || disabled || submitDisable
                    }
                  >
                    {submitText ?? "Submit"}
                  </Button>
                </Form.Item>
              </Col>
            ) : null}
          </Row>
        )}
      </Form>
    </div>
  );
}
