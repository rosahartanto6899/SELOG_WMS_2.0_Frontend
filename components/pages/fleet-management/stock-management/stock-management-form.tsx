/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Card from "@sera-components/card";
import Error404 from "@sera-components/error-boundary/Error404";
import Modal from "@sera-components/modal";
import RsFormBuilder from "@sera-components/rs-form-builder";
import Typography from "@sera-components/typography";
import { ChildConfig } from "@sera-libraries/types/formBuilderType";
import {
  businessAreaActions,
  customerActions,
  RootState,
  vehicleTypeActions,
} from "@sera-redux";
import {
  BusinessAreaState,
  businessAreaTypes,
} from "@sera-types/business-area.type";
import { CustomerState } from "@sera-types/customer.type";
import { LoadingState } from "@sera-types/loading.type";
import { StockManagementState } from "@sera-types/stock-management.type";
import {
  VehicleTypeState,
  vehicleTypeTypes,
} from "@sera-types/vehicle-type.type";
import { DATE_FORMAT, DATE_TO_FORM } from "@sera-utils/constants/common";
import { FormConfigHandler } from "@sera-utils/data-manipulator";
import { setFormErrorHandle } from "@sera-utils/error-handler";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { FormInstance } from "antd";
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

export const CONST_YES_NO = ["Yes", "No"];
export const CONST_OWNERSHIP = ["OWNED", "VENDOR"];
export const CONST_SHIPMENT_TYPE = ["Ritase", "Dedicated", "Not Defined"];
export const CONST_VEHICLE_STATUS = ["USP", "UTSP"];

interface StockManagementFormProps {
  type: "create" | "detail" | "update";
  form: FormInstance;
  loading: boolean;
  onSubmit: () => void;
  loadingState: LoadingState;
  businessAreas: BusinessAreaState;
  customers: CustomerState;
  stockManagement: StockManagementState;
  vehicleTypes: VehicleTypeState;
  getDropdownBusinessAreas: typeof businessAreaActions.getDropdownBusinessAreasFetch;
  getCustomers: typeof customerActions.getCustomersFetch;
  getDropdownVehicleTypes: typeof vehicleTypeActions.getDropdownVehicleTypesFetch;
}

export const FORMAT_PAYLOAD = (_data: { [_key: string]: string }) => {
  const DATE_FORMAT = (_value: string, _format = "YYYY-MM-DD") => {
    if (_value) return dayjs(_value)?.format(_format);
    return undefined;
  };

  const _payload = {
    ..._data,

    licensePlate: _data?.licensePlate?.replace(/\s+/g, ""),

    hasDashcam: _data?.hasDashcam ? 1 : 0,
    hasObd: _data?.hasObd ? 1 : 0,
    ownership: CONST_OWNERSHIP[_data?.ownership ? 0 : 1],
    vehicleStatus: CONST_VEHICLE_STATUS[_data?.vehicleStatus ? 0 : 1],

    acquisitionDate: DATE_FORMAT(_data?.acquisitionDate),
    actualDisposalDate: DATE_FORMAT(_data?.actualDisposalDate),
    kirExpired: DATE_FORMAT(_data?.kirExpired),
    licenseExpired: DATE_FORMAT(_data?.licenseExpired),
    planRegMaintenance: DATE_FORMAT(_data?.planRegMaintenance) ?? null,
  };

  if ("vehicleTypeGroup" in _payload) {
    delete _payload.vehicleTypeGroup;
  }

  return _payload;
};

const PAYLOAD = { page: 1, limit: 10 };

