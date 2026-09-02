import Image from "next/image";

import styles from "./dashboard.module.scss";

export default function Dashboard() {
  return (
    <div className={styles.welcome}>
      <div className={styles["illustration-wrapper"]}>
        <Image
          src="/images/dashboard-illustration.svg"
          alt="Welcome to WMS 2.0"
          fill
          priority
          unoptimized
          style={{ objectFit: "contain" }}
        />
      </div>
    </div>
  );
}
