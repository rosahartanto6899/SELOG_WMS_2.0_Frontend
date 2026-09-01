import ConstructionImg from "@sera-assets/img/construction.png";
import styles from "@sera-assets/sass/internal-server-error.module.scss";
import Image from "next/image";
import { useTranslation } from "react-i18next";

const WaitingError = () => {
  const { t } = useTranslation();
  return (
    <div className={styles["error-container"]}>
      <Image src={ConstructionImg} alt="Under Maintenance" priority />
      <div className={styles["error-text"]}>
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

export default WaitingError;
