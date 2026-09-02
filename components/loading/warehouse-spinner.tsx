import styles from "./warehouse-spinner.module.scss";

interface WarehouseSpinnerProps {
  size?: number;
}

const WarehouseSpinner = ({ size = 96 }: WarehouseSpinnerProps) => (
  <div
    className={styles["spinner-wrapper"]}
    style={{ width: size, height: size }}
    role="status"
    aria-label="Loading"
  >
    <svg
      viewBox="0 0 120 120"
      width="100%"
      height="100%"
      className={styles["spinner-svg"]}
    >
      <defs>
        <linearGradient id="wms-spinner-box" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffb545" />
          <stop offset="100%" stopColor="#e2892a" />
        </linearGradient>
      </defs>

      {/* rack uprights */}
      <line x1="20" y1="14" x2="20" y2="96" className={styles["rack-line"]} />
      <line x1="100" y1="14" x2="100" y2="96" className={styles["rack-line"]} />

      {/* shelves */}
      <line
        x1="12"
        y1="26"
        x2="108"
        y2="26"
        className={`${styles["shelf-line"]} ${styles["shelf-top"]}`}
      />
      <line
        x1="12"
        y1="58"
        x2="108"
        y2="58"
        className={`${styles["shelf-line"]} ${styles["shelf-mid"]}`}
      />
      <line
        x1="12"
        y1="90"
        x2="108"
        y2="90"
        className={`${styles["shelf-line"]} ${styles["shelf-bottom"]}`}
      />

      {/* box, animated climbing shelf-to-shelf (rest position = bottom shelf) */}
      <g className={styles["box-group"]}>
        <rect
          x="43"
          y="68"
          width="34"
          height="22"
          rx="3"
          fill="url(#wms-spinner-box)"
        />
        <line
          x1="43"
          y1="76"
          x2="77"
          y2="76"
          stroke="#8a5a1e"
          strokeOpacity="0.5"
          strokeWidth="1.5"
        />
        <line
          x1="60"
          y1="68"
          x2="60"
          y2="90"
          stroke="#8a5a1e"
          strokeOpacity="0.4"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  </div>
);

export default WarehouseSpinner;
