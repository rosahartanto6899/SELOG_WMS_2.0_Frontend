/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import Button from "@sera-components/button";
import Card from "@sera-components/card";
// import Error404 from "@sera-components/error-boundary/Error404";
import FormActions from "@sera-components/hocs/form-actions";
// import useGetPermissionFleetManagement from "@sera-components/pages/fleet-management/hooks/useGetPermission";
import TableEditable from "@sera-components/table-editable";
import UploadDnD from "@sera-components/upload-dnd";
import { RootState, stockManagementActions } from "@sera-redux";
import { LoadingState } from "@sera-types/loading.type";
import {
  StockManagementState,
  stockManagementTypes,
} from "@sera-types/stock-management.type";
import { Col, Flex, message, Row } from "antd";
import { RcFile } from "antd/lib/upload";
import { cloneDeep, identity, isEmpty, isEqual, isNull, pickBy } from "lodash";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import * as XLSX from "xlsx";

import styles from "./booking-order.module.scss";
import {
  Columns,
  DataBulk,
  FormatConstant,
  HEADER_KEYS,
  // payloadingData,
  // validatingDate,
  ValidationData,
} from "./booking-order-upsert-bulk-props-table";

type Data = { [_key: string]: string | undefined };

interface StockManagementUpsertBulkProps {
  loading: LoadingState;
  stockManagement: StockManagementState;
  upsertVehicle: typeof stockManagementActions.upsertVehicleFetch;
  upsertVehicleClear: typeof stockManagementActions.upsertVehicleClear;
  downloadTemplate: typeof stockManagementActions.downloadTemplateFetch;
}

