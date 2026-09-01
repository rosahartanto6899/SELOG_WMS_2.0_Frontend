import Modal from "@sera-components/modal";
import { Attachment } from "@sera-types/pod-collection.type";
import { FormInstance } from "antd";
import { useForm } from "antd/es/form/Form";
import { includes } from "lodash";
import React, { useEffect, useState } from "react";

import FormPod from "./form-pod";
import FormPodHardcopy from "./form-pod-hardcopy";
import FormUploadTimestamp from "./form-upload-timestamp";
import {
  extractFileNameFromUrl,
  PodTypeEnum,
  TModalMutationType,
  TPODReformatType,
} from "./list-props-table";

interface IProps<T> {
  isOpen: boolean;
  onClose: (form: FormInstance) => void;
  onSubmit: (
    args: T,
    form?: FormInstance,
    cleanFiles?: (args: any) => void,
  ) => void;
  type: TModalMutationType;
  podType: TPODReformatType;
  title: string;
  formData: {
    shipmentNumber?: string;
    customerName?: string;
    submittedDate?: string;
    submittedBy?: string;
    attachments?: Attachment[];
  };
}

const ModalPod = <T,>(props: IProps<T>) => {
  const { isOpen, onClose, onSubmit, type, podType, title, formData } = props;

  const [form] = useForm();

  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);

  useEffect(() => {
    if (formData.attachments && !includes(["edit", "preview"], type)) {
      return setSelectedFiles(
        formData.attachments?.map((e) => ({
          status: "done",
          percent: 100,
          thumbUrl: e.fileUrl,
          name: extractFileNameFromUrl(e.fileUrl),
        })),
      );
    }
    return setSelectedFiles([]);
  }, [formData, type]);

  return (
    <Modal
      open={isOpen}
      title={title}
      okButtonProps={{
        disabled: false,
        loading: false,
      }}
      cancelButtonProps={{
        disabled: false,
      }}
      onCancel={() => onClose(form)}
      height={700}
      closable
    >
      {includes(
        [PodTypeEnum.LOADING, PodTypeEnum.UNLOADING, PodTypeEnum.DELIVERY],
        podType?.toLowerCase(),
      ) ? (
        <FormPod
          type={type}
          podType={podType}
          onSubmit={onSubmit}
          formData={formData}
          onCancel={onClose}
          form={form}
          setSelectedFiles={setSelectedFiles}
          selectedFiles={selectedFiles}
        />
      ) : podType?.toLowerCase() === PodTypeEnum.HARDCOPY ? (
        <FormPodHardcopy
          type={type}
          podType={podType}
          form={form}
          formData={formData}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      ) : (
        <FormUploadTimestamp
          type={type}
          podType={podType}
          form={form}
          setSelectedFiles={setSelectedFiles}
          selectedFiles={selectedFiles}
          formData={formData}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      )}
    </Modal>
  );
};

export default ModalPod;
