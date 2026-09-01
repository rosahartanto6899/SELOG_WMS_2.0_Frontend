/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { CustomUseSession } from "@sera-types/auth.type";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";

interface PowerBIProps {
  paramPowerBI?: any;
}

const ReportComponent = dynamic(
  () =>
    import("@sera-components/reports/containers").then(
      (report) => report.default,
    ),
  {
    ssr: false,
  },
);

const PowerBI = ({ paramPowerBI }: PowerBIProps) => {
  const { accessToken, embedUrl, reportId } = paramPowerBI;
  const { data: session } = useSession() as CustomUseSession;
  const idUser = session.detail.data.user.id;

  const [forceUpdateToggle, setForceUpdateToggle] = useState(false);
  const [filterReport, setFilterReport] = useState<string>("");

  useEffect(() => {
    setFilterReport(`&filter=eproc_dim_uam/id eq '${idUser}'`);
  }, []);

  if (forceUpdateToggle) {
    return <>Loading...</>;
  }

  const { pageId } = paramPowerBI;
  const pageParam = pageId ? `&pageName=${pageId}` : "";

  return (
    <ReportComponent
      accessToken={accessToken}
      embedUrl={`${embedUrl}${pageParam}${filterReport}`}
      reportId={reportId}
      setForceUpdateToggle={setForceUpdateToggle}
    />
  );
};
const mapStateToProps = () => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(PowerBI);
