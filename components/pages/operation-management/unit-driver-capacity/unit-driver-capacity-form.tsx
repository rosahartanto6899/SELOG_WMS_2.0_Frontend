import Card from "@sera-components/card";
import RsFormBuilder from "@sera-components/rs-form-builder";
import { ChildConfig } from "@sera-libraries/types/formBuilderType";
import { useAppSelector } from "@sera-redux";
import { Flex } from "antd";
import { FormInstance } from "antd/lib";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface UnitDriverCapacityFormProps {
  form: FormInstance;
}

const UnitDriverCapacityForm = ({ form }: UnitDriverCapacityFormProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "unitDriverCapacity.form",
  });

  const router = useRouter();

  const type = router.query.type;

  const IS_UNIT = type === "unit";

  const requiredMessage = t("message");

  const {
    unitCapacity: {
      detail: { data: detailUnit },
    },
    driverCapacity: {
      detail: { data: detailDriver },
    },
  } = useAppSelector((state) => state.unitDriverCapacity);

  const FORM_UNIT_INFORMATION: ChildConfig[] = [
    {
      id: "licensePlate",
      type: "text",
      name: "licensePlate",
      label: t("unit.input.licensePlate.label"),
      placeholder: t("unit.input.licensePlate.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "unitYear",
      type: "text",
      name: "unitYear",
      label: t("unit.input.unitYear.label"),
      placeholder: t("unit.input.unitYear.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "unitType",
      type: "text",
      name: "unitType",
      label: t("unit.input.unitType.label"),
      placeholder: t("unit.input.unitType.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "description",
      type: "text",
      name: "description",
      label: t("unit.input.description.label"),
      placeholder: t("unit.input.description.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "shipmentType",
      type: "text",
      name: "shipmentType",
      label: t("unit.input.shipmentType.label"),
      placeholder: t("unit.input.shipmentType.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "customerAssignment",
      type: "text",
      name: "customerAssignment",
      label: t("unit.input.customerAssignment.label"),
      placeholder: t("unit.input.customerAssignment.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "branch",
      type: "text",
      name: "branch",
      label: t("unit.input.branch.label"),
      placeholder: t("unit.input.branch.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "ownership",
      type: "text",
      name: "ownership",
      label: t("unit.input.ownership.label"),
      placeholder: t("unit.input.ownership.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "lastPosition",
      type: "text",
      name: "lastPosition",
      label: t("unit.input.lastPosition.label"),
      placeholder: t("unit.input.lastPosition.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "area",
      type: "text",
      name: "area",
      label: t("unit.input.area.label"),
      placeholder: t("unit.input.area.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "note",
      type: "text",
      name: "note",
      label: t("unit.input.note.label"),
      placeholder: t("unit.input.note.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
  ];

  const SHIPMENT_UNIT_INFORMATION: ChildConfig[] = [
    {
      id: "bookingCode",
      type: "text",
      name: "bookingCode",
      label: t("unit.input.bookingCode.label"),
      placeholder: t("unit.input.bookingCode.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "shipmentNo",
      type: "text",
      name: "shipmentNo",
      label: t("unit.input.shipmentNo.label"),
      placeholder: t("unit.input.shipmentNo.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "customerName",
      type: "text",
      name: "customerName",
      label: t("unit.input.customerName.label"),
      placeholder: t("unit.input.customerName.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "estimationTimeArrival",
      type: "text",
      name: "estimationTimeArrival",
      label: t("unit.input.estimationTimeArrival.label"),
      placeholder: t("unit.input.estimationTimeArrival.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "origin",
      type: "text",
      name: "origin",
      label: t("unit.input.origin.label"),
      placeholder: t("unit.input.origin.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "destination",
      type: "text",
      name: "destination",
      label: t("unit.input.destination.label"),
      placeholder: t("unit.input.destination.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "driver1",
      type: "text",
      name: "driver1",
      label: t("unit.input.driver1.label"),
      placeholder: t("unit.input.driver1.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "driver2",
      type: "text",
      name: "driver2",
      label: t("unit.input.driver2.label"),
      placeholder: t("unit.input.driver2.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "noteShipment",
      type: "text",
      name: "noteShipment",
      label: t("unit.input.noteShipment.label"),
      placeholder: t("unit.input.noteShipment.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
  ];

  const FORM_DRIVER_INFORMATION: ChildConfig[] = [
    {
      id: "driverId",
      type: "text",
      name: "driverId",
      label: t("driver.input.driverId.label"),
      placeholder: t("driver.input.driverId.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "vkvd",
      type: "text",
      name: "vkvd",
      label: t("driver.input.vkvd.label"),
      placeholder: t("driver.input.vkvd.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "driverName",
      type: "text",
      name: "driverName",
      label: t("driver.input.driverName.label"),
      placeholder: t("driver.input.driverName.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "phoneNumber",
      type: "text",
      name: "phoneNumber",
      label: t("driver.input.phoneNumber.label"),
      placeholder: t("driver.input.phoneNumber.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "shipmentType",
      type: "text",
      name: "shipmentType",
      label: t("driver.input.shipmentType.label"),
      placeholder: t("driver.input.shipmentType.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "customerAssignment",
      type: "text",
      name: "customerAssignment",
      label: t("driver.input.customerAssignment.label"),
      placeholder: t("driver.input.customerAssignment.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "branch",
      type: "text",
      name: "branch",
      label: t("driver.input.branch.label"),
      placeholder: t("driver.input.branch.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "employeeStatus",
      type: "text",
      name: "employeeStatus",
      label: t("driver.input.employeeStatus.label"),
      placeholder: t("driver.input.employeeStatus.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "lastPosition",
      type: "text",
      name: "lastPosition",
      label: t("driver.input.lastPosition.label"),
      placeholder: t("driver.input.lastPosition.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "area",
      type: "text",
      name: "area",
      label: t("driver.input.area.label"),
      placeholder: t("driver.input.area.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "note",
      type: "text",
      name: "note",
      label: t("driver.input.note.label"),
      placeholder: t("driver.input.note.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
  ];

  const SHIPMENT_DRIVER_INFORMATION: ChildConfig[] = [
    {
      id: "bookingCode",
      type: "text",
      name: "bookingCode",
      label: t("driver.input.bookingCode.label"),
      placeholder: t("driver.input.bookingCode.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "shipmentNo",
      type: "text",
      name: "shipmentNo",
      label: t("driver.input.shipmentNo.label"),
      placeholder: t("driver.input.shipmentNo.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "customerName",
      type: "text",
      name: "customerName",
      label: t("driver.input.customerName.label"),
      placeholder: t("driver.input.customerName.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "estimationTimeArrival",
      type: "text",
      name: "estimationTimeArrival",
      label: t("driver.input.estimationTimeArrival.label"),
      placeholder: t("driver.input.estimationTimeArrival.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "origin",
      type: "text",
      name: "origin",
      label: t("driver.input.origin.label"),
      placeholder: t("driver.input.origin.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "destination",
      type: "text",
      name: "destination",
      label: t("driver.input.destination.label"),
      placeholder: t("driver.input.destination.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "licensePlate",
      type: "text",
      name: "licensePlate",
      label: t("driver.input.licensePlate.label"),
      placeholder: t("driver.input.licensePlate.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "unitType",
      type: "text",
      name: "unitType",
      label: t("driver.input.unitType.label"),
      placeholder: t("driver.input.unitType.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "noteShipment",
      type: "text",
      name: "noteShipment",
      label: t("driver.input.noteShipment.label"),
      placeholder: t("driver.input.noteShipment.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
  ];

  const withDash = <T extends Record<string, any>>(obj?: T) =>
    Object.fromEntries(
      Object.entries(obj ?? {}).map(([key, value]) => [key, value || "-"]),
    );

  useEffect(() => {
    if (IS_UNIT) {
      if (!detailUnit?.unitInformation || !detailUnit?.shipmentInformation)
        return;

      const { unitInformation, shipmentInformation } = detailUnit;
      form.setFieldsValue({
        ...withDash(unitInformation),
        unitType: unitInformation.vehicleType || "-",
        ...withDash(shipmentInformation),
        driver1: shipmentInformation.driver1?.employeeName || "-",
        driver2: shipmentInformation.driver2?.employeeName || "-",
        estimationTimeArrival: shipmentInformation.estimationTimeArrival
          ? dayjs(shipmentInformation.estimationTimeArrival).format(
              "DD-MM-YYYY HH:mm",
            )
          : "-",
        noteShipment: shipmentInformation.note || "-",
      });
    } else {
      if (!detailDriver?.driver || !detailDriver?.shipment) return;

      const { driver, shipment } = detailDriver;
      form.setFieldsValue({
        ...withDash(driver),
        branch: driver.branchName || "-",
        ...withDash(shipment),
        estimationTimeArrival: shipment.estimateTimeArrival
          ? dayjs(shipment.estimateTimeArrival).format("DD-MM-YYYY HH:mm")
          : "-",
        noteShipment: shipment.note || "-",
      });
    }
  }, [detailDriver, detailUnit, IS_UNIT, form]);

  useEffect(() => {
    if (!router.isReady) return;
    if (!type) {
      router.back();
    }
  }, [router.isReady, type, router]);

  const _TITLE = IS_UNIT ? t("unit.title") : t("driver.title");

  return (
    <Flex gap={16} vertical>
      <Card title={_TITLE}>
        <RsFormBuilder
          type={"create"}
          layout="vertical"
          name={""}
          form={form}
          onFinish={() => {}}
          onCancel={() => {}}
          configs={IS_UNIT ? FORM_UNIT_INFORMATION : FORM_DRIVER_INFORMATION}
          isHideFormButton
          loading={true}
          disabled={true}
        />
      </Card>
      <Card title={t("unit.titleShipment")}>
        <RsFormBuilder
          type={"create"}
          layout="vertical"
          name={""}
          form={form}
          onFinish={() => {}}
          onCancel={() => {}}
          configs={
            IS_UNIT ? SHIPMENT_UNIT_INFORMATION : SHIPMENT_DRIVER_INFORMATION
          }
          isHideFormButton
          loading={true}
          disabled={true}
        />
      </Card>
    </Flex>
  );
};

export default UnitDriverCapacityForm;
