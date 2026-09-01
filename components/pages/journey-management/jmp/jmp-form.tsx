/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import Card from "@sera-components/card";
import Error404 from "@sera-components/error-boundary/Error404";
import RsFormBuilder from "@sera-components/rs-form-builder";
import { ChildConfig } from "@sera-libraries/types/formBuilderType";
import {
  customerActions,
  customerRouteActions,
  locationActions,
  RootState,
} from "@sera-redux";
import { jmpActions } from "@sera-redux/slices/jmp.slice";
import { CustomerState } from "@sera-types/customer.type";
import { CustomerRouteState } from "@sera-types/customer-route.type";
import { JMPState } from "@sera-types/jmp.type";
import { LoadingState } from "@sera-types/loading.type";
import {
  Location,
  LocationState,
  locationTypes,
} from "@sera-types/location.type";
import { DATE_FORMAT, FORMAT_DATE_TIME } from "@sera-utils/constants/common";
import { FormConfigHandler } from "@sera-utils/data-manipulator";
import { setFormErrorHandle } from "@sera-utils/error-handler";
import { FormInstance } from "antd";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

const PAYLOAD = { page: 1, limit: 10 };

interface JMPFormProps {
  type: "create" | "detail" | "update";
  form: FormInstance;
  loading: boolean;
  onSubmit: () => void;

  loadingState: LoadingState;
  jmp: JMPState;
  locations: LocationState;
  customers: CustomerState;
  customerRoutes: CustomerRouteState;
  getCustomers: typeof customerActions.getCustomersFetch;
  getDropdownTollUsages: typeof customerRouteActions.getDropdownTollUsagesFetch;
  getDropdownLocations: typeof locationActions.getDropdownLocationsFetch;
  getDropdownLocationsClear: typeof locationActions.getDropdownLocationsClear;
  createJMPClear: typeof jmpActions.createJMPClear;
  updateJMPClear: typeof jmpActions.updateJMPClear;
}

export const CONST_YES_NO = ["Yes", "No"];

