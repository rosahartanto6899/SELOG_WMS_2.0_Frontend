/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import Button from "@sera-components/button";
import Card from "@sera-components/card";
import Select from "@sera-components/select";
// import Error404 from "@sera-components/error-boundary/Error404";
// import FormActions from "@sera-components/hocs/form-actions";
// import useGetPermissionFleetManagement from "@sera-components/pages/fleet-management/hooks/useGetPermission";
import TableEditable from "@sera-components/table-editable";
import UploadDnD from "@sera-components/upload-dnd";
import MessageHandler from "@sera-libraries/message-handler";
import {
  businessAreaActions,
  customerActions,
  customerContractActions,
  customerRouteActions,
  expensesActions,
  useAppDispatch,
  useAppSelector,
} from "@sera-redux";
import { businessAreaTypes } from "@sera-types/business-area.type";
import { customerContractTypes } from "@sera-types/customer-contract.type";
import { customerRouteTypes } from "@sera-types/customer-route.type";
import {
  ExpensesPayload,
  expensesTypes,
  ExpensesUpsertProps,
} from "@sera-types/expenses.type";
import { Col, Flex, message, Row } from "antd";
import { RcFile } from "antd/lib/upload";
import { cloneDeep, isEmpty, isEqual, isNull } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";

import styles from "./expenses.module.scss";
import {
  Columns,
  DataBulk,
  DropdownBulk,
  EMPLOYEE_STATUS_TYPE,
  FormatConstant,
  HEADER_KEYS,
  payloadingData,
  SHIPMENT_TYPE_OPTIONS,
  ValidationData,
} from "./expenses-upsert-props-table";

type Data = { [_key: string]: string | number | undefined };

