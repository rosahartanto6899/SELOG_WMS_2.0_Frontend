import * as React from "react";
import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgFilterOutlined = ({
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
      d="M.167.167A.571.571 0 0 1 .571 0H15.43A.571.571 0 0 1 16 .572a8.012 8.012 0 0 1-5.714 7.672v4.899c0 .19-.096.37-.255.475l-3.428 2.286a.572.572 0 0 1-.889-.475V8.244A8.011 8.011 0 0 1 0 .572C0 .42.06.275.167.167Zm1 .976A6.869 6.869 0 0 0 6.418 7.25a.571.571 0 0 1 .44.556v6.555l2.285-1.524V7.806c0-.265.181-.495.439-.556a6.868 6.868 0 0 0 5.251-6.107H1.167Z"
      fill="currentColor"
      fillOpacity={0.85}
    />
  </svg>
);
export default SvgFilterOutlined;
