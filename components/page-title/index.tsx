/* eslint-disable no-unused-vars */
import Head from "next/head";
import { StaticImageData } from "next/image";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import {
  REGEX_PATTERN_PATHNAME,
  REGEX_PATTERN_STRING_BRACKET,
} from "../../libraries/common/regexConstants";
import ProductIcon from "../../public/favicon.ico";

interface PageTitleProps {
  icon?: string | StaticImageData;
}

export enum ConsPageTitle {
  Dashboard = "dashboard",
  Login = "login",
  Activation = "activation",
  RecoverPassword = "recoverPassword",
}

const PageTitle: React.FC<PageTitleProps> = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { pathname } = router;

  function formatTitle(pathName: string): string {
    if (pathName === "/") {
      return t(`global.pageTitle.${ConsPageTitle.Dashboard}`);
    }
    if (pathName === "/auth") {
      return t(`global.pageTitle.${ConsPageTitle.Login}`);
    }

    const authPageMap: { [key: string]: string } = {
      "/auth/activation": t(`global.pageTitle.${ConsPageTitle.Activation}`),
      "/auth/recover-password": t(
        `global.pageTitle.${ConsPageTitle.RecoverPassword}`,
      ),
    };

    const matchingPath = Object.keys(authPageMap).find((key) =>
      pathName.includes(key),
    );
    if (matchingPath) {
      return authPageMap[matchingPath];
    }

    return pathName
      .replace(REGEX_PATTERN_PATHNAME, "")
      .replace(REGEX_PATTERN_STRING_BRACKET, "")
      .split("/")
      .filter((segment) => segment !== "")
      .map((segment) => {
        const words = segment.split("-");
        const transformedWords = words.map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1),
        );
        return transformedWords.join(" ");
      })
      .join(" - ");
  }

  useEffect(() => {
    const handleRouteChange = () => {
      document.title = pathname;
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router, pathname]);

  const title = `LOGis - ${formatTitle(pathname)}`;
  return (
    <Head>
      <title>{title}</title>
      {ProductIcon && (
        <link
          rel="icon"
          href={
            typeof ProductIcon === "string"
              ? ProductIcon
              : (ProductIcon as StaticImageData).src
          }
        />
      )}
    </Head>
  );
};

export default PageTitle;
