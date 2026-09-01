/* eslint-disable react-hooks/exhaustive-deps */
import Card from "@sera-components/card";
import RsFormBuilder from "@sera-components/rs-form-builder";
import { ChildConfig } from "@sera-libraries/types/formBuilderType";
import { RootState } from "@sera-redux";
import { BusinessAreaState } from "@sera-types/business-area.type";
import { setFormErrorHandle } from "@sera-utils/error-handler";
import Utils from "@sera-utils/utils";
import { FormInstance } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface ActionFormProps {
  type: "create" | "update";
  form: FormInstance;
  loading: boolean;
  onSubmit: () => void;
  businessAreas: BusinessAreaState;
}

const ActionForm = ({
  type,
  form,
  loading,
  onSubmit,
  businessAreas,
}: ActionFormProps) => {
  const router = useRouter();

  const { t } = useTranslation(undefined, { keyPrefix: "businessArea.form" });

  const requiredMessage = t("input.message");
  const maxCharMessage = (_value: number) => {
    return t("input.invalidLength", { total: _value });
  };

  const onGoBack = () => Utils().onGoBack(router, "/master-data/master-branch");

  const branchForm: ChildConfig[] = [
    {
      id: "code",
      type: "text",
      name: "code",
      label: t("input.code.label"),
      placeholder: t("input.code.placeholder"),
      maxLength: 10,
      showCount: true,
      rules: [
        { required: true, message: requiredMessage },
        { max: 10, message: maxCharMessage(10) },
      ],
    },
    {
      id: "name",
      type: "text",
      name: "name",
      label: t("input.name.label"),
      placeholder: t("input.name.placeholder"),
      maxLength: 50,
      showCount: true,
      rules: [
        { required: true, message: requiredMessage },
        { max: 50, message: maxCharMessage(50) },
      ],
    },
  ];

  useEffect(() => {
    if (businessAreas?.businessAreaDetail?.data) {
      const { name, code } = businessAreas.businessAreaDetail.data;
      form.setFieldValue("name", name);
      form.setFieldValue("code", code);
    }
  }, [businessAreas.businessAreaDetail.data]);

  useEffect(() => {
    setFormErrorHandle(form, businessAreas?.error);
  }, [businessAreas?.error]);

  return (
    <Card
      title={
        Object.entries(businessAreas?.businessAreaDetail?.data)?.length > 0
          ? t("title.edit")
          : t("title.add")
      }
    >
      <RsFormBuilder
        form={form}
        type={type}
        name="form-branch"
        layout="vertical"
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
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ActionForm);
