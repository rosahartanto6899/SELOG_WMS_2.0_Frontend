import Image from "next/image";

import styles from "./dashboard.module.scss";

export default function Dashboard() {
  return (
    <div className={styles.welcome}>
      <div className={styles["illustration-wrapper"]}>
        <Image
          src="/images/dashboard-illustration-v3.png"
          alt="Welcome to WMS 2.0"
          fill
          priority
          unoptimized
          style={{ objectFit: "contain" }}
        />
      </div>

      <div className={styles["hero-text"]}>
        <div className={styles["hero-badge"]}>WMS 2.0</div>
        <h1 className={styles["hero-headline"]}>
          Faster scanning.
          <br />
          Smarter tracking.
          <br />
          <span className={styles["hero-accent"]}>
            One connected warehouse.
          </span>
        </h1>
        <div className={styles["hero-divider"]} />
      </div>
    </div>
  );
}
