import Skeleton from "@sera-components/skeleton";
import { ConfigProvider, Typography } from "antd";
import { TitleProps } from "antd/lib/typography/Title";

import { getColor, TypographyProps } from "./typography-props";

const TypographyTitle = ({
  loading,
  fontSize,
  variant,
  ...args
}: TypographyProps & TitleProps) => (
  <ConfigProvider
    theme={{
      components: {
        Typography: {
          fontSize: fontSize ?? 14,
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
    {!loading && <Typography.Title {...args} />}
  </ConfigProvider>
);

export default TypographyTitle;
