/* eslint-disable @typescript-eslint/no-explicit-any */
import FilterDropdown from "@sera-components/filter-dropdown";
import { Col, Row } from "antd";
import { useTranslation } from "react-i18next";

const GET_DUMMY = (_label: string) =>
  Array(10)
    .fill(null)
    .map((_, _index) => ({
      value: _index,
      label: `${_label} ${_index + 1}`,
    }));

interface EmptyMilesFiltersProps {
  data: any;
  onChangeFilter: (_payload: any) => void;
}

const EmptyMilesFilters = ({}: EmptyMilesFiltersProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "emptyMiles.filters",
  });

  const IS_LOADING = false;

  return (
    <Row gutter={[8, 4]}>
      <Col>
        <FilterDropdown
          buttonLabel={t("0")}
          options={GET_DUMMY(t("0")) ?? []}
          selectedValues={[]}
          onChange={() => {}}
          loading={IS_LOADING}
          disabled={IS_LOADING}
        />
      </Col>

      <Col>
        <FilterDropdown
          buttonLabel={t("1")}
          options={GET_DUMMY(t("1")) ?? []}
          selectedValues={[]}
          onChange={() => {}}
          loading={IS_LOADING}
          disabled={IS_LOADING}
        />
      </Col>

      <Col>
        <FilterDropdown
          buttonLabel={t("2")}
          options={GET_DUMMY(t("2")) ?? []}
          selectedValues={[]}
          onChange={() => {}}
          loading={IS_LOADING}
          disabled={IS_LOADING}
        />
      </Col>
    </Row>
  );
};

export default EmptyMilesFilters;
