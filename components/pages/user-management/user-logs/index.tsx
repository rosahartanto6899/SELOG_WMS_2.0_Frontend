import {
  DownloadOutlined,
  DownOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import Badge from "@sera-components/badge";
import { Download } from "@sera-components/icons";
import Input from "@sera-components/input";
import Modal from "@sera-components/modal";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import ListExportHistory from "@sera-components/table-export";
import MessageHandler from "@sera-libraries/message-handler";
import { userLogActions } from "@sera-redux";
import { exportLogActions } from "@sera-redux/slices/export-log.slice";
import { CustomUseSession } from "@sera-types/auth.type";
import {
  AutoCompleteType,
  BaseType,
  PaginationType,
} from "@sera-types/base.type";
import { ExportLog, ExportLogState } from "@sera-types/export-log.type";
import { LoadingState } from "@sera-types/loading.type";
import { UserLog, userLogTypes } from "@sera-types/user-logs.type";
import FormatUtils from "@sera-utils/format";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { UserLogsType } from "@sera-utils/settings/types";
import SettingsUtils from "@sera-utils/settings/utils";
import Utils from "@sera-utils/utils";
import { Button, Col, Dropdown, MenuProps, Row, Space } from "antd";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface UserLogsProps {
  dataSource?: UserLog[];
  autocomplete?: AutoCompleteType[];
  userOptions?: PaginationType;
  loading: LoadingState;
  exportLogs: ExportLogState;
  onFetchUserLogs: typeof userLogActions.getUserLogsFetch;
  onFetchAutoComplete: typeof userLogActions.getUserLogsAutoCompleteFetch;
  onExportUserLogs: typeof userLogActions.exportUserLogsFetch;
  onGetExportHistory: typeof exportLogActions.getExportLogsFetch;
}

const UserLogs = (props: UserLogsProps) => {
  const {
    userOptions,
    onFetchUserLogs,
    onFetchAutoComplete,
    dataSource,
    loading,
    autocomplete,
    onExportUserLogs,
    onGetExportHistory,
    exportLogs,
  } = props;
  const { sendErrorHandlerApi } = useErrorHandler(
    "components/user-management/user-logs/",
  );
  const { t } = useTranslation(undefined, { keyPrefix: "userLogs" });

  const settingsUtils = SettingsUtils();
  // const { data } = useSession() as any;
  // const { isInternal } = data.detail.data.user;

  const COLUMNS = [
    {
      title: t("table.header.0.title"),
      key: "no",
      fixed: "left",
      render: (record: any) => (
        <Row justify="center">
          <Col>{record.no}</Col>
        </Row>
      ),
      width: 60,
    },
    {
      title: t("table.header.1.title"),
      dataIndex: "name",
      key: "name",
      fixed: "left",
      width: 150,
      sorter: true,
      truncate: true,
    },
    {
      title: t("table.header.2.title"),
      dataIndex: "email",
      key: "email",
      sorter: true,
      width: 250,
      truncate: true,
    },
    {
      title: t("table.header.3.title"),
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: false,
      width: 175,
      render: (_: unknown, record: any) =>
        FormatUtils().dateTimeTransform(record.createdAt),
    },
    {
      title: t("table.header.4.title"),
      dataIndex: "activityDetail",
      key: "activityDetail",
      sorter: false,
      width: 200,
    },
    {
      title: t("table.header.5.title"),
      dataIndex: "activityName",
      key: "activityName",
      width: 150,
      render: (text: UserLogsType) => (
        <Badge
          color={settingsUtils.getUserLogsColor(text.split(".")[1])}
          text={FormatUtils().camelCaseToTitleCase(text.split(".")[0])}
        />
      ),
    },
    {
      title: t("table.header.6.title"),
      dataIndex: "channel",
      key: "channel",
      sorter: false,
      width: 150,
      align: "center",
      render: (text: UserLogsType) => FormatUtils().stringToTitleCase(text),
    },
  ];

  const SEARCH_OPTIONS = [
    {
      label: t("searchBox.dropdownOptions.0"),
      value: "name",
    },
    {
      label: t("searchBox.dropdownOptions.1"),
      value: "email",
    },
    {
      label: t("searchBox.dropdownOptions.2"),
      value: "activityDetail",
    },
    {
      label: t("searchBox.dropdownOptions.3"),
      value: "activityName",
    },
    {
      label: t("searchBox.dropdownOptions.4"),
      value: "channel",
    },
  ];

  const [userLogOptions, setUserLogOptions] = useState<BaseType>({
    page: 1,
    limit: userOptions?.limit ?? 10,
    order: "createdAt",
    sort: "desc",
  });

  const [userLogsAutoCompleteOptions, setUserLogsAutoCompleteOptions] =
    useState<BaseType>({
      page: 1,
      limit: 10,
    });

  const [exportHistoryOpen, setExportHistoryOpen] = useState<boolean>(false);
  const [loadingDownloadExportHistory, setLoadingDownloadExportHistory] =
    useState<{
      isLoading: boolean;
      id: string;
    }>({
      isLoading: false,
      id: "",
    });
  const [dataExportLog, setDataExportLog] = useState<ExportLog[]>([]);
  const { data: session } = useSession() as CustomUseSession;
  const [searchByOption, setSearchByOption] = useState(SEARCH_OPTIONS[0].value);

  const actionUserLogs = {
    isExport: false,
  };

  useEffect(() => {
    onFetchUserLogs(userLogOptions);
  }, [userLogOptions]);

  useEffect(() => {
    if (exportHistoryOpen) {
      onGetExportHistory({ type: "userLog" });
    }
  }, [exportHistoryOpen]);

  useEffect(() => {
    setDataExportLog(exportLogs.data);
  }, [exportLogs.data]);

  useEffect(() => {
    if (userLogsAutoCompleteOptions.search)
      onFetchAutoComplete(userLogsAutoCompleteOptions);
  }, [userLogsAutoCompleteOptions]);

  const onPageChangeListener = (current: number, limit: number) => {
    setUserLogOptions((prevState: BaseType) => ({
      ...prevState,
      page: current,
      limit,
    }));
  };

  const onTableChangeListener = (_: unknown, __: unknown, sorter: any) => {
    if (sorter) {
      setUserLogOptions((prevState: BaseType) => ({
        ...prevState,
        order: sorter.field,
        sort: sorter.order === "ascend" ? "asc" : "desc",
      }));
    }
  };

  const onSearchChangeListener = (search?: string, searchBy?: string) => {
    setUserLogOptions((prevState: BaseType) => ({
      ...prevState,
      searchBy,
      search,
      page: 1,
    }));
  };

  const onChangeSelect = (searchBy: string) => {
    setSearchByOption(searchBy);
  };

  const onClearSearchListener = () => {
    setUserLogOptions((prevState: BaseType) => ({
      ...prevState,
      search: null,
    }));
  };

  const onSearchingChangeListener = (search?: string, searchBy?: string) => {
    setUserLogsAutoCompleteOptions((prevState: BaseType) => ({
      ...prevState,
      search,
      searchBy,
    }));
  };

  const exportUserLogs = async () => {
    onExportUserLogs({
      search: userLogOptions.search ?? "",
      searchBy: userLogOptions.searchBy,
    });
  };

  const handleDownloadExport = async (fileUrl: string, id: string) => {
    setLoadingDownloadExportHistory({ isLoading: true, id });
    try {
      const mimeType = "application/zip";
      const filename = "Export User Logs";
      await Utils()
        .downloadFile(
          fileUrl,
          filename,
          session.detail.data.accessToken,
          mimeType,
        )
        .then(() => {
          setLoadingDownloadExportHistory({ isLoading: false, id: "" });
        });
    } catch (error: any) {
      let errorMessageExport = "Failed download file, please try again.";
      if (axios.isAxiosError(error)) {
        errorMessageExport = error.response?.statusText ?? "";
      }
      const errorHandler = (message: string) => {
        MessageHandler().error({ content: message });
      };
      sendErrorHandlerApi(
        "exportListUserLogs",
        177,
        errorMessageExport,
        errorHandler,
      );
      setLoadingDownloadExportHistory({ isLoading: false, id: "" });
    }
  };

  const items: MenuProps["items"] = [
    {
      label: (
        <Button
          id="button-export-user-logs"
          type="link"
          style={{
            width: "100%",
            padding: 0,
            color: "inherit",
            textAlign: "left",
          }}
          onClick={() => exportUserLogs()}
        >
          Export
        </Button>
      ),
      key: "1",
      icon: <DownloadOutlined />,
    },
    {
      label: (
        <Button
          id="button-export-history"
          type="link"
          style={{
            width: "100%",
            padding: 0,
            color: "inherit",
            textAlign: "left",
          }}
          onClick={() => setExportHistoryOpen(true)}
        >
          History
        </Button>
      ),
      key: "2",
      icon: <HistoryOutlined />,
    },
  ];

  return (
    <div>
      {dataSource && (
        <Table
          dataSource={dataSource}
          columns={COLUMNS}
          current={Number(userLogOptions?.page)}
          pageSize={userOptions?.limit}
          total={userOptions?.totalData ?? 0}
          rowKey={(row: UserLog) => `${row.no}`}
          loading={loading[userLogTypes.GET_USER_LOGS]}
          title={t("table.title")}
          scroll={{ x: 1000 }}
          onPageChange={onPageChangeListener}
          onTableChange={onTableChangeListener}
          isCustomSearch
          multipleDelete={false}
          actions={
            <Row gutter={8}>
              <Col>
                {actionUserLogs.isExport && (
                  <Dropdown menu={{ items }}>
                    <Button
                      id="button-export-options"
                      type="primary"
                      icon={<Download />}
                    >
                      <Space>
                        Export Data
                        <DownOutlined />
                      </Space>
                    </Button>
                  </Dropdown>
                )}
              </Col>
            </Row>
          }
          customSearch={
            <Row align="middle" gutter={[8, 4]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Select
                  id="user-log-select"
                  placeholder="Search By"
                  allowClear={false}
                  defaultValue={searchByOption}
                  onChange={(value) => onChangeSelect(value)}
                >
                  {SEARCH_OPTIONS.map((opt) => (
                    <Select.Option key={opt.value} value={opt.value}>
                      {opt.label}
                    </Select.Option>
                  ))}
                </Select>
              </Col>

              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Input.Search
                  loading={false}
                  placeholder={t("searchBox.placeholder")}
                  autoCompleteItems={autocomplete}
                  onClearAutoComplete={onClearSearchListener}
                  onSearching={(searchingVal) =>
                    onSearchingChangeListener(searchingVal, searchByOption)
                  }
                  onSearch={(search) =>
                    onSearchChangeListener(search, searchByOption)
                  }
                  onClear={onClearSearchListener}
                  value={userLogsAutoCompleteOptions.search ?? ""}
                />
              </Col>
            </Row>
          }
        />
      )}

      <Modal.View
        title="List Export History"
        open={exportHistoryOpen}
        closable
        okButtonProps={{
          style: {
            display: "none",
          },
        }}
        cancelText="Close"
        onCancel={() => setExportHistoryOpen(false)}
        width={800}
      >
        <ListExportHistory
          feature="user-logs"
          loading={loading}
          loadingDownload={loadingDownloadExportHistory}
          handleDownloadExport={handleDownloadExport}
          data={dataExportLog}
        />
      </Modal.View>
    </div>
  );
};

export default UserLogs;
