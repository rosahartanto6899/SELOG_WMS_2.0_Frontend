/* eslint-disable react-hooks/exhaustive-deps */
import Card from "@sera-components/card";
import RsFormBuilder from "@sera-components/rs-form-builder";
import { ChildConfig } from "@sera-libraries/types/formBuilderType";
import { RootState } from "@sera-redux";
import { CompanyState } from "@sera-types/company.type";
import Utils from "@sera-utils/utils";
import { FormInstance } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
interface ActionFormProps {
  type: "create" | "update";
  companies: CompanyState;
  form: FormInstance;
  loading: boolean;
  onSubmit: () => void;
}

const ActionForm = ({
  type,
  companies,
  form,
  loading,
  onSubmit,
}: ActionFormProps) => {
  const router = useRouter();
  const { t } = useTranslation(undefined, { keyPrefix: "company.form" });

  const onGoBack = () =>
    Utils().onGoBack(router, "/master-data/master-company");

  const requiredMessage = t("input.message");

  const companyForm: ChildConfig[] = [
    {
      type: "text",
      label: t("input.code.label"),
      name: "code",
      id: "code",
      placeholder: t("input.code.placeholder"),
      dependency: {
        fields: [],
        disabled: () => type !== "create",
      },
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      type: "text",
      label: t("input.name.label"),
      name: "name",
      id: "name",
      placeholder: t("input.name.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
  ];

  useEffect(() => {
    if (companies?.companyDetail?.data) {
      const { name, code } = companies.companyDetail.data;

      form.setFieldValue("name", name);
      form.setFieldValue("code", code);
    }
  }, [companies.companyDetail.data]);

  return (
    <Card
      title={
        Object.entries(companies?.companyDetail?.data)?.length > 0
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
        configs={companyForm}
        submitText={t("button.save")}
        cancelText={t("button.cancel")}
        loading={loading}
        disabled={loading}
      />
    </Card>
  );
};

const mapStateToProps = (state: RootState) => ({
  companies: state.companies,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ActionForm);
