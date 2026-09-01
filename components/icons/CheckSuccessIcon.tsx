import * as React from "react";
import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgCheckSuccessIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 15 15"
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
      d="M7.082 14.5a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm2.57-10.25c.14-.24.44-.32.68-.18.24.14.32.44.18.68l-3.21 5.5c-.07.12-.17.23-.29.31-.11.09-.25.14-.39.17-.06.02-.12.02-.18.02a.986.986 0 0 1-.62-.22l-2.05-1.64a.495.495 0 0 1-.08-.7c.17-.22.48-.25.7-.08l2.05 1.64 3.21-5.5Z"
      fill="#27CE56"
    />
  </svg>
);
export default SvgCheckSuccessIcon;
