import {
  ChildConfig,
  DynamicChildConfig,
  InputChildConfig,
} from "@sera-libraries/types/formBuilderType";

const FormConfig = (_data: ChildConfig[]): ChildConfig[] => {
  return _data?.map((_item) => ({
    ..._item,
    rules: !_item?.disabled ? _item?.rules : undefined,
    showCount: !_item?.disabled
      ? (_item as InputChildConfig)?.showCount
      : undefined,
  })) as ChildConfig[];
};

export const FormConfigHandler = (
  _data: ChildConfig[],
  _isReadOnly = false,
): ChildConfig[] => {
  if (!_isReadOnly) return FormConfig(_data);

  return _data?.map((_item) => ({
    ..._item,
    type: ["text", "number", "select", "date"].includes(_item?.type)
      ? "text"
      : _item?.type,
    placeholder: undefined,
    disabled: _isReadOnly,
    readOnly: true,
    rules: [],
    showCount: undefined,
    ...(_item?.dependency
      ? {
          dependency: {
            ..._item?.dependency,
            disabled: () => false,
          },
        }
      : {}),
    ...(_item?.type === "dynamicInput"
      ? {
          childConfigs: FormConfigHandler(
            (_item as DynamicChildConfig)?.childConfigs ?? [],
            _isReadOnly,
          ),
        }
      : {}),
  })) as ChildConfig[];
};
