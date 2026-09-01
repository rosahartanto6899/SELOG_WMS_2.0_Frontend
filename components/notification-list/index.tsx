import { BellOutlined } from "@ant-design/icons";
import { Badge, Button, List, Popover } from "antd";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
// import axios from 'axios';
import InfiniteScroll from "react-infinite-scroll-component";
import { connect } from "react-redux";

import { db } from "../../libraries/firebase/config";
import { notificationActions, RootState } from "../../redux";
import { CustomUseSession } from "../../types/auth.type";
import { NotificationState } from "../../types/notification.type";
import FormatUtils from "../../utils/format";
import Empty from "../empty";
import { TriangleWarning } from "../icons";
import styles from "./notification-list.module.scss";

interface NotificationListProps {
  notification: NotificationState;
  alertHistory: any;
  getNotificationDaily: typeof notificationActions.getNotificationDailyFetch;
  getNotificationFleetGroup: typeof notificationActions.getNotificationFleetGroupFetch;
}

const NotificationList = (props: NotificationListProps) => {
  const {
    notification,
    alertHistory,
    getNotificationDaily,
    getNotificationFleetGroup,
  } = props;
  const { t } = useTranslation();

  // const soundNotif = new Audio(process.env.NEXT_PUBLIC_SOUND_NOTIFICATION_URL ?? '');

  const { data: session } = useSession() as CustomUseSession;
  const userFleetGroupId = session?.detail?.data?.user?.fleetGroup;

  const [isInitCallNotif, setIsInitCallNotif] = useState<boolean>(true);
  const [isNotifWasCalled, setIsNotifWasCalled] = useState<boolean>(false);
  const [currentTotalNotif, setCurrentTotalNotif] = useState<number>(0);
  const [playSoundNotif, setPlaySoundNotif] = useState<string>("disabled");
  const [open, setOpen] = useState<boolean>(false);
  // const [sound, setSound] = useState<any>();

  const soundNotif = async () => {
    // let masterSound = localStorage.getItem('sound');
    // if (!masterSound) {
    //   const configSound = {
    //     method: 'POST',
    //     url: `/api/sound`,
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     data: {
    //       url: process.env.NEXT_PUBLIC_SOUND_NOTIFICATION_URL,
    //     },
    //   };
    //   const sound = await axios(configSound)
    //     .then((response) => response)
    //     .catch((error) => error);
    //   masterSound = `data:audio/mpeg;base64,${sound.data.data}`;
    //   localStorage.setItem('sound', masterSound);
    // }
    // if (masterSound) {
    //   const snd = new Audio(masterSound);
    //   setSound(snd);
    // }
  };

  useEffect(() => {
    getNotificationFleetGroup();
    soundNotif();
  }, []);

  useEffect(() => {
    if (notification.fleetGroups.data) {
      notification.fleetGroups.data.forEach((item) => {
        const q = query(
          collection(db, `/alert/fleetgroup/${item.id}`),
          orderBy("body.waktu", "desc"),
          limit(1),
        );
        onSnapshot(q, (querySnapshot) => {
          querySnapshot.docChanges().forEach((change) => {
            if (change.type === "added" && change.doc.exists()) {
              setPlaySoundNotif(change.doc.data().body.isSoundNotif);
              setIsNotifWasCalled(true);
            }
          });
        });
      });
    }
  }, [db, notification.fleetGroups]);

  useEffect(() => {
    if (isNotifWasCalled && userFleetGroupId) {
      setTimeout(() => {
        getNotificationDaily({
          fleetGroupId: userFleetGroupId,
        });
        setIsNotifWasCalled(false);
      }, 500);
    }
  }, [isNotifWasCalled]);

  useEffect(() => {
    setCurrentTotalNotif(notification.count);
    // eslint-disable-next-line consistent-return
    notification.data.forEach(() => {
      if (
        isInitCallNotif === false &&
        notification.count > currentTotalNotif &&
        playSoundNotif === "enabled"
      ) {
        // soundNotif.play();
        // soundNotif();
        // sound.play();
        return false;
      }
      setIsInitCallNotif(false);
    });
  }, [notification, currentTotalNotif, playSoundNotif]);

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const loadMoreData = () => {
    console.log("");
  };

  return (
    <div className={styles["container-notification"]}>
      <Popover
        placement="bottom"
        title={
          <div className={styles["notification-list-title"]}>
            {t("global.notification.list.title")}
          </div>
        }
        trigger="click"
        open={open}
        onOpenChange={handleOpenChange}
        overlayClassName="custom-inner-popover"
        content={
          <>
            <div
              id="scrollableDiv"
              style={{
                maxHeight: "400px",
                overflow: "auto",
                padding: "0 15px",
              }}
            >
              <InfiniteScroll
                dataLength={notification.data.length}
                next={loadMoreData}
                hasMore={false}
                loader={false}
                scrollableTarget="scrollableDiv"
                // endMessage={<Divider plain> </Divider>}
              >
                <div style={{ width: "350px" }}>
                  {notification.data.length === 0 && (
                    <Empty
                      description={t("global.notification.list.data.empty")}
                    />
                  )}
                  {notification.data.length > 0 && (
                    <List
                      itemLayout="horizontal"
                      dataSource={notification.data}
                      renderItem={(item) => {
                        const findAlertCategory =
                          alertHistory.alertCategory?.find(
                            (data: any) => data.name === item.alertCategoryName,
                          );
                        const alertCategoryId = findAlertCategory?.id;
                        return (
                          <Link
                            id="link-alert-history-detail"
                            href={`/alert/history/detail/${item._id}?activeKey=information-tab&menuName=${item.alertCategoryName}&category=${alertCategoryId}`}
                            passHref
                          >
                            <List.Item
                              extra={FormatUtils().dateTimeTransform(
                                item.deviceTime || "",
                                "DD MMM YYYY HH:mm:ss",
                              )}
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                hide();
                              }}
                            >
                              <List.Item.Meta
                                title={
                                  <div
                                    style={{
                                      color: "#BE1E2D",
                                      fontWeight: "bold",
                                      fontSize: "12pt",
                                    }}
                                  >
                                    <TriangleWarning />{" "}
                                    <span style={{ marginLeft: "10px" }}>
                                      {item.eventName ?? item.eventType}
                                    </span>
                                  </div>
                                }
                                description={`${item.licensePlate} ${t("global.notification.list.data.description")}`}
                              />
                            </List.Item>
                          </Link>
                        );
                      }}
                    />
                  )}
                </div>
              </InfiniteScroll>
            </div>
            {notification.data.length > 0 && (
              <div className={styles["footer-popover-notification"]}>
                <Link
                  id="link-all-alert-notification"
                  href="/alert/history/uncategories"
                  passHref
                >
                  <Button
                    type="link"
                    id="button-read-all"
                    onClick={() => {
                      hide();
                    }}
                  >
                    {t("global.notification.list.data.button")}
                  </Button>
                </Link>
              </div>
            )}
          </>
        }
      >
        <Badge
          size="small"
          count={notification.count}
          title=""
          overflowCount={1000000000000000}
        >
          <BellOutlined className={styles["notification-icon"]} size={24} />
        </Badge>
      </Popover>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  notification: state.notification,
  alertHistory: {
    alertCategory: [],
  },
});

const mapDispatchToProps = {
  getNotificationDaily: notificationActions.getNotificationDailyFetch,
  getNotificationFleetGroup: notificationActions.getNotificationFleetGroupFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationList);
