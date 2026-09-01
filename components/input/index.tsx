/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-unused-expressions */
import FormatUtils from "@sera-utils/format";
import { Input as AntdInput, InputProps as AntdInputProps } from "antd";
import React, { useEffect, useState } from "react";

import Skeleton from "../skeleton";
import styles from "./input.module.scss";
import InputSearch from "./search";

const regexNumber = /^\d*$/;
const regexFraction = /^\d*\,?\d{0,2}$/;

export interface InputProps extends AntdInputProps {
  onlyNumber?: boolean;
  displayCurrency?: boolean;
  loading?: boolean;
  suffixInner?: boolean;
  disableCurrency?: boolean;
  allowFraction?: boolean;
}

const defaultProps: InputProps = {
  onlyNumber: false,
  loading: false,
  suffixInner: false,
};

const Input = ({
  defaultValue,
  disableCurrency,
  displayCurrency,
  loading,
  onlyNumber,
  suffixInner,
  type,
  value,
  onChange,
  allowFraction,
  ...restProps
}: InputProps) => {
  const [values, setValues] = useState<string>("");
  const isCurrency = !disableCurrency && displayCurrency;

  useEffect(() => {
    const _value = defaultValue?.toString() ?? value?.toString();

    if (!_value) return;
    setValues(isCurrency ? FormatUtils().formatInputCurrency(_value) : _value);
  }, [defaultValue, isCurrency, value]);

  const onHandleChange = (_event: React.ChangeEvent<HTMLInputElement>) => {
    const { selectionStart, setSelectionRange, value } = _event.target;

    let _prevLength = 0;
    let _finalValue = value;

    if (isCurrency) {
      const _value = value.replace(/[^\d,]/g, "");
      _prevLength = _value.length;

      const _regex = allowFraction ? regexFraction : regexNumber;

      _finalValue =
        _value === "" || _regex.test(_value)
          ? FormatUtils().formatInputCurrency(_value)
          : values;
    } else if (onlyNumber) {
      _finalValue = value === "" || regexNumber.test(value) ? value : values;
    } else {
      _finalValue = value;
    }

    setValues(_finalValue);

    if (onChange) {
      const rawValue = isCurrency
        ? _finalValue.replace(/\./g, "")
        : _finalValue;

      onChange({
        ..._event,
        target: { ..._event.target, value: rawValue },
      });
    }

    if (isCurrency) {
      requestAnimationFrame(() => {
        const _formattedValue = FormatUtils().formatInputCurrency(value).length;
        const _cursorShift = _formattedValue - _prevLength;
        let _newCp = selectionStart ? selectionStart + _cursorShift : 0;

        if (_newCp < _formattedValue) {
          _newCp =
            (selectionStart ? selectionStart : 0) +
            Math.max(_formattedValue - value.length, 0);
        }

        setSelectionRange(_newCp, _newCp);
      });
    }
  };

  return (
    <div className={styles.container}>
      {loading && (
        <Skeleton.Input
          active
          size="small"
          style={{ height: 16, width: "100%" }}
        />
      )}

      {!loading && (
        <AntdInput
          {...restProps}
          type={onlyNumber || isCurrency ? "text" : type}
          className={`${suffixInner && styles["input-suffix--inner"]}`}
          value={values}
          onChange={onHandleChange}
        />
      )}
    </div>
  );
};

Input.defaultProps = defaultProps;
Input.Search = InputSearch;

export default Input;
