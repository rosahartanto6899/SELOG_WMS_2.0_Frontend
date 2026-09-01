import PageLayout from "@sera-components/layout/page-layout";
import PowerBI from "@sera-components/pages/dashboard/power-bi";
import logoImage from "@sera-public/images/logo.svg";
import { decryptData } from "@sera-utils/encryptor";
import {
  getPowerBIEmbedParams,
  PowerBIParams,
} from "@sera-utils/powerbi-utils";
import { Flex } from "antd";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface DashboardProfitabilityProps {
  paramPowerBI?: PowerBIParams | null;
}

const DashboardProfitabilityPage = ({
  paramPowerBI,
}: Readonly<DashboardProfitabilityProps>) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "dashboard.profitability",
  });

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[{ title: t("breadcrumb.0") }, { title: t("breadcrumb.1") }]}
      noPadding
      content={
        <>
          {paramPowerBI ? (
            <PowerBI paramPowerBI={paramPowerBI} />
          ) : (
            <Flex
              justify="center"
              align="center"
              vertical
              style={{ height: "calc(100vh - 350px)" }}
            >
              <Image
                src={logoImage}
                alt="SELOG Logo"
                width={200}
                height={80}
                priority
              />
            </Flex>
          )}
        </>
      }
    />
  );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

export async function getServerSideProps() {
  const reportId = decryptData(process.env.POWER_BI_REPORT_ID as string);
  const pageId = decryptData(
    process.env.POWER_BI_PAGE_ID_PROFITABILITY as string,
  );
  const paramPowerBI = await getPowerBIEmbedParams(reportId, pageId);

  return {
    props: {
      paramPowerBI,
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DashboardProfitabilityPage);
