/* eslint-disable react-hooks/exhaustive-deps */
// import { GlobalOutlined } from "@ant-design/icons";
import LoginForm from "@sera-components/auth/login-form";
// import i18next from "@sera-locale/i18n";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  useEffect,
  // useState
} from "react";

import styles from "./auth.module.scss";

const Login = () => {
  // const [lang, setLang] = useState<string>(localStorage.getItem("i18nextLng")!);
  const router = useRouter();
  const { error } = router.query;

  // const translationMenu = [
  //   {
  //     key: "id",
  //     label: "ID",
  //     onClick: () => {
  //       router.replace(router.asPath, router.asPath, { locale: "id" });
  //       setLang("id");
  //       i18next.changeLanguage("id");
  //       localStorage.setItem("i18nextLng", "id");
  //     },
  //   },
  //   {
  //     key: "en",
  //     label: "EN",
  //     onClick: () => {
  //       router.replace(router.asPath, router.asPath, { locale: "en" });
  //       setLang("en");
  //       i18next.changeLanguage("en");
  //       localStorage.setItem("i18nextLng", "en");
  //     },
  //   },
  // ];

  useEffect(() => {
    if (error) {
      router.replace("/auth", undefined, { shallow: true });
    }
  }, [error]);

  // if user entering the website for the first time
  // set default id language
  // useEffect(() => {
  //   const locale = localStorage.getItem("i18nextLng")!;
  //   if (!locale) {
  //     const _lang = "id";
  //     router.replace(router.asPath, router.asPath, {
  //       locale: _lang,
  //     });
  //     i18next.changeLanguage(_lang);
  //     setLang(_lang);
  //     localStorage.setItem("i18nextLng", _lang);
  //   }
  // }, []);

  // IF CURRENT LANGUAGE IS NOT THE SAME AS THE ONE THAT SAVED IN LOCAL
  // FORCEFULLY CHANGE THE LANGUAGE TO SAME AS THE LOCAL
  // useEffect(() => {
  //   if (typeof window === "undefined" || !router.isReady) return;

  //   const currentLang = i18next.language;
  //   const localLang = localStorage.getItem("i18nextLng");
  //   const isEn = router.locale === "en";

  //   if (localLang && currentLang !== localLang) {
  //     if (isEn && localLang !== "en") {
  //       router.replace(router.asPath, router.asPath, { locale: localLang });
  //     }
  //     i18next.changeLanguage(localLang);
  //     setLang(localLang);
  //   }
  // }, []);

  useEffect(() => {
    localStorage.removeItem("accessMenus");
  }, []);

  return (
    <main className={styles["auth-container"]}>
      <section className={styles["body-wrapper"]}>
        <div className={styles["image-wrapper"]}>
          <Image
            src="/images/slider/wms-login-bg-v2.svg"
            alt="SELOG"
            fill
            priority
            unoptimized
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
          <div className={styles["image-overlay"]} />
        </div>

        <div className={styles["form-wrapper"]}>
          {/* <div className={styles["navbar-wrapper"]}>
            <Dropdown
              className={styles["navbar-dropdown"]}
              menu={{ items: translationMenu }}
            >
              <Space>
                <Typography.Text
                  className={styles["navbar-text"]}
                  variant="light"
                  fontSize={16}
                >
                  {lang?.toUpperCase()}
                </Typography.Text>
                <GlobalOutlined className={styles["navbar-dropdown-icon"]} />
              </Space>
            </Dropdown>
          </div> */}
          <LoginForm />
        </div>
      </section>
    </main>
  );
};

export default Login;
