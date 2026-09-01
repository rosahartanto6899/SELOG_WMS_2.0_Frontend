import { CloseOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Drawer, Row, Skeleton, Space } from "antd";
import { collection, onSnapshot, query } from "firebase/firestore";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { connect } from "react-redux";

import { db } from "../../libraries/firebase/config";
import { RootState } from "../../redux";
import { notificationActions } from "../../redux/slices/notification.slice";
import { CustomUseSession } from "../../types/auth.type";
import { NotificationState } from "../../types/notification.type";
import Card from "../card";
import Empty from "../empty";
import Input from "../input";
import styles from "./notification-bar.module.scss";

interface NotificationDrawerProps {
  open: boolean;
  notification: NotificationState;
  getNotificationDaily: typeof notificationActions.getNotificationDailyFetch;
  onClose: () => void;
}

const NotificationDrawer = (props: NotificationDrawerProps) => {
  const { open, onClose, notification, getNotificationDaily } = props;
  const { t } = useTranslation();
  const router = useRouter();

  const soundNotif = new Audio(
    "https://seradev.blob.core.windows.net/asset/sound/AirPlaneDing496729130.mp3",
  );

  const { data: session } = useSession() as CustomUseSession;
  const userFleetGroupId = session?.detail?.data?.user?.fleetGroup;

  const [doRetrieveNotif, setDoRetrieveNotif] = useState<boolean>(false);

  useEffect(() => {
    if (userFleetGroupId) {
      getNotificationDaily({
        fleetGroupId: userFleetGroupId,
      });
    }
  }, [userFleetGroupId]);

  useEffect(() => {
    const q = query(collection(db, `/alert/fleetgroup/${userFleetGroupId}`));
    onSnapshot(q, (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        if (
          change.type === "added" &&
          change.doc.exists() &&
          doRetrieveNotif === false
        ) {
          setDoRetrieveNotif(true);
        }
      });
    });
  }, [db]);

  useEffect(() => {
    if (doRetrieveNotif && userFleetGroupId) {
      getNotificationDaily({
        fleetGroupId: userFleetGroupId,
      });
      setDoRetrieveNotif(false);
    }
  }, [doRetrieveNotif, getNotificationDaily]);

  useEffect(() => {
    let playNotif = false;
    notification.data.forEach((item) => {
      if (item.isSoundNotif) {
        playNotif = true;
      }
    });
    if (playNotif) {
      soundNotif.play();
    }
  }, [notification.data]);

  return (
    <Drawer
      className={styles["sera-drawer-notification"]}
      closable={false}
      title={
        <>
          <Row gutter={[8, 8]} justify="space-between" align="middle">
            <Col>
              <h4>{t("global.notification.bar.header.title")}</h4>
            </Col>
            <Col>
              <Button
                id="close"
                type="default"
                className="ant-drawer-close"
                shape="round"
                onClick={onClose}
                icon={<CloseOutlined />}
                size="small"
              />
            </Col>
          </Row>
          <Row gutter={[4, 4]}>
            <Col>
              <Space wrap>
                <Button id="button-filter-all" type="primary">
                  {t("global.notification.bar.header.buttons[0].label")}
                </Button>
                <Button id="button-filter-anomalies" type="default">
                  {t("global.notification.bar.header.buttons[1].label")}
                </Button>
                <Button id="button-filter-critical-events" type="default">
                  {t("global.notification.bar.header.buttons[2].label")}
                </Button>
                <Button id="button-filter-violations" type="default">
                  {t("global.notification.bar.header.buttons[3].label")}
                </Button>
              </Space>
            </Col>
          </Row>
          <Row style={{ marginTop: "8px" }}>
            <Col span={24}>
              <Input.Search
                loading={false}
                placeholder={t(
                  "global.notification.bar.header.input.placeholder",
                )}
              />
            </Col>
          </Row>
        </>
      }
      placement="right"
      open={open}
      onClose={onClose}
    >
      <div>
        <Row justify="end">
          <Col>
            <Button
              id="button-mark-all-as-read"
              type="link"
              onClick={() => {
                router.push("/alert/history");
                onClose();
              }}
            >
              {t("global.notification.bar.body.button")}
            </Button>
          </Col>
        </Row>
      </div>
      <div
        id="SeraNotificationScrollable"
        style={{ height: "auto", overflow: "auto" }}
      >
        {notification.data && (
          <InfiniteScroll
            dataLength={notification.data?.length || 0}
            // next={() => getNotifications && getNotifications({ userId: session.SeraUserId })}
            next={() => console}
            hasMore={notification.options.hasMore || false}
            style={{ padding: "8px 10px" }}
            loader={
              <Row gutter={[0, 8]} style={{ marginTop: "8px" }}>
                <Col span={24}>
                  <Skeleton avatar paragraph={{ rows: 2 }} />
                </Col>
              </Row>
            }
            endMessage={
              notification.data.length >= notification.options.limit && (
                <Divider plain>
                  {t("global.notification.bar.body.divider")}
                </Divider>
              )
            }
            scrollableTarget="SeraNotificationScrollable"
          >
            {notification.data.length === 0 && (
              <Empty
                description={t("global.notification.bar.body.data.empty")}
              />
            )}
            {notification.data.length > 0 && (
              <Row gutter={[0, 8]}>
                {/* {notification?.data.map((notif: Notification) => ( */}
                {notification.data.map((notif: any) => (
                  <Col span={24} key={notif.body.waktu._seconds}>
                    <Card.Notification
                      key={notif.body.waktu._seconds}
                      onClick={() => {
                        router.push(
                          `/alert/history/detail/${notif._id}?menuName=Critical Events&category=${notif.category}`,
                        );
                      }}
                      title={
                        <div style={{ color: "#BE1E2D" }}>
                          {notif.body.alert}
                        </div>
                      }
                      type="alert"
                      timestamp={notif.createdAt}
                      description={
                        <div>
                          {notif.body.licensePlate}{" "}
                          {t("global.notification.bar.body.data.description")}
                        </div>
                      }
                    />
                  </Col>
                ))}
              </Row>
            )}
          </InfiniteScroll>
        )}
      </div>
    </Drawer>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  notification: state.notification,
});

const mapDispatchToProps = {
  getNotificationDaily: notificationActions.getNotificationDailyFetch,
  // getNotifications: notificationActions.getNotificationsFetch,
  // getStartListen: notificationActions.getNotificationsListenStart,
  // getStopListen: notificationActions.getNotificationsListenStop,
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationDrawer);
