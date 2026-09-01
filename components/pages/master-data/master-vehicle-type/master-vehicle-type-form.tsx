import Card from "@sera-components/card";
import RsFormBuilder from "@sera-components/rs-form-builder";
import { ChildConfig } from "@sera-libraries/types/formBuilderType";
import { RootState, vehicleGroupActions } from "@sera-redux";
import { AutoCompleteType } from "@sera-types/base.type";
import { VehicleGroupState } from "@sera-types/vehicle-group.type";
import { VehicleTypeState } from "@sera-types/vehicle-type.type";
import { setFormErrorHandle } from "@sera-utils/error-handler";
import Utils from "@sera-utils/utils";
import { FormInstance } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface ActionFormProps {
  type: "create" | "update";
  vehicleTypes: VehicleTypeState;
  form: FormInstance;
  loading: boolean;
  onSubmit: () => void;
  vehicleGroups: VehicleGroupState;
  getDropdownVehicleGroups: typeof vehicleGroupActions.getDropdownVehicleGroupsFetch;
}

const ActionForm = ({
  type,
  vehicleTypes,
  form,
  loading,
  onSubmit,
  vehicleGroups,
  getDropdownVehicleGroups,
}: ActionFormProps) => {
  const router = useRouter();
  const { t } = useTranslation(undefined, { keyPrefix: "vehicleType.form" });

  const onGoBack = () =>
    Utils().onGoBack(router, "/master-data/master-vehicle-type");
  const [dataDropdownVehicleGroups, setDataDropdownVehicleGroups] = useState<
    AutoCompleteType[]
  >([]);

  const requiredMessage = t("input.message");

  const vehicleTypeForm: ChildConfig[] = [
    {
      type: "text",
      label: t("input.code.label"),
      name: "code",
      id: "code",
      placeholder: t("input.code.placeholder"),
      rules: [
        { required: true, message: requiredMessage },
        { max: 20, message: t("input.code.rule.invalidMax") },
      ],
      maxLength: 20,
      showCount: true,
    },
    {
      type: "text",
      label: t("input.name.label"),
      name: "name",
      id: "name",
      placeholder: t("input.name.placeholder"),
      rules: [
        { required: true, message: requiredMessage },
        { max: 50, message: t("input.name.rule.invalidMax") },
      ],
      maxLength: 50,
      showCount: true,
    },
    {
      type: "select",
      label: t("input.group.label"),
      name: "group",
      id: "group",
      placeholder: t("input.group.placeholder"),
      options: dataDropdownVehicleGroups,
      rules: [{ required: true, message: requiredMessage }],
    },
  ];

  useEffect(() => {
    setFormErrorHandle(form, vehicleTypes?.error);
  }, [vehicleTypes?.error]);

  useEffect(() => {
    setDataDropdownVehicleGroups(
      vehicleGroups.dropdownVehicleGroups.data.map((vehicleGroup) => ({
        label: vehicleGroup.name,
        value: vehicleGroup.id,
      })),
    );
  }, [vehicleGroups.dropdownVehicleGroups.data]);

  useEffect(() => {
    if (vehicleTypes?.vehicleTypeDetail?.data) {
      const { name, code, group } = vehicleTypes.vehicleTypeDetail.data;
      form.setFieldValue("code", code);
      form.setFieldValue("name", name);
      form.setFieldValue("group", group);
    }
  }, [form, vehicleTypes.vehicleTypeDetail.data]);

  useEffect(() => {
    getDropdownVehicleGroups();
  }, []);

  return (
    <Card
      title={
        Object.entries(vehicleTypes?.vehicleTypeDetail?.data || {})?.length > 0
          ? t("title.edit")
          : t("title.add")
      }
    >
      <RsFormBuilder
        type={type}
        layout="vertical"
        name={""}
        form={form}
        onFinish={onSubmit}
        onCancel={onGoBack}
        configs={vehicleTypeForm}
        submitText={t("button.save")}
        cancelText={t("button.cancel")}
        loading={loading}
        disabled={loading}
      />
    </Card>
  );
};

const mapStateToProps = (state: RootState) => ({
  vehicleTypes: state.vehicleTypes || { vehicleTypeDetail: { data: {} } },
  vehicleGroups: state.vehicleGroups,
});

const mapDispatchToProps = {
  getDropdownVehicleGroups: vehicleGroupActions.getDropdownVehicleGroupsFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionForm);
