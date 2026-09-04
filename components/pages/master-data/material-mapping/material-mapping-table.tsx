/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import Card from "@sera-components/card";
import FilterDropdown from "@sera-components/filter-dropdown";
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import WmsWarehouseApi from "@sera-libraries/api/wms-warehouse";
import { materialLocationMappingActions } from "@sera-redux";
import { BaseType } from "@sera-types/base.type";
import { MaterialLocationMapping } from "@sera-types/material-location-mapping.type";
import FormatUtils from "@sera-utils/format";
import { Col, Flex, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  dataSource?: MaterialLocationMapping[];
  options?: any;
  loading: any;
  onFetch: typeof materialLocationMappingActions.getMappingsFetch;
}

/** Final mapping list — replaces the legacy #datatableLocationMapping table. */
const MaterialMappingTable = (props: Props) => {
  const { dataSource, options, loading, onFetch } = props;
  const { t } = useTranslation(undefined, {
    keyPrefix: "masterData.materialMapping.list",
  });

  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [warehouseCodes, setWarehouseCodes] = useState<string[]>([]);
  const [listOptions, setListOptions] = useState<BaseType>({
    page: 1,
    limit: 10,
    order: "createdDate",
    sort: "desc",
  });
  const [searchByOption, setSearchByOption] = useState("materialCode");

  useEffect(() => {
    WmsWarehouseApi()
      .retrieveDropdownWarehouses()
      .then((resp: any) => setWarehouses(resp?.data?.data ?? []))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    onFetch({
      ...listOptions,
      warehouseCode: warehouseCodes.length
        ? warehouseCodes.join(",")
        : undefined,
    });
  }, [listOptions, warehouseCodes]);

  const onPageChangeListener = (page: number, pageSize?: number) => {
    setListOptions((prevState: BaseType) => ({
      ...prevState,
      page,
      limit: pageSize ?? prevState.limit,
    }));
  };

  const handlerSelectSearchBy = (value?: string) => {
    setSearchByOption(value ?? "materialCode");
    setListOptions((prevState: BaseType) => ({
      ...prevState,
      search: null,
      page: 1,
    }));
  };

  const COLUMNS = [
    {
      key: "no",
      dataIndex: "no",
      title: "No.",
      fixed: "left",
      width: 60,
      align: "center",
    },
    {
      title: t("columns.materialCode"),
      dataIndex: "materialCode",
      key: "materialCode",
      width: 160,
      truncate: true,
    },
    {
      title: t("columns.materialName"),
      dataIndex: "materialName",
      key: "materialName",
      width: 240,
      truncate: true,
    },
    {
      title: t("columns.materialBrand"),
      dataIndex: "materialBrand",
      key: "materialBrand",
      width: 140,
      truncate: true,
    },
    {
      title: t("columns.locationName"),
      dataIndex: "locationName",
      key: "locationName",
      width: 200,
      truncate: true,
    },
    {
      title: t("columns.createdDate"),
      dataIndex: "createdDate",
      key: "createdDate",
      width: 180,
      render: (_: unknown, record: MaterialLocationMapping) =>
        FormatUtils().dateTimeTransform(record.createdDate ?? ""),
    },
  ];

  return (
    <>
      <Flex vertical gap={24}>
        <Card.Filter>
          <Row gutter={[8, 4]}>
            <Col>
              <FilterDropdown
                buttonLabel={t("selectWarehouse")}
                options={warehouses.map((w: any) => ({
                  label: w.name,
                  value: w.code,
                }))}
                selectedValues={warehouseCodes}
                onChange={(values) => setWarehouseCodes(values ?? [])}
                loading={false}
                disabled={false}
              />
            </Col>
          </Row>
        </Card.Filter>

        {dataSource && (
          <Table
            dataSource={dataSource}
            columns={COLUMNS}
            current={Number(options?.page)}
            pageSize={options?.limit}
            total={options?.totalData ?? 0}
            rowKey={(row: MaterialLocationMapping) => `${row.no}`}
            loading={loading}
            title={t("title")}
            scroll={{ x: 1100 }}
            onPageChange={onPageChangeListener}
            isCustomSearch
            multipleDelete={false}
            customSearch={
              <Row align="middle" gutter={[8, 8]}>
                <Col xs={24} md={{ flex: "0 1 auto" }}>
                  <Select
                    id="table-select"
                    className="table-search-select"
                    style={{ width: "20rem", maxWidth: "100%" }}
                    placeholder={t("searchBy")}
                    allowClear={false}
                    defaultValue={searchByOption}
                    onChange={(value) => handlerSelectSearchBy(value)}
                    onClear={() => handlerSelectSearchBy("")}
                  >
                    <Select.Option value="materialCode">
                      {t("columns.materialCode")}
                    </Select.Option>
                    <Select.Option value="locationName">
                      {t("columns.locationName")}
                    </Select.Option>
                  </Select>
                </Col>
                <Col xs={24} md={{ flex: "0 1 auto" }}>
                  <Input.Search
                    loading={!!loading}
                    id="table-search"
                    style={{ width: "28rem", maxWidth: "100%" }}
                    placeholder={t("searchPlaceholder")}
                    value={listOptions.search ?? ""}
                    onClear={() =>
                      setListOptions((prevState: BaseType) => ({
                        ...prevState,
                        search: null,
                      }))
                    }
                    onSearch={(value) =>
                      setListOptions((prevState: BaseType) => ({
                        ...prevState,
                        search: value || null,
                        searchBy: searchByOption,
                        page: 1,
                      }))
                    }
                  />
                </Col>
              </Row>
            }
          />
        )}
      </Flex>
    </>
  );
};

export default MaterialMappingTable;
