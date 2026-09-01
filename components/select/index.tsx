import { Select as AntdSelect, SelectProps as AntdSelectProps } from "antd";
import { debounce } from "lodash";
import { MouseEvent, ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";

import styles from "./select.module.scss";
import SelectTree from "./select-tree";

export interface SelectProps extends AntdSelectProps {
  id?: string;
  isLoading?: boolean;
  children?: ReactNode;
  loading?: boolean;
  onNext?: () => void;
  // eslint-disable-next-line no-unused-vars
  onSearch?: (value: string) => void;
  onClear?: () => void;
  showSearch?: boolean;
  allowClear?: boolean;
  className?: string;
  isDelayChar?: boolean;
}

const DELAY_CHAR = 3;
const DELAY_IN_MS = 500;

const Select = (props: SelectProps) => {
  const {
    id,
    isLoading,
    onNext,
    onSearch,
    onClear,
    loading,
    children,
    showSearch,
    allowClear,
    mode,
    onChange,
    isDelayChar = true,
    className = "",
  } = props;
  const { t } = useTranslation();

  const handleScroll = (e: MouseEvent<HTMLDivElement, UIEvent>) => {
    const target = e.currentTarget;

    if (
      !isLoading &&
      !loading &&
      Math.round(target.scrollTop + target.offsetHeight) ===
        target.scrollHeight &&
      onNext
    ) {
      onNext();
    }
  };

  const handleSearch = useMemo(() => {
    const searchHandler = (value: string) => {
      if (value.length === 0 && onClear) {
        onClear();
      }
      if (value.length >= DELAY_CHAR && onSearch && isDelayChar) {
        onSearch(value);
      }
      if (onSearch && !isDelayChar) {
        onSearch(value);
      }
    };

    return debounce(searchHandler, DELAY_IN_MS);
  }, [DELAY_IN_MS, onClear, onSearch]);

  const handleClear = () => {
    if (onClear) {
      onClear();
    }
  };

  return (
    <div
      className={`${styles.container} ${className}`}
      id={id}
      onBlur={() => {
        if (mode === "multiple") handleClear();
      }}
    >
      <AntdSelect
        {...props}
        showSearch={showSearch}
        onPopupScroll={handleScroll}
        onSearch={handleSearch}
        onClear={handleClear}
        onChange={(value, options) => {
          if (onChange) onChange(value, options);
          if (mode === "multiple") handleClear();
        }}
        allowClear={allowClear}
      >
        <>
          {children}
          {(isLoading || loading) && (
            <AntdSelect.Option disabled>
              {t("global.loading")}...
            </AntdSelect.Option>
          )}
          ;
        </>
      </AntdSelect>
    </div>
  );
};

const defaultProps = {
  loading: false,

  allowClear: true,
  showSearch: true,
};

Select.defaultProps = defaultProps;
Select.Option = AntdSelect.Option;
Select.OptGroup = AntdSelect.OptGroup;
Select.Tree = SelectTree;

export default Select;
