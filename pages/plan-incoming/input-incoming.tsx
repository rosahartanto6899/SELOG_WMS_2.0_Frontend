import PageLayout from "@sera-components/layout/page-layout";
import InputIncomingForm from "@sera-components/pages/plan-incoming/outstanding-incoming/input-incoming-form";
import { ROUTE } from "@sera-utils/constants/routes";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

/** Input Plan Incoming — halaman penuh (dulu popup di list Outstanding Incoming).
 *  ?id= → mode edit; submit/cancel kembali ke Outstanding Incoming. */
const InputIncomingPage = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "planIncoming.outstandingIncoming.page",
  });
  const router = useRouter();

  const back = () => router.push(ROUTE.PLAN_INCOMING.OUTSTANDING_INCOMING);

  return (
    <PageLayout
      title={t("inputTitle")}
      breadcrumb={[{ title: t("breadcrumb.0") }, { title: t("inputTitle") }]}
      backUrl={ROUTE.PLAN_INCOMING.OUTSTANDING_INCOMING}
      isDirectToURL
      withTab={false}
      content={
        <InputIncomingForm
          open
          editId={typeof router.query.id === "string" ? router.query.id : null}
          onClose={back}
          onDone={back}
        />
      }
    />
  );
};

export default InputIncomingPage;
