import { Skeleton as AntdSkeleton, SkeletonProps } from "antd";

import SkeletonTable from "./skeleton-table";

const Skeleton = (props: SkeletonProps) => <AntdSkeleton {...props} />;

Skeleton.Table = SkeletonTable;
Skeleton.Input = AntdSkeleton.Input;
Skeleton.Button = AntdSkeleton.Button;

export default Skeleton;
