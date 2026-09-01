import Modal from "@sera-components/modal";
import { Attachment } from "@sera-types/pod-collection.type";
import { useState } from "react";

// import { useTranslation } from "react-i18next";
import PreviewAttachment from "./preview-attachment";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  attachments: Attachment[];
}

export interface IPreview {
  type: string;
  url: string;
}

const ModalPreviewAttachment = (props: IProps) => {
  const { isOpen, onClose, onSubmit, title, attachments } = props;
  // const { t } = useTranslation(undefined, {
  //   keyPrefix: "podCollection.detail.modalPreview",
  // });

  const [selectedPreview, setSelectedPreview] = useState<IPreview | null>(null);

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
      onOk={() => {
        onSubmit();
        setSelectedPreview(null);
      }}
      onCancel={() => {
        onClose();
        setSelectedPreview(null);
      }}
      width={900}
      closable
      onClose={() => {
        onClose();
        setSelectedPreview(null);
      }}
      height={700}
      centered
    >
      <PreviewAttachment
        attachments={attachments}
        selectedPreview={selectedPreview}
        setSelectedPreview={setSelectedPreview}
      />
    </Modal>
  );
};

export default ModalPreviewAttachment;
