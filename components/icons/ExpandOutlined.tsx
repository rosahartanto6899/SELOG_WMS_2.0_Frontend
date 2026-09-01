import * as React from "react";
import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgExpandOutlined = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="fms-icon"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M.571 0A.571.571 0 0 0 0 .571v4.572a.571.571 0 0 0 1.143 0V1.95L5.882 6.69a.571.571 0 1 0 .808-.808L1.95 1.142h3.192a.571.571 0 0 0 0-1.142H.57ZM10.857 0a.571.571 0 0 0 0 1.143h3.192L9.31 5.882a.571.571 0 0 0 .808.808l4.74-4.739v3.192a.571.571 0 0 0 1.142 0V.57A.571.571 0 0 0 15.429 0h-4.572ZM9.31 9.31a.571.571 0 0 1 .808 0l4.74 4.739v-3.192a.572.572 0 0 1 1.142 0v4.572a.571.571 0 0 1-.571.571h-4.572a.571.571 0 0 1 0-1.143h3.192L9.31 10.118a.571.571 0 0 1 0-.808ZM6.69 9.31a.571.571 0 0 1 0 .808l-4.739 4.74h3.192a.571.571 0 0 1 0 1.142H.57A.571.571 0 0 1 0 15.429v-4.572a.571.571 0 0 1 1.143 0v3.192L5.882 9.31a.571.571 0 0 1 .808 0Z"
      fill="currentColor"
      fillOpacity={0.85}
    />
  </svg>
);
export default SvgExpandOutlined;
