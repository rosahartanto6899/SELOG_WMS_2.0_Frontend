import PageHeader from "@sera-components/page-header";
import JourneyManagement from "@sera-components/pages/journey-management";
import { journeySupportActions, useAppDispatch } from "@sera-redux";
import { ROUTE } from "@sera-utils/constants/routes";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

const JourneySupportDetail = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "journeySupport",
  });

  const router = useRouter();
  const dispatch = useAppDispatch();

  const id = router.query.id as string;

  useEffect(() => {
    if (!id) return;

    dispatch(journeySupportActions.getDetailJourneySupportFetch({ id }));

    return () => {
      dispatch(journeySupportActions.getDetailJourneySupportClear());
    };
  }, [id]);
  return (
    <>
      <PageHeader
        title={t("title")}
        breadcrumb={[
          {
            title: t("breadcrumb.0"),
          },
          {
            title: t("breadcrumb.1"),
            url: ROUTE.JOURNEY_MANAGEMENT.JOURNEY_SUPPORT,
          },
          { title: t("breadcrumb.2") },
        ]}
        backUrl={ROUTE.JOURNEY_MANAGEMENT.JOURNEY_SUPPORT}
        isDirectToURL
      />
      <JourneyManagement.JourneySupportForm />
    </>
  );
};

export default JourneySupportDetail;
