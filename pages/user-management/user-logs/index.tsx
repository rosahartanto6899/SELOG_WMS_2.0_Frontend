import Card from "@sera-components/card";
import PageHeader from "@sera-components/page-header";
import UserLogs from "@sera-components/pages/user-management/user-logs";
import { RootState } from "@sera-redux";
import { exportLogActions } from "@sera-redux/slices/export-log.slice";
import { userLogActions } from "@sera-redux/slices/user-logs.slice";
import { ExportLogState } from "@sera-types/export-log.type";
import { LoadingState } from "@sera-types/loading.type";
import { UserLogState } from "@sera-types/user-logs.type";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface UserLogPageProps {
  userLogs: UserLogState;
  loading: LoadingState;
  exportLogs: ExportLogState;
  getUserLogs: typeof userLogActions.getUserLogsFetch;
  getUserLogsAutoComplete: typeof userLogActions.getUserLogsAutoCompleteFetch;
  onExportUserLogs: typeof userLogActions.exportUserLogsFetch;
  onGetExportHistory: typeof exportLogActions.getExportLogsFetch;
}

const UserLogsPage = (props: UserLogPageProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: "userLogs" });

  const {
    userLogs,
    loading,
    exportLogs,
    getUserLogs,
    getUserLogsAutoComplete,
    onExportUserLogs,
    onGetExportHistory,
  } = props;

  return (
    <>
      <PageHeader
        title={t("title")}
        breadcrumb={[
          { title: t("breadcrumb.0.title") },
          { title: t("breadcrumb.1.title") },
        ]}
      />

      <Card.Container>
        <UserLogs
          dataSource={userLogs.data}
          autocomplete={userLogs.autoComplete?.data}
          userOptions={userLogs.options}
          loading={loading}
          exportLogs={exportLogs}
          onFetchUserLogs={getUserLogs}
          onFetchAutoComplete={getUserLogsAutoComplete}
          onExportUserLogs={onExportUserLogs}
          onGetExportHistory={onGetExportHistory}
        />
      </Card.Container>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  userLogs: state.userLogs,
  loading: state.loading,
  exportLogs: state.exportLogs,
});

const mapDispatchToProps = {
  getUserLogs: userLogActions.getUserLogsFetch,
  getUserLogsAutoComplete: userLogActions.getUserLogsAutoCompleteFetch,
  onExportUserLogs: userLogActions.exportUserLogsFetch,
  onGetExportHistory: exportLogActions.getExportLogsFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserLogsPage);
