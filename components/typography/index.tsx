import { Typography as AntdTypography } from "antd";
import { TypographyProps as AntdTypographyProps } from "antd/lib/typography/Typography";

import Skeleton from "../skeleton";
import TypographyText from "./typography-text";
import TypographyTitle from "./typography-title";

export interface TypographyProps extends AntdTypographyProps<any> {
  loading?: boolean;
}

const Typography = ({ loading, ...args }: TypographyProps) => (
  <>
    {loading && (
      <Skeleton.Input
        active
        size="small"
        style={{ height: 16, width: "100%" }}
      />
    )}
    {!loading && <AntdTypography {...args} />}
  </>
);

Typography.Text = TypographyText;
Typography.Title = TypographyTitle;

export default Typography;
