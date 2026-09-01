import Skeleton from "@sera-components/skeleton";
import { ConfigProvider, Typography } from "antd";
import { TextProps } from "antd/lib/typography/Text";

import { getColor, TypographyProps } from "./typography-props";

const TypographyText = ({
  loading,
  fontSize,
  fontWeight,
  variant,
  ...args
}: TypographyProps & TextProps) => (
  <ConfigProvider
    theme={{
      components: {
        Typography: {
          fontSize: fontSize ?? 14,
          fontWeightStrong: fontWeight ?? 400,
          colorText: getColor(variant),
          algorithm: true,
        },
      },
    }}
  >
    {loading && (
      <Skeleton.Input
        active
        size="small"
        style={{ height: 16, width: "100%" }}
      />
    )}
    {!loading && <Typography.Text {...args} />}
  </ConfigProvider>
);

export default TypographyText;