const StockManagementForm = ({
  type,
  form,
  loading,
  onSubmit,
  loadingState,
  businessAreas,
  customers,
  stockManagement,
  vehicleTypes,
  getDropdownBusinessAreas,
  getCustomers,
  getDropdownVehicleTypes,
}: StockManagementFormProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "stockManagement.form",
  });

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/fleet-management/stock-management/form");

  const messageRequired = t("message.required");
  const messageInvalidLength = (_value: number) => {
    return t("input.message.invalidLength", { total: _value });
  };

  const [isOpenAlert, setOpenAlert] = useState(false);

  const FORM_CONFIG = [
    {
      id: "vin",
      type: "text",
      name: "vin",
      label: t("input.vin.label"),
      placeholder: t("input.vin.placeholder"),
      disabled: type === "update",
      rules: [
        { required: type === "create", message: messageRequired },
        { max: 50, message: messageInvalidLength(50) },
      ],
      maxLength: 50,
      showCount: true,
    },
    {
      id: "licensePlate",
      type: "text",
      name: "licensePlate",
      label: t("input.licensePlate.label"),
      placeholder: t("input.licensePlate.placeholder"),
      rules: [
        { required: true, message: messageRequired },
        { max: 15, message: messageInvalidLength(15) },
      ],
      maxLength: 15,
      showCount: true,
    },
    {
      id: "vehicleTypeId",
      type: "select",
      name: "vehicleTypeId",
      placeholder: t("input.vehicleTypeId.placeholder"),
      options: vehicleTypes?.dropdownVehicleTypes?.data ?? [],
      valueField: "id",
      labelField: "name",
      rules: [{ required: true, message: messageRequired }],
      loading: loadingState[vehicleTypeTypes.GET_DROPDOWN_VEHICLE_TYPES],
      dependency: {
        fields: ["vehicleTypeId"],
        label: (_value) => {
          if (type === "detail") {
            return (
              <span>
                {t("input.vehicleTypeId.label")} (<strong>Unit Group</strong>:{" "}
                <>{stockManagement?.detailVehicle?.data?.vehicleTypeGroup}</>)
              </span>
            );
          }

          const _vehicleTypeGroup =
            vehicleTypes?.dropdownVehicleTypes?.data?.find(
              (_item) => _item?.id === _value?.vehicleTypeId,
            )?.group ?? "-";

          return (
            <span>
              {t("input.vehicleTypeId.label")} (<strong>Unit Group</strong>:{" "}
              <>{_vehicleTypeGroup}</>)
            </span>
          );
        },
      },
    },
    {
      id: "vehicleDescription",
      type: "text",
      name: "vehicleDescription",
      label: t("input.vehicleDescription.label"),
      placeholder: t("input.vehicleDescription.placeholder"),
      maxLength: 100,
      showCount: true,
    },
    {
      id: "shipmentType",
      type: "select",
      name: "shipmentType",
      label: t("input.shipmentType.label"),
      placeholder: t("input.shipmentType.placeholder"),
      options: CONST_SHIPMENT_TYPE?.map((_value) => ({
        id: _value,
        name: _value,
      })),
      valueField: "id",
      labelField: "name",
      rules: [{ required: true, message: messageRequired }],
      onChange: () => {
        form.resetFields(["customerId"]);
      },
    },
    {
      id: "customerId",
      type: "select",
      name: "customerId",
      label: t("input.customerId.label"),
      placeholder: t("input.customerId.placeholder"),
      options: customers?.data ?? [],
      valueField: "id",
      labelField: "name",
      onSearch(_value) {
        getCustomers({ ...PAYLOAD, searchBy: "name", search: _value });
      },
      onClear() {
        getCustomers(PAYLOAD);
      },
      dependency: {
        fields: ["shipmentType"],
        required: {
          condition: (_value) => {
            return _value?.shipmentType === CONST_SHIPMENT_TYPE[1];
          },
          message: messageRequired,
        },
        disabled: (_value) => _value?.shipmentType !== CONST_SHIPMENT_TYPE[1],
      },
      loading: loadingState[customerActions.getCustomersFetch.type],
    },
    {
      id: "branchId",
      type: "select",
      name: "branchId",
      label: t("input.branchId.label"),
      placeholder: t("input.branchId.placeholder"),
      options: businessAreas?.dropdownBusinessAreas?.data ?? [],
      valueField: "id",
      labelField: "name",
      rules: [{ required: true, message: messageRequired }],
      loading: loadingState[businessAreaTypes.GET_DROPDOWN_BUSINESS_AREAS],
    },
    {
      id: "ownership",
      type: "switch",
      name: "ownership",
      label: t("input.ownership.label"),
      options: CONST_OWNERSHIP,
      rules: [{ required: true, message: messageRequired }],
    },
    {
      id: "hasObd",
      type: "switch",
      name: "hasObd",
      label: t("input.hasObd.label"),
      options: CONST_YES_NO,
      rules: [{ required: true, message: messageRequired }],
    },
    {
      id: "hasDashcam",
      type: "switch",
      name: "hasDashcam",
      label: t("input.hasDashcam.label"),
      options: CONST_YES_NO,
      rules: [{ required: true, message: messageRequired }],
    },
    {
      id: "acquisitionDate",
      type: "date",
      name: "acquisitionDate",
      label: t("input.acquisitionDate.label"),
      placeholder: t("input.acquisitionDate.placeholder"),
      rules: [{ required: true, message: messageRequired }],
    },
    {
      id: "kirExpired",
      type: "date",
      name: "kirExpired",
      label: t("input.kirExpired.label"),
      placeholder: t("input.kirExpired.placeholder"),
      rules: [{ required: true, message: messageRequired }],
    },
    {
      id: "licenseNumber",
      type: "text",
      name: "licenseNumber",
      label: t("input.licenseNumber.label"),
      placeholder: t("input.licenseNumber.placeholder"),
      rules: [
        { required: true, message: messageRequired },
        { max: 20, message: messageInvalidLength(20) },
      ],
      maxLength: 20,
      showCount: true,
    },
    {
      id: "licenseExpired",
      type: "date",
      name: "licenseExpired",
      label: t("input.licenseExpired.label"),
      placeholder: t("input.licenseExpired.placeholder"),
      rules: [{ required: true, message: messageRequired }],
    },
    {
      id: "vehicleYear",
      type: "number",
      name: "vehicleYear",
      label: t("input.vehicleYear.label"),
      placeholder: t("input.vehicleYear.placeholder"),
      disableCurrency: true,
      rules: [{ required: true, message: messageRequired }],
    },
    {
      id: "planRegMaintenance",
      type: "date",
      name: "planRegMaintenance",
      label: t("input.planRegMaintenance.label"),
      placeholder: t("input.planRegMaintenance.placeholder"),
      startDate: dayjs(new Date()),
    },
    {
      id: "vehicleStatus",
      type: "switch",
      name: "vehicleStatus",
      label: t("input.vehicleStatus.label"),
      options: CONST_VEHICLE_STATUS,
      disabled: type === "update",
      rules: [{ required: type === "create", message: messageRequired }],
    },
    {
      id: "actualDisposalDate",
      type: "date",
      name: "actualDisposalDate",
      label: t("input.actualDisposalDate.label"),
      placeholder: t("input.actualDisposalDate.placeholder"),
      hidden: type !== "update",
    },
    {
      id: "note",
      type: "textarea",
      name: "note",
      label: t("input.note.label"),
      placeholder: t("input.note.placeholder"),
      rules: [{ max: 200, message: messageInvalidLength(200) }],
      maxLength: 200,
      showCount: true,
    },
  ] as ChildConfig[];

  useEffect(() => {
    form.resetFields();

    if (type === "create") {
      form.setFieldsValue({
        hasObd: false,
        hasDashcam: false,
        ownership: true,
        vehicleStatus: true,
      });
    }

    if (type === "detail") return;

    try {
      getDropdownBusinessAreas({});
      getCustomers(PAYLOAD);
      getDropdownVehicleTypes({});
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 330, error);
      else sendErrorHandler("useEffect", 330, error?.data?.message);
    }
  }, []);

  useEffect(() => {
    if (type === "create" || isEmpty(stockManagement?.detailVehicle?.data)) {
      return;
    }

    const _data = stockManagement?.detailVehicle?.data;
    form.setFieldsValue({
      ..._data,
      ownership: _data?.ownership === CONST_OWNERSHIP[0],
      vehicleStatus: _data?.vehicleStatus === CONST_VEHICLE_STATUS[0],

      ...(type === "update"
        ? {
            actualDisposalDate: DATE_TO_FORM(_data?.actualDisposalDate),
            acquisitionDate: DATE_TO_FORM(_data?.acquisitionDate),
            kirExpired: DATE_TO_FORM(_data?.kirExpired),
            licenseExpired: DATE_TO_FORM(_data?.licenseExpired),
            planRegMaintenance: DATE_TO_FORM(_data?.planRegMaintenance),
          }
        : {
            actualDisposalDate: DATE_FORMAT(_data?.actualDisposalDate),
            acquisitionDate: DATE_FORMAT(_data?.acquisitionDate),
            branchId: _data?.branchName,
            customerId: _data?.customerAssignment,
            kirExpired: DATE_FORMAT(_data?.kirExpired),
            licenseExpired: DATE_FORMAT(_data?.licenseExpired),
            planRegMaintenance: DATE_FORMAT(_data?.planRegMaintenance),
            vehicleTypeId: _data?.vehicleTypeName,
          }),
    });
  }, [stockManagement?.detailVehicle?.data]);

  useEffect(() => {
    if (type !== "create") return;
    setFormErrorHandle(form, stockManagement?.createVehicle?.error);
  }, [stockManagement?.createVehicle?.error]);

  useEffect(() => {
    if (type !== "update") return;
    setFormErrorHandle(form, stockManagement?.updateVehicle?.error);
  }, [stockManagement?.updateVehicle?.error]);

  if (!isEmpty(stockManagement?.detailVehicle?.error)) return <Error404 />;

  return (
    <>
      <Card
        {...(type === "create" ? { title: t("title.add") } : {})}
        {...(type === "detail" ? { title: t("title.detail") } : {})}
        {...(type === "update" ? { title: t("title.update") } : {})}
      >
        <RsFormBuilder
          name="form-stock"
          layout="vertical"
          form={form}
          type={type}
          configs={FormConfigHandler(FORM_CONFIG, type === "detail")}
          onFinish={() => {
            const _value = form.getFieldValue("actualDisposalDate");

            if (_value) return setOpenAlert(true);
            return onSubmit();
          }}
          loading={loading}
          disabled={loading}
        />

        <Modal.Confirm
          type="warning"
          open={isOpenAlert}
          title={t("alert.title")}
          okText={t("alert.okBtn")}
          onOk={onSubmit}
          onCancel={() => setOpenAlert(false)}
        >
          <Typography.Text>{t("alert.desc")}</Typography.Text>
        </Modal.Confirm>
      </Card>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  loadingState: state.loading,
  stockManagement: state.stockManagement,
  businessAreas: state.businessAreas,
  customers: state.customers,
  vehicleTypes: state.vehicleTypes,
});

const mapDispatchToProps = {
  getDropdownBusinessAreas: businessAreaActions.getDropdownBusinessAreasFetch,
  getCustomers: customerActions.getCustomersFetch,
  getDropdownVehicleTypes: vehicleTypeActions.getDropdownVehicleTypesFetch,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StockManagementForm);
