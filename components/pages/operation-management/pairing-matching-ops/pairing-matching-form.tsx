/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import Modal from "@sera-components/modal";
import RsFormBuilder from "@sera-components/rs-form-builder";
import Typography from "@sera-components/typography";
import { ChildConfig } from "@sera-libraries/types/formBuilderType";
import { RootState } from "@sera-redux";
import { LoadingState } from "@sera-types/loading.type";
import { pairingMatchingTypes } from "@sera-types/pairing-matching-ops";
import { ROUTE } from "@sera-utils/constants/routes";
import useCheckPermission from "@sera-utils/hooks/useCheckPermission";
import { FormInstance } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface PairingMatchingFormProps {
  form: FormInstance;
  data: Record<string, any>;
  onSubmit: () => void;
  loading: LoadingState;
}

const PairingMatchingForm = ({
  form,
  data,
  onSubmit,
  loading,
}: PairingMatchingFormProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "pairingMatching.form",
  });

  const messageRequired = t("message.required");

  const IS_LOADING =
    loading[pairingMatchingTypes.GET_DEMANDS] ||
    loading[pairingMatchingTypes.GET_UNPAIRED_UNIT] ||
    loading[pairingMatchingTypes.GET_UNPAIRED_DRIVER] ||
    loading[pairingMatchingTypes.PAIRING_PROCESS];

  const [isOpenConfirm, setIsOpenConfirm] = useState(false);

  const { isCreate } = useCheckPermission({
    menuLink: ROUTE.OPERATION_MANAGEMENT.PAIRING_MATCHING_OPS,
  });

  const FORM_CONFIG = [
    {
      id: "id",
      type: "text",
      name: "id",
      hidden: true,
    },
    {
      id: "shipmentNo",
      type: "text",
      name: "shipmentNo",
      label: t("input.shipmentNo.label"),
      placeholder: t("input.shipmentNo.placeholder"),
      rules: [{ required: true, message: messageRequired }],
      readOnly: true,
    },
    {
      id: "driverId1",
      type: "text",
      name: "driverId1",
      hidden: true,
    },
    {
      id: "driverName1",
      type: "text",
      name: "driverName1",
      label: t("input.driverName1.label"),
      placeholder: t("input.driverName1.placeholder"),
      rules: [{ required: true, message: messageRequired }],
      readOnly: true,
    },
    {
      id: "vehicleId",
      type: "text",
      name: "vehicleId",
      hidden: true,
    },
    {
      id: "licensePlate",
      type: "text",
      name: "licensePlate",
      label: t("input.licensePlate.label"),
      placeholder: t("input.licensePlate.placeholder"),
      rules: [{ required: true, message: messageRequired }],
      readOnly: true,
    },
    {
      id: "driverId2",
      type: "text",
      name: "driverId2",
      hidden: true,
    },
    {
      id: "driverName2",
      type: "text",
      name: "driverName2",
      label: t("input.driverName2.label"),
      placeholder: t("input.driverName2.placeholder"),
      rules: [{ required: data?.qtyDriver === 2, message: messageRequired }],
      readOnly: true,
      disabled: data?.qtyDriver !== 2,
    },
  ] as ChildConfig[];

  return (
    <>
      <h3 style={{ fontWeight: 600 }}>{t("title")}</h3>

      <RsFormBuilder
        name="form-pairing-matching"
        layout="vertical"
        form={form}
        type="create"
        configs={FORM_CONFIG}
        submitText={t("button.submit")}
        onFinish={() => setIsOpenConfirm(true)}
        loading={IS_LOADING}
        disabled={IS_LOADING || !isCreate}
        hideCancel
        isHideFormButton={!isCreate}
      />

      <Modal.Confirm
        type="warning"
        open={isOpenConfirm}
        title={t("alert.title")}
        okText={t("alert.okBtn")}
        onOk={() => {
          onSubmit();
          setIsOpenConfirm(false);
        }}
        onCancel={() => setIsOpenConfirm(false)}
        okButtonProps={{ loading: IS_LOADING, disabled: IS_LOADING }}
        cancelButtonProps={{ disabled: IS_LOADING }}
      >
        <Typography.Text>{t("alert.desc")}</Typography.Text>
      </Modal.Confirm>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PairingMatchingForm);
