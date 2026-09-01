import { CheckOutlined, CloseOutlined, EyeOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import { EditOutlined } from "@sera-components/icons";
import StatusTag from "@sera-components/status-tag";
import { Attachment, Pod } from "@sera-types/pod-collection.type";
import { NUMBER_FORMAT } from "@sera-utils/constants/common";
import { ROUTE } from "@sera-utils/constants/routes";
import useCheckPermission from "@sera-utils/hooks/useCheckPermission";
import { Col, Row } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { includes, isEmpty, isNil } from "lodash";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export type TModalMutationType =
  | "verify"
  | "edit"
  | "preview"
  | "reject"
  | null
  | undefined;
export type TPODType =
  | "Pod loading"
  | "Pod delivery"
  | "Pod unloading"
  | "Pod hardcopy"
  | "Pod checkpoint"
  | null
  | undefined;

export type TPODReformatType =
  | "podloading"
  | "poddelivery"
  | "podunloading"
  | "podhardcopy"
  | "podcheckpoint"
  | null
  | undefined;

export enum PodTypeEnum {
  LOADING = "podloading",
  UNLOADING = "podunloading",
  DELIVERY = "poddelivery",
  HARDCOPY = "podhardcopy",
  TIMESTAMP = "podcheckpoint",
}

export enum ApprovalTypeEnum {
  APPROVED = "Approved",
  REJECTED = "Rejected",
  WAITING_APPROVAL = "Waiting for Approval",
}

export interface IModalEditVerify {
  type: TModalMutationType;
  podType: TPODType;
  attachments?: Attachment[];
  title: string;
  shipmentNumber?: string;
  customerName?: string;
  submittedDate?: string;
  submittedBy?: string;
  picName?: string;
  podId: string | null;
  receiptDate: string | null | Dayjs;
}

export const UNCHECK_KEYS = [""];
export const UNCHECK_KEYS_DETAILS = [""];

export const reformatPodType = (value: TPODType): TPODReformatType =>
  value ? (value.toLowerCase().replace(/ /g, "") as TPODReformatType) : null;

export const getFileExtensionFromUrl = (path: string) =>
  path.slice(((path.lastIndexOf(".") - 1) >>> 0) + 2);

export const extractFileNameFromUrl = (urlString: string): string => {
  if (!urlString) return "";
  const match = urlString.match(/\/([^\/]+)\/?$/);
  const fileName = match ? match[1] : "";

  return fileName;
};

export const ColumnsList = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "podCollection.table.column",
  });

  const { isRead } = useCheckPermission({
    menuLink: ROUTE.ADMINISTRATION_MANAGEMENT.POD_COLLECTION,
  });

  return [
    {
      key: "no",
      dataIndex: "no",
      title: "No",
      fixed: "left",
      width: 60,
      align: "center",
      exception: true,
    },
    {
      key: "B",
      dataIndex: "podStatus",
      title: t("B"),
      fixed: "left",
      render: (_record: string) => (!isNil(_record) ? _record : "-"),
    },
    {
      key: "A",
      dataIndex: "shipmentNo",
      title: t("A"),
      fixed: "left",
    },

    {
      key: "C",
      dataIndex: "expenseStatus",
      title: t("C"),
      render: (_record: string) =>
        !isNil(_record) ? <StatusTag value={_record} block /> : "-",
    },
    {
      key: "D",
      dataIndex: "bookingOrderNo",
      title: t("D"),
    },
    {
      key: "E",
      dataIndex: "customerName",
      title: t("E"),
    },
    {
      key: "F",
      dataIndex: "shipmentType",
      title: t("F"),
    },
    // {
    //   key: "G",
    //   dataIndex: "G",
    //   title: t("G"),
    // },
    {
      key: "H",
      dataIndex: "origin",
      title: t("H"),
    },
    {
      key: "I",
      dataIndex: "destination",
      title: t("I"),
    },
    {
      key: "J",
      dataIndex: "licensePlate",
      title: t("J"),
    },
    {
      key: "K",
      dataIndex: ["driver1", "name"],
      title: t("K"),
      render: (_value: string | null) => _value ?? "-",
    },
    {
      key: "L",
      dataIndex: ["driver2", "name"],
      title: t("L"),
      render: (_value: string) => _value ?? "-",
    },
    {
      key: "M",
      dataIndex: "expenseTransferred",
      title: t("M"),
      fixed: "right",
      render: (_value: string) =>
        _value ? `Rp.${NUMBER_FORMAT(_value)}` : "-",
    },
    {
      key: "N",
      dataIndex: "totalExpense",
      title: t("N"),
      fixed: "right",
      render: (_value: string) =>
        _value ? `Rp.${NUMBER_FORMAT(_value)}` : "-",
    },
    {
      key: "Z",
      dataIndex: "id",
      title: t("Z"),
      align: "center",
      fixed: "right",
      render: (_record: any) => {
        return (
          <Row justify="center" gutter={[8, 4]}>
            {isRead && (
              <Col>
                <Link
                  id="link-view"
                  href={`${ROUTE.ADMINISTRATION_MANAGEMENT.POD_COLLECTION}/${_record}`}
                  passHref
                >
                  <Button
                    id="detail-button"
                    size="small"
                    tooltip={t("button.detail.tooltip")}
                    type="link"
                    icon={<EyeOutlined />}
                  />
                </Link>
              </Col>
            )}
          </Row>
        );
      },
    },
  ];
};

