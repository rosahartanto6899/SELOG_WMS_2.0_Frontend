import { BoxPlotOutlined } from "@ant-design/icons";
import { useAppSelector } from "@sera-redux";
import { outstandingOutgoingTypes } from "@sera-types/outstanding-outgoing.type";
import { Col, Row, Skeleton } from "antd";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import styles from "./outstanding-outgoing-summary.module.scss";

interface SummaryCard {
  key: string;
  label: string;
  value: number;
  color: string;
  tint: string;
  gradient: string;
  icon: React.ReactNode;
}

/** aksen warna kartu total (biru, parity incoming) */
const ACCENT = {
  color: "#2563eb",
  tint: "#dbeafe",
  gradient: "linear-gradient(90deg, #60a5fa, #2563eb)",
};

/** Summary total outstanding (Q10) — style parity outstanding-incoming-summary
 *  (accent bar + icon badge + skeleton). */
const OutstandingOutgoingSummary = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "planOutgoing.outstandingOutgoing.summary.fields",
  });

  const {
    totals: { data },
  } = useAppSelector((state) => state.outstandingOutgoing);

  const loading = useAppSelector(
    (state) => state.loading[outstandingOutgoingTypes.GET_OUTGOING_TOTALS],
  );

  const CARDS: SummaryCard[] = useMemo(
    () => [
      {
        key: "total",
        label: t("total"),
        value: data?.total ?? 0,
        icon: <BoxPlotOutlined />,
        ...ACCENT,
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
                  <span className={styles.caption}>{t("caption")}</span>
                </>
              )}
            </div>
          </div>
        </Col>
      ))}
    </Row>
  );
};

export default OutstandingOutgoingSummary;
