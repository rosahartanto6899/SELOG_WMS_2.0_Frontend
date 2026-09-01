import Card from "@sera-components/card";
import RsFormBuilder from "@sera-components/rs-form-builder";
import Table from "@sera-components/table";
import { ChildConfig } from "@sera-libraries/types/formBuilderType";
import {
  bookingOrderActions,
  useAppDispatch,
  useAppSelector,
} from "@sera-redux";
import {
  ShipmentDetailPayload,
  SummaryRouteRecord,
} from "@sera-types/additional-expense.type";
import { bookingOrderTypes } from "@sera-types/booking-order.type";
import { NUMBER_FORMAT } from "@sera-utils/constants/common";
import Utils from "@sera-utils/utils";
import { Divider, Flex, Form } from "antd";
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import { FC, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

import useShipmentDetail from "./hooks/useShipmentDetail";

export const ColumnsSummaryRoute = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "additionalExpense.table",
  });

  return [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      align: "center",
      width: 70,
    },
    {
      title: t("summaryColumn.type"),
      dataIndex: "type",
      key: "type",
      truncate: true,
      align: "left",
    },
    {
      title: t("summaryColumn.location"),
      dataIndex: "location",
      key: "location",
      truncate: true,
    },
    {
      title: t("summaryColumn.address"),
      dataIndex: "address",
      key: "address",
      truncate: true,
      width: 200,
    },
    {
      title: t("summaryColumn.province"),
      dataIndex: "province",
      key: "province",
      truncate: true,
    },
    {
      title: t("summaryColumn.city"),
      dataIndex: "city",
      key: "city",
      truncate: true,
    },
    {
      title: t("summaryColumn.district"),
      dataIndex: "district",
      key: "district",
      truncate: true,
    },
    {
      title: t("summaryColumn.area"),
      dataIndex: "area",
      key: "area",
      truncate: true,
      align: "left",
    },
  ];
};

interface ShipmentDetailProps {
  id: string;
}

