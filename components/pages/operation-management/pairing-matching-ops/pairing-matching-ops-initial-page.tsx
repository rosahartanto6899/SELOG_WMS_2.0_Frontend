import Card from "@sera-components/card";
import Modal from "@sera-components/modal";
import MessageHandler from "@sera-libraries/message-handler";
import {
  Demands,
  UnitParams,
  UnpairedDriver,
  UnpairedUnit,
} from "@sera-types/pairing-matching-ops";
import { Col, Flex, Form, Row, Typography } from "antd";
import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import usePairingMatchingOps from "./hooks/usePairingMatchingOps";
import PairingMatchingFilters from "./pairing-matching-filters";
import PairingMatchingForm from "./pairing-matching-form";
import PairingMatchingMaps from "./pairing-matching-maps";
import PairingMatchingSummary from "./pairing-matching-summary";
import TableDemands from "./pairing-matching-table-demands";
import TableDrivers from "./pairing-matching-table-drivers";
import TableUnits from "./pairing-matching-table-units";

const DEFAULT_PARAMS: UnitParams = {
  branchId: [],
  area: [],
  unitTypeId: [],
  shipmentType: [],
};

const PairingMatchingOpsInintialPage = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "pairingMatchingOps",
  });

  const [form] = Form.useForm();

  const {
    queries: { fetchUnitCapacityStatus, fetchDemandFilter, fetchSummary },
    mutations: { pairingProcess },
  } = usePairingMatchingOps();

  const [isWarningWipeOpen, setIsWarningWipeOpen] = useState(false);
  const [tempParams, setTempParams] = useState<UnitParams>(DEFAULT_PARAMS);

  const [params, setParams] = useState<UnitParams>(DEFAULT_PARAMS);
  const [selectedData, setSelectedData] = useState<Record<string, any>>({});
  const [isSkipFetch, setIsSkipFetch] = useState(false);

  const onChangeFilter = (_value: any) => {
    if (!isEmpty(selectedData)) {
      setIsWarningWipeOpen(true);
      setTempParams({ ...params, ..._value });
    } else {
      setParams((_prev) => ({ ..._prev, ..._value }));
    }
  };

  const onSelectDataDemand = (_value: Demands, _index?: number) => {
    setSelectedData((_prev) => ({
      ..._prev,
      id: _value?.id,
      shipmentNo: _value?.shipmentNo,
      qtyDriver: _value?.qtyDriver,
      shipmentType: _value?.shipmentType,
      customerId: _value?.customerId,
      vehicleId: null,
      licensePlate: null,
      originId: _value.originId,
    }));
    setIsSkipFetch(true);
    setParams((_prev) => ({
      ..._prev,
      unitTypeId:
        _value.shipmentType === "Dedicated" ? [_value?.vehicleTypeId] : [],
    }));
  };

  const onSelectDataUnit = (_value: UnpairedUnit, _index?: number) => {
    setSelectedData((_prev) => ({
      ..._prev,
      vehicleId: _value?.id,
      licensePlate: _value?.licensePlate,
    }));
  };

  const onSelectDataDrivers = (_value: UnpairedDriver, _index?: number) => {
    if (isEmpty(selectedData?.driverId1)) {
      setSelectedData((_prev) => ({
        ..._prev,
        driverId1: _value?.id,
        driverName1: _value?.driverName,
      }));
    } else if (
      isEmpty(selectedData?.driverId2) &&
      _value?.id !== selectedData?.driverId1 &&
      selectedData?.qtyDriver > 1
    ) {
      setSelectedData((_prev) => ({
        ..._prev,
        driverId2: _value?.id,
        driverName2: _value?.driverName,
      }));
    } else if (
      _value?.id === selectedData?.driverId1 &&
      isEmpty(selectedData?.driverId2)
    ) {
      setSelectedData((_prev) => ({
        ..._prev,
        driverId1: undefined,
        driverName1: undefined,
      }));
    } else if (
      _value?.id === selectedData?.driverId1 &&
      !isEmpty(selectedData?.driverId2)
    ) {
      setSelectedData((_prev) => ({
        ..._prev,
        driverId1: _prev?.driverId2,
        driverName1: _prev?.driverName2,
        driverId2: undefined,
        driverName2: undefined,
      }));
    } else if (_value?.id === selectedData?.driverId2) {
      setSelectedData((_prev) => ({
        ..._prev,
        driverId2: undefined,
        driverName2: undefined,
      }));
    } else if (selectedData?.qtyDriver === 1) {
      setSelectedData((_prev) => ({
        ..._prev,
        driverId1: _value?.id,
        driverName1: _value?.driverName,
        driverId2: undefined,
        driverName2: undefined,
      }));
    }
  };

  const onHandlePairingProcess = () => {
    form
      .validateFields()
      .then(() => {
        pairingProcess(
          {
            id: selectedData?.id,
            vehicleId: selectedData?.vehicleId,
            driverId1: selectedData?.driverId1,
            driverId2: selectedData?.driverId2,
          },
          () => {
            MessageHandler().success(t("toast.pairing"));
            setSelectedData({});
            form.resetFields();
            fetchSummary(params);
          },
        );
      })
      .catch((_error: any) => {
        MessageHandler().error({ content: t("message") });
      });
  };

  useEffect(() => {
    fetchUnitCapacityStatus();
    fetchDemandFilter();
  }, []);

  useEffect(() => {
    Object.entries(selectedData).forEach((_item) => {
      if (isEmpty(_item[1])) return form.resetFields([_item[0]]);
      form.setFields([{ name: _item[0], value: _item[1], errors: [] }]);
    });
  }, [selectedData]);

  return (
    <>
      <Flex gap={24} vertical>
        <Card.Filter>
          <PairingMatchingFilters
            onChangeFilter={onChangeFilter}
            params={params}
          />
        </Card.Filter>

        <Card>
          <PairingMatchingSummary params={params} />
        </Card>

        <Card>
          <PairingMatchingMaps />
        </Card>

        <Card>
          <TableDemands
            data={selectedData}
            onSelectData={onSelectDataDemand}
            params={params}
            isSkipFetch={isSkipFetch}
            setIsSkipFetch={setIsSkipFetch}
          />
        </Card>

        {selectedData?.shipmentType?.toUpperCase() === "DEDICATED" && (
          <>
            <Row gutter={32}>
              <Col
                style={{ display: "flex", flexDirection: "column" }}
                span={24}
                lg={12}
              >
                <Card style={{ flex: 1 }}>
                  <TableUnits
                    data={selectedData}
                    onSelectData={onSelectDataUnit}
                    params={params}
                  />
                </Card>
              </Col>

              <Col
                style={{ display: "flex", flexDirection: "column" }}
                span={24}
                lg={12}
              >
                <Card style={{ flex: 1 }}>
                  <TableDrivers
                    params={params}
                    data={selectedData}
                    onSelectData={onSelectDataDrivers}
                  />
                </Card>
              </Col>
            </Row>

            <Card>
              <PairingMatchingForm
                form={form}
                data={selectedData}
                onSubmit={onHandlePairingProcess}
              />
            </Card>
          </>
        )}
      </Flex>
      <Modal.Confirm
        type="warning"
        open={isWarningWipeOpen}
        title={t("alert.title")}
        okText={t("alert.okBtn")}
        onOk={() => {
          setParams(tempParams);
          setIsWarningWipeOpen(false);
          setSelectedData({});
        }}
        onCancel={() => {
          setIsWarningWipeOpen(false);
          setTempParams(DEFAULT_PARAMS);
        }}
      >
        <Typography.Text>{t("alert.desc")}</Typography.Text>
      </Modal.Confirm>
    </>
  );
};

export default PairingMatchingOpsInintialPage;
