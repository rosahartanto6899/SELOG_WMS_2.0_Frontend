import WaitingError from "@sera-components/error-boundary/Waiting";
import Modal from "@sera-components/modal";
import Typography from "@sera-components/typography";
import { models, Report } from "powerbi-client";
import { PowerBIEmbed } from "powerbi-client-react";
import { useCallback, useState } from "react";

interface ReportPageProps {
  accessToken: string;
  embedUrl: string;
  reportId: string;
  setForceUpdateToggle: (value: boolean) => void;
}

const ReportPage = ({
  accessToken,
  embedUrl,
  reportId,
  setForceUpdateToggle,
}: ReportPageProps) => {
  const [report, setReport] = useState<Report>();
  const [errorLoadModel, setErrorLoadModel] = useState<boolean>(false);
  const [errorMemoryExceeded, setErrorMemoryExceeded] =
    useState<boolean>(false);

  const forceUpdate = useCallback(() => {
    setForceUpdateToggle(true);

    setTimeout(() => {
      report?.refresh();
      setForceUpdateToggle(false);
    }, 1000);
  }, []);

  const handleReportError = (responseString: string) => {
    if (
      responseString.includes("FailedToLoadModel") ||
      responseString.includes("OpenConnectionError")
    ) {
      setErrorLoadModel(true);
    }
    if (responseString.includes("QueryUserError")) {
      setErrorMemoryExceeded(true);
    }
  };

  function checkModelResponse(response: any) {
    const responseString = JSON.stringify(response);
    handleReportError(responseString);
  }

  const renderReport = () => {
    return (
      <PowerBIEmbed
        embedConfig={{
          type: "report",
          id: reportId,
          embedUrl: embedUrl,
          accessToken,
          tokenType: models.TokenType.Embed, // Use models.TokenType.Aad for SaaS embed
          settings: {
            navContentPaneEnabled: true,
            panes: {
              filters: {
                expanded: false,
                visible: false,
              },
              pageNavigation: {
                visible: false,
              },
            },
            layoutType: models.LayoutType.Custom,
            customLayout: {
              displayOption: models.DisplayOption.FitToWidth,
            },
          },
        }}
        eventHandlers={
          new Map([
            [
              "rendered",
              function () {
                setErrorLoadModel(false);
              },
            ],
            [
              "error",
              function (event) {
                checkModelResponse(event?.detail);
              },
            ],
          ])
        }
        cssClassName="reportClass"
        getEmbeddedComponent={(embeddedReport) => {
          setReport(embeddedReport as Report);
        }}
      />
    );
  };
  if (errorLoadModel) {
    return <WaitingError resetErrorBoundary={() => forceUpdate()} />;
  }
  return (
    <>
      <div id="fullscreen">{renderReport()}</div>
      <Modal.View
        open={errorMemoryExceeded}
        title="Cannot Show Report Data"
        closable
        mask={false}
        okButtonProps={{
          style: { display: "none" },
        }}
        cancelText="Close"
        onCancel={() => setErrorMemoryExceeded(false)}
      >
        <Typography>
          We’re unable to display the requested report data at the moment.
          <br />
          Please consider shortening period by adjusting the{" "}
          <strong>Period</strong> filter.
        </Typography>
      </Modal.View>
    </>
  );
};

export default ReportPage;
