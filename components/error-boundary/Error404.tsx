import Page404Img from "@sera-assets/img/page404.png";
import styles from "@sera-assets/sass/internal-server-error.module.scss";
import Button from "@sera-components/button";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const Error404 = () => {
  const { t } = useTranslation();
  return (
    <div className={styles["error-container"]}>
      <Image src={Page404Img} alt="Page Not Found" priority />
      <div className={styles["error-text"]}>
        <h1 className={styles["error-title"]}>
          {" "}
          {t("global.error.error404.title")}
        </h1>
        <p className={styles["error-subtitle"]}>
          {" "}
          {t("global.error.error404.subtitle")}
        </p>
      </div>
      <Button id="home-button" type="default">
        <Link href="/" id="home-link" passHref>
          {t("global.error.error404.backToHomeButton")}
        </Link>
      </Button>
    </div>
  );
};

export default Error404;
