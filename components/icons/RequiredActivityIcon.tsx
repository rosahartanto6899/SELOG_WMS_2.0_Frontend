import * as React from "react";
import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgRequiredActivityIcon = ({
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
    className="'fms-icon'"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16Zm.571-12A.571.571 0 0 0 7.43 4v3.429a.571.571 0 0 0 1.142 0V4Zm-1.714 6.857a1.143 1.143 0 1 1 2.286 0 1.143 1.143 0 0 1-2.286 0Z"
      fill="#F47920"
    />
  </svg>
);
export default SvgRequiredActivityIcon;
