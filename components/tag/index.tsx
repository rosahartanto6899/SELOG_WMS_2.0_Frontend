import { Tag as AntdTag } from "antd";
import { ReactNode } from "react";

type TagProps = {
  text: string;
  color: string;
  icon?: ReactNode;
};

const Tag = (props: TagProps) => {
  const { text, color, icon } = props;

  return (
    <AntdTag color={color} icon={icon || null}>
      {text}
    </AntdTag>
  );
};

export default Tag;
