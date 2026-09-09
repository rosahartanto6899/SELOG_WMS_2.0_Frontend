import PageLayout from "@sera-components/layout/page-layout";
import InputOutgoingForm from "@sera-components/pages/plan-outgoing/input-outgoing-form";
import { ROUTE } from "@sera-utils/constants/routes";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

/** Input Plan Outgoing — halaman penuh, mirror input-incoming.
 *  ?id= → mode edit; submit/cancel kembali ke Outstanding Outgoing. */
const InputOutgoingPage = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "planOutgoing.page",
  });
  const router = useRouter();

  const back = () => router.push(ROUTE.PLAN_OUTGOING.OUTSTANDING_OUTGOING);

  return (
    <PageLayout
      title={t("inputTitle")}
      breadcrumb={[{ title: t("breadcrumb.0") }, { title: t("inputTitle") }]}
      backUrl={ROUTE.PLAN_OUTGOING.OUTSTANDING_OUTGOING}
      isDirectToURL
      withTab={false}
      content={
        <InputOutgoingForm
          open
          editId={typeof router.query.id === "string" ? router.query.id : null}
          onClose={back}
          onDone={back}
        />
      }
    />
  );
};

export default InputOutgoingPage;
