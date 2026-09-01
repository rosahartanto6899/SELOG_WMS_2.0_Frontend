import RecoverPasswordForm from "@sera-components/auth/recover-password-form";
import Typography from "@sera-components/typography";
import logoImage from "@sera-public/images/logo.svg";
import { Space } from "antd";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import styles from "./recover-password.module.scss";

export default function RecoverPassword() {
  const { t } = useTranslation();
  return (
    <main className={styles["auth-container"]}>
      <section className={styles["body-wrapper"]}>
        <div className={styles["image-wrapper"]}>
          <Image
            src="/images/slider/recover-password.png"
            alt="SELOG"
            fill
            priority
            style={{ objectFit: "cover", objectPosition: "top" }}
          />

          <div className={styles["image-overlay"]} />
        </div>

        <div className={styles["form-wrapper"]}>
          <RecoverPasswordForm />
        </div>
      </section>

      <section className={styles["footer-wrapper"]}>
        <div className={styles["footer-logo"]}>
          <Image src={logoImage} alt="Sera Logo" sizes="85px" fill priority />
        </div>

        <Space size="large">
          <Link id="footer-help" href="/#">
            <Typography.Text>{t("global.footer.help")}</Typography.Text>
          </Link>

          <Link id="footer-tnc" href="/#">
            <Typography.Text>{t("global.footer.tnc")}</Typography.Text>
          </Link>
        </Space>

        <Typography.Text variant="muted" style={{ textAlign: "center" }}>
          <span>Copyright © {moment().format("YYYY")} Serasi Autoraya.</span>
          <span>&nbsp;All Rights Reserved.</span>
        </Typography.Text>
      </section>
    </main>
  );
}
