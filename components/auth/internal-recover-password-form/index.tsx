import { Button, Col } from "antd";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";

import { COMMON_CONST } from "../../../utils/constants/common";
import styles from "./internal-recover-password-form.module.scss";

const InternalRecoverPasswordForm = () => {
  const { t } = useTranslation();

  return (
    <div className={styles["internal-recover-password-wrapper"]}>
      <div className={styles["internal-recover-password-container"]}>
        <Col span={24}>
          <div className={styles["internal-recover-password-description"]}>
            {t("auth.internalRecoverPassword.description")}
            <ul>
              <li>
                {t("auth.internalRecoverPassword.email.preText")}{" "}
                <a
                  id="request-reset-password"
                  href={`mailto:${process.env.HELPDESK_MAIL}?subject=${COMMON_CONST.URL_SUBJECT_RESET_PASSWORD}`}
                >
                  {t("auth.internalRecoverPassword.email.text")}
                </a>
              </li>
              <li>{t("auth.internalRecoverPassword.information")}</li>
            </ul>
          </div>
        </Col>
        <Col span={24}>
          <Link id="login" href="/auth" passHref>
            <Button
              id="go-back"
              className={`${styles["internal-recover-password-form-button"]} ${styles["internal-recover-password-form-button-secondary"]}`}
            >
              {t("auth.internalRecoverPassword.button")}
            </Button>
          </Link>
        </Col>
      </div>
    </div>
  );
};

export default InternalRecoverPasswordForm;
