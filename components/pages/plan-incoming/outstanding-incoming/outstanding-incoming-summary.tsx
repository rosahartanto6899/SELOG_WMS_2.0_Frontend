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
  gradient: string;
  icon: React.ReactNode;
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

  const CARDS: SummaryCard[] = useMemo(
    () => [
      {
        // dipindah/lanjut dari hari sebelumnya — panah maju
        key: "carryOver",
        label: t("carryOver"),
        value: data?.carryOver ?? 0,
        color: "#e11d48",
        tint: "#ffe4e6",
        gradient: "linear-gradient(90deg, #fb7185, #e11d48)",
        icon: <ForwardOutlined />,
      },
      {
        // jatuh tempo hari ini — kalender
        key: "today",
        label: t("today"),
        value: data?.today ?? 0,
        color: "#d97706",
        tint: "#fef3c7",
        gradient: "linear-gradient(90deg, #fbbf24, #d97706)",
        icon: <CalendarOutlined />,
      },
      {
        // terjadwal ke depan — jadwal
        key: "planned",
        label: t("planned"),
        value: data?.planned ?? 0,
        color: "#059669",
        tint: "#d1fae5",
        gradient: "linear-gradient(90deg, #34d399, #059669)",
        icon: <ScheduleOutlined />,
      },
      {
        // ditahan/dijeda — pause
        key: "hold",
        label: t("hold"),
        value: data?.hold ?? 0,
        color: "#7c3aed",
        tint: "#ede9fe",
        gradient: "linear-gradient(90deg, #a78bfa, #7c3aed)",
        icon: <PauseCircleOutlined />,
      },
    ],
    [data, t],
  );

  return (
    <Row gutter={[16, 16]}>
      {CARDS.map((card) => (
        <Col key={card.key} xs={24} sm={12} md={6}>
          <div
            className={styles.card}
            style={
              {
                "--accent-bar": card.gradient,
                "--accent-color": card.color,
                "--accent-tint": card.tint,
              } as React.CSSProperties
            }
          >
            <div className={styles["icon-badge"]}>{card.icon}</div>

            <div className={styles.body}>
              <span className={styles.label}>{card.label}</span>
              {loading ? (
                <Skeleton.Button
                  active
                  size="small"
                  style={{ marginTop: 6, width: 48 }}
                />
              ) : (
                <>
                  <span className={styles.value}>{card.value}</span>
                  <span className={styles.caption}>{t("deliveryNote")}</span>
                </>
              )}
            </div>
          </div>
        </Col>
      ))}
    </Row>
  );
};

export default OutstandingIncomingSummary;
