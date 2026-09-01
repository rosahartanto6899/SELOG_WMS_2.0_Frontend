import Typography from "@sera-components/typography";
import UserApi from "@sera-libraries/api/auth";
import logoImage from "@sera-public/images/logo.svg";
import { Col, Row, Space } from "antd";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import styles from "./activation.module.scss";

export default function TokenActivation() {
  const router = useRouter();
  const { token } = router.query;
  const { t } = useTranslation();

  const verify = async (token: string) => {
    try {
      await UserApi().checkVerification(token);
    } catch (error) {
      console.error(error);
    } finally {
      router.push("/auth");
    }
  };

  useEffect(() => {
    if (token) {
      verify(token as string);
    }
  }, [token]);
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
          <div className={styles["activation-wrapper"]}>
            <div className={styles["activation-container"]}>
              <Row justify="center" style={{ marginBottom: "5rem" }}>
                <Col>
                  <div className={styles["activation-logo"]} />
                </Col>
              </Row>
            </div>
          </div>
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
