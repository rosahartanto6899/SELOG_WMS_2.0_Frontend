/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AutoComplete, Button, Input, InputProps } from "antd";
import { DefaultOptionType } from "antd/lib/select";
import debounce from "lodash/debounce";
import { CSSProperties, useEffect, useMemo, useState } from "react";

import { Search } from "../icons";
import Select from "../select";
import styles from "./search.module.scss";

export interface IInputSearchProps extends InputProps {
  id?: string;
  onSearch?: (search?: string, event?: any, searchBy?: string) => void;
  loading: boolean;
  placeholder: string;
  searchByPlaceholder?: string;
  searchByOptions?: { label: string; value: string }[];
  autoCompleteItems?: DefaultOptionType[] | any[];
  onSearching?: (searchingValue: string, searchBy: string) => void;
  onClear?: (event?: any) => void;
  className?: string;
  style?: CSSProperties;
  onClearAutoComplete?: (state?: any, action?: any) => void;
  showSearchBy?: boolean;
  value?: string;
  onEnterCallback?: (searchingValue: string) => void;
}

const defaultProps = {
  showSearchBy: true,
};

const InputSearch = (props: IInputSearchProps) => {
  const {
    id,
    searchByOptions,
    onSearch,
    onSearching,
    autoCompleteItems,
    loading,
    className,
    style,
    placeholder,
    onClear,
    searchByPlaceholder,
    onClearAutoComplete,
    showSearchBy,
    value,
    onEnterCallback,
  } = props;

  const [searchBy, setSearchBy] = useState(
    searchByOptions && searchByOptions.length > 0
      ? searchByOptions[0].value
      : "",
  );
  const [searchValue, setSearchValue] = useState("");
  const [autocomplete, setAutocomplete] = useState(false);
  const delay = 500; // delay in ms
  const minCharLength = 3;

  useEffect(() => {
    setSearchValue(value ?? "");
  }, [value]);

  const onSearchByChangeHandlerListener = (value: string) => {
    setSearchValue("");
    setSearchBy(value);
    if (onClearAutoComplete) {
      onClearAutoComplete();
    }

    if (onClear) {
      onClear("");
    }
  };

  const onSelectHandlerListener = (value: string) => {
    setAutocomplete(false);
    setSearchValue(value);
    if (onSearch) {
      onSearch(value, null, searchBy);
    }
  };

  const onSearchHandlerListener = (e: any) => {
    if (searchValue.length > -1 && onSearch) {
      setAutocomplete(false);
      onSearch(searchValue, e, searchBy);
      onEnterCallback?.(searchValue);
    }
  };

  const onSearchingHandlerListener = (value: string) => {
    if (onSearching && value.length >= minCharLength) {
      onSearching(value, searchBy);
    }
  };

  const debouncedChangeHandler = useMemo(() => {
    const searchHandler = (value: string) => {
      onSearchingHandlerListener(value);
    };

    return debounce(searchHandler, delay);
  }, [searchBy, delay]);

  return (
    <AutoComplete
      id="auto-complete-input"
      className={styles["sera-autocomplete"]}
      options={autocomplete ? autoCompleteItems : undefined}
      onSelect={onSelectHandlerListener}
      onSearch={debouncedChangeHandler}
      size="middle"
      value={searchValue}
    >
      <Input.Search
        id={id}
        className={`${styles["sera-input-search"]} ${className}`}
        style={style}
        size="middle"
        disabled={loading || false}
        placeholder={placeholder || "Search in table"}
        onInput={(e: any) => setSearchValue(e.target.value)}
        onChange={(e) => {
          if (e.type === "click" && onClear) {
            setSearchValue("");
            onClear(e);
            if (onClearAutoComplete) {
              onClearAutoComplete();
            }
          }
          if (e.target.value === "" && onClearAutoComplete) {
            onClearAutoComplete();
          }
        }}
        onClick={(e) => {
          setAutocomplete(true);
          e.stopPropagation();
        }}
        enterButton={
          <Button
            id="button-search"
            size="small"
            disabled={loading || false}
            onClick={onSearchHandlerListener}
          >
            <Search />
          </Button>
        }
        suffix={
          showSearchBy &&
          searchByOptions &&
          searchByOptions.length > 0 && (
            <Select
              id="search-by"
              className={styles["sera-input-search-option"]}
              showSearch={false}
              disabled={loading || false}
              onChange={onSearchByChangeHandlerListener}
              placeholder={searchByPlaceholder || ""}
              defaultValue={
                searchByOptions.length > 0 ? searchByOptions[0].value : ""
              }
              // dropdownMatchSelectWidth={false}
              popupMatchSelectWidth={false}
              onClick={(e) => {
                if (autocomplete) setAutocomplete(false);
                e.stopPropagation();
              }}
              allowClear={false}
            >
              {searchByOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          )
        }
        onPressEnter={onSearchHandlerListener}
      />
    </AutoComplete>
  );
};

InputSearch.defaultProps = defaultProps;

export default InputSearch;
