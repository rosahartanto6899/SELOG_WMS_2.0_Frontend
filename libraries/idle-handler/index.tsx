import Button from "@sera-components/button";
import { ExportOutlined, Sleep, UserCheck } from "@sera-components/icons";
import Modal from "@sera-components/modal";
import { RootState } from "@sera-redux";
import { CustomUseSession } from "@sera-types/auth.type";
import { API_STATUS_CODE } from "@sera-utils/constants/response-api";
import { decryptData } from "@sera-utils/encryptor";
import SharedUtils from "@sera-utils/shared-utils";
import Utils from "@sera-utils/utils";
import { Space, Typography } from "antd";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useIdleTimer } from "react-idle-timer";
import { connect } from "react-redux";

type IdleHandlerProps = {
  children: JSX.Element;
  error: any;
};

const IdleHandler = (props: IdleHandlerProps): JSX.Element => {
  const { children, error } = props;
  const timeout = Number(process.env.MAX_IDLE_TIME); // 1 hour
  const promptBeforeIdle = Number(process.env.WARNING_IDLE_TIME);
  const [remaining, setRemaining] = useState(timeout);
  const [showWarningIdle, setShowWarningIdle] = useState(false);
  const [showLogoutIdle, setShowLogoutIdle] = useState(false);
  const [showLogoutConcurrent, setShowLogoutConcurrent] = useState(false);
  const [showLogoutChangeRole, setShowLogoutChangeRole] = useState(false);
  const [timeRemining, setTimeRemining] = useState("");
  const router = useRouter();
  const { data } = useSession() as CustomUseSession;
  const isInternal = data?.detail?.data?.user.isInternal;
  const loginProvider = data?.loginProvider;
  const { pathname } = router;
  const isTrackIdle =
    pathname !== "/" &&
    pathname !== "/vehicle-monitoring/[id]" &&
    pathname !== "/report/analytics" &&
    pathname !== "/report/performance" &&
    pathname !== "/report/specific" &&
    pathname !== "/vehicle/add-bulk" &&
    pathname !== "/vehicle/edit/bulk" &&
    pathname !== "/devices/device-list/add" &&
    pathname !== "/master-data/poi/add" &&
    pathname !== "/drivers/add-bulk" &&
    pathname !== "/geofence/vehicle-pairing/mapping/[id]";

  const onActive = () => {
    setShowWarningIdle(false);
  };

  const onIdle = () => {
    if (isTrackIdle) {
      setShowWarningIdle(false);
      setTimeout(() => {
        setShowLogoutIdle(true);
      }, 500);
    }
  };

  const onPrompt = () => {
    if (isTrackIdle) {
      setShowWarningIdle(true);
    }
  };

  const { getRemainingTime, activate } = useIdleTimer({
    onIdle,
    onActive,
    onPrompt,
    timeout,
    promptBeforeIdle,
  });

  const handleFMALogoutRedirect = () => {
    const baseUrl = process.env.NEXTAUTH_URL ?? window.location.origin;
    let authUrl = `${baseUrl}/auth`;
    if (isInternal && loginProvider === "azure-ad") {
      authUrl = `${decryptData(process.env.MSAL_LOGIN_URL)}/${decryptData(process.env.MSAL_TENANT_ID)}/oauth2/logout?post_logout_redirect_uri=${decryptData(process.env.AUTH_URL)}&prompt=none`;
    }
    // setTimeout(() => {
    window.location.replace(authUrl);
    // }, 500);
  };

  useEffect(() => {
    setRemaining(getRemainingTime());

    const intervalIdleCounter = setInterval(() => {
      setRemaining(getRemainingTime());
    }, 1000);

    window.addEventListener("mousemove", () => {
      activate();
    });

    window.addEventListener("click", () => {
      activate();
    });

    window.addEventListener("keypress", () => {
      activate();
    });

    return () => {
      clearInterval(intervalIdleCounter);
      window.removeEventListener("mouseover", () => {
        activate();
      });
      window.removeEventListener("click", () => {
        activate();
      });
      window.removeEventListener("keypress", () => {
        activate();
      });
    };
  }, []);

  useEffect(() => {
    setTimeRemining(Utils().convertMsToTime(remaining));
  }, [remaining]);

  useEffect(() => {
    const statusCode = error?.detail?.statusCode;

    if (statusCode !== undefined) {
      switch (statusCode) {
        case API_STATUS_CODE.AUTH.USER_NOT_FOUND:
          SharedUtils().clearSession(loginProvider);
          break;

        case API_STATUS_CODE.LOGOUT.MULTIPLE_DEVICE:
          setShowLogoutConcurrent(true);
          break;

        case API_STATUS_CODE.LOGOUT.CHANGE_ROLE:
        case API_STATUS_CODE.LOGOUT.UPDATE_USER:
        case API_STATUS_CODE.LOGOUT.DELETE_USER:
          setShowLogoutChangeRole(true);
          break;

        default:
          break;
      }
    }
  }, [error]);

  return (
    <>
      {children}

      <Modal
        id="warning-idle-modal"
        open={showWarningIdle}
        width={415}
        style={{ textAlign: "center" }}
      >
        <span
          style={{
            color: "#F47920",
            width: 58,
            height: 58,
            fontSize: 58,
            marginBottom: 46,
            display: "inline-block",
          }}
        >
          <Sleep />
        </span>
        <Space direction="vertical" align="center">
          <Typography.Text strong>Attention</Typography.Text>
          <Typography.Text>
            Your screen will be automatically closed in{" "}
          </Typography.Text>
          <Typography.Text strong>{timeRemining}</Typography.Text>
          <Typography.Text>
            Please shake your mouse or press the keyboard to keep on your
            screen{" "}
          </Typography.Text>
        </Space>
      </Modal>

      <Modal.Confirm
        title="Your login session was ended"
        open={showLogoutIdle}
        footer={[
          <Button
            key="submit"
            id="back-to-login"
            type="primary"
            onClick={() => setShowLogoutIdle(false)}
          >
            Back to Login
          </Button>,
        ]}
        afterClose={() => {
          SharedUtils().logout(loginProvider);
          handleFMALogoutRedirect();
        }}
        centered
        icon={<ExportOutlined style={{ fontSize: "22px", color: "#3A8DDB" }} />}
      >
        <Space direction="vertical">
          <Typography.Text>
            Your screen was automaticaly closed.
          </Typography.Text>
          <Typography.Text>Please login to continue and back</Typography.Text>
        </Space>
      </Modal.Confirm>

      <Modal.Confirm
        title="Attention"
        open={showLogoutConcurrent}
        footer={[
          <Button
            key="submit"
            id="back-to-login-concurrent"
            type="primary"
            warning
            onClick={() => setShowLogoutConcurrent(false)}
          >
            Back to Login
          </Button>,
        ]}
        afterClose={() => {
          SharedUtils().clearSession(loginProvider);
          handleFMALogoutRedirect();
        }}
        centered
        icon={<UserCheck style={{ fontSize: "22px", color: "#f47920" }} />}
      >
        <Space direction="vertical">
          <Typography.Text>
            We detected someone just used your password to try to sign in to
            your Sera account in other device or browser
          </Typography.Text>
        </Space>
      </Modal.Confirm>

      <Modal.Confirm
        title="Please Re-login with your account"
        open={showLogoutChangeRole}
        footer={[
          <Button
            key="submit"
            id="back-to-login-change-role"
            type="primary"
            onClick={() => setShowLogoutChangeRole(false)}
          >
            Back to Login
          </Button>,
        ]}
        afterClose={() => {
          SharedUtils().clearSession(loginProvider);
          handleFMALogoutRedirect();
        }}
        centered
        icon={<ExportOutlined style={{ fontSize: "22px", color: "#3A8DDB" }} />}
      >
        <Space direction="vertical">
          <Typography.Text>
            Someone has changed your account and roles access. Please Re-login
            to continue.
          </Typography.Text>
        </Space>
      </Modal.Confirm>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  error: state.error,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(IdleHandler);
