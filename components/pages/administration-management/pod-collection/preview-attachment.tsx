import { FilePdfOutlined } from "@ant-design/icons";
import TypographyText from "@sera-components/typography/typography-text";
import { Attachment } from "@sera-types/pod-collection.type";
import { useIsMobileView } from "@sera-utils/hooks/useIsMobileView";
import { Col, Flex, Image, Row } from "antd";
import { isNil } from "lodash";

import { IPreview } from "./modal-preview-attachment";
import PreviewPdf from "./preview-pdf";

interface IProps {
  attachments: Attachment[];
  selectedPreview: IPreview | null;
  setSelectedPreview: (args: IPreview | null) => void;
}

export enum FileTypeEnum {
  PDF = "pdf",
  IMAGE = "IMAGE",
}

const PreviewAttachment = ({
  attachments,
  selectedPreview,
  setSelectedPreview,
}: IProps) => {
  const isMobile = useIsMobileView();
  const ITEM_SIZE = isMobile ? 80 : 100;

  // const dummyData = [
  //   {
  //     type: "pdf",
  //     url: "/sample/sample-local.pdf",
  //   },
  //   {
  //     type: "image",
  //     url: "/sample/sample-landscape.jpeg",
  //   },
  //   {
  //     type: "pdf",
  //     url: "/sample/sample-local.pdf",
  //   },
  //   {
  //     type: "image",
  //     url: "/sample/sample-landscape.jpeg",
  //   },
  //   {
  //     type: "pdf",
  //     url: "/sample/sample-local.pdf",
  //   },
  //   {
  //     type: "image",
  //     url: "/sample/sample-landscape.jpeg",
  //   },
  //   {
  //     type: "pdf",
  //     url: "/sample/sample-local.pdf",
  //   },
  //   {
  //     type: "image",
  //     url: "/sample/sample-landscape.jpeg",
  //   },
  // ];

  return (
    <Row
      gutter={[12, 12]}
      style={{
        flexDirection: isMobile ? "column-reverse" : "row",
        ...(isMobile && { minHeight: "50vh" }),
        justifyContent: "space-between",
      }}
    >
      <Col md={4} lg={4}>
        <Flex
          gap="middle"
          vertical={!isMobile}
          style={{
            overflow: "auto",
            maxHeight: isMobile ? ITEM_SIZE + 20 : 700,
            padding: "0px 3px",
          }}
        >
          {attachments
            .map((e) => ({
              type: e.fileExtension,
              url: e.fileUrl,
            }))
            .map((e, idx) => (
              <Col
                key={idx}
                style={{
                  cursor: "pointer",
                  ...(selectedPreview?.url === e.url && {
                    border: "1px solid #3A8DDB",
                  }),
                  borderRadius: 3,
                  padding: 5,
                }}
                xs={8}
                md={22}
                onClick={() => setSelectedPreview(e)}
              >
                {e.type === FileTypeEnum.PDF ? (
                  <Row
                    style={{
                      border: "1px dashed gray",
                      borderRadius: 6,
                      height: ITEM_SIZE,
                    }}
                    justify={"center"}
                    align={"middle"}
                  >
                    <Col>
                      <FilePdfOutlined style={{ fontSize: 24 }} />
                    </Col>
                  </Row>
                ) : (
                  <Row>
                    <Col span={24}>
                      <Image
                        preview={false}
                        width={"100%"}
                        height={ITEM_SIZE}
                        src={e.url}
                        alt="thumbnail"
                        style={{ objectFit: "cover", borderRadius: 6 }}
                      />
                    </Col>
                  </Row>
                )}
              </Col>
            ))}
        </Flex>
      </Col>
      <Col md={20} lg={20}>
        <Row
          justify={"center"}
          align={selectedPreview?.type !== FileTypeEnum.PDF ? "middle" : "top"}
          style={{ height: "100%" }}
        >
          {!isNil(selectedPreview?.type) &&
          selectedPreview?.type !== FileTypeEnum.PDF ? (
            <Col>
              {!selectedPreview?.url ? (
                <Flex justify="center">
                  <TypographyText>Please select file to preview</TypographyText>
                </Flex>
              ) : (
                <Image
                  src={selectedPreview.url}
                  alt="preview"
                  style={{ objectFit: "contain", maxHeight: 600 }}
                  preview={false}
                />
              )}
            </Col>
          ) : (
            <Col xs={24} lg={16}>
              <PreviewPdf url={selectedPreview?.url ?? ""} />
            </Col>
          )}
        </Row>
      </Col>
    </Row>
  );
};

export default PreviewAttachment;
