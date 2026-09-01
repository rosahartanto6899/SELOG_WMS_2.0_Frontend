import Typography from "@sera-components/typography";
import logoImage from "@sera-public/images/logo.svg";
import { Flex } from "antd";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const { t } = useTranslation();
  return (
    <Flex justify="center" align="center" vertical style={{ height: "100vh" }}>
      <Typography.Title style={{ color: "#3A8DDB" }}>
        {t("dashboard.welcome")}
      </Typography.Title>
      <Image src={logoImage} alt="Sera Logo" width={200} height={80} priority />
    </Flex>
  );
}
