import Typography from "@sera-components/typography";
import logoImage from "@sera-public/images/logo.svg";
import { Flex } from "antd";
import Image from "next/image";

import styles from "./dashboard.module.scss";

export default function Dashboard() {
  return (
    <Flex justify="center" align="center" vertical className={styles.welcome}>
      <div className={styles["welcome-copy"]}>
        <Typography.Title level={4} className={styles["welcome-title"]}>
          Welcome to WMS
        </Typography.Title>
        <Typography.Text className={styles["welcome-subtitle"]}>
          Warehouse Management System
        </Typography.Text>
      </div>
      <div className={styles["logo-wrapper"]}>
        <Image
          src={logoImage}
          alt="SELOG"
          fill
          priority
          style={{ objectFit: "contain" }}
        />
      </div>
    </Flex>
  );
}
