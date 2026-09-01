import { InsertRowAboveOutlined } from "@ant-design/icons";
import FilterDropdown from "@sera-components/filter-dropdown";
import Table from "@sera-components/table";
import MessageHandler from "@sera-libraries/message-handler";
import { AutoCompleteType, BaseType } from "@sera-types/base.type";
import {
  PodDeliveryPayload,
  PodHardcopyPayload,
  // ApprovalActionType,
  PodLoadingPayload,
  PodTimestampPayload,
  PodUnloadingPayload,
} from "@sera-types/pod-collection.type";
import { Col, Row } from "antd";
import { FormInstance } from "antd/lib";
import dayjs from "dayjs";
import { includes, isNil, omit } from "lodash";
import React, { useEffect, useReducer, useState } from "react";
import { useTranslation } from "react-i18next";

import usePodCollection from "./hooks/usePodCollection";
import {
  ApprovalTypeEnum,
  ColumnsDetails,
  IModalEditVerify,
  PodTypeEnum,
  reformatPodType,
  TPODType,
  UNCHECK_KEYS_DETAILS,
} from "./list-props-table";
import ModalPod from "./modal-pod";
import ModalPreviewAttachment from "./modal-preview-attachment";
import ModalReject from "./modal-reject";
import styles from "./pod-collection.module.scss";

// const DUMMY = {
//   shipmentId: "90EDB8BE-2D09-4B8D-A4E4-447082BB2055",
//   pods: [
//     {
//       podType: "POD Unloading ",
//       submittedDate: "2026-02-10T12:16:57.622Z",
//       submittedBy: "Budi",
//       confirmedDate: null,
//       confirmedBy: null,
//       attachments: [
//         {
//           fileUrl:
//             "selog-logis-staging/pod/unloading/90EDB8BE-2D09-4B8D-A4E4-447082BB2055/1770725817759-Timesheet SERA Shaden 01-26 (1).pdf",
//         },
//         {
//           fileUrl:
//             "selog-logis-staging/pod/unloading/90EDB8BE-2D09-4B8D-A4E4-447082BB2055/1770725817886-Media.jpg",
//         },
//       ],
//       status: "Open",
//       action: "Edit",
//     },
//     {
//       podType: "POD Loading ",
//       submittedDate: "2026-02-10T12:16:57.622Z",
//       submittedBy: "Ani",
//       confirmedDate: null,
//       confirmedBy: null,
//       attachments: [
//         {
//           fileUrl:
//             "selog-logis-staging/pod/unloading/90EDB8BE-2D09-4B8D-A4E4-447082BB2055/1770725817759-Timesheet SERA Shaden 01-26 (1).pdf",
//         },
//         {
//           fileUrl:
//             "selog-logis-staging/pod/unloading/90EDB8BE-2D09-4B8D-A4E4-447082BB2055/1770725817886-Media.jpg",
//         },
//       ],
//       status: "Open",
//       action: "Edit",
//     },
//   ],
// };

interface IProps {
  id: string;
}

const initialOptions = { page: 1, limit: 10 };

