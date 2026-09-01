import { Badge as AntdBadge, BadgeProps as AntBadgeProps } from "antd";

import Skeleton from "../skeleton";

export interface BadgeProps extends AntBadgeProps {
  loading?: boolean;
}

const Badge = (props: BadgeProps) => {
  const { loading } = props;

  return (
    <>
      {loading && (
        <Skeleton.Input
          active
          size="small"
          style={{ height: 16, width: "100%" }}
        />
      )}
      {!loading && <AntdBadge {...props} />}
    </>
  );
};

export default Badge;
