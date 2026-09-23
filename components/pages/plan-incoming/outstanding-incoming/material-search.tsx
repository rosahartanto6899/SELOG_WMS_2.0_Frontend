/* eslint-disable @typescript-eslint/no-explicit-any */
import Input from "@sera-components/input";
import { Col, Row, Select } from "antd";
import React from "react";

interface Props {
  id: string;
  searchBy: string;
  onSearchBy: (value: string) => void;
  placeholder: string;
  onSearchValue: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}

/** Search by + keyword — pola table Outstanding Incoming, dipakai QI & Barcode Labeling. */
const MaterialSearch = (props: Props) => {
  const { id, searchBy, onSearchBy, placeholder, onSearchValue, options } =
    props;
  return (
    <Row align="middle" gutter={[8, 8]}>
      {/* xs=24: stack di mobile — minWidth fix bikin overflow di layar sempit */}
      <Col xs={24} md={8} lg={6}>
        <Select
          style={{ width: "100%" }}
          id={`${id}-search-by`}
          value={searchBy}
          onChange={onSearchBy}
        >
          {options.map((o) => (
            <Select.Option key={o.value} value={o.value}>
              {o.label}
            </Select.Option>
          ))}
        </Select>
      </Col>
      <Col xs={24} md={16} lg={18}>
        <Input.Search
          loading={false}
          style={{ width: "100%" }}
          placeholder={placeholder}
          allowClear
          onSearch={(v?: string) => onSearchValue(v ?? "")}
        />
      </Col>
    </Row>
  );
};

export default MaterialSearch;
