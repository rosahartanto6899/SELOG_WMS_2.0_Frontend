import * as React from "react";
import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgContractExpiringIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="'fms-icon'"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.571 0H6a2.571 2.571 0 0 0-2.571 2.571v6a.857.857 0 0 0 1.714 0v-6A.857.857 0 0 1 6 1.714h7.714V9.43c0 .473.384.857.857.857h7.715v11.143a.857.857 0 0 1-.857.857h-7.715a.857.857 0 0 0 0 1.714h7.715A2.57 2.57 0 0 0 24 21.429v-12a.854.854 0 0 0-.25-.606L15.178.251A.857.857 0 0 0 14.57 0Zm.858 2.926v5.645h5.644L15.43 2.926Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.888 15.325a.857.857 0 1 0-1.213-1.213l-1.818 1.819-1.818-1.819a.857.857 0 0 0-1.212 1.213l1.818 1.818-1.818 1.818a.857.857 0 0 0 1.212 1.212l1.818-1.818 1.818 1.818a.857.857 0 1 0 1.213-1.212l-1.819-1.818 1.819-1.818Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 17.143a6.857 6.857 0 1 1 13.714 0 6.857 6.857 0 0 1-13.714 0ZM6.857 12a5.143 5.143 0 1 0 0 10.286 5.143 5.143 0 0 0 0-10.286Z"
      fill="currentColor"
    />
  </svg>
);
export default SvgContractExpiringIcon;
