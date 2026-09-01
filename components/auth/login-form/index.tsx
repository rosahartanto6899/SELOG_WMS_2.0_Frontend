/* eslint-disable @typescript-eslint/no-explicit-any */
import Typography from "@sera-components/typography";
import logoImage from "@sera-public/images/logo.svg";
import { API_STATUS_CODE } from "@sera-utils/constants/response-api";
import { encryptData } from "@sera-utils/encryptor";
import LocalStorageUtils from "@sera-utils/local-storage";
import Utils from "@sera-utils/utils";
import { Alert, Button, Col, Divider, Form, Input, Row } from "antd";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { getCsrfToken, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import styles from "./login-form.module.scss";

const MicrosoftLogo = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <rect x="0" y="0" width="7" height="7" fill="#F25022" />
    <rect x="9" y="0" width="7" height="7" fill="#7FBA00" />
    <rect x="0" y="9" width="7" height="7" fill="#00A4EF" />
    <rect x="9" y="9" width="7" height="7" fill="#FFB900" />
  </svg>
);

const LoginForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [csrfToken, setCsrfToken] = useState("");
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingSSO, setLoadingSSO] = useState<boolean>(false);
  const [maxFailedAttempts, setMaxFailedAttempts] = useState<number>(0);
  const [expiryAttempts, setExpiryAttempts] = useState<string>("");
  const routeQuery = router.query;

  useEffect(() => {
    const intervalIdleCounter = setInterval(() => {
      const { value, expiry } =
        LocalStorageUtils().getWithExpiry("loginAttempts");
      if (expiry !== 0 && Number(value) === 0) {
        setExpiryAttempts(
          Utils().convertMsToTime(expiry - Number(moment().format("x"))),
        );
      } else {
        setExpiryAttempts("");
      }
      setMaxFailedAttempts(Number(value));
    }, 1000);

    return () => {
      clearInterval(intervalIdleCounter);
    };
  }, [expiryAttempts]);

  useEffect(() => {
    if (expiryAttempts !== "") {
      setErrorMessage(`${t("auth.login.expiry")} ${expiryAttempts}.`);
    } else {
      setErrorMessage(``);
    }
  }, [t, expiryAttempts]);

  useEffect(() => {
    if (routeQuery.error === "AccessDenied") {
      setErrorMessage(t("auth.login.denied"));
    }
  }, [t, routeQuery.error]);

  const loginWithMFA = async () => {
    setLoadingSSO(true);
    await signIn("azure-ad", {
      callbackUrl: process.env.NEXTAUTH_URL,
      redirect: false,
    });
    setLoadingSSO(false);
  };

  const onFinishHandler = async (values: {
    email: string;
    password: string;
  }) => {
    setLoading(true);

    const { error }: any = await signIn("credentials-local", {
      redirect: false,
      email: values.email,
      password: encryptData(values.password),
    });

    setLoading(false);

    if (error) {
      let errors: any;
      try {
        errors = JSON.parse(error);
      } catch {
        setErrorMessage(t("auth.login.denied"));
        form.resetFields();
        return;
      }
      if (errors.errors?.code === API_STATUS_CODE.AUTH.USER_NOT_FOUND) {
        const attempts = maxFailedAttempts - 1;
        if (attempts > 0) {
          setErrorMessage(
            `${t("auth.login.attempt.preText")} ${attempts} ${
              attempts > 1
                ? t("auth.login.attempt.texts")
                : t("auth.login.attempt.text")
            } ${t("auth.login.attempt.postText")}`,
          );
        } else {
          setErrorMessage(``);
        }
        LocalStorageUtils().setWithExpiry(
          "loginAttempts",
          attempts.toString(),
          Number(process.env.COOLDOWN_LOGIN),
        );
      } else if (errors.errors?.code === API_STATUS_CODE.AUTH.COOLDOWN_LOGIN) {
        LocalStorageUtils().setWithExpiry(
          "loginAttempts",
          "0",
          Number(moment(errors.errors.data).format("x")) -
            Number(moment().format("x")),
        );
      } else {
        setErrorMessage(errors.errors?.message ?? t("auth.login.denied"));
      }
      form.resetFields();
    } else {
      localStorage.removeItem("loginAttempts");
      router.reload();
    }
  };

  useEffect(() => {
    const getCsrf = async () => {
      const token = (await getCsrfToken()) || "";
      setCsrfToken(token);
    };

    getCsrf();
  }, []);

  return (
    <main className={styles["form-container"]}>
      <section className={styles["body-wrapper"]}>
        <Row justify="center">
          <div className={styles["logo-wrapper"]}>
            <Image
              src={logoImage}
              alt="Sera Logo"
              sizes="165px"
              fill
              priority
              style={{ objectFit: "contain" }}
            />
          </div>
        </Row>

        {errorMessage && (
          <Row justify="center" gutter={[8, 8]}>
            <Col span={24}>
              <Alert message={errorMessage} type="error" showIcon />
            </Col>
          </Row>
        )}
        <Row justify="center" gutter={[8, 8]}>
          <Col span={24}>
            <Form
              name="login"
              form={form}
              layout="vertical"
              autoComplete="off"
              onFinish={onFinishHandler}
              disabled={loading || maxFailedAttempts === 0}
            >
              <input
                type="hidden"
                name="csrfToken"
                id="csrfToken"
                value={csrfToken}
              />

              <Form.Item
                label={t("auth.login.input.email.label")}
                name="email"
                className="procurement-input"
                required={false}
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: t("auth.login.input.email.validation"),
                  },
                ]}
              >
                <Input
                  placeholder={t("auth.login.input.email.placeholder")}
                  autoComplete="new-email"
                />
              </Form.Item>

              <Form.Item
                label={t("auth.login.input.password.label")}
                name="password"
                className="procurement-input password"
                required={false}
                rules={[
                  {
                    required: true,
                    message: t("auth.login.input.password.validation"),
                  },
                ]}
              >
                <Input.Password
                  placeholder={t("auth.login.input.password.placeholder")}
                  autoComplete="new-password"
                />
              </Form.Item>

              <Form.Item style={{ textAlign: "right" }}>
                <Link
                  id="forgotPassword"
                  href="/auth/recover-password"
                  passHref
                >
                  <Typography.Text variant="link" fontWeight={600}>
                    {t("auth.login.input.forgot")}
                  </Typography.Text>
                </Link>
              </Form.Item>

              <Form.Item>
                <Button
                  id="loginInternal"
                  htmlType="submit"
                  type="primary"
                  className={styles["login-form-button"]}
                  loading={loading}
                >
                  {t("auth.login.input.button.login")}
                </Button>
              </Form.Item>

              <Divider>
                <Typography.Text
                  variant="muted"
                  className={styles["divider-text"]}
                >
                  {t("auth.login.input.divider")}
                </Typography.Text>
              </Divider>

              <Form.Item>
                <Button
                  id="loginMFA"
                  htmlType="button"
                  onClick={loginWithMFA}
                  loading={loadingSSO}
                  className={styles["login-form-button-secondary"]}
                  icon={<MicrosoftLogo />}
                >
                  {t("auth.login.input.button.loginMFA.preText")}&nbsp;
                  {t("auth.login.input.button.loginMFA.text")}
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </section>
    </main>
  );
};

export default LoginForm;
