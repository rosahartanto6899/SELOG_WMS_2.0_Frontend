import HourGlassImg from "@sera-assets/img/hourglass.png";
import styles from "@sera-assets/sass/internal-server-error.module.scss";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import Button from "../button";

type WaitingErrorProps = { resetErrorBoundary: any };

const WaitingError = ({ resetErrorBoundary }: WaitingErrorProps) => {
  const { t } = useTranslation();
  return (
    <div className={styles["error-container"]}>
      <Image src={HourGlassImg} alt="Waiting" priority />
      <div className={styles["error-text"]}>
        <h1 className={styles["error-title"]}>
          {t("global.error.handleWait.title")}
        </h1>
        <p className={styles["error-subtitle"]}>
          {t("global.error.handleWait.subtitle")}
        </p>
      </div>
      <Button
        id="error-boundary-reset-button"
        onClick={resetErrorBoundary}
        type="primary"
      >
        {t("global.error.handleWait.refreshButton")}
      </Button>
    </div>
  );
};

export default WaitingError;
