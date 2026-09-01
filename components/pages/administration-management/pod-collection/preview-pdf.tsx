import TypographyText from "@sera-components/typography/typography-text";
import { useIsMobileView } from "@sera-utils/hooks/useIsMobileView";
import { Flex } from "antd";
import React from "react";

interface IProps {
  url: string;
}

const PreviewPdf = (props: IProps) => {
  const { url } = props;

  const isMobile = useIsMobileView();
  if (!url)
    return (
      <Flex justify="center">
        <TypographyText>Please select file to preview</TypographyText>
      </Flex>
    );
  return (
    <object
      data={`${url}#toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0`}
      type="application/pdf"
      width={isMobile ? 300 : "100%"}
      height={isMobile ? 500 : 700}
    ></object>
  );
};

export default PreviewPdf;
