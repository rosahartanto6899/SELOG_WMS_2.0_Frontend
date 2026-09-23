import {
  CalendarOutlined,
  ForwardOutlined,
  PauseCircleOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
import { useAppSelector } from "@sera-redux";
import { outstandingIncomingTypes } from "@sera-types/outstanding-incoming.type";
import { Col, Row, Skeleton } from "antd";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import styles from "./outstanding-incoming-summary.module.scss";

interface SummaryCard {
  key: string;
  label: string;
  value: number;
  color: string;
  tint: string;
  ambientGlow: string;
  gradient: string;
  glowShadow: string;
  icon: React.ReactNode;
  pulse?: boolean;
}

const OutstandingIncomingSummary = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "planIncoming.outstandingIncoming.summary.fields",
  });

  const {
    summary: { data },
  } = useAppSelector((state) => state.outstandingIncoming);

  const loading = useAppSelector(
    (state) =>
      state.loading[outstandingIncomingTypes.GET_OUTSTANDING_INCOMING_SUMMARY],
  );

  const total = useMemo(() => {
    return (
      (data?.carryOver ?? 0) +
      (data?.today ?? 0) +
      (data?.planned ?? 0) +
      (data?.hold ?? 0)
    );
  }, [data]);

  const CARDS: SummaryCard[] = useMemo(
    () => [
      {
        // dipindah/lanjut dari hari sebelumnya — panah maju, perlu atensi khusus
        key: "carryOver",
        label: t("carryOver"),
        value: data?.carryOver ?? 0,
        color: "#f43f5e",
        tint: "rgba(244, 63, 94, 0.12)",
        ambientGlow:
          "radial-gradient(circle at 85% 15%, rgba(244, 63, 94, 0.22) 0%, rgba(251, 113, 133, 0.08) 50%, transparent 75%)",
        gradient: "linear-gradient(90deg, #fb7185, #f43f5e)",
        glowShadow: "rgba(244, 63, 94, 0.22)",
        icon: <ForwardOutlined />,
        pulse: (data?.carryOver ?? 0) > 0,
      },
      {
        // jatuh tempo hari ini — kalender
        key: "today",
        label: t("today"),
        value: data?.today ?? 0,
        color: "#d97706",
        tint: "rgba(217, 119, 6, 0.12)",
        ambientGlow:
          "radial-gradient(circle at 85% 15%, rgba(245, 158, 11, 0.22) 0%, rgba(251, 191, 36, 0.08) 50%, transparent 75%)",
        gradient: "linear-gradient(90deg, #fbbf24, #d97706)",
        glowShadow: "rgba(217, 119, 6, 0.22)",
        icon: <CalendarOutlined />,
      },
      {
        // terjadwal ke depan — jadwal
        key: "planned",
        label: t("planned"),
        value: data?.planned ?? 0,
        color: "#059669",
        tint: "rgba(5, 150, 105, 0.12)",
        ambientGlow:
          "radial-gradient(circle at 85% 15%, rgba(16, 185, 129, 0.22) 0%, rgba(52, 211, 153, 0.08) 50%, transparent 75%)",
        gradient: "linear-gradient(90deg, #34d399, #059669)",
        glowShadow: "rgba(5, 150, 105, 0.22)",
        icon: <ScheduleOutlined />,
      },
      {
        // ditahan/dijeda — pause
        key: "hold",
        label: t("hold"),
        value: data?.hold ?? 0,
        color: "#7c3aed",
        tint: "rgba(124, 58, 237, 0.12)",
        ambientGlow:
          "radial-gradient(circle at 85% 15%, rgba(139, 92, 246, 0.22) 0%, rgba(167, 139, 250, 0.08) 50%, transparent 75%)",
        gradient: "linear-gradient(90deg, #a78bfa, #7c3aed)",
        glowShadow: "rgba(124, 58, 237, 0.22)",
        icon: <PauseCircleOutlined />,
      },
    ],
    [data, t],
  );

  return (
    // ponytail: wrapper div untuk horizontal swipe di mobile
    <div className={styles["cards-scroll"]}>
      <Row gutter={[16, 16]}>
        {CARDS.map((card) => {
          const percentage =
            total > 0 ? Math.round((card.value / total) * 100) : 0;

          return (
            <Col key={card.key} xs={24} sm={12} md={6}>
              <div
                className={styles.card}
                style={
                  {
                    "--accent-bar": card.gradient,
                    "--accent-color": card.color,
                    "--accent-tint": card.tint,
                    "--ambient-glow": card.ambientGlow,
                    "--card-glow-shadow": card.glowShadow,
                  } as React.CSSProperties
                }
              >
                {/* Header: Dot + Status Label | Frosted Icon Badge */}
                <div className={styles["card-header"]}>
                  <div className={styles["label-group"]}>
                    <span className={styles["dot-wrapper"]}>
                      <span className={styles.dot} />
                      {card.pulse && <span className={styles["dot-pulse"]} />}
                    </span>
                    <span className={styles.label}>{card.label}</span>
                  </div>
                  <div className={styles["icon-badge"]}>{card.icon}</div>
                </div>

                {/* Value & Proportion Ratio */}
                <div className={styles["card-value-row"]}>
                  {loading ? (
                    <Skeleton.Button
                      active
                      size="small"
                      style={{ width: 64, height: 32 }}
                    />
                  ) : (
                    <>
                      <div className={styles["value-group"]}>
                        <span className={styles.value}>{card.value}</span>
                        <span className={styles.caption}>
                          {t("deliveryNote")}
                        </span>
                      </div>
                      <span className={styles["ratio-badge"]}>
                        {percentage}%
                      </span>
                    </>
                  )}
                </div>

                {/* Segmented Telemetry Distribution Meter */}
                <div className={styles["progress-container"]}>
                  <div className={styles["segments-track"]}>
                    {Array.from({ length: 8 }).map((_, idx) => {
                      const activeSegments =
                        loading || total === 0
                          ? 0
                          : card.value > 0
                            ? Math.max(1, Math.round((percentage / 100) * 8))
                            : 0;
                      const isActive = idx < activeSegments;

                      return (
                        <div
                          key={idx}
                          className={`${styles.segment} ${
                            isActive ? styles["segment-active"] : ""
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default OutstandingIncomingSummary;
