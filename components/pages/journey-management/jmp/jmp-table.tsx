/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import Button from "@sera-components/button";
import { Plus } from "@sera-components/icons";
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import { RootState } from "@sera-redux";
import { DEFAULT_SEARCH, jmpActions } from "@sera-redux/slices/jmp.slice";
import { BaseType } from "@sera-types/base.type";
import {
  FilterParams,
  JMPList,
  JMPState,
  jmpTypes,
} from "@sera-types/jmp.type";
import { LoadingState } from "@sera-types/loading.type";
import { ROUTE } from "@sera-utils/constants/routes";
import { Col, Row } from "antd";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import useGetPermission from "../hooks/useGetPermission";
import { Columns, SearchByOptions } from "./jmp-props-table";

const AUTOCOMPLETE = { searchBy: DEFAULT_SEARCH, page: 1, limit: 10 };

interface JMPTableProps {
  params: FilterParams;

  loading: LoadingState;
  jmp: JMPState;
  getJMPList: typeof jmpActions.getJMPListFetch;
  getACJMPList: typeof jmpActions.getACJMPListFetch;
  getACJMPListClear: typeof jmpActions.getACJMPListClear;
}

const JMPTable = ({
  params,
  loading,
  jmp,
  getJMPList,
  getACJMPList,
  getACJMPListClear,
}: JMPTableProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "jmp.table",
  });

  const { isCreate } = useGetPermission("journey-management-plan");

  const [isSkipFetch, setIsSkipFetch] = useState(false);
  const [options, setOptions] = useState<BaseType>({ page: 1, limit: 10 });
  const [autoComplete, setAutoComplete] = useState<BaseType>(AUTOCOMPLETE);

  const onChangePagination = (_current: number, _limit: number) => {
    setOptions((_prev) => ({ ..._prev, page: _current, limit: _limit }));
  };

  const onChangeSearchBy = (_value?: string) => {
    setIsSkipFetch(true);

    setOptions((_prev) => ({ ..._prev, searchBy: _value, search: null }));
    setAutoComplete((_prev) => ({ ..._prev, searchBy: _value, search: null }));

    getACJMPListClear();
  };

  const onHandleSearch = (_search?: string) => {
    setOptions((_prev) => ({
      ..._prev,
      searchBy: _prev?.searchBy ?? DEFAULT_SEARCH,
      search: _search || null,
      page: 1,
    }));
  };

  const onHandleSearching = (_search?: string) => {
    setAutoComplete((_prev) => ({
      ..._prev,
      searchBy: _prev?.searchBy ?? DEFAULT_SEARCH,
      search: _search || null,
      page: 1,
    }));
  };

  const onHandleClearSearch = () => {
    setOptions((_prev) => ({ ..._prev, search: null }));
  };

  useEffect(() => {
    getACJMPListClear();
  }, []);

  useEffect(() => {
    if (isSkipFetch) return setIsSkipFetch(false);
    getJMPList({
      ...options,
      searchBy: options?.search ? options?.searchBy : undefined,
      ...params,
    });
  }, [options, params]);

  useEffect(() => {
    if (autoComplete.search)
      getACJMPList({
        ...autoComplete,
        searchBy: autoComplete?.search ? autoComplete?.searchBy : undefined,
        ...params,
      });
  }, [autoComplete, params]);

  const renderFilter = useMemo(() => {
    return (
      <Input.Search
        id={`${options?.searchBy}-search`}
        key={`${options?.searchBy}-search`}
        value={options?.search ?? undefined}
        style={{ width: 172 }}
        loading={loading[jmpTypes.GET_AC_JMP_LIST]}
        placeholder={t(`placeholder.${options?.searchBy ?? "default"}`)}
        autoCompleteItems={jmp?.getACJMPList?.data ?? []}
        onSearch={(_search) => onHandleSearch(_search)}
        onSearching={(_search) => onHandleSearching(_search)}
        onClear={onHandleClearSearch}
      />
    );
  }, [options?.searchBy, jmp?.getACJMPList?.data]);

  return (
    <Table
      title={t("title")}
      columns={Columns()}
      dataSource={jmp?.getJMPList?.data ?? []}
      total={jmp?.getJMPList?.options?.totalData ?? 0}
      current={jmp?.getJMPList?.options?.page ?? 1}
      pageSize={jmp?.getJMPList?.options?.limit ?? 10}
      rowKey={(row: JMPList) => `${row.no}`}
      onPageChange={onChangePagination}
      scroll={{ x: "max-content" }}
      loading={loading[jmpTypes.GET_JMP_LIST]}
      isCustomSearch
      customSearch={
        <Row align="middle" gutter={[8, 8]}>
          <Col xs={24} md={12}>
            <Select
              id="jmp-search"
              style={{ width: 172 }}
              defaultValue={DEFAULT_SEARCH}
              options={SearchByOptions()}
              onChange={(value) => onChangeSearchBy(value)}
              onClear={() => onChangeSearchBy("")}
              allowClear={false}
            />
          </Col>

          <Col xs={24} md={12}>
            {renderFilter}
          </Col>
        </Row>
      }
      actions={
        <Row gutter={[16, 4]}>
          {isCreate ? (
            <Col>
              <Link
                id="link-add-jmp"
                href={`${ROUTE.JOURNEY_MANAGEMENT.JMP}/add`}
                passHref
              >
                <Button id="action-add" type="primary" icon={<Plus />}>
                  {t("button.add")}
                </Button>
              </Link>
            </Col>
          ) : null}
        </Row>
      }
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  jmp: state.jmp,
});

const mapDispatchToProps = {
  getJMPList: jmpActions.getJMPListFetch,
  getACJMPList: jmpActions.getACJMPListFetch,
  getACJMPListClear: jmpActions.getACJMPListClear,
};

export default connect(mapStateToProps, mapDispatchToProps)(JMPTable);