export const ColumnsDetails = (props: {
  onEdit?: (args: Pod) => void;
  onPreview?: (args: Pod) => void;
  onVerify?: (args: Pod, type: "Approved" | "Rejected") => void;
  onReject?: (args: Pod) => void;
}) => {
  const {
    onEdit = () => null,
    onPreview = () => null,
    onVerify = () => null,
    onReject = () => null,
  } = props;
  const { t } = useTranslation(undefined, {
    keyPrefix: "podCollection.detail.table.column",
  });

  const { isUpdate } = useCheckPermission({
    menuLink: ROUTE.ADMINISTRATION_MANAGEMENT.POD_COLLECTION,
  });

  return [
    {
      key: "no",
      dataIndex: "no",
      title: "No",
      fixed: "left",
      width: 60,
      align: "center",
      exception: true,
    },

    {
      key: "A",
      dataIndex: "podType",
      title: t("A"),
    },
    {
      key: "B",
      dataIndex: "submittedDate",
      title: t("B"),
      render: (val: string | null) =>
        !isNil(val) ? dayjs(val).format("YYYY-MM-DD HH:mm") : "-",
    },
    {
      key: "C",
      dataIndex: "submittedBy",
      title: t("C"),
    },
    {
      key: "D",
      dataIndex: "confirmedDate",
      title: t("D"),
      render: (val: string | null) =>
        !isNil(val) ? dayjs(val).format("YYYY-MM-DD HH:mm") : "-",
    },
    {
      key: "E",
      dataIndex: "confirmedBy",
      title: t("E"),
    },
    {
      key: "F",
      dataIndex: "attachments",
      title: t("F"),
      render: (_value: any, record: Pod) => (
        <Button
          disabled={record?.attachments.length < 1}
          type="link"
          onClick={() => onPreview(record)}
        >
          {record?.attachments.length ?? 0} File(s)
        </Button>
      ),
    },
    {
      key: "G",
      dataIndex: "status",
      title: t("G"),
      render: (text: string, _record: Pod) => {
        if (isNil(_record?.submittedDate) || isEmpty(_record.submittedDate)) {
          return <StatusTag value={"OPEN"} block />;
        }
        return text ? <StatusTag value={text} block /> : "-";
      },
    },
    {
      key: "Z",
      title: t("Z"),
      align: "center",
      fixed: "right",
      render: (_val: any, _record: Pod) => {
        return (
          <Row justify="center" gutter={[8, 4]}>
            {isUpdate && (
              <>
                <Col>
                  <Button
                    id="detail-button"
                    size="small"
                    tooltip={t("button.update.tooltip")}
                    type="link"
                    icon={<EditOutlined />}
                    disabled={_record.status === ApprovalTypeEnum.APPROVED}
                    onClick={() => onEdit(_record)}
                  />
                </Col>
                <Col>
                  <Button
                    id="confirm-button"
                    size="small"
                    tooltip={t("button.verify.tooltip")}
                    type="link"
                    disabled={
                      reformatPodType((_record?.podType ?? "") as TPODType) ===
                        PodTypeEnum.HARDCOPY ||
                      includes(
                        [ApprovalTypeEnum.APPROVED, ApprovalTypeEnum.REJECTED],
                        _record.status,
                      ) ||
                      isNil(_record.submittedDate)
                    }
                    icon={<CheckOutlined />}
                    onClick={() => onVerify(_record, ApprovalTypeEnum.APPROVED)}
                  />
                </Col>
                <Col>
                  <Button
                    id="confirm-button"
                    size="small"
                    tooltip={t("button.reject.tooltip")}
                    type="link"
                    disabled={
                      reformatPodType((_record?.podType ?? "") as TPODType) ===
                        PodTypeEnum.HARDCOPY ||
                      includes(
                        [ApprovalTypeEnum.APPROVED, ApprovalTypeEnum.REJECTED],
                        _record.status,
                      ) ||
                      isNil(_record.submittedDate)
                    }
                    icon={<CloseOutlined />}
                    onClick={() => onReject(_record)}
                  />
                </Col>
              </>
            )}
          </Row>
        );
      },
    },
  ];
};