const PodDetails = ({ id }: IProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "podCollection.detail",
  });

  const {
    queries: {
      fetchDetails,
      putApproval,
      postLoading,
      postUnloading,
      postDelivery,
      postHardcopy,
      postTimestamp,
    },
    loading: { detailsLoading, loadingApproval },
    data: { detailsData },
  } = usePodCollection();

  const COLUMN_KEYS = ColumnsDetails({})?.filter((_item) => !_item?.exception);

  const [showColumns, setShowColumns] = useState<string[]>(
    COLUMN_KEYS?.map((_item) => _item?.key)?.filter(
      (_key) => !UNCHECK_KEYS_DETAILS.includes(_key),
    ),
  );

  const [options, setOptions] = useState<BaseType>(initialOptions);

  const initialEditVerify: IModalEditVerify = {
    type: null,
    podType: null,
    attachments: [],
    title: "",
    podId: null,
    receiptDate: null,
  };
  const [stateEditVerify, dispatchEditVerify] = useReducer(
    (curr: IModalEditVerify, acc: IModalEditVerify) => ({ ...curr, ...acc }),
    initialEditVerify,
  );

  const [statePreview, dispatchPreview] = useReducer(
    (curr: IModalEditVerify, acc: IModalEditVerify) => ({ ...curr, ...acc }),
    initialEditVerify,
  );

  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  const onChangePagination = (_current: number, _limit: number) => {
    setOptions((_prev) => ({ ..._prev, page: _current, limit: _limit }));
  };

  const onRejectApproval = (
    payload: { reason: string },
    // type: ApprovalActionType,
  ) => {
    if (!stateEditVerify?.podId) return;
    putApproval(
      {
        id: stateEditVerify.podId,
        reason: payload.reason,
        action: ApprovalTypeEnum.REJECTED,
      },
      () => {
        MessageHandler().success(t("message.rejected"));
        setRejectModalOpen(false);
        fetchDetails({ id });
      },
    );
  };

  const uploadPodLoading = async (
    payload: PodLoadingPayload,
    form?: FormInstance,
    cleanupFiles?: (args: any) => void,
  ) => {
    postLoading(
      {
        files: payload.files,
        shipmentNumber: detailsData.shipmentNo,
        picName: payload.picName,
      },
      () => {
        MessageHandler().success(t("message.edited"));
        fetchDetails({ id });
        dispatchEditVerify(initialEditVerify);
        if (form) form.resetFields();
        if (cleanupFiles) cleanupFiles([]);
      },
    );
  };

  const uploadPodUnloading = async (
    payload: PodUnloadingPayload,
    form?: FormInstance,
    cleanupFiles?: (args: any) => void,
  ) => {
    postUnloading(
      {
        files: payload.files,
        shipmentNumber: detailsData.shipmentNo,
        picName: payload.picName,
        isClaim: Boolean(payload?.isClaim),
      },
      () => {
        MessageHandler().success(t("message.edited"));
        dispatchEditVerify(initialEditVerify);
        fetchDetails({ id });
        if (form) form.resetFields();
        if (cleanupFiles) cleanupFiles([]);
      },
    );
  };

  const uploadPodDelivery = async (
    payload: PodDeliveryPayload,
    form?: FormInstance,
    cleanupFiles?: (args: any) => void,
  ) => {
    postDelivery(
      {
        files: payload.files,
        shipmentNumber: detailsData.shipmentNo,
        amount: payload.amount,
        courier: payload.courier,
        receiptDate: dayjs(payload.receiptDate).format("YYYY-MM-DD"),
        receiptNumber: payload.receiptNumber,
      },
      () => {
        MessageHandler().success(t("message.edited"));
        dispatchEditVerify(initialEditVerify);
        fetchDetails({ id });
        if (form) form.resetFields();
        if (cleanupFiles) cleanupFiles([]);
      },
    );
  };

  const uploadPodTimestamp = async (
    payload: PodTimestampPayload,
    form?: FormInstance,
    cleanupFiles?: (args: any) => void,
  ) => {
    postTimestamp(
      {
        files: payload.files,
        shipmentNumber: detailsData.shipmentNo,
      },
      () => {
        MessageHandler().success(t("message.edited"));
        dispatchEditVerify(initialEditVerify);
        fetchDetails({ id });
        if (form) form.resetFields();
        if (cleanupFiles) cleanupFiles([]);
      },
    );
  };

  const uploadPodHardcopy = async (
    payload: PodHardcopyPayload,
    form?: FormInstance,
  ) => {
    postHardcopy(
      {
        shipmentNumber: detailsData.shipmentNo,
        submittedDate: dayjs(payload.submittedDate).format("YYYY-MM-DD"),
      },
      () => {
        MessageHandler().success(t("message.edited"));
        dispatchEditVerify(initialEditVerify);
        fetchDetails({ id });
        if (form) form.resetFields();
      },
    );
  };

  const handleEditPod = (
    payload: any,
    form?: FormInstance,
    cleanFiles?: (args: any) => void,
  ) => {
    if (stateEditVerify.type === "edit") {
      switch (reformatPodType(stateEditVerify.podType)) {
        case PodTypeEnum.LOADING:
          uploadPodLoading(payload, form, cleanFiles);
          break;
        case PodTypeEnum.UNLOADING:
          uploadPodUnloading(payload, form, cleanFiles);
          break;
        case PodTypeEnum.DELIVERY:
          uploadPodDelivery(payload, form, cleanFiles);
          break;
        case PodTypeEnum.TIMESTAMP:
          uploadPodTimestamp(payload, form, cleanFiles);
          break;
        case PodTypeEnum.HARDCOPY:
          uploadPodHardcopy(payload, form);
          break;
        default:
          break;
      }
    }
    if (stateEditVerify.type === "verify" && !isNil(stateEditVerify?.podId)) {
      if (!detailsData?.shipmentId) return;
      putApproval(
        {
          id: stateEditVerify.podId,
          reason: "",
          action: ApprovalTypeEnum.APPROVED,
        },
        () => {
          MessageHandler().success(t("message.approved"));
          dispatchEditVerify(initialEditVerify);
          fetchDetails({ id });
          if (form) form.resetFields();
        },
      );
    }
  };

  useEffect(() => {
    if (id) fetchDetails({ id });
  }, [id]);

  return (
    <>
      <div className={styles["pod-collection-detail-overview-wrapper"]}>
        <div
          className={styles["pod-collection-detail-overview-wrapper__content"]}
        >
          {/* <Card title={t("title")}> */}
          <Table
            columns={ColumnsDetails({
              onEdit: (value) =>
                dispatchEditVerify({
                  type: "edit",
                  podType: value.podType as TPODType,
                  title: includes(
                    [
                      PodTypeEnum.LOADING,
                      PodTypeEnum.UNLOADING,
                      PodTypeEnum.DELIVERY,
                      PodTypeEnum.HARDCOPY,
                    ],
                    reformatPodType(value?.podType as TPODType),
                  )
                    ? (value?.podType ?? "")
                    : "Upload Checkpoint",
                  submittedDate: value?.submittedDate
                    ? dayjs(value.submittedDate).format("YYYY-MM-DD HH:mm")
                    : undefined,
                  shipmentNumber: detailsData?.shipmentNo ?? "-",
                  customerName: detailsData?.customer?.name ?? "-",
                  picName: value?.picName,
                  ...omit(value, ["podType", "submittedDate"]),
                  podId: value?.id,
                  receiptDate: value?.receiptDate
                    ? dayjs(value.receiptDate)
                    : null,
                }),
              onPreview: (value) =>
                dispatchPreview({
                  type: "preview",
                  podType: value.podType as TPODType,
                  attachments: value.attachments,
                  title: includes(
                    [
                      PodTypeEnum.LOADING,
                      PodTypeEnum.UNLOADING,
                      PodTypeEnum.DELIVERY,
                      PodTypeEnum.HARDCOPY,
                    ],
                    reformatPodType(value?.podType as TPODType),
                  )
                    ? `Preview ${value?.podType}`
                    : "Preview Upload Checkpoint",
                  podId: value?.id,
                  receiptDate: value?.receiptDate
                    ? dayjs(value.receiptDate)
                    : null,
                }),

              onVerify: (value) =>
                dispatchEditVerify({
                  type: "verify",
                  podType: value.podType as TPODType,
                  title: includes(
                    [
                      PodTypeEnum.LOADING,
                      PodTypeEnum.UNLOADING,
                      PodTypeEnum.DELIVERY,
                      PodTypeEnum.HARDCOPY,
                    ],
                    reformatPodType(value?.podType as TPODType),
                  )
                    ? (value?.podType ?? "")
                    : "Upload Checkpoint",
                  submittedDate: dayjs(value.submittedDate).isValid()
                    ? dayjs(value.submittedDate).format("YYYY-MM-DD HH:mm")
                    : undefined,
                  shipmentNumber: detailsData?.shipmentNo ?? "-",
                  customerName: detailsData?.customer?.name ?? "-",
                  picName: value?.picName,
                  ...omit(value, ["podType", "submittedDate"]),
                  podId: value?.id,
                  receiptDate: value?.receiptDate
                    ? dayjs(value.receiptDate)
                    : null,
                }),
              onReject: (value) => {
                setRejectModalOpen(true);
                dispatchEditVerify({
                  type: null,
                  podType: value.podType as TPODType,
                  title: includes(
                    [
                      PodTypeEnum.LOADING,
                      PodTypeEnum.UNLOADING,
                      PodTypeEnum.DELIVERY,
                      PodTypeEnum.HARDCOPY,
                    ],
                    reformatPodType(value?.podType as TPODType),
                  )
                    ? (value?.podType ?? "")
                    : "Upload Checkpoint",
                  submittedDate: dayjs(value.submittedDate).isValid()
                    ? dayjs(value.submittedDate).format("YYYY-MM-DD HH:mm")
                    : undefined,
                  shipmentNumber: detailsData?.shipmentNo ?? "-",
                  customerName: detailsData?.customer?.name ?? "-",
                  picName: value?.picName,
                  ...omit(value, ["podType", "submittedDate"]),
                  podId: value?.id,
                  receiptDate: value?.receiptDate
                    ? dayjs(value.receiptDate)
                    : null,
                });
              },
            })?.filter(
              (_item) => _item?.exception || showColumns?.includes(_item?.key),
            )}
            // title="POD Detail List"
            // dataSource={DUMMY?.pods}
            dataSource={
              detailsData.pods?.map((e, idx) => ({ ...e, no: idx + 1 })) ?? []
            }
            total={detailsData?.pods?.length ?? 0}
            current={1}
            pageSize={options.limit}
            onPageChange={onChangePagination}
            scroll={{ x: "max-content" }}
            loading={detailsLoading}
            showActions
            showPagination={false}
            actions={
              <Row gutter={[12, 12]}>
                <Col>
                  <FilterDropdown
                    buttonLabel={t("button.config")}
                    icon={<InsertRowAboveOutlined />}
                    options={
                      (COLUMN_KEYS?.map((_item) => ({
                        label: _item?.title,
                        value: _item?.key,
                      })) as AutoCompleteType[]) ?? []
                    }
                    selectedValues={showColumns}
                    onChange={(_value: string[]) => {
                      setShowColumns(_value);
                    }}
                    onReset={() => {
                      setShowColumns(COLUMN_KEYS?.map((_item) => _item?.key));
                    }}
                  />
                </Col>
              </Row>
            }
          />
          {/* </Card> */}
        </div>
      </div>
      <ModalPod
        isOpen={!isNil(stateEditVerify.type)}
        onClose={(form) => {
          form.resetFields();
          dispatchEditVerify(initialEditVerify);
        }}
        onSubmit={(val: any, form?: any, cleanFiles?: (args: any) => void) =>
          handleEditPod(val, form, cleanFiles)
        }
        type={stateEditVerify.type}
        podType={reformatPodType(stateEditVerify.podType)}
        title={stateEditVerify.title}
        formData={stateEditVerify}
      />
      <ModalPreviewAttachment
        isOpen={!isNil(statePreview.type)}
        onClose={() => dispatchPreview(initialEditVerify)}
        onSubmit={() => null}
        title={statePreview.title}
        attachments={statePreview?.attachments ?? []}
      />
      <ModalReject
        isOpen={rejectModalOpen}
        onSubmit={onRejectApproval}
        onCancel={() => {
          setRejectModalOpen(false);
        }}
        loading={loadingApproval}
      />
    </>
  );
};

export default PodDetails;
