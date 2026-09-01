import { useTranslation } from "react-i18next";

export const GetBreadcrumb = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "menuConfiguration.breadcrumb",
  });

  return [
    { title: t("0.title") },
    { title: t("1.title"), href: "/user-management/menu-configuration" },
  ];
};