const JMPForm = ({
  type,
  form,
  loading,
  onSubmit,
  loadingState,
  jmp,
  locations,
  customers,
  customerRoutes,
  getCustomers,
  getDropdownTollUsages,
  getDropdownLocations,
  getDropdownLocationsClear,
  createJMPClear,
  updateJMPClear,
}: JMPFormProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "jmp.form",
  });

  const messageRequired = t("message.required");

  const [dataCusLoc, setDataCusLoc] = useState<Location[]>([]);
  const [dataCheckpoint, setDataCheckpoint] = useState<Location[]>([]);

  const FORM_CONFIG = [
    {
      id: "jmpCode",
      type: "text",
      name: "jmpCode",
      label: t("input.jmpCode.label"),
      placeholder: t("input.jmpCode.placeholder"),
      disabled: true,
      hidden: type === "create",
    },
    {
      id: "createdAt",
      type: "text",
      name: "createdAt",
      label: t("input.createdAt.label"),
      placeholder: t("input.createdAt.placeholder"),
      disabled: true,
      hidden: type === "create",
    },
    {
      id: "origin",
      type: "select",
      name: "origin",
      label: t("input.origin.label"),
      placeholder: t("input.origin.placeholder"),
      options: dataCusLoc ?? [],
      valueField: "id",
      labelField: "name",
      rules: [{ required: type === "create", message: messageRequired }],
      loading: loadingState[locationTypes.GET_DROPDOWN_LOCATIONS],
      disabled: type === "update",
    },
    {
      id: "destination",
      type: "select",
      name: "destination",
      label: t("input.destination.label"),
      placeholder: t("input.destination.placeholder"),
      options: dataCusLoc ?? [],
      valueField: "id",
      labelField: "name",
      rules: [{ required: type === "create", message: messageRequired }],
      loading: loadingState[locationTypes.GET_DROPDOWN_LOCATIONS],
      disabled: type === "update",
    },
    {
      id: "tollUsage",
      type: "select",
      name: "tollUsage",
      label: t("input.tollUsage.label"),
      placeholder: t("input.tollUsage.placeholder"),
      options: customerRoutes?.dropdownTollUsages?.data ?? [],
      valueField: "id",
      labelField: "name",
      rules: [{ required: type === "create", message: messageRequired }],
      loading: false,
      disabled: type === "update",
    },
    {
      id: "specificCustomer",
      type: "switch",
      name: "specificCustomer",
      label: t("input.specificCustomer.label"),
      options: CONST_YES_NO,
      onChange() {
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
      loading: loadingState[customerActions.getCustomersFetch.type],
      dependency: {
        fields: ["specificCustomer"],
        required: {
          condition: (_value) => _value?.specificCustomer,
          message: messageRequired,
        },
        disabled: (_value) => !_value?.specificCustomer,
      },
    },
    {
      id: "jmpDetails",
      type: "dynamicInput",
      name: "jmpDetails",
      title: t("input.jmpDetails.title"),
      noHeader: true,
      withOrder: type !== "detail",
      hideAddButton: type == "detail",
      maxChild: 25,
      childConfigs: [
        {
          id: "location",
          type: "select",
          name: "location",
          label: t("input.jmpDetails.location.label"),
          placeholder: t("input.jmpDetails.location.placeholder"),
          mdSize: type == "detail" ? 8 : 7,
          options: dataCheckpoint ?? [],
          valueField: "id",
          labelField: "name",
          rules: [{ required: true, message: messageRequired }],
          loading: loadingState[locationTypes.GET_DROPDOWN_LOCATIONS],
          onChange(_value) {
            const _data = dataCheckpoint?.find((_item) => _item?.id === _value);

            form.setFieldsValue({
              jmpDetails:
                form.getFieldValue("jmpDetails")?.map((_item: any) => ({
                  ..._item,
                  address:
                    _item?.location === _value
                      ? _data?.address
                      : _item?.address,
                  coordinate:
                    _item?.location === _value
                      ? _data?.coordinate
                      : _item?.coordinate,
                })) ?? [],
            });
          },
        },
        {
          id: "address",
          type: "text",
          name: "address",
          label: t("input.jmpDetails.address.label"),
          placeholder: t("input.jmpDetails.address.placeholder"),
          mdSize: type == "detail" ? 8 : 7,
          disabled: true,
        },
        {
          id: "coordinate",
          type: "text",
          name: "coordinate",
          label: t("input.jmpDetails.coordinate.label"),
          placeholder: t("input.jmpDetails.coordinate.placeholder"),
          mdSize: type == "detail" ? 8 : 7,
          disabled: true,
        },
      ],
    },
  ] as ChildConfig[];

  useEffect(() => {
    form.resetFields();
    createJMPClear();
    updateJMPClear();

    if (type === "detail") return;

    if (type === "create") {
      form.setFieldsValue({
        jmpDetails: [{}],
      });

      getDropdownLocations({ type: "Customer Location" });
      getDropdownTollUsages();
    }

    if (type === "update") getDropdownLocations({ type: "Checkpoint" });

    getCustomers(PAYLOAD);
  }, []);

  useEffect(() => {
    const _isSuccess = locations?.dropdownLocations?.isSuccess;
    const _data = locations?.dropdownLocations?.data;
    const _payload = locations?.dropdownLocations?.payload;

    if (!_isSuccess) return;

    if (_payload?.type === "Customer Location") {
      setDataCusLoc(_data ?? []);
      getDropdownLocationsClear();

      getDropdownLocations({ type: "Checkpoint" });
    }

    if (_payload?.type === "Checkpoint") {
      setDataCheckpoint(_data ?? []);
      getDropdownLocationsClear();
    }
  }, [locations?.dropdownLocations]);

  useEffect(() => {
    const _data = jmp?.detailJMP?.data;
    if (type === "create" || isEmpty(_data)) return;

    form.setFieldsValue({
      jmpCode: _data?.jmpCode ?? " ",
      createdAt: DATE_FORMAT(_data?.createdAt, FORMAT_DATE_TIME),
      origin: _data?.originName ?? " ",
      destination: _data?.destinationName ?? " ",
      tollUsage: _data?.tollUsageCategory?.name ?? " ",
      specificCustomer: _data?.specificCustomer,
      jmpDetails:
        _data?.details?.map((_item) => ({
          location: type === "update" ? _item?.locationId : _item?.locationName,
          address: _item?.address,
          coordinate: _item?.coordinate,
        })) ?? [],
      ...(type === "update"
        ? { customerId: _data?.customer?.id }
        : { customerId: _data?.customer?.name ?? " " }),
    });
  }, [jmp?.detailJMP?.data]);

  useEffect(() => {
    if (type !== "create") return;
    setFormErrorHandle(form, jmp?.createJMP?.error);
  }, [jmp?.createJMP?.error]);

  useEffect(() => {
    if (type !== "update") return;
    setFormErrorHandle(form, jmp?.updateJMP?.error);
  }, [jmp?.updateJMP?.error]);

  if (!isEmpty(jmp?.detailJMP?.error)) return <Error404 />;

  return (
    <Card>
      <RsFormBuilder
        name="form-unit-activities"
        layout="vertical"
        form={form}
        type={type}
        configs={FormConfigHandler(FORM_CONFIG, type === "detail")}
        onFinish={onSubmit}
        loading={loading}
        disabled={loading}
      />
    </Card>
  );
};

const mapStateToProps = (state: RootState) => ({
  loadingState: state.loading,
  jmp: state.jmp,
  customers: state.customers,
  customerRoutes: state.customerRoutes,
  locations: state.locations,
});

const mapDispatchToProps = {
  getCustomers: customerActions.getCustomersFetch,
  getDropdownTollUsages: customerRouteActions.getDropdownTollUsagesFetch,
  getDropdownLocations: locationActions.getDropdownLocationsFetch,
  getDropdownLocationsClear: locationActions.getDropdownLocationsClear,
  createJMPClear: jmpActions.createJMPClear,
  updateJMPClear: jmpActions.updateJMPClear,
};

export default connect(mapStateToProps, mapDispatchToProps)(JMPForm);
