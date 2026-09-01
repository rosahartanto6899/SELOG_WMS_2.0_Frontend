import NextErrorComponent from "next/error";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import ToolSetImg from "../assets/img/toolSet.png";
import styles from "../assets/sass/internal-server-error.module.scss";
import GlitchTip from "../utils/glitchtip";

const InternalServerPage = () => {
  const { data } = useSession() as any;
  const { user } = data.detail.data;
  const { t } = useTranslation();

  const router = useRouter();

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      GlitchTip().setUserContext(user);
      GlitchTip().setApiContext({
        url: router.pathname,
      });
    }
  }, []);

  return (
    <div className={styles["internal-server-error"]}>
      <div className={styles["internal-server-error-image"]}>
        <Image src={ToolSetImg} alt="Under Maintenance" priority />
      </div>
      <div className={styles["internal-server-error-text"]}>
        <h1 className={styles["error-title"]}>
          {" "}
          {t("global.error.underMaintenance.title")}
        </h1>
        <p className={styles["error-subtitle"]}>
          {" "}
          {t("global.error.underMaintenance.subtitle")}
        </p>
      </div>
    </div>
  );
};

InternalServerPage.getInitialProps = (contextData: any) => {
  // In case this is running in a serverless function, await this in order to give Sentry
  // time to send the error before the lambda exits
  GlitchTip().captureException("Error 500, Internal Server Error");

  // This will contain the status code of the response
  return NextErrorComponent.getInitialProps(contextData);
};

export default InternalServerPage;
