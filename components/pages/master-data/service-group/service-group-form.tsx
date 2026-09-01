/* eslint-disable react-hooks/exhaustive-deps */
import Card from "@sera-components/card";
import RsFormBuilder from "@sera-components/rs-form-builder";
import { ChildConfig } from "@sera-libraries/types/formBuilderType";
import { businessAreaActions, RootState } from "@sera-redux";
import { BusinessAreaState } from "@sera-types/business-area.type";
import { ServiceGroupState } from "@sera-types/service-group.type";
import { ROUTE } from "@sera-utils/constants/routes";
import { setFormErrorHandle } from "@sera-utils/error-handler";
import Utils from "@sera-utils/utils";
import { FormInstance } from "antd";
import { isEmpty } from "lodash";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface ActionFormProp {
  type: "create" | "update";
  form: FormInstance;
  loading: boolean;
  onSubmit: () => void;
  businessAreas: BusinessAreaState;
  serviceGroups: ServiceGroupState;
  getDropdownBusinessAreas: typeof businessAreaActions.getDropdownBusinessAreasFetch;
}

const ActionForm = ({
  type,
  form,
  loading,
  onSubmit,
  businessAreas,
  serviceGroups,
  getDropdownBusinessAreas,
}: ActionFormProp) => {
  const router = useRouter();
  const { t } = useTranslation(undefined, { keyPrefix: "serviceGroup.form" });

  const requiredMessage = t("input.message");

  const branchForm: ChildConfig[] = [
    {
      id: "name",
      type: "text",
      name: "name",
      label: t("input.name.label"),
      placeholder: t("input.name.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
      maxLength: 50,
      showCount: true,
    },
    {
      id: "branchId",
      type: "select",
      name: "branchId",
      label: t("input.branch.label"),
      placeholder: t("input.branch.placeholder"),
      options: businessAreas?.dropdownBusinessAreas?.data ?? [],
      valueField: "id",
      labelField: "name",
      rules: [{ required: true, message: requiredMessage }],
    },
  ];

  const onGoBack = () => {
    Utils().onGoBack(router, ROUTE.MASTER_DATA.SERVICE_GROUP);
  };

  useEffect(() => {
    getDropdownBusinessAreas({ show: "all" });
  }, []);

  useEffect(() => {
    if (isEmpty(serviceGroups?.detailServiceGroup?.data)) return;

    const { name, branchId } = serviceGroups?.detailServiceGroup?.data;
    form.setFieldValue("name", name);
    form.setFieldValue("branchId", branchId);
  }, [serviceGroups?.detailServiceGroup?.data]);

  useEffect(() => {
    if (type === "create") {
      setFormErrorHandle(form, serviceGroups?.createServiceGroup?.error);
    }

    if (type === "update") {
      setFormErrorHandle(form, serviceGroups?.updateServiceGroup?.error);
    }
  }, [
    serviceGroups?.createServiceGroup?.error,
    serviceGroups?.updateServiceGroup?.error,
  ]);

  return (
    <Card
      {...(type === "create" ? { title: t("title.add") } : {})}
      {...(type === "update" ? { title: t("title.edit") } : {})}
    >
      <RsFormBuilder
        name="form-service-group"
        type={type}
        layout="vertical"
        form={form}
        configs={branchForm}
        submitText={t("button.save")}
        cancelText={t("button.cancel")}
        onFinish={onSubmit}
        onCancel={onGoBack}
        loading={loading}
        disabled={loading}
      />
    </Card>
  );
};

const mapStateToProps = (state: RootState) => ({
  businessAreas: state.businessAreas,
  serviceGroups: state.serviceGroups,
});

const mapDispatchToProps = {
  getDropdownBusinessAreas: businessAreaActions.getDropdownBusinessAreasFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionForm);
