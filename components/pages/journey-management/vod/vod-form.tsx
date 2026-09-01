/* eslint-disable react-hooks/exhaustive-deps */
import { SearchOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import Card from "@sera-components/card";
import Error404 from "@sera-components/error-boundary/Error404";
import RsFormBuilder from "@sera-components/rs-form-builder";
import MessageHandler from "@sera-libraries/message-handler";
import { ChildConfig } from "@sera-libraries/types/formBuilderType";
import { masterDataActions, RootState } from "@sera-redux";
import { vodActions } from "@sera-redux/slices/voice-of-driver.slice";
import { LoadingState } from "@sera-types/loading.type";
import { MasterDataState, masterDataTypes } from "@sera-types/master-data.type";
import { VoDState, vodTypes } from "@sera-types/voice-of-driver.type";
import {
  DATE_FORMAT,
  DATE_TO_FORM,
  FORMAT_DATE_TIME,
} from "@sera-utils/constants/common";
import { FormConfigHandler } from "@sera-utils/data-manipulator";
import { setFormErrorHandle } from "@sera-utils/error-handler";
import { FormInstance } from "antd";
import { isEmpty } from "lodash";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface VoDFormProps {
  type: "create" | "detail" | "update";
  form: FormInstance;
  loading: boolean;
  onSubmit: () => void;

  loadingState: LoadingState;
  masterData: MasterDataState;
  vod: VoDState;
  getVoDCategories: typeof masterDataActions.getVoDCategoriesFetch;
  getVoDStatus: typeof masterDataActions.getVoDStatusesFetch;
  getVoDTypes: typeof masterDataActions.getVoDTypesFetch;
  getShipment: typeof vodActions.getShipmentFetch;
  getLocationReverse: typeof masterDataActions.getLocationReverseFetch;
  createVoDClear: typeof vodActions.createVoDClear;
  updateVoDClear: typeof vodActions.updateVoDClear;
  getLocationReverseClear: typeof masterDataActions.getLocationReverseClear;
}

const PAYLOAD = { page: 1, limit: 10 };

const VoDForm = ({
  type,
  form,
  loading,
  onSubmit,

  loadingState,
  masterData,
  vod,
  getVoDCategories,
  getVoDStatus,
  getVoDTypes,
  getShipment,
  getLocationReverse,
  createVoDClear,
  updateVoDClear,
  getLocationReverseClear,
}: VoDFormProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "vod.form",
  });

  const messageRequired = t("message.required");
  const messageCordinate = t("message.cordinate");
  const messageCordinate404 = t("message.cordinate404");

  const onHandleSelectShipment = (_id = "") => {
    const _data = vod?.getShipment?.data?.find((_item) => _item?.id === _id);

    form.setFieldsValue({
      customerName: _data?.customerName ?? " ",
      branchName: _data?.branchName ?? " ",
      shipmentType: _data?.shipmentType ?? " ",
      licensePlate: _data?.licensePlate ?? " ",
      driverName: _data?.driverName ?? " ",
    });
  };

  const onHandleGetDetailLocation = async () => {
    await form.validateFields(["coordinate"]);

    const [latitude, longitude] = form
      .getFieldValue("coordinate")
      ?.split(",")
      ?.map((_val: string) => _val?.trim());

    getLocationReverse({ latitude, longitude });
  };

  const FORM_CONFIG = [
    {
      id: "ticketNumber",
      type: "text",
      name: "ticketNumber",
      label: t("input.ticketNumber.label"),
      placeholder: t("input.ticketNumber.placeholder"),
      hidden: type == "create",
      disabled: true,
    },
    {
      id: "createdAt",
      type: "text",
      name: "createdAt",
      label: t("input.createdAt.label"),
      placeholder: t("input.createdAt.placeholder"),
      hidden: type == "create",
      disabled: true,
    },
    {
      id: "category",
      type: "select",
      name: "category",
      label: t("input.category.label"),
      placeholder: t("input.category.placeholder"),
      options: masterData?.getVoDCategories?.data ?? [],
      valueField: "id",
      labelField: "name",
      rules: [{ required: type === "create", message: messageRequired }],
      loading: loadingState[masterDataTypes.GET_VOD_CATEGORIES],
      disabled: type === "update",
      onChange(_value) {
        form.resetFields([
          "shipmentNo",
          "referenceNo",
          "customerName",
          "branchName",
          "shipmentType",
          "licensePlate",
          "driverName",
        ]);
        getShipment({ ...PAYLOAD, filter: _value });
      },
    },
    {
      id: "shipmentNo",
      type: "select",
      name: "shipmentNo",
      label: t("input.shipmentNo.label"),
      placeholder: t("input.shipmentNo.placeholder"),
      options: vod?.getShipment?.data ?? [],
      valueField: "id",
      labelField: "shipmentNo",
      loading: loadingState[vodTypes.GET_SHIPMENT],
      dependency: {
        fields: ["category"],
        required: {
          condition: (_value) => {
            return (
              type === "create" &&
              _value?.category === masterData?.getVoDCategories?.data?.[0]?.id
            );
          },
          message: messageRequired,
        },
        disabled: (_value) => {
          return (
            type === "update" ||
            !Boolean(_value?.category) ||
            _value?.category !== masterData?.getVoDCategories?.data?.[0]?.id
          );
        },
      },
      onChange(_value) {
        onHandleSelectShipment(_value);
      },
      onClear() {
        onHandleSelectShipment();
      },
    },
    {
      id: "referenceNo",
      type: "select",
      name: "referenceNo",
      label: t("input.referenceNo.label"),
      placeholder: t("input.referenceNo.placeholder"),
      options: vod?.getShipment?.data ?? [],
      valueField: "id",
      labelField: "shipmentNo",
      loading: loadingState[vodTypes.GET_SHIPMENT],
      dependency: {
        fields: ["category"],
        required: {
          condition: (_value) => {
            return (
              type === "create" &&
              _value?.category === masterData?.getVoDCategories?.data?.[1]?.id
            );
          },
          message: messageRequired,
        },
        disabled: (_value) => {
          return (
            type === "update" ||
            !Boolean(_value?.category) ||
            _value?.category !== masterData?.getVoDCategories?.data?.[1]?.id
          );
        },
      },
      onChange(_value) {
        onHandleSelectShipment(_value);
      },
      onClear() {
        onHandleSelectShipment();
      },
    },
    {
      id: "customerName",
      type: "text",
      name: "customerName",
      label: t("input.customerName.label"),
      placeholder: t("input.customerName.placeholder"),
      disabled: true,
    },
    {
      id: "branchName",
      type: "text",
      name: "branchName",
      label: t("input.branchName.label"),
      placeholder: t("input.branchName.placeholder"),
      disabled: true,
    },
    {
      id: "shipmentType",
      type: "text",
      name: "shipmentType",
      label: t("input.shipmentType.label"),
      placeholder: t("input.shipmentType.placeholder"),
      disabled: true,
    },
    {
      id: "licensePlate",
      type: "text",
      name: "licensePlate",
      label: t("input.licensePlate.label"),
      placeholder: t("input.licensePlate.placeholder"),
      disabled: true,
    },
    {
      id: "driverName",
      type: "text",
      name: "driverName",
      label: t("input.driverName.label"),
      placeholder: t("input.driverName.placeholder"),
      disabled: true,
    },
    {
      id: "voiceType",
      type: "select",
      name: "voiceType",
      label: t("input.voiceType.label"),
      placeholder: t("input.voiceType.placeholder"),
      options: masterData?.getVoDTypes?.data ?? [],
      valueField: "id",
      labelField: "name",
      rules: [{ required: type === "create", message: messageRequired }],
      loading: loadingState[masterDataTypes.GET_VOD_TYPES],
      disabled: type === "update",
    },
    {
      id: "voiceDetail",
      type: "rich-text",
      name: "voiceDetail",
      label: t("input.voiceDetail.label"),
      placeholder: t("input.voiceDetail.placeholder"),
      rules: [{ required: type === "create", message: messageRequired }],
      disabled: type === "update",
    },
    {
      id: "coordinate",
      type: "text",
      name: "coordinate",
      label: t("input.coordinate.label"),
      placeholder: t("input.coordinate.placeholder"),
      rules: [
        type === "create"
          ? {
              validator: async (_: never, _value = "") => {
                const _val = _value
                  .split(",")
                  .filter((_val) => _val.trim() !== "");

                if (_val.length === 2) return Promise.resolve();
                return Promise.reject(new Error(messageCordinate));
              },
              required: type === "create",
            }
          : {},
      ],
      suffix:
        type === "create" ? (
          <Button
            type="text"
            icon={<SearchOutlined />}
            onClick={onHandleGetDetailLocation}
            style={{ marginBottom: 23, marginRight: 4 }}
          />
        ) : null,
      disabled: type === "update",
    },
    {
      id: "dateOfAccident",
      type: "date",
      name: "dateOfAccident",
      label: t("input.dateOfAccident.label"),
      placeholder: t("input.dateOfAccident.placeholder"),
      rules: [{ required: type === "create", message: messageRequired }],
      disabled: type === "update",
      format: "YYYY-MM-DD HH:mm",
    },
    {
      id: "position",
      type: "text",
      name: "position",
      label: t("input.position.label"),
      placeholder: t("input.position.placeholder"),
      rules: [{ required: type === "create", message: messageRequired }],
      maxLength: 200,
      showCount: true,
      disabled: type === "update",
    },
    {
      id: "status",
      type: "select",
      name: "status",
      label: t("input.status.label"),
      placeholder: t("input.status.placeholder"),
      options: masterData?.getVoDStatuses?.data ?? [],
      valueField: "name",
      labelField: "name",
      rules: [{ required: type == "update", message: messageRequired }],
      loading: loadingState[masterDataTypes.GET_VOD_STATUSES],
      hidden: type == "create",
    },
    {
      id: "note",
      type: "text",
      name: "note",
      label: t("input.note.label"),
      placeholder: t("input.note.placeholder"),
      hidden: type == "create",
    },
  ] as ChildConfig[];

  useEffect(() => {
    form.resetFields();
    createVoDClear();
    updateVoDClear();

    if (type === "create") {
      getVoDCategories();
      getVoDTypes();
    }

    if (type === "update") getVoDStatus();
  }, []);

  useEffect(() => {
    const _data = masterData?.getLocationReverse?.data;
    if (isEmpty(_data)) return;

    if (_data == "NOT FOUND") MessageHandler().error(messageCordinate404);
    else form.setFieldsValue({ position: _data });

    getLocationReverseClear();
  }, [masterData?.getLocationReverse?.data]);

  useEffect(() => {
    const _error = masterData?.getLocationReverse?.error;
    if (isEmpty(_error)) return;

    MessageHandler().error(messageCordinate404);
    getLocationReverseClear();
  }, [masterData?.getLocationReverse?.error]);

  useEffect(() => {
    const _data = vod?.detailVoD?.data;
    if (type === "create" || isEmpty(_data)) return;

    form.setFieldsValue({
      ticketNumber: _data?.ticketNumber ?? "",
      createdAt: DATE_FORMAT(_data?.createdAt, FORMAT_DATE_TIME),
      category: _data?.category ?? "",
      shipmentNo: _data?.shipmentNo ?? "",
      referenceNo: _data?.referenceNo ?? "",
      customerName: _data?.customerName ?? "",
      branchName: _data?.branchName ?? "",
      shipmentType: _data?.shipmentType ?? "",
      licensePlate: _data?.licensePlate ?? "",
      driverName: _data?.employeeName ?? "",
      voiceType: _data?.voiceType ?? "",
      voiceDetail: _data?.voiceDetail ?? "",
      position: _data?.position ?? "",
      coordinate: _data?.coordinate ?? "",
      status: _data?.status ?? "",
      note: _data?.note ?? "",

      ...(type === "update"
        ? {
            dateOfAccident: DATE_TO_FORM(_data?.dateOfAccident),
          }
        : {
            dateOfAccident: DATE_FORMAT(
              _data?.dateOfAccident,
              FORMAT_DATE_TIME,
            ),
          }),
    });
  }, [vod?.detailVoD?.data]);

  useEffect(() => {
    if (type !== "create") return;
    setFormErrorHandle(form, vod?.createVoD?.error);
  }, [vod?.createVoD?.error]);

  useEffect(() => {
    if (type !== "update") return;
    setFormErrorHandle(form, vod?.updateVoD?.error);
  }, [vod?.updateVoD?.error]);

  if (!isEmpty(vod?.detailVoD?.error)) return <Error404 />;

  return (
    <Card
      {...(type === "create" ? { title: t("title.add") } : {})}
      {...(type === "detail" ? { title: t("title.detail") } : {})}
      {...(type === "update" ? { title: t("title.edit") } : {})}
    >
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
  masterData: state.masterData,
  vod: state.vod,
});

const mapDispatchToProps = {
  getVoDCategories: masterDataActions.getVoDCategoriesFetch,
  getVoDStatus: masterDataActions.getVoDStatusesFetch,
  getVoDTypes: masterDataActions.getVoDTypesFetch,
  getLocationReverse: masterDataActions.getLocationReverseFetch,
  getShipment: vodActions.getShipmentFetch,
  createVoDClear: vodActions.createVoDClear,
  updateVoDClear: vodActions.updateVoDClear,
  getLocationReverseClear: masterDataActions.getLocationReverseClear,
};

export default connect(mapStateToProps, mapDispatchToProps)(VoDForm);
