import { Input } from "antd";
import { capitalize } from "lodash";
import React, { FC, useState } from "react";
import { useTranslation } from "react-i18next";

import Modal from ".";

interface ModalApproveRejectProps {
  type: "approve" | "reject";
  open: boolean;
  title?: string;
  subtitle?: string;
  okText?: string;
  onOk: (reason: string) => void;
  onCancel: () => void;
  disabled?: boolean;
  loading?: boolean;
  withReason?: boolean;
}

const ModalApproveReject: FC<ModalApproveRejectProps> = ({
  type,
  open,
  title,
  okText,
  onOk,
  onCancel,
  subtitle,
  disabled,
  loading,
  withReason = true,
}) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "additionalExpense.form",
  });
  const [reason, setReason] = useState("");
  const isReject = type === "reject";

  const _subtitle =
    subtitle ??
    (isReject && withReason
      ? "Please provide the reason for rejection."
      : `Are you sure you want to ${type} this?`);

  const requiredMsg = t("message");

  const _title = title ?? `Confirm ${capitalize(type)}`;
  const [isRequired, setIsRequired] = useState(false);
  return (
    <Modal.Confirm
      destroyOnClose
      type={isReject ? "danger" : "warning"}
      width={550}
      open={open}
      title={_title}
      okButtonProps={{
        disabled: disabled || loading,
      }}
      cancelButtonProps={{ disabled: disabled || loading }}
      okText={okText ?? (isReject ? "Reject" : "Approve")}
      onOk={() => {
        if (isReject && !reason) {
          return setIsRequired(true);
        }
        onOk(reason);
      }}
      onCancel={() => {
        if (!loading) {
          onCancel();
        }
      }}
    >
      <span>{_subtitle}</span>

      {isReject && withReason ? (
        <>
          <Input.TextArea
            onChange={(e) => {
              if (isRequired) {
                setIsRequired(false);
              }
              setReason(e.target.value);
            }}
            value={reason}
            autoSize={{ minRows: 4, maxRows: 6 }}
            maxLength={200}
            showCount
            required
            disabled={disabled || loading}
            style={{ marginTop: "1rem" }}
          />
          {isRequired && (
            <span style={{ color: "red", fontSize: 14 }}>{requiredMsg}</span>
          )}
        </>
      ) : (
        <></>
      )}
    </Modal.Confirm>
  );
};

export default ModalApproveReject;