function BookingOrderUpsertBulk({
  loading,
  stockManagement,
  upsertVehicle,
  upsertVehicleClear,
  downloadTemplate,
}: StockManagementUpsertBulkProps) {
  // const { isCreate, isUpdate } =
  //   useGetPermissionFleetManagement("stock-management");

  const { t } = useTranslation(undefined, {
    keyPrefix: "bookingOrder.upsert",
  });

  const [data, setData] = useState<Data[] | null>(null);
  const [dataBulk, setDataBulk] = useState<DataBulk | null>(null);
  const [activeUpsert, setActiveUpsert] = useState(-1);

  const onHandlingUploadFile = (file: RcFile) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const arrayBuffer = e.target?.result;
      if (!arrayBuffer) return;

      try {
        const REQUIRED_SHEET = [
          "Formulir input",
          "Ref_bodyKey",
          // "Ref_salesName",
          // "Ref_branchOrder",
          // "Ref_pickupDate",
          // "Ref_customerName",
          // "Ref_shipmentType",
          // "Ref_unitType",
          // "Ref_routeCode",
          // "Ref_qtyUnit",
          // "Ref_qtyDriver",
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
        console.log({ _isMissingSheets, workbook });
        if (_isMissingSheets.length > 0) throw new Error("");

        const _bodyRef = XLSXtoJSON("Ref_bodyKey");
        const _bodyRefIds = _bodyRef?.map(({ id }) => id);
        const _bodyRefNames = _bodyRef?.map(({ name }) => name);
        const _header = XLSXtoJSON("Formulir input", 4, true)[0];

        // Based on header configuration with itself
        console.log(isEqual(_bodyRefNames, _header), {
          _bodyRefNames,
          _header,
        });
        if (!isEqual(_bodyRefNames, _header)) throw new Error("");

        // Based on header configuration with FE
        if (!isEqual(HEADER_KEYS, _bodyRefIds)) throw new Error("");

        const _dropdown = {
          branchOrder: [],
          customerName: [],
          shipmentType: [],
          unitType: [],
          routeCode: [],
        };

        setData(
          ValidationData(
            XLSXtoJSON("Formulir input", 4),
            XLSXtoJSON("Ref_bodyKey"),
            _dropdown,
          ),
        );

        setDataBulk({
          titles: FormatConstant(XLSXtoJSON("Ref_bodyKey")),
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
      if (isNull(data) || _nextIndex >= data?.length) return -1;
      return _nextIndex;
    });
  };

  const onHandleUpsertBulk = async (_data: Data) => {
    if (isNull(data) || isNull(dataBulk)) return;

    // const { dropdown } = dataBulk;
    const _payload = cloneDeep(_data);

    delete _payload?.no;
    delete _payload?.upsertStatus;
    delete _payload?.upsertReason;

    const _finalPayload = {
      ..._payload,

      // Type Number
      km: Number(_payload?.km),

      // Type: Dropdown
      // branchId: payloadingData(dropdown?.branch, _payload?.branchId),
      // hasObd: Number(payloadingData(dropdown?.hasObd, _payload?.hasObd)),
      // customerId: payloadingData(dropdown?.customer, _payload?.customerId),
      // fuel: payloadingData(dropdown?.fuel, _payload?.fuel),
      // ownership: payloadingData(dropdown?.ownership, _payload?.ownership),
      // statusObd: payloadingData(dropdown?.statusObd, _payload?.statusObd),

      // shipmentType: payloadingData(
      //   dropdown?.shipmentType,
      //   _payload?.shipmentType,
      // ),
      // vehicleTypeId: payloadingData(
      //   dropdown?.vehicleType,
      //   _payload?.vehicleTypeId,
      // ),

      // Type: Date
      // kirExpired: validatingDate(_payload?.kirExpired),
      // licenseExpired: validatingDate(_payload?.licenseExpired),
      // acquisitionDate: validatingDate(_payload?.acquisitionDate),
      // depreciationStartDate: validatingDate(_payload?.depreciationStartDate),
      // planDisposalDate: validatingDate(_payload?.planDisposalDate),
      // actualDisposalDate: validatingDate(_payload?.actualDisposalDate),

      // Type: Date with time
      // lastLocationUpdatedAt: validatingDate(
      //   _payload?.lastLocationUpdatedAt,
      //   true,
      // ),
    };

    upsertVehicle(pickBy(_finalPayload, identity));
  };

  useEffect(() => {
    upsertVehicleClear();
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
            return { ..._item, upsertStatus: "UPLOADING" };
          }

          return _item;
        });
      });
    }
  }, [activeUpsert]);

  useEffect(() => {
    const _data = stockManagement?.upsertVehicle?.data;

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
  }, [stockManagement?.upsertVehicle?.data]);

  useEffect(() => {
    const _error = stockManagement?.upsertVehicle?.error;

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
  }, [stockManagement?.upsertVehicle?.error]);

  // if (!isCreate || !isUpdate) return <Error404 />;

  return (
    <Flex vertical gap={16}>
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
                onClick={() => downloadTemplate()}
                loading={loading[stockManagementTypes.DOWNLOAD_TEMPLATE]}
                disabled={loading[stockManagementTypes.DOWNLOAD_TEMPLATE]}
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
            dataSource={data ?? []}
            total={data?.length ?? 0}
            rowKey={(row: any) => `${row.key}`}
            scroll={{ x: "max-content" }}
            showPagination={false}
            onSaveAction={({ index, key, value }) => {
              setData((_prev) => {
                if (isNull(_prev)) return null;

                return _prev?.map((_item, _index) => {
                  return index === _index
                    ? {
                        ..._item,
                        [key]: value,
                        upsertStatus: "CHANGED",
                        upsertReason: "",
                      }
                    : _item;
                });
              });
            }}
          />
        </Card.Container>
      ) : null}

      <FormActions>
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
      </FormActions>
    </Flex>
  );
}

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  stockManagement: state.stockManagement,
});

const mapDispatchToProps = {
  upsertVehicle: stockManagementActions.upsertVehicleFetch,
  upsertVehicleClear: stockManagementActions.upsertVehicleClear,
  downloadTemplate: stockManagementActions.downloadTemplateFetch,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BookingOrderUpsertBulk);
