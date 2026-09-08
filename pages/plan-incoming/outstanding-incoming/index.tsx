import PageLayout from "@sera-components/layout/page-layout";
import OutstandingIncomingComponent from "@sera-components/pages/plan-incoming/outstanding-incoming";
import { FilterStateProps } from "@sera-components/pages/plan-incoming/outstanding-incoming/outstanding-incoming-filter";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const OutstandingIncomingPage = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "planIncoming.outstandingIncoming.page",
  });

  const [filter, setFilter] = useState<FilterStateProps>({});
  const onChangeFilter = (v: any, type: string) =>
    setFilter((prev) => ({ ...prev, [type]: v }));

  return (
    // position:relative dibutuhkan agar overlay sticky di bawah punya containing
    // block yang TINGGI (setinggi seluruh halaman) — kalau sticky ditaruh di dalam
    // Row header PageHeader (pendek), ia ikut hilang begitu Row itu discroll lewat.
    <div style={{ position: "relative" }}>
      <div
        style={{
          height: 0,
          position: "sticky",
          top: 0,
          zIndex: 10, // JANGAN >1000 (mask Modal antd) — lihat komentar lama di card-filter.tsx
        }}
      >
        <div style={{ position: "absolute", right: 0, top: 24 }}>
          <OutstandingIncomingComponent.OutstandingIncomingFilter
            filter={filter}
            onChangeFilter={onChangeFilter}
          />
        </div>
      </div>

      <PageLayout
        title={t("title")}
        breadcrumb={[
          { title: t("breadcrumb.0") },
          { title: t("breadcrumb.1") },
        ]}
        content={
          <OutstandingIncomingComponent.OutstandingIncomingInitialPage
            filter={filter}
          />
        }
      />
    </div>
  );
};

export default OutstandingIncomingPage;
