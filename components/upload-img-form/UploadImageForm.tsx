/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "@sera-components/button";
import Modal from "@sera-components/modal";
import MessageHandler from "@sera-libraries/message-handler";
import { RootState, uploadImgActions } from "@sera-redux";
import { IUploadImgState } from "@sera-types/upload-img.type";
import { decryptData } from "@sera-utils/encryptor";
import type { UploadFile, UploadProps } from "antd";
import { Flex, Form, Image as AntdImage, Upload } from "antd";
import { RcFile } from "antd/lib/upload";
import Image from "next/image";
import { useEffect, useState } from "react";
import { connect } from "react-redux";

interface UploadImageFormProps {
  uploadImage: typeof uploadImgActions.uploadImageFetch;
  uploadImgState: IUploadImgState;
  getImage: typeof uploadImgActions.getImageFetch;
}

const UploadImageForm = ({
  uploadImage,
  uploadImgState,
  getImage,
}: UploadImageFormProps) => {
  const [form] = Form.useForm();

  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [imgBase64, setImgBase64] = useState<string>("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const onFinish = () => {
    const image = imgBase64.split("base64,")?.[1];
    uploadImage({ images: [{ type: "KTP", image }] });
  };

  const handlePreviewUpload = (file: UploadFile): void => {
    const input = file;

    if (input?.url === undefined && input?.preview === undefined) {
      // file.preview = await getBase64(file.originFileObj as RcFile);
      input.preview = imgBase64;
    }

    setPreviewImage(input?.url ?? (input.preview as string));
    setPreviewOpen(true);
    // setPreviewTitle(input?.name ?? input?.url?.substring(input?.url?.lastIndexOf('/')! + 1));
  };

  const handleBeforeUpload = (file: RcFile): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        reject(new Error("You can only upload image files!"));
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          setImgBase64(result);
        }

        resolve(false);
      };

      reader.onerror = (error) => {
        console.error("File reading failed:", error);
        reject(new Error("File reading failed. Please try again."));
      };

      reader.readAsDataURL(file);
    });
  };

  const handleChangeUpload: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => {
    if (
      imgBase64 !== "" ||
      newFileList.length === 0 ||
      newFileList?.[0]?.type?.startsWith("image/") === true
    ) {
      setFileList(newFileList);
    }
  };

  const handleGetImage = (e: any) => {
    e.preventDefault();
    getImage();
  };

  const handleCancel = () => setPreviewOpen(false);

  const validateMessages = {
    required: "This field is required",
  };

  // SUCCESS - CREATE NEW ROLE
  useEffect(() => {
    const { isSuccess, data } = uploadImgState;
    if (isSuccess === true && data !== null) {
      MessageHandler().success(`Gambar berhasil di-upload`);
    }
  }, [uploadImgState.isSuccess, uploadImgState.data]);

  // ERROR - CREATE NEW ROLE
  useEffect(() => {
    const { error } = uploadImgState;
    if (error !== null) {
      MessageHandler().error(`Gambar gagal di-upload`);
    }
  }, [uploadImgState.error]);

  return (
    <>
      <Form
        name="basic"
        size="large"
        layout="vertical"
        form={form}
        onFinish={onFinish}
        autoComplete="off"
        validateMessages={validateMessages}
      >
        <Form.Item label="Pilih Gambar" name="picture">
          <Upload
            listType="picture-card"
            fileList={fileList}
            disabled={false}
            onPreview={handlePreviewUpload}
            onChange={handleChangeUpload}
            beforeUpload={handleBeforeUpload}
          >
            {fileList?.length < 1 && <div>Tambah</div>}
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button
            id="upload_image"
            type="primary"
            htmlType="submit"
            disabled={uploadImgState.isLoading}
          >
            {uploadImgState.isLoading ? "Loading..." : "Upload"}
          </Button>
        </Form.Item>
      </Form>

      <Modal
        id="asdsad"
        open={previewOpen}
        // title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <AntdImage alt="example" src={previewImage} style={{ width: "100%" }} />
      </Modal>

      <h1 style={{ marginTop: "60px" }}>Get Image</h1>
      <div style={{ marginTop: "20px" }}>
        <Button
          id="get_image"
          type="primary"
          onClick={handleGetImage}
          disabled={uploadImgState.getImage?.isLoading}
        >
          {uploadImgState.getImage?.isLoading ? "Loading..." : "Get Image"}
        </Button>

        <div
          style={{
            marginTop: "20px",
            background: "#f0f0f0",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          {uploadImgState.getImage?.isLoading ? (
            <p>Mengambil Data...</p>
          ) : uploadImgState.getImage?.error ? (
            <p>Gagal Mengambil Data</p>
          ) : uploadImgState.getImage?.isSuccess ? (
            <Flex wrap="wrap" gap="large" align="center">
              {uploadImgState.getImage.data?.data?.images.map(
                (image, index: number) => {
                  const valKey = uploadImgState.getImage.data!.key;
                  const splitKey = valKey.split(valKey.slice(-2));

                  let key: string = "";
                  let keyIV: string = "";

                  splitKey.forEach((item: string) => {
                    if (item !== "") {
                      if (item.length < 33) keyIV = item;
                      else key = item;
                    }
                  });

                  return (
                    <div
                      style={{
                        position: "relative",
                        aspectRatio: "16 / 9",
                        width: "280px",
                      }}
                      key={`image-${index + 1}`}
                    >
                      <Image
                        src={decryptData(image.url, key, keyIV)}
                        alt={`image-${image.id}`}
                        fill
                        style={{ objectFit: "contain" }}
                        quality={100}
                        sizes="280px"
                      />
                    </div>
                  );
                },
              )}
            </Flex>
          ) : (
            // ELSE
            <p>Klik tombol Get Image</p>
          )}
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  uploadImgState: state.uploadImg,
});

const mapDispatchToProps = {
  uploadImage: uploadImgActions.uploadImageFetch,
  getImage: uploadImgActions.getImageFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadImageForm);