export const ShipmentDetailForm: FC<ShipmentDetailProps> = ({ id }) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "additionalExpense.form",
  });
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const { dropdownAdditionalRequestItems } = useAppSelector(
    (state) => state.bookingOrder,
  );
  const loading = useAppSelector((state) => state.loading);

  const {
    queries: { fetchDetails },
    data: { shipmentDetails },
  } = useShipmentDetail();

  const { _data: data, summaryRouteData: routeData } =
    useMemo(() => {
      if (isEmpty(shipmentDetails)) {
        return {
          _data: {},
          summaryRouteData: [],
        };
      }
      const _shipmentInformation = shipmentDetails?.shipmentInformation;
      const _shipmentDetail = shipmentDetails?.shipmentDetail;
      const _vehicleInformation = shipmentDetails?.vehicleInformation;
      const _driverInformation = shipmentDetails?.driverInformation;
      const _expenseInformation = shipmentDetails?.expense;

      const _data: ShipmentDetailPayload = {
        additionalRequest: _shipmentInformation?.additionalRequests,
        bookingNumber: _shipmentInformation?.bookingOrderNo ?? "-",
        branch: _shipmentInformation?.branchOrder?.name,
        branchOrder: _shipmentInformation?.branchOrder?.name,
        contractNo: _shipmentInformation?.contract?.contractNo,
        customerName: _shipmentInformation?.customerName,
        distanceCargo: `${_expenseInformation?.distanceWithCargo ?? 0}`,
        distanceEmpty: `${_expenseInformation?.distanceWithoutCargo ?? 0}`,
        driver1_branch: _driverInformation?.[0]?.branch?.name ?? "-",
        driver1_customerName: _driverInformation?.[0]?.customer?.name ?? "-",
        driver1_driverId: _driverInformation?.[0]?.employeeId,
        driver1_driverName: _driverInformation?.[0]?.employeeName ?? "-",
        driver1_employeeStatus: _driverInformation?.[0]?.employeeStatus ?? "-",
        driver1_mobilePhone: _driverInformation?.[0]?.mobilePhone ?? "-",
        driver1_note: _driverInformation?.[0]?.note ?? "-",
        driver1_shipmentType: _driverInformation?.[0]?.shipmentType ?? "-",
        driver1_tierDriver: _driverInformation?.[0]?.tiers,
        driver1_vkVd: _driverInformation?.[0]?.vkvd ?? "-",
        driver2_branch: _driverInformation?.[1]?.branch?.name ?? "-",
        driver2_customerName: _driverInformation?.[1]?.customer?.name ?? "-",
        driver2_driverId: _driverInformation?.[1]?.employeeId ?? "-",
        driver2_driverName: _driverInformation?.[1]?.employeeName ?? "-",
        driver2_employeeStatus: _driverInformation?.[1]?.employeeStatus ?? "-",
        driver2_mobilePhone: _driverInformation?.[1]?.mobilePhone ?? "-",
        driver2_note: _driverInformation?.[1]?.note ?? "-",
        driver2_shipmentType: _driverInformation?.[1]?.shipmentType ?? "-",
        driver2_tierDriver: _driverInformation?.[1]?.tiers,
        driver2_vkVd: _driverInformation?.[1]?.vkvd ?? "-",
        eta: _shipmentDetail?.eta
          ? dayjs(_shipmentDetail?.eta).format("YYYY-MM-DD HH:mm")
          : "-",
        expenseRatio: _expenseInformation?.expenseRatio,
        fuel: _expenseInformation?.operationalCost?.fuel,
        fuelCargo: _expenseInformation?.fuelCargo ?? 0,
        fuelEmpty: _expenseInformation?.fuelEmpty ?? 0,
        harborCrossing: _expenseInformation?.operationalCost?.harborCrossing,
        hasDashcam: Boolean(_vehicleInformation?.hasDashcam),
        hasObd: Boolean(_vehicleInformation?.hasObd),
        incentiveDaily: _expenseInformation?.incentive?.incentiveDaily,
        incentiveKm: _expenseInformation?.incentive?.incentiveKM,
        incentiveSio: _expenseInformation?.incentive?.incentiveSIO,
        jmpCode: _shipmentDetail?.jmpCode ?? "-",
        licensePlate: _vehicleInformation?.licensePlate ?? "-",
        loadingUnloading:
          _expenseInformation?.operationalCost?.loadingUnloading,
        mell: _expenseInformation?.operationalCost?.mell,
        note: _shipmentDetail?.note ?? "-",
        vehicleNote: _vehicleInformation?.note ?? "-",
        ownership: _vehicleInformation?.ownership ?? "-",
        pickupDate: _shipmentDetail?.pickupDate
          ? dayjs(_shipmentDetail?.pickupDate).format("YYYY-MM-DD HH:mm")
          : "-",
        revenue: `Rp.${NUMBER_FORMAT(_shipmentInformation?.revenue)}`,
        routeCode: _shipmentDetail?.routeCode ?? "-",
        salesDealing: _shipmentInformation?.salesDealing ?? "-",
        salesServicing: _shipmentInformation?.salesServicing ?? "-",
        security: _expenseInformation?.operationalCost?.security,
        shipmentNumber: _shipmentInformation?.shipmentNo,
        shipmentType: _shipmentInformation?.shipmentType ?? "-",
        soCreatedDate: _shipmentInformation?.soCreatedDate
          ? dayjs(_shipmentInformation?.soCreatedDate).format("YYYY-MM-DD")
          : "-",
        soNumber: _shipmentInformation?.soNumber ?? "-",
        toleranceCargo: _expenseInformation?.toleranceWithCargo ?? 0,
        toleranceEmpty: _expenseInformation?.toleranceWithoutCargo ?? 0,
        toll: _expenseInformation?.operationalCost?.toll,
        tollUsage: NUMBER_FORMAT(_shipmentDetail?.tollUsage),
        totalCost: _expenseInformation?.operationalCost?.totalCost,
        totalDistance: _expenseInformation?.totalDistance,
        totalDistanceCargo: _expenseInformation?.totalDistanceCargo,
        totalDistanceEmpty: _expenseInformation?.totalDistanceEmpty,
        totalExpense: _expenseInformation?.total,
        totalFuel: _expenseInformation?.totalFuel,
        totalIncentive: _expenseInformation?.incentive?.totalIncentive,
        unitType: _vehicleInformation?.vehicleTypeName ?? "-",
        vehicle_customerName: _vehicleInformation?.customerAssignment ?? "-",
        vin: _vehicleInformation?.vin,
        workerContributions: `${_expenseInformation?.operationalCost?.workerContributions ?? "0"}`,
        year: _vehicleInformation?.vehicleYear ?? "-",
        documentShippingFee:
          _expenseInformation?.operationalCost?.documentShippingFee || 0,
        termin1: _expenseInformation?.terminSummary?.termin1 || 0,
        termin2: _expenseInformation?.terminSummary?.termin2 || 0,
        termin3: _expenseInformation?.terminSummary?.termin3 || 0,
        termin4: _expenseInformation?.terminSummary?.termin4 || 0,
        termin5: _expenseInformation?.terminSummary?.termin5 || 0,
        termin6: _expenseInformation?.terminSummary?.termin6 || 0,
      };

      const sortedSummaryRouteData = [
        ...(_shipmentDetail?.routeLocations || []),
      ].sort((a, b) => a.order - b.order);

      const summaryRouteData: SummaryRouteRecord[] = sortedSummaryRouteData.map(
        (item, i) => ({
          no: i + 1,
          type:
            item.activityType.toLowerCase() === "loading"
              ? "Origin"
              : "Destination",
          location: item?.location?.name || "-",
          address: item?.location?.address || "-",
          province: item?.location?.province?.name || "-",
          city: item?.location?.city?.name?.trim() || "-",
          district: item?.location?.district?.name || "-",
          area: item?.location?.area || "-",
        }),
      );

      return {
        _data,
        summaryRouteData,
      };
    }, [shipmentDetails]) || {};

  const driver2Exist = shipmentDetails?.driverInformation?.length > 1;

  useEffect(() => {
    if (id) fetchDetails({ id });
  }, [id]);

  const SHIPMENT_DETAIL_CONFIG: ChildConfig[] = [
    {
      id: "routeCode",
      type: "text",
      name: "routeCode",
      label: t("shipmentDetail.shipmentDetail.routeCode.label"),
      placeholder: t("shipmentDetail.shipmentDetail.routeCode.placeholder"),
    },
    {
      id: "jmpCode",
      type: "text",
      name: "jmpCode",
      label: t("shipmentDetail.shipmentDetail.jmpCode.label"),
      placeholder: t("shipmentDetail.shipmentDetail.jmpCode.placeholder"),
    },
    {
      id: "pickupDate",
      type: "text",
      name: "pickupDate",
      label: t("shipmentDetail.shipmentDetail.pickupDate.label"),
      placeholder: t("shipmentDetail.shipmentDetail.pickupDate.placeholder"),
    },
    {
      id: "eta",
      type: "text",
      name: "eta",
      label: t("shipmentDetail.shipmentDetail.eta.label"),
      placeholder: t("shipmentDetail.shipmentDetail.eta.placeholder"),
      disabled: true,
    },
    {
      id: "tollUsage",
      type: "text",
      name: "tollUsage",
      label: t("shipmentDetail.shipmentDetail.tollUsage.label"),
      placeholder: t("shipmentDetail.shipmentDetail.tollUsage.placeholder"),
    },
    {
      id: "note",
      type: "text",
      name: "note",
      label: t("shipmentDetail.shipmentDetail.note.label"),
      placeholder: t("shipmentDetail.shipmentDetail.note.placeholder"),
    },
  ];

  const VEHICLE_INFORMATION_CONFIG: ChildConfig[] = [
    {
      id: "licensePlate",
      type: "text",
      name: "licensePlate",
      label: t("shipmentDetail.vehicleInformation.licensePlate.label"),
      placeholder: t(
        "shipmentDetail.vehicleInformation.licensePlate.placeholder",
      ),
    },
    {
      id: "unitType",
      type: "text",
      name: "unitType",
      label: t("shipmentDetail.vehicleInformation.unitType.label"),
      placeholder: t("shipmentDetail.vehicleInformation.unitType.placeholder"),
    },
    {
      id: "shipmentType",
      type: "text",
      name: "shipmentType",
      label: t("shipmentDetail.vehicleInformation.shipmentType.label"),
      placeholder: t(
        "shipmentDetail.vehicleInformation.shipmentType.placeholder",
      ),
    },
    {
      id: "vehicle_customerName",
      type: "text",
      name: "vehicle_customerName",
      label: t("shipmentDetail.vehicleInformation.customerName.label"),
      placeholder: t(
        "shipmentDetail.vehicleInformation.customerName.placeholder",
      ),
    },
    {
      id: "branch",
      type: "text",
      name: "branch",
      label: t("shipmentDetail.vehicleInformation.branch.label"),
      placeholder: t("shipmentDetail.vehicleInformation.branch.placeholder"),
    },
    {
      id: "year",
      type: "text",
      name: "year",
      label: t("shipmentDetail.vehicleInformation.year.label"),
      placeholder: t("shipmentDetail.vehicleInformation.year.placeholder"),
    },
    {
      id: "vin",
      type: "text",
      name: "vin",
      label: t("shipmentDetail.vehicleInformation.vin.label"),
      placeholder: t("shipmentDetail.vehicleInformation.vin.placeholder"),
    },
    {
      id: "ownership",
      type: "text",
      name: "ownership",
      label: t("shipmentDetail.vehicleInformation.ownership.label"),
      placeholder: t("shipmentDetail.vehicleInformation.ownership.placeholder"),
    },
    {
      id: "hasObd",
      type: "switch",
      name: "hasObd",
      label: t("shipmentDetail.vehicleInformation.hasObd.label"),
      placeholder: t("shipmentDetail.vehicleInformation.hasObd.placeholder"),
      options: ["Yes", "No"],
    },
    {
      id: "hasDashcam",
      type: "switch",
      name: "hasDashcam",
      label: t("shipmentDetail.vehicleInformation.hasDashcam.label"),
      options: ["Yes", "No"],
      placeholder: t(
        "shipmentDetail.vehicleInformation.hasDashcam.placeholder",
      ),
    },
    {
      id: "note",
      type: "text",
      name: "vehicleNote",
      label: t("shipmentDetail.vehicleInformation.note.label"),
      placeholder: t("shipmentDetail.vehicleInformation.note.placeholder"),
    },
  ];

  const DRIVER_1_INFORMATION_CONFIG: ChildConfig[] = [
    {
      id: "driver1_driverName",
      type: "text",
      name: "driver1_driverName",
      label: t("shipmentDetail.driverInformation.driver1.driverName.label"),
      placeholder: t(
        "shipmentDetail.driverInformation.driver1.driverName.placeholder",
      ),
    },
    {
      id: "driver1_employeeStatus",
      type: "text",
      name: "driver1_employeeStatus",
      label: t("shipmentDetail.driverInformation.driver1.employeeStatus.label"),
      placeholder: t(
        "shipmentDetail.driverInformation.driver1.employeeStatus.placeholder",
      ),
    },
    {
      id: "driver1_vkVd",
      type: "text",
      name: "driver1_vkVd",
      label: t("shipmentDetail.driverInformation.driver1.vkVd.label"),
      placeholder: t(
        "shipmentDetail.driverInformation.driver1.vkVd.placeholder",
      ),
    },
    {
      id: "driver1_driverId",
      type: "text",
      name: "driver1_driverId",
      label: t("shipmentDetail.driverInformation.driver1.driverId.label"),
      placeholder: t(
        "shipmentDetail.driverInformation.driver1.driverId.placeholder",
      ),
    },
    {
      id: "driver1_branch",
      type: "text",
      name: "driver1_branch",
      label: t("shipmentDetail.driverInformation.driver1.branch.label"),
      placeholder: t(
        "shipmentDetail.driverInformation.driver1.branch.placeholder",
      ),
    },
    {
      id: "driver1_tierDriver",
      type: "text",
      name: "driver1_tierDriver",
      label: t("shipmentDetail.driverInformation.driver1.tierDriver.label"),
      placeholder: t(
        "shipmentDetail.driverInformation.driver1.tierDriver.placeholder",
      ),
    },
    {
      id: "driver1_shipmentType",
      type: "text",
      name: "driver1_shipmentType",
      label: t("shipmentDetail.driverInformation.driver1.shipmentType.label"),
      placeholder: t(
        "shipmentDetail.driverInformation.driver1.shipmentType.placeholder",
      ),
    },
    {
      id: "driver1_customerName",
      type: "text",
      name: "driver1_customerName",
      label: t("shipmentDetail.driverInformation.driver1.customerName.label"),
      placeholder: t(
        "shipmentDetail.driverInformation.driver1.customerName.placeholder",
      ),
    },
    {
      id: "driver1_mobilePhone",
      type: "text",
      name: "driver1_mobilePhone",
      label: t("shipmentDetail.driverInformation.driver1.mobilePhone.label"),
      placeholder: t(
        "shipmentDetail.driverInformation.driver1.mobilePhone.placeholder",
      ),
    },
    {
      id: "driver1_note",
      type: "text",
      name: "driver1_note",
      label: t("shipmentDetail.driverInformation.driver1.note.label"),
      placeholder: t(
        "shipmentDetail.driverInformation.driver1.note.placeholder",
      ),
    },
  ];

  const DRIVER_2_INFORMATION_CONFIG: ChildConfig[] = [
    {
      id: "driver2_driverName",
      type: "text",
      name: "driver2_driverName",
      label: t("shipmentDetail.driverInformation.driver2.driverName.label"),
      placeholder: t(
        "shipmentDetail.driverInformation.driver2.driverName.placeholder",
      ),
    },
    {
      id: "driver2_employeeStatus",
      type: "text",
      name: "driver2_employeeStatus",
      label: t("shipmentDetail.driverInformation.driver2.employeeStatus.label"),
      placeholder: t(
        "shipmentDetail.driverInformation.driver2.employeeStatus.placeholder",
      ),
    },
    {
      id: "driver2_vkVd",
      type: "text",
      name: "driver2_vkVd",
      label: t("shipmentDetail.driverInformation.driver2.vkVd.label"),
      placeholder: t(
        "shipmentDetail.driverInformation.driver2.vkVd.placeholder",
      ),
    },
    {
      id: "driver2_driverId",
      type: "text",
      name: "driver2_driverId",
      label: t("shipmentDetail.driverInformation.driver2.driverId.label"),
      placeholder: t(
        "shipmentDetail.driverInformation.driver2.driverId.placeholder",
      ),
    },
    {
      id: "driver2_branch",
      type: "text",
      name: "driver2_branch",
      label: t("shipmentDetail.driverInformation.driver2.branch.label"),
      placeholder: t(
        "shipmentDetail.driverInformation.driver2.branch.placeholder",
      ),
    },
    {
      id: "driver2_tierDriver",
      type: "text",
      name: "driver2_tierDriver",
      label: t("shipmentDetail.driverInformation.driver2.tierDriver.label"),
      placeholder: t(
        "shipmentDetail.driverInformation.driver2.tierDriver.placeholder",
      ),
    },
    {
      id: "driver2_shipmentType",
      type: "text",
      name: "driver2_shipmentType",
      label: t("shipmentDetail.driverInformation.driver2.shipmentType.label"),
      placeholder: t(
        "shipmentDetail.driverInformation.driver2.shipmentType.placeholder",
      ),
    },
    {
      id: "driver2_customerName",
      type: "text",
      name: "driver2_customerName",
      label: t("shipmentDetail.driverInformation.driver2.customerName.label"),
      placeholder: t(
        "shipmentDetail.driverInformation.driver2.customerName.placeholder",
      ),
    },
    {
      id: "driver2_mobilePhone",
      type: "text",
      name: "driver2_mobilePhone",
      label: t("shipmentDetail.driverInformation.driver2.mobilePhone.label"),
      placeholder: t(
        "shipmentDetail.driverInformation.driver2.mobilePhone.placeholder",
      ),
    },
    {
      id: "driver2_note",
      type: "text",
      name: "driver2_note",
      label: t("shipmentDetail.driverInformation.driver2.note.label"),
      placeholder: t(
        "shipmentDetail.driverInformation.driver2.note.placeholder",
      ),
    },
  ];

  const SHIPMENT_INFORMATION_CONFIG: ChildConfig[] = [
    {
      id: "shipmentNumber",
      type: "text",
      name: "shipmentNumber",
      label: t("shipmentDetail.shipmentInformation.shipmentNumber.label"),
      placeholder: t(
        "shipmentDetail.shipmentInformation.shipmentNumber.placeholder",
      ),
    },
    {
      id: "bookingNumber",
      type: "text",
      name: "bookingNumber",
      label: t("shipmentDetail.shipmentInformation.bookingNumber.label"),
      placeholder: t(
        "shipmentDetail.shipmentInformation.bookingNumber.placeholder",
      ),
    },
    {
      id: "shipmentType",
      type: "text",
      name: "shipmentType",
      label: t("shipmentDetail.shipmentInformation.shipmentType.label"),
      placeholder: t(
        "shipmentDetail.shipmentInformation.shipmentType.placeholder",
      ),
    },
    {
      id: "customerName",
      type: "text",
      name: "customerName",
      label: t("shipmentDetail.shipmentInformation.customerName.label"),
      placeholder: t(
        "shipmentDetail.shipmentInformation.customerName.placeholder",
      ),
    },
    {
      id: "branchOrder",
      type: "text",
      name: "branchOrder",
      label: t("shipmentDetail.shipmentInformation.branchOrder.label"),
      placeholder: t(
        "shipmentDetail.shipmentInformation.branchOrder.placeholder",
      ),
    },
    {
      id: "contractNo",
      type: "text",
      name: "contractNo",
      label: t("shipmentDetail.shipmentInformation.contractNo.label"),
      placeholder: t(
        "shipmentDetail.shipmentInformation.contractNo.placeholder",
      ),
    },
    {
      id: "salesDealing",
      type: "text",
      name: "salesDealing",
      label: t("shipmentDetail.shipmentInformation.salesDealing.label"),
      placeholder: t(
        "shipmentDetail.shipmentInformation.salesDealing.placeholder",
      ),
    },
    {
      id: "salesServicing",
      type: "text",
      name: "salesServicing",
      label: t("shipmentDetail.shipmentInformation.salesServicing.label"),
      placeholder: t(
        "shipmentDetail.shipmentInformation.salesServicing.placeholder",
      ),
    },
    {
      id: "soNumber",
      type: "text",
      name: "soNumber",
      label: t("shipmentDetail.shipmentInformation.soNumber.label"),
      placeholder: t("shipmentDetail.shipmentInformation.soNumber.placeholder"),
    },
    {
      id: "soCreatedDate",
      type: "text",
      name: "soCreatedDate",
      label: t("shipmentDetail.shipmentInformation.soCreatedDate.label"),
      placeholder: t(
        "shipmentDetail.shipmentInformation.soCreatedDate.placeholder",
      ),
    },
    {
      id: "revenue",
      type: "text", // Or "number" if preferred, keeping text for consistency/flexibility unless typed
      name: "revenue",
      label: t("shipmentDetail.shipmentInformation.revenue.label"),
      placeholder: t("shipmentDetail.shipmentInformation.revenue.placeholder"),
    },
    {
      id: "additionalRequest",
      type: "checkbox",
      name: "additionalRequest",
      label: t("shipmentDetail.shipmentInformation.additionalRequest.label"),
      placeholder: t(
        "shipmentDetail.shipmentInformation.additionalRequest.placeholder",
      ),
      mdSize: 24,
      columns: { xs: 12, xl: 8 },
      options: dropdownAdditionalRequestItems.data.map((_item) => ({
        value: _item?.id,
        label: _item?.name,
      })),
      loading: loading[bookingOrderTypes.GET_DROPDOWN_ADDITIONAL_REQUEST_ITEMS],
      dependency: {
        fields: [],
      },
    },
  ];

  const DISTANCE_AND_FUEL_CONFIG: ChildConfig[] = [
    {
      id: "distanceCargo",
      type: "number",
      name: "distanceCargo",
      label: t("shipmentDetail.distanceAndFuel.distanceCargo.label"),
      placeholder: t(
        "shipmentDetail.distanceAndFuel.distanceCargo.placeholder",
      ),
    },
    {
      id: "toleranceCargo",
      type: "number",
      name: "toleranceCargo",
      label: t("shipmentDetail.distanceAndFuel.toleranceCargo.label"),
      placeholder: t(
        "shipmentDetail.distanceAndFuel.toleranceCargo.placeholder",
      ),
    },
    {
      id: "totalDistanceCargo",
      type: "number",
      name: "totalDistanceCargo",
      label: t("shipmentDetail.distanceAndFuel.totalDistanceCargo.label"),
      placeholder: t(
        "shipmentDetail.distanceAndFuel.totalDistanceCargo.placeholder",
      ),
      disabled: true,
    },
    {
      id: "distanceEmpty",
      type: "number",
      name: "distanceEmpty",
      label: t("shipmentDetail.distanceAndFuel.distanceEmpty.label"),
      placeholder: t(
        "shipmentDetail.distanceAndFuel.distanceEmpty.placeholder",
      ),
    },
    {
      id: "toleranceEmpty",
      type: "number",
      name: "toleranceEmpty",
      label: t("shipmentDetail.distanceAndFuel.toleranceEmpty.label"),
      placeholder: t(
        "shipmentDetail.distanceAndFuel.toleranceEmpty.placeholder",
      ),
    },
    {
      id: "totalDistanceEmpty",
      type: "number",
      name: "totalDistanceEmpty",
      label: t("shipmentDetail.distanceAndFuel.totalDistanceEmpty.label"),
      placeholder: t(
        "shipmentDetail.distanceAndFuel.totalDistanceEmpty.placeholder",
      ),
      disabled: true,
    },
    {
      id: "totalDistance",
      type: "number",
      name: "totalDistance",
      label: t("shipmentDetail.distanceAndFuel.totalDistance.label"),
      placeholder: t(
        "shipmentDetail.distanceAndFuel.totalDistance.placeholder",
      ),
      disabled: true,
    },
    {
      id: "fuelCargo",
      type: "number",
      name: "fuelCargo",
      label: t("shipmentDetail.distanceAndFuel.fuelCargo.label"),
      placeholder: t("shipmentDetail.distanceAndFuel.fuelCargo.placeholder"),
    },
    {
      id: "fuelEmpty",
      type: "number",
      name: "fuelEmpty",
      label: t("shipmentDetail.distanceAndFuel.fuelEmpty.label"),
      placeholder: t("shipmentDetail.distanceAndFuel.fuelEmpty.placeholder"),
    },
    {
      id: "totalFuel",
      type: "number",
      name: "totalFuel",
      label: t("shipmentDetail.distanceAndFuel.totalFuel.label"),
      placeholder: t("shipmentDetail.distanceAndFuel.totalFuel.placeholder"),
      disabled: true,
    },
  ];

  const OPERATIONAL_COSTS_CONFIG: ChildConfig[] = [
    {
      id: "fuel",
      type: "number",
      name: "fuel",
      label: t("shipmentDetail.operationalCosts.fuel.label"),
      placeholder: t("shipmentDetail.operationalCosts.fuel.placeholder"),
      prefix: "Rp.",
    },
    {
      id: "toll",
      type: "number",
      name: "toll",
      label: t("shipmentDetail.operationalCosts.toll.label"),
      placeholder: t("shipmentDetail.operationalCosts.toll.placeholder"),
      prefix: "Rp.",
    },
    {
      id: "mell",
      type: "number",
      name: "mell",
      label: t("shipmentDetail.operationalCosts.mell.label"),
      placeholder: t("shipmentDetail.operationalCosts.mell.placeholder"),
      prefix: "Rp.",
    },
    {
      id: "loadingUnloading",
      type: "number",
      name: "loadingUnloading",
      label: t("shipmentDetail.operationalCosts.loadingUnloading.label"),
      placeholder: t(
        "shipmentDetail.operationalCosts.loadingUnloading.placeholder",
      ),
      prefix: "Rp.",
    },
    {
      id: "harborCrossing",
      type: "number",
      name: "harborCrossing",
      label: t("shipmentDetail.operationalCosts.harborCrossing.label"),
      placeholder: t(
        "shipmentDetail.operationalCosts.harborCrossing.placeholder",
      ),
      prefix: "Rp.",
    },
    {
      id: "workerContributions",
      type: "number",
      name: "workerContributions",
      label: t("shipmentDetail.operationalCosts.workerContributions.label"),
      placeholder: t(
        "shipmentDetail.operationalCosts.workerContributions.placeholder",
      ),
      prefix: "Rp.",
    },
    {
      id: "security",
      type: "number",
      name: "security",
      label: t("shipmentDetail.operationalCosts.security.label"),
      placeholder: t("shipmentDetail.operationalCosts.security.placeholder"),
      prefix: "Rp.",
    },
    {
      id: "documentShippingFee",
      type: "number",
      name: "documentShippingFee",
      label: t("shipmentDetail.operationalCosts.documentShippingFee.label"),
      placeholder: t(
        "shipmentDetail.operationalCosts.documentShippingFee.placeholder",
      ),
      prefix: "Rp.",
    },
    {
      id: "totalCost",
      type: "number",
      name: "totalCost",
      label: t("shipmentDetail.operationalCosts.totalCost.label"),
      prefix: "Rp.",
      placeholder: t("shipmentDetail.operationalCosts.totalCost.placeholder"),
      disabled: true,
    },
  ];

  const INCENTIVE_CONFIG: ChildConfig[] = [
    {
      id: "incentiveKm",
      type: "number",
      name: "incentiveKm",
      label: t("shipmentDetail.incentive.incentiveKm.label"),
      prefix: "Rp.",
      placeholder: t("shipmentDetail.incentive.incentiveKm.placeholder"),
    },
    {
      id: "incentiveDaily",
      type: "number",
      name: "incentiveDaily",
      label: t("shipmentDetail.incentive.incentiveDaily.label"),
      prefix: "Rp.",
      placeholder: t("shipmentDetail.incentive.incentiveDaily.placeholder"),
    },
    {
      id: "incentiveSio",
      type: "number",
      name: "incentiveSio",
      label: t("shipmentDetail.incentive.incentiveSio.label"),
      prefix: "Rp.",
      placeholder: t("shipmentDetail.incentive.incentiveSio.placeholder"),
    },
    {
      id: "totalIncentive",
      type: "number",
      name: "totalIncentive",
      label: t("shipmentDetail.incentive.totalIncentive.label"),
      prefix: "Rp.",
      placeholder: t("shipmentDetail.incentive.totalIncentive.placeholder"),
      disabled: true,
    },
  ];

  const TOTAL_EXPENSE_CONFIG: ChildConfig[] = [
    {
      id: "totalExpense",
      type: "number",
      name: "totalExpense",
      label: t("shipmentDetail.totalExpense.totalExpense.label"),
      placeholder: t("shipmentDetail.totalExpense.totalExpense.placeholder"),
      prefix: "Rp.",
      disabled: true,
    },
    {
      id: "expenseRatio",
      type: "text",
      name: "expenseRatio",
      label: t("shipmentDetail.totalExpense.expenseRatio.label"),
      placeholder: t("shipmentDetail.totalExpense.expenseRatio.placeholder"),
      disabled: true,
    },
    {
      id: "revenue",
      type: "number",
      name: "revenue",
      label: "revenue",
      placeholder: "revenue",
      hidden: true,
      disabled: true,
    },
  ];

  const TERMIN_CONFIG: ChildConfig[] = [
    {
      id: "termin1",
      type: "number",
      name: "termin1",
      label: t("shipmentDetail.termin.termin1.label"),
      placeholder: t("shipmentDetail.termin.termin1.placeholder"),
      prefix: "Rp.",
    },
    {
      id: "termin2",
      type: "number",
      name: "termin2",
      label: t("shipmentDetail.termin.termin2.label"),
      placeholder: t("shipmentDetail.termin.termin2.placeholder"),
      prefix: "Rp.",
    },
    {
      id: "termin3",
      type: "number",
      name: "termin3",
      label: t("shipmentDetail.termin.termin3.label"),
      placeholder: t("shipmentDetail.termin.termin3.placeholder"),
      prefix: "Rp.",
    },
    {
      id: "termin4",
      type: "number",
      name: "termin4",
      label: t("shipmentDetail.termin.termin4.label"),
      placeholder: t("shipmentDetail.termin.termin4.placeholder"),
      prefix: "Rp.",
    },
    {
      id: "termin5",
      type: "number",
      name: "termin5",
      label: t("shipmentDetail.termin.termin5.label"),
      placeholder: t("shipmentDetail.termin.termin5.placeholder"),
      prefix: "Rp.",
    },
    {
      id: "termin6",
      type: "number",
      name: "termin6",
      label: t("shipmentDetail.termin.termin6.label"),
      placeholder: t("shipmentDetail.termin.termin6.placeholder"),
      prefix: "Rp.",
    },
  ];

  const { withDash } = Utils();

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...withDash(data),
        expenseRatio: data.expenseRatio,
        additionalRequest: data.additionalRequest?.length
          ? data.additionalRequest.map((e) => e.id)
          : [],
      });
    }
  }, [data]);

  useEffect(() => {
    dispatch(bookingOrderActions.getDropdownAdditionalRequestItemsFetch());

    return () => {
      dispatch(bookingOrderActions.getDropdownAdditionalRequestItemsClear());
    };
  }, []);

  return (
    <Flex vertical gap={24}>
      <Card title={t("shipmentDetail.shipmentInformation.title")}>
        <RsFormBuilder
          type={"create"}
          layout="vertical"
          name={""}
          form={form}
          onFinish={() => {}}
          onCancel={() => {}}
          configs={SHIPMENT_INFORMATION_CONFIG}
          isHideFormButton
          loading={true}
          disabled={true}
        />
      </Card>
      <Card title={t("shipmentDetail.shipmentDetail.title")}>
        <RsFormBuilder
          type={"create"}
          layout="vertical"
          name={""}
          form={form}
          onFinish={() => {}}
          onCancel={() => {}}
          configs={SHIPMENT_DETAIL_CONFIG}
          isHideFormButton
          loading={true}
          disabled={true}
        />

        <Divider orientation="left" orientationMargin={0}>
          {t("title.summaryRouteLocation")}
        </Divider>
        <Table
          showTitle={false}
          columns={ColumnsSummaryRoute()}
          scroll={{ x: "max-content" }}
          dataSource={routeData}
          isCustomSearch={false}
          showActions={false}
        />
      </Card>
      <Card title={t("shipmentDetail.vehicleInformation.title")}>
        <RsFormBuilder
          type={"create"}
          layout="vertical"
          name={""}
          form={form}
          onFinish={() => {}}
          onCancel={() => {}}
          configs={VEHICLE_INFORMATION_CONFIG}
          isHideFormButton
          loading={true}
          disabled={true}
        />
      </Card>
      <Card title={t("shipmentDetail.driverInformation.title")}>
        <div style={{ marginBottom: 16 }}>
          <strong>{t("shipmentDetail.driverInformation.driver1.title")}</strong>
        </div>
        <RsFormBuilder
          type={"create"}
          layout="vertical"
          name={""}
          form={form}
          onFinish={() => {}}
          onCancel={() => {}}
          configs={DRIVER_1_INFORMATION_CONFIG}
          isHideFormButton
          loading={true}
          disabled={true}
        />

        {Boolean(driver2Exist) && (
          <>
            <div style={{ marginTop: 24, marginBottom: 16 }}>
              <strong>
                {t("shipmentDetail.driverInformation.driver2.title")}
              </strong>
            </div>

            <RsFormBuilder
              type={"create"}
              layout="vertical"
              name={""}
              form={form}
              onFinish={() => {}}
              onCancel={() => {}}
              configs={DRIVER_2_INFORMATION_CONFIG}
              isHideFormButton
              loading={true}
              disabled={true}
            />
          </>
        )}
      </Card>
      <Card title={t("shipmentDetail.distanceAndFuel.title")}>
        <RsFormBuilder
          type={"create"}
          layout="vertical"
          name={""}
          form={form}
          onFinish={() => {}}
          onCancel={() => {}}
          configs={DISTANCE_AND_FUEL_CONFIG}
          isHideFormButton
          loading={true}
          disabled={true}
        />
      </Card>
      <Card title={t("shipmentDetail.operationalCosts.title")}>
        <RsFormBuilder
          type={"create"}
          layout="vertical"
          name={""}
          form={form}
          onFinish={() => {}}
          onCancel={() => {}}
          configs={OPERATIONAL_COSTS_CONFIG}
          isHideFormButton
          loading={true}
          disabled={true}
        />
      </Card>
      <Card title={t("shipmentDetail.incentive.title")}>
        <RsFormBuilder
          type={"create"}
          layout="vertical"
          name={""}
          form={form}
          onFinish={() => {}}
          onCancel={() => {}}
          configs={INCENTIVE_CONFIG}
          isHideFormButton
          loading={true}
          disabled={true}
        />
      </Card>
      <Card title={t("shipmentDetail.totalExpense.title")}>
        <RsFormBuilder
          type={"create"}
          layout="vertical"
          name={""}
          form={form}
          onFinish={() => {}}
          onCancel={() => {}}
          configs={TOTAL_EXPENSE_CONFIG}
          isHideFormButton
          loading={true}
          disabled={true}
        />
      </Card>

      <Card title={t("shipmentDetail.termin.title")}>
        <RsFormBuilder
          type={"create"}
          layout="vertical"
          name={""}
          form={form}
          onFinish={() => {}}
          onCancel={() => {}}
          configs={TERMIN_CONFIG}
          isHideFormButton
          loading={true}
          disabled={true}
        />
      </Card>

      {/* <Row justify={"end"}>
        <Space style={{ marginTop: "1rem" }} align="end" wrap>
          <Button>{t("button.cancel")}</Button>
          <Button type="primary">{t("button.submit")}</Button>
        </Space>
      </Row> */}
    </Flex>
  );
};
