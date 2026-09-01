/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormInstance, UploadFile } from "antd";
import { ColProps } from "antd/es/grid";
import { Rule } from "antd/lib/form";
import { ReactElement } from "react";

interface BaseChildConfig {
  type:
    | "text"
    | "textarea"
    | "select"
    | "checkbox"
    | "radio"
    | "textarea"
    | "password"
    | "email"
    | "number"
    | "date"
    | "switch"
    | "upload"
    | "maps"
    | "datetime"
    | "dynamicInput"
    | "empty"
    | "inputNumber"
    | "rich-text";
  label: string | React.ReactNode;
  mdSize?: number | 12 | 24;
  helperText?: string;
  name: string;
  id: string;
  className?: string;
  rules?: Rule[] | any;
  placeholder?: string;
  autoComplete?: "on" | "off";
  dependency?: FormDependency;
  hidden?: boolean;
  disabled?: boolean;
  displayCurrency?: boolean;
  suffix?: string;
  prefix?: string;
  onChange?: (value: any) => void;
  render?: () => JSX.Element;
  readOnly?: boolean;
  order?: number;
}

export interface FormDependency {
  fields: string[];
  label?: (data: any) => string;
  visibility?: (data: any) => boolean;
  disabled?: (data: any) => boolean;
  options?: (data: any) => any;
  required?: {
    condition: (data: any) => boolean;
    message: string;
  };
}

export interface InputChildConfig extends BaseChildConfig {
  initialValue?: string;
  disableCurrency?: boolean;
  onChange?: (value: any) => void;
  error?: boolean;
  maxLength?: number;
  showCount?: boolean;
  childInput: ChildConfig[];
  allowFraction?: boolean;
  formatCurrency?: boolean;
}

export interface CheckboxConfig extends BaseChildConfig {
  columns?: ColProps;
  options?: { label?: string; value?: string; disabled?: boolean }[];
  onChange?: () => void;
  loading?: boolean;
}

export interface SelectChildConfig extends BaseChildConfig {
  labelInValue?: boolean;
  updateData?: () => void;
  loading?: boolean;
  initialValue?: string | number | string[] | number[];
  options?: Array<{ [key: string]: any }> | Promise<any>;
  labelField?: string;
  valueField?: string;
  limit?: number;
  mode?: "multiple" | "tags" | undefined;
  onChange?: (value: any) => void;
  onSearch?: (value: any) => void;
  onClear?: () => void;
  isDelayChar?: boolean;
  onNext?: () => void;
}

export interface DynamicChildConfig extends BaseChildConfig {
  name: string;
  title?: string;
  childConfigs: ChildConfig[];
  childInput: ChildConfig[];
  onUpdate: (val: any) => void;
  onDelete: (val: any) => void;
  filledBefore?: boolean;
  updateButtonLabel?: string;
  addButtonLabel?: string;
  removeButtonLabel?: string;
  noUpdateButton?: boolean;
  hideLabel?: boolean;
  hideRemoveButton?: boolean;
  hideAddButton?: boolean;
  disableAddButton?: boolean;
  defaultValueDynamicField?: string;
  noHeader?: boolean;
  withOrder?: boolean;
  maxChild?: number;
}

export interface UploadChildConfig extends BaseChildConfig {
  initialValue?: string | string[];
  limit?: number;
  maxSize?: number;
  accept?: string;
  action?: string;
  headers?: Record<string, string>;
  data?: Record<string, any>;
  valuePropName?: string;
  validateDebounce?: number;
  endpointUrl?: true;
  multiple?: boolean;
  maxCount?: number;
  maxFile?: number;
  isShowSupportedFiles?: boolean;
  renderAdditionalComponent?: () => JSX.Element | null;
  endpointPreview?: (branchId: string, id: string) => string;
  fileList?: () => UploadFile<any>[];
  customRequest?: (e: any) => any;
  beforeUpload?: (e: any) => any;
  getValueFromEvent?: (e: any) => any;
  onRemove?: (e: any) => any;
}

export interface SwitchChildConfig extends BaseChildConfig {
  options: string[];
}

export interface DateChildConfig extends BaseChildConfig {
  format?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  onChange?: () => void;
  disablePastTime?: boolean;
  isStartDate?: boolean;
}

export interface RowSegment {
  gutter: number;
  // left: JSX.Element;
}

export type ChildConfig =
  | InputChildConfig
  | SelectChildConfig
  | UploadChildConfig
  | DynamicChildConfig
  | DateChildConfig
  | CheckboxConfig
  | SwitchChildConfig;

export interface BaseFormBuilderProps {
  name: string;
  type: "create" | "detail" | "update";
  update?: {
    endpoint: string;
    id?: string;
    render?: (data: any) => Record<string, any>;
  };
  form: FormInstance;
  layout?: "vertical" | "horizontal" | "inline";
  autoComplete?: "on" | "off";
  disabled?: boolean;
  loading?: boolean;
  submitText?: string;
  cancelText?: string;
  initalValue?: any;
  configs: ChildConfig[];
  isHideFormButton?: boolean;
  customFormButton?: () => ReactElement;
  fullWidth?: boolean;
  customWidth?: ColProps;
  scrollToFirstError?: boolean;
  onValuesChange?: (changedValues?: any, allValues?: any) => void;
  submitDisable?: boolean;
  cancelDisable?: boolean;
}

export type FormBuilderProps = BaseFormBuilderProps &
  (
    | {
        onFinish: (values: any) => void;
        onCancel?: () => void;
        hideCancel?: boolean;
        endpointSubmit?: string;
      }
    | {
        onFinish?: never;
        onCancel?: never;
        hideCancel?: boolean;
        endpointSubmit: string;
      }
  );