function ExpensesUpsert() {
  const { t } = useTranslation(undefined, {
    keyPrefix: "expenses.upsert",
  });

  const [data, setData] = useState<Data[] | null>(null);
  const [dataBulk, setDataBulk] = useState<DataBulk | null>(null);
  const [updateTable, setUpdateTable] = useState(false);

  const [showErr, setShowErr] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [activeUpsert, setActiveUpsert] = useState(-1);
  const [dropdownDownload, setDropdownDownload] = useState({
    customerId: undefined,
    contractId: undefined,
    customerRouteIds: [],
    branchIds: [],
  });

  const dispatch = useAppDispatch();
  const { createExpenses } = useAppSelector((state) => state.expenses);
  const { dropdownBusinessAreas } = useAppSelector(
    (state) => state.businessAreas,
  );
  const { dropdownCustomerRoutes } = useAppSelector(
    (state) => state.customerRoutes,
  );
  const { data: dropdownContracts } = useAppSelector(
    (state) => state.customerContracts,
  );
  const loading = useAppSelector((state) => state.loading);
  const { data: dropdownCustomers } = useAppSelector(
    (state) => state.customers,
  );

  const onPageChangeListener = (current: number, limit: number) => {
    setPage(current);
    setLimit(limit);
  };

  const onHandlingUploadFile = (file: RcFile) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const arrayBuffer = e.target?.result;
      if (!arrayBuffer) return;

      try {
        const REQUIRED_SHEET = [
          "Expenses",
          "RequestTypeBody",
          "Branches",
          "CustomerRoutes",
        ] as const;

        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const XLSXtoJSON = (
          key: (typeof REQUIRED_SHEET)[number],
          range?: number,
          header?: boolean,
        ): { [_key: string]: string }[] => {
          return XLSX.utils.sheet_to_json(workbook.Sheets[key], {
            ...(header ? { header: 1 } : {}),
            range: range ?? 0,
            defval: "",
          });
        };

        const _isMissingSheets = REQUIRED_SHEET.filter(
          (name) => !workbook.Sheets[name],
        );
        if (_isMissingSheets.length > 0) throw new Error("");

        const _bodyRef = XLSXtoJSON("RequestTypeBody");
        const _bodyRefIds = _bodyRef?.map(({ id }) => id);
        const _bodyRefNames = _bodyRef?.map(({ name }) => name);
        const _header = XLSXtoJSON("Expenses", 0, true)[0];

        // Based on header configuration with itself
        if (!isEqual(_bodyRefNames, _header)) throw new Error("");

        // Based on header configuration with FE
        if (!isEqual(HEADER_KEYS, _bodyRefIds)) throw new Error("");
        const _branchesRef = XLSXtoJSON("Branches");
        const _customerRoutesRef = XLSXtoJSON("CustomerRoutes");

        const _dropdown: DropdownBulk = {
          branch: _branchesRef,
          routeCode: _customerRoutesRef,
          driverType: EMPLOYEE_STATUS_TYPE,
          shipmentType: SHIPMENT_TYPE_OPTIONS,
        };

        setData(
          ValidationData(
            XLSXtoJSON("Expenses"),
            XLSXtoJSON("RequestTypeBody"),
            _dropdown,
          ),
        );

        setDataBulk({
          titles: FormatConstant(XLSXtoJSON("RequestTypeBody")),
          dropdown: _dropdown,
        });
      } catch (_error) {
        console.log(_error);
        setData(null);
        setDataBulk(null);

        if (_error) {
          message.error(t("message.import"));
        }
      } finally {
        setActiveUpsert(-1);
      }
    };

    reader.readAsArrayBuffer(file);

    return false;
  };

  const onHandleNextUpsert = () => {
    setActiveUpsert((_prev) => {
      const _nextIndex = _prev + 1;
      if (isNull(data) || _nextIndex >= data?.length) {
        setShowErr(false);
        return -1;
      }
      return _nextIndex;
    });
  };

  const onHandleUpsertBulk = async (_data: Data) => {
    if (isNull(data) || isNull(dataBulk)) return;

    const { dropdown } = dataBulk;
    const _payload = cloneDeep(_data) as ExpensesUpsertProps;

    delete _payload?.no;
    delete _payload?.upsertStatus;
    delete _payload?.upsertReason;

    // TODO: PAYLOAD UPSERT BULK
    const _finalPayload: ExpensesPayload = {
      customerRouteId:
        payloadingData(dropdown?.routeCode, _payload?.routeCode) || "",
      branchId: payloadingData(dropdown?.branch, _payload?.branch) || "",
      shipmentType:
        payloadingData(dropdown?.shipmentType, _payload?.shipmentType) || "",
      driverType:
        payloadingData(dropdown?.driverType, _payload?.driverType) || "",
      distanceWithCargo: Number(_payload.distanceCargo) || 0,
      toleranceWithCargo: Number(_payload.toleranceCargo) || 0,
      distanceWithoutCargo: Number(_payload.distanceEmpty) || 0,
      toleranceWithoutCargo: Number(_payload.toleranceEmpty) || 0,
      fuelCargo: Number(_payload.fuelCargo) || 0,
      fuelEmpty: Number(_payload.fuelEmpty) || 0,
      fuel: Number(_payload.fuel) || 0,
      toll: Number(_payload.toll) || 0,
      mell: Number(_payload.mell) || 0,
      loadingUnloading: Number(_payload.loadingUnloading) || 0,
      harborCrossing: Number(_payload.harborCrossing) || 0,
      workerContributions: Number(_payload.workerContributions) || 0,
      security: Number(_payload.security) || 0,
      incentiveKM: Number(_payload.incentiveKm) || 0,
      incentiveDaily: Number(_payload.incentiveDaily) || 0,
      incentiveSIO: Number(_payload.incentiveSio) || 0,
      documentShippingFee: Number(_payload?.documentShippingFee) || 0,
      termin1: Number(_payload?.termin1) || 0,
      termin2: Number(_payload?.termin2) || 0,
      termin3: Number(_payload?.termin3) || 0,
      termin4: Number(_payload?.termin4) || 0,
      termin5: Number(_payload?.termin5) || 0,
      termin6: Number(_payload?.termin6) || 0,
    };

    dispatch(
      expensesActions.createExpensesFetch({
        payload: _finalPayload,
        isUpsert: true,
      }),
    );
  };

  const handleChangeDropdown = (
    value: string[] | string,
    type: keyof typeof dropdownDownload,
  ) => {
    const isSelectAllDropdown =
      type === "branchIds" || type === "customerRouteIds";

    if (type === "customerId") {
      setDropdownDownload((prev) => ({
        ...prev,
        contractId: undefined,
        customerRouteIds: [],
      }));
    }
    if (!isSelectAllDropdown) {
      setDropdownDownload((prev) => ({
        ...prev,
        [type]: value,
      }));

      return;
    }
    const isSelectAll = value?.includes("all");

    const dropdownValues =
      type === "branchIds"
        ? dropdownBusinessAreas.data.map((v) => v.id)
        : dropdownCustomerRoutes.data.map((v) => v.id);

    const currentSelected = dropdownDownload[type] ?? [];
    const selectedWithoutAll = currentSelected.filter((v) => v !== "all");

    const isAllSelected =
      selectedWithoutAll.length === dropdownValues.length &&
      selectedWithoutAll.every((v) => dropdownValues.includes(v));

    setDropdownDownload((prev) => ({
      ...prev,
      [type]: isSelectAll ? (isAllSelected ? [] : dropdownValues) : value,
    }));
  };

  function getDynamicSelectAllLabel<T>(
    dropdown: T[],
    key: keyof T,
    type: keyof typeof dropdownDownload,
  ) {
    const selected = dropdownDownload?.[type] ?? [];

    const dropdownValues = dropdown.map((item) => item[key]);

    const selectedWithoutAll = selected.filter((v) => v !== "all");

    const isAllSelected =
      selectedWithoutAll.length === dropdownValues.length &&
      selectedWithoutAll.every((value) => dropdownValues.includes(value));

    return isAllSelected
      ? t("dropdown.button.unselectAll")
      : t("dropdown.button.selectAll");
  }

  const handleExpensesCalculation = useCallback((key: ExpensesUpsertProps) => {
    // Calculate Total Distance Cargo
    const _distanceCargo = Number(key.distanceCargo) || 0;
    const _toleranceCargo = Number(key.toleranceCargo) || 0;
    const _totalDistanceCargo = _distanceCargo + _toleranceCargo;

    // Calculate Total Distance Empty
    const _distanceEmpty = Number(key.distanceEmpty) || 0;
    const _toleranceEmpty = Number(key.toleranceEmpty) || 0;
    const _totalDistanceEmpty = _distanceEmpty + _toleranceEmpty;

    // Calculate Grand Total Distance
    const _totalDistance = _totalDistanceCargo + _totalDistanceEmpty;

    // Calculate Total Fuel
    const _fuelCargo = Number(key.fuelCargo) || 0;
    const _fuelEmpty = Number(key.fuelEmpty) || 0;
    const _totalFuel = _fuelCargo + _fuelEmpty;

    // Calculate Operational Costs
    const _fuel = Number(key.fuel) || 0;
    const _toll = Number(key.toll) || 0;
    const _mell = Number(key.mell) || 0;
    const _loadingUnloading = Number(key.loadingUnloading) || 0;
    const _harborCrossing = Number(key.harborCrossing) || 0;
    const _workerContributions = Number(key.workerContributions) || 0;
    const _security = Number(key.security) || 0;
    const _documentShippingFee = Number(key.documentShippingFee) || 0;

    // Calculate Incentive
    const _incentiveKm = Number(key.incentiveKm) || 0;
    const _incentiveDaily = Number(key.incentiveDaily) || 0;
    const _incentiveSio = Number(key.incentiveSio) || 0;

    const _totalIncentive = _incentiveKm + _incentiveDaily + _incentiveSio;

    const _totalCost =
      _fuel +
      _toll +
      _mell +
      _loadingUnloading +
      _harborCrossing +
      _workerContributions +
      _security +
      _documentShippingFee;

    // Calculate Total Expense
    const _totalExpense = _totalCost + _totalIncentive;
    const _revenue = Number(key.revenue) || 0;
    const rawPercentage = _revenue > 0 ? (_totalExpense / _revenue) * 100 : 0;
    const _expenseRatio = `${Math.ceil(rawPercentage)}%`;

    return {
      ...key,
      totalDistanceCargo: _totalDistanceCargo,
      totalDistanceEmpty: _totalDistanceEmpty,
      totalDistance: _totalDistance,
      totalFuel: _totalFuel,
      totalCost: _totalCost,
      totalIncentive: _totalIncentive,
      totalExpense: _totalExpense,
      expenseRatio: _expenseRatio,
    };
  }, []);

  const isAnyDropdownEmpty = useMemo(() => {
    return Object.values(dropdownDownload).some((value) =>
      Array.isArray(value) ? value.length === 0 : !value,
    );
  }, [dropdownDownload]);

  useEffect(() => {
    dispatch(expensesActions.createExpensesClear());
  }, []);

  useEffect(() => {
    if (isNull(data) || activeUpsert === -1) return;

    const _activeData = data[activeUpsert];

    if (_activeData?.upsertStatus === "SUCCESS") {
      onHandleNextUpsert();
    } else {
      onHandleUpsertBulk(_activeData);

      setData((_prev) => {
        if (isNull(_prev)) return null;

        return _prev?.map((_item, _index) => {
          if (_index === activeUpsert) {
            return { ..._item, upsertStatus: "UPLOADING", upsertReason: "" };
          }

          return _item;
        });
      });
    }
  }, [activeUpsert]);

  // TODO: UPDATE TABLE DATA SUCCESSFULLY CREATED
  useEffect(() => {
    const _data = createExpenses?.data;

    if (isEmpty(_data) || isNull(data) || activeUpsert === -1) return;
    onHandleNextUpsert();

    setData((_prev) => {
      if (isNull(_prev)) return null;

      return _prev?.map((_item) => {
        if (_item?.upsertStatus === "UPLOADING") {
          return {
            ..._item,
            upsertStatus: "SUCCESS",
          };
        }

        return _item;
      });
    });
    dispatch(expensesActions.createExpensesClear());
  }, [createExpenses?.data]);

  // TODO: UPDATE TABLE DATA ERROR
  useEffect(() => {
    const _error = createExpenses?.error;

    if (isEmpty(_error) || isNull(data) || activeUpsert === -1) return;
    onHandleNextUpsert();

    setData((_prev) => {
      if (isNull(_prev)) return null;

      return _prev?.map((_item) => {
        if (_item?.upsertStatus === "UPLOADING") {
          let errorMessage = "";

          if ((_error as any)?.data?.errors?.length) {
            const errorData = (_error as any).data.errors;
            errorMessage = errorData
              ?.map((err: { field: any; message: any }) => err.message)
              ?.join(", ");
          } else {
            errorMessage = (_error as any).data.message;
          }

          return {
            ..._item,
            upsertStatus: "FAILED",
            upsertReason: errorMessage,
          };
        }

        return _item;
      });
    });
    dispatch(expensesActions.createExpensesClear());
  }, [createExpenses?.error]);

  useEffect(() => {
    const isFailed = data?.some((o) => o.upsertStatus === "FAILED");
    if (activeUpsert < 0 && isFailed && !showErr) {
      MessageHandler().error({ content: t("message.failed") });
      setShowErr(true);
    }
  }, [activeUpsert, data, showErr]);

  useEffect(() => {
    if (!dropdownDownload.customerId) return;
    const params = {
      limit: 1000,
      page: 1,
      customerId: dropdownDownload.customerId || undefined,
    };
    dispatch(customerContractActions.getContractsFetch(params));

    return () => {
      dispatch(customerContractActions.getContractsClear());
    };
  }, [dropdownDownload.customerId]);

  useEffect(() => {
    if (!dropdownDownload.customerId || !dropdownDownload.contractId) return;
    const params = {
      limit: 1000,
      page: 1,
      customerId: dropdownDownload.customerId || undefined,
      contractId: [dropdownDownload.contractId],
    };
    dispatch(customerRouteActions.getDropdownCustomerRoutesFetch(params));

    return () => {
      dispatch(customerRouteActions.getDropdownCustomerRoutesClear());
    };
  }, [dropdownDownload.contractId, dropdownDownload.customerId]);

  useEffect(() => {
    dispatch(businessAreaActions.getDropdownBusinessAreasFetch({}));

    dispatch(customerActions.getCustomersFetch({ page: 1, limit: 1000 }));

    return () => {
      dispatch(businessAreaActions.getDropdownBusinessAreasClear());
      setDropdownDownload({
        customerId: undefined,
        contractId: undefined,
        customerRouteIds: [],
        branchIds: [],
      });
    };
  }, []);

  useEffect(() => {
    if (!data || !updateTable) return;
    setData((prev) => {
      if (isNull(prev)) return null;
      const _updatedData = prev.map((key: ExpensesUpsertProps) =>
        handleExpensesCalculation(key),
      );

      return _updatedData;
    });

    setUpdateTable(false);
  }, [updateTable, data]);

  return (
    <Flex vertical gap={16}>
      <Card.Container>
        <Flex vertical gap={8}>
          <Row gutter={[16, 16]}>
            <Col span={24} lg={12}>
              <p>{t("dropdown.customerName.title")}</p>
              <Select
                id="customer-name"
                optionFilterProp="label"
                placeholder={t("dropdown.customerName.placeholder")}
                onChange={(value) => handleChangeDropdown(value, "customerId")}
                value={dropdownDownload.customerId}
                loading={loading[customerActions.getCustomersFetch.type]}
                disabled={loading[customerActions.getCustomersFetch.type]}
                onClear={() => {
                  setDropdownDownload((prev) => ({
                    ...prev,
                    customerId: undefined,
                    contractId: undefined,
                    customerRouteIds: [],
                  }));
                }}
                options={dropdownCustomers?.map((opt) => ({
                  value: opt.id,
                  label: opt.name,
                }))}
              />
            </Col>
            <Col span={24} lg={12}>
              <p>{t("dropdown.contractNo.title")}</p>
              <Select
                id="contract-no"
                placeholder={t("dropdown.contractNo.placeholder")}
                onChange={(value) => handleChangeDropdown(value, "contractId")}
                value={dropdownDownload.contractId}
                loading={loading[customerContractTypes.GET_CONTRACTS]}
                disabled={
                  loading[customerContractTypes.GET_CONTRACTS] ||
                  !dropdownDownload.customerId
                }
              >
                {dropdownContracts.map((opt) => (
                  <Select.Option key={opt.id} value={opt.id}>
                    {opt.contractNo}
                  </Select.Option>
                ))}
              </Select>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24} lg={12}>
              <p>{t("dropdown.routeCode.title")}</p>
              <Select
                mode="multiple"
                id="routeCode"
                maxTagCount={1}
                placeholder={t("dropdown.routeCode.placeholder")}
                onChange={(value) =>
                  handleChangeDropdown(value, "customerRouteIds")
                }
                value={dropdownDownload.customerRouteIds}
                loading={
                  loading[customerRouteTypes.GET_DROPDOWN_CUSTOMER_ROUTES]
                }
                disabled={
                  loading[customerRouteTypes.GET_DROPDOWN_CUSTOMER_ROUTES] ||
                  !dropdownDownload.customerId ||
                  !dropdownDownload.contractId
                }
              >
                {dropdownCustomerRoutes.data?.length > 0 ? (
                  <Select.Option value="all" key="all">
                    {getDynamicSelectAllLabel(
                      dropdownCustomerRoutes.data,
                      "id",
                      "customerRouteIds",
                    )}
                  </Select.Option>
                ) : null}
                {dropdownCustomerRoutes.data.map((opt) => (
                  <Select.Option key={opt.id} value={opt.id}>
                    {opt.originalRouteCode}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col span={24} lg={12}>
              <p>{t("dropdown.branch.title")}</p>
              <Select
                mode="multiple"
                id="branch"
                maxTagCount={5}
                placeholder={t("dropdown.branch.placeholder")}
                onChange={(value) => handleChangeDropdown(value, "branchIds")}
                value={dropdownDownload.branchIds}
                loading={loading[businessAreaTypes.GET_DROPDOWN_BUSINESS_AREAS]}
                disabled={
                  loading[businessAreaTypes.GET_DROPDOWN_BUSINESS_AREAS]
                }
              >
                {dropdownBusinessAreas.data?.length > 0 ? (
                  <Select.Option value="all" key="all">
                    {getDynamicSelectAllLabel(
                      dropdownBusinessAreas.data,
                      "id",
                      "branchIds",
                    )}
                  </Select.Option>
                ) : null}
                {dropdownBusinessAreas.data.map((opt) => (
                  <Select.Option key={opt.id} value={opt.id}>
                    {opt.name}
                  </Select.Option>
                ))}
              </Select>
            </Col>
          </Row>
        </Flex>
      </Card.Container>
      <Card.Container>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12} className={styles["download-template"]}>
            <Row>
              <h3>{t("action.download.desc")}</h3>
            </Row>

            <Row>
              <Button
                id="btn-download-template"
                type="primary"
                className="ant-btn-custom primary"
                onClick={() =>
                  dispatch(
                    expensesActions.downloadExpensesTemplateFetch({
                      branchIds: dropdownDownload.branchIds,
                      customerId: dropdownDownload.customerId || "",
                      contractId: dropdownDownload.contractId || "",
                      customerRouteIds: dropdownDownload.customerRouteIds,
                    }),
                  )
                }
                loading={loading[expensesTypes.DOWNLOAD_EXPENSES_TEMPLATE]}
                disabled={
                  loading[expensesTypes.DOWNLOAD_EXPENSES_TEMPLATE] ||
                  isAnyDropdownEmpty
                }
              >
                {t("action.download.btn")}
              </Button>
            </Row>
          </Col>

          <Col xs={24} md={12}>
            <UploadDnD
              name="file"
              accept=".xls, .xlsx"
              showUploadList={false}
              beforeUpload={onHandlingUploadFile}
            />
          </Col>
        </Row>
      </Card.Container>

      {data && dataBulk ? (
        <Card.Container>
          <TableEditable
            columns={Columns({ data: dataBulk })}
            dataSource={
              Array.isArray(data) && data?.length > 30
                ? data.slice((page - 1) * limit, page * limit)
                : (data ?? [])
            }
            total={data?.length ?? 0}
            current={page}
            pageSize={limit}
            showTitle={false}
            showActions={false}
            showPagination={data?.length > 30}
            onPageChange={onPageChangeListener}
            rowKey={"no"}
            scroll={{ x: "max-content" }}
            onSaveAction={({ index, key, value }) => {
              setData((_prev) => {
                if (isNull(_prev)) return null;
                const _indx = index + (page - 1) * limit;
                return _prev?.map((_item, _index) => {
                  return _indx === _index
                    ? {
                        ..._item,
                        [key]: value,
                        upsertStatus: "CHANGED",
                        upsertReason: "",
                      }
                    : _item;
                });
              });

              setUpdateTable(true);
            }}
          />
        </Card.Container>
      ) : null}

      <Row justify="end" gutter={[8, 8]}>
        <Col>
          <Button
            id="btn-upload-bulk"
            type="primary"
            className="ant-btn-custom primary"
            onClick={() => setActiveUpsert(0)}
            disabled={
              isNull(data) ||
              data?.length === 0 ||
              data?.every((_item) => _item?.upsertStatus === "SUCCESS") ||
              activeUpsert !== -1
            }
            loading={activeUpsert !== -1}
          >
            {t("action.upload")}
          </Button>
        </Col>
      </Row>
    </Flex>
  );
}

export default ExpensesUpsert;
