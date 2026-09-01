import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { Upload } from "antd";
import { useTranslation } from "react-i18next";

const { Dragger } = Upload;

export default function UploadDnD({ ...props }: UploadProps) {
  const { t } = useTranslation(undefined, { keyPrefix: "global.uploadDnd" });

  return (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>

      <p className="ant-upload-text">{t("desc")}</p>
    </Dragger>
  );
}
