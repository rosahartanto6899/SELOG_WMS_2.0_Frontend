import Modal from "@sera-components/modal";
import MessageHandler from "@sera-libraries/message-handler";
import { Input, Modal as ModalAntd } from "antd";
import { OTPProps } from "antd/es/input/OTP";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import styles from "./input-otp.module.scss";

const OTPInputPopUp = ({
  open,
  handleShow,
  handleVerificationOtp,
  handleResendCode,
  status,
  loading,
  isClosable,
}: {
  open: boolean;
  handleShow: () => void;
  handleVerificationOtp: (otp: string) => void;
  handleResendCode: () => Promise<number>;
  status: OTPProps["status"];
  loading: boolean;
  isClosable: boolean;
}) => {
  const { t } = useTranslation(undefined, { keyPrefix: "auth" });

  const [timer, setTimer] = useState(300);

  const [runTimer, setRunTimer] = useState(false);

  const [disableResendCode, setDisableResendCode] = useState(false);

  const handleResend = async () => {
    const status = await handleResendCode();
    if (status === 200) {
      setTimer(300);
      localStorage.setItem(
        "otp-expired",
        JSON.stringify(dayjs().add(5, "minute")),
      );
      setRunTimer(true);
      setDisableResendCode(false);
    }
  };

  useEffect(() => {
    if (!runTimer) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          setRunTimer(false);
          handleShow();
          MessageHandler().error(t("otp.toast.expired"));
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runTimer]);

  useEffect(() => {
    if (open) {
      setRunTimer(true);
      setTimer(() => {
        const otpExpiry = localStorage.getItem("otp-expired");
        if (otpExpiry) {
          try {
            const expiryDate = dayjs(JSON.parse(otpExpiry));
            const diff = expiryDate.diff(dayjs(), "second");
            return diff > 0 ? diff : 0;
          } catch (error) {
            console.error("Invalid OTP expiry date:", error);
          }
        }
        return 300;
      });
    }

    return () => {
      setRunTimer(false);
    };
  }, [open]);

  const { OTP: Otp } = Input;

  return (
    <Modal
      open={open}
      width={550}
      onCancel={() => {
        if (isClosable) {
          ModalAntd.confirm({
            title: t("otp.modal.title"),
            content: t("otp.modal.content"),
            onOk: () => {
              handleShow();
              localStorage.removeItem("otp-expired");
            },
          });
        }
      }}
      centered
      closable={isClosable}
    >
      <div className={styles["otp-body-container"]}>
        <h3 className={styles["otp-title"]}>{t("otp.title")}</h3>
        <p className={styles["otp-subtitle"]}>{t("otp.subtitle")}</p>
      </div>

      <div className={styles["otp-input-container"]}>
        <p data-error={status === "error"}>{t("otp.error.status.message")}</p>
        <Otp
          onChange={(val) => handleVerificationOtp(val)}
          id="input-otp-sera"
          length={6}
          disabled={loading}
          status={status}
          type="number"
          variant="outlined"
        />
      </div>

      <div className={styles["otp-footer-container"]}>
        <p
          className={styles["resend-code"]}
          data-show={timer <= 240 && !isClosable}
        >
          {t("otp.footer.resend.message")}{" "}
          <button
            disabled={disableResendCode}
            data-disable={disableResendCode}
            className={styles["resend-code-btn"]}
            onClick={handleResend}
          >
            {t("otp.footer.resend.button.label")}
          </button>
        </p>
        <p>
          {t("otp.footer.expired.message")}:{" "}
          <label style={{ fontWeight: "bolder", marginBottom: 0 }}>
            {String(Math.floor(timer / 60)).padStart(2, "0")}:
            {String(timer % 60).padStart(2, "0")}
          </label>
        </p>
      </div>
    </Modal>
  );
};

export default OTPInputPopUp;
