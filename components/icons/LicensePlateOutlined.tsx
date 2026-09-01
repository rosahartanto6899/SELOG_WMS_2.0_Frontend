import * as React from "react";
import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgLicensePlateOutlined = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="fms-icon"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      d="M4.286 4.714a.857.857 0 1 0 0-1.714.857.857 0 0 0 0 1.714ZM19.714 4.714a.857.857 0 1 0 0-1.714.857.857 0 0 0 0 1.714ZM5.143 14.143a.857.857 0 1 1-1.715 0 .857.857 0 0 1 1.715 0ZM20.571 14.143a.857.857 0 1 1-1.714 0 .857.857 0 0 1 1.714 0ZM8.571 13.286a.857.857 0 0 0 0 1.714h6.858a.857.857 0 0 0 0-1.714H8.57Z"
      fill="#3A8DDB"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 2.143C0 1.196.768.429 1.714.429h20.572c.947 0 1.714.767 1.714 1.714v13.714c0 .947-.767 1.714-1.714 1.714H1.714A1.714 1.714 0 0 1 0 15.857V2.143Zm1.714 0h20.572V5.57H1.714V2.143Zm0 8.571V7.286h20.572v3.428H1.714Zm0 1.715h20.572v3.428H1.714V12.43Z"
      fill="#3A8DDB"
    />
  </svg>
);
export default SvgLicensePlateOutlined;
