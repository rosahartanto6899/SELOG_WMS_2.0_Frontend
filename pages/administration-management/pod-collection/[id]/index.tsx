import Error404 from "@sera-components/error-boundary/Error404";
import PageLayout from "@sera-components/layout/page-layout";
import useGetPermission from "@sera-components/pages/administration-management/hooks/useGetPermission";
import DetailPageComponent from "@sera-components/pages/administration-management/pod-collection/detail-page";
import { ROUTE } from "@sera-utils/constants/routes";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

const DetailPage = () => {
  const router = useRouter();
  const { t } = useTranslation(undefined, { keyPrefix: "podCollection" });

  const { id } = router.query;

  const { isRead } = useGetPermission("pod-collection");

  if (!isRead) return <Error404 />;

  return (
    <PageLayout
      title={t("breadcrumb.2.detail")}
      breadcrumb={[
        { title: t("breadcrumb.0") },
        {
          title: t("breadcrumb.1"),
          url: ROUTE.ADMINISTRATION_MANAGEMENT.POD_COLLECTION,
        },
        { title: t("breadcrumb.2.detail") },
      ]}
      backUrl={ROUTE.ADMINISTRATION_MANAGEMENT.POD_COLLECTION}
      isDirectToURL
      withTab={false}
      content={<DetailPageComponent id={id as string} />}
    />
  );
};

export default DetailPage;
