/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Card from "@sera-components/card";
import MessageHandler from "@sera-libraries/message-handler";
import {
  masterDataActions,
  pairingMatchingActions,
  RootState,
} from "@sera-redux";
import {
  Demands,
  PairingMatchingState,
  UnitParams,
  UnpairedDriver,
  UnpairedUnit,
} from "@sera-types/pairing-matching";
import { Col, Flex, Form, Row } from "antd";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import PairingMatchingFilters from "./pairing-matching-filters";
import PairingMatchingForm from "./pairing-matching-form";
import PairingMatchingMaps from "./pairing-matching-maps";
import PairingMatchingSummary from "./pairing-matching-summary";
import TableDemands from "./pairing-matching-table-demands";
import TableDrivers from "./pairing-matching-table-drivers";
import TablePaired from "./pairing-matching-table-paired";
import TableUnits from "./pairing-matching-table-units";

const DEFAULT_PARAMS: UnitParams = {
  branchId: [],
  area: [],
  unitTypeId: [],
};

interface UnitActivitiesInitialPageProps {
  pairingMatching: PairingMatchingState;
  pairingProcess: typeof pairingMatchingActions.pairingProcessFetch;
  pairingProcessClear: typeof pairingMatchingActions.pairingProcessClear;
  getUnitCapacityStatuses: typeof masterDataActions.getUnitCapacityStatusesFetch;
}

const UnitActivitiesInitialPage = ({
  pairingMatching,
  pairingProcess,
  pairingProcessClear,
  getUnitCapacityStatuses,
}: UnitActivitiesInitialPageProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "pairingMatching",
  });

  const [form] = Form.useForm();

  const [params, setParams] = useState<UnitParams>(DEFAULT_PARAMS);
  const [selectedData, setSelectedData] = useState<Record<string, any>>({});

  const onChangeFilter = (_value: UnitParams) => {
    setParams((_prev) => ({ ..._prev, ..._value }));
  };

  const onSelectDataDemand = (_value: Demands, _index?: number) => {
    setSelectedData((_prev) => ({
      ..._prev,
      id: _value?.id,
      shipmentNo: _value?.shipmentNo,
      qtyDriver: _value?.qtyDriver,
      vehicleTypeId: _value?.vehicleTypeId,
      originId: _value?.originId,
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
    if (!selectedData?.qtyDriver) return;
    const _isTwoDriver = selectedData?.qtyDriver === 2;

    if (isEmpty(selectedData?.driverId1)) {
      setSelectedData((_prev) => ({
        ..._prev,
        driverId1: _value?.id,
        driverName1: _value?.driverName,
      }));
    } else if (!_isTwoDriver && selectedData?.driverId1) {
      setSelectedData((_prev) => ({
        ..._prev,
        driverId1: _value?.id,
        driverName1: _value?.driverName,
      }));
    } else if (
      _isTwoDriver &&
      isEmpty(selectedData?.driverId2) &&
      _value?.id !== selectedData?.driverId1
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
      _isTwoDriver &&
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
    }
  };

  const onHandlePairingProcess = () => {
    form
      .validateFields()
      .then(() => {
        pairingProcess({
          id: selectedData?.id,
          vehicleId: selectedData?.vehicleId,
          driverId1: selectedData?.driverId1,
          driverId2: selectedData?.driverId2 || null,
        });
      })
      .catch((_error: any) => {
        MessageHandler().error({ content: t("message") });
      });
  };

  useEffect(() => {
    getUnitCapacityStatuses();
  }, []);

  useEffect(() => {
    Object.entries(selectedData).forEach((_item) => {
      if (isEmpty(_item[1])) return form.resetFields([_item[0]]);
      form.setFields([{ name: _item[0], value: _item[1], errors: [] }]);
    });
  }, [selectedData]);

  useEffect(() => {
    if (isEmpty(pairingMatching?.pairingProcess?.data)) return;

    MessageHandler().success(t("toast.pairing"));
    pairingProcessClear();
    setSelectedData({});
    form.resetFields();
  }, [pairingMatching?.pairingProcess?.data]);

  return (
    <Flex gap={24} vertical>
      <Card.Filter>
        <PairingMatchingFilters
          params={params}
          onChangeFilter={onChangeFilter}
        />
      </Card.Filter>

      <Card>
        <PairingMatchingSummary params={params} />
      </Card>

      <Card>
        <PairingMatchingMaps params={params} />
      </Card>

      <Card>
        <TableDemands
          params={params}
          data={selectedData}
          onSelectData={onSelectDataDemand}
        />
      </Card>

      <Row gutter={32}>
        <Col
          style={{ display: "flex", flexDirection: "column" }}
          span={24}
          lg={12}
        >
          <Card style={{ flex: 1 }}>
            <TableUnits
              params={params}
              data={selectedData}
              onSelectData={onSelectDataUnit}
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

      <Card>
        <TablePaired params={params} />
      </Card>
    </Flex>
  );
};

const mapStateToProps = (state: RootState) => ({
  pairingMatching: state.pairingMatching,
});

const mapDispatchToProps = {
  pairingProcess: pairingMatchingActions.pairingProcessFetch,
  pairingProcessClear: pairingMatchingActions.pairingProcessClear,
  getUnitCapacityStatuses: masterDataActions.getUnitCapacityStatusesFetch,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnitActivitiesInitialPage);
