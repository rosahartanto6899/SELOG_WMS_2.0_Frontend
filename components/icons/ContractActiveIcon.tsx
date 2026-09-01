import * as React from "react";
import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgContractActiveIcon = ({
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
      d="M14.571 0c.228 0 .446.09.607.251l8.57 8.571c.156.156.252.37.252.607v12A2.57 2.57 0 0 1 21.429 24h-7.715a.857.857 0 0 1 0-1.714h7.715a.857.857 0 0 0 .857-.857V10.286H14.57a.857.857 0 0 1-.857-.857V1.714H6a.857.857 0 0 0-.857.857v6a.857.857 0 0 1-1.714 0v-6A2.571 2.571 0 0 1 6 0h8.571Zm6.502 8.571L15.43 2.926v5.645h5.644Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.904 13.858c.394.263.5.795.238 1.189L6.713 20.19a.857.857 0 0 1-1.32.13L3.68 18.606a.857.857 0 0 1 1.212-1.212l.975.975 2.848-4.273a.857.857 0 0 1 1.189-.238Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.857 10.286a6.857 6.857 0 1 0 0 13.714 6.857 6.857 0 0 0 0-13.714Zm-5.143 6.857a5.143 5.143 0 1 1 10.286 0 5.143 5.143 0 0 1-10.286 0Z"
      fill="currentColor"
    />
  </svg>
);
export default SvgContractActiveIcon;
