import * as React from "react";
import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgDisabledLoading = ({
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
      d="M11.463 1a1.5 1.5 0 0 1 1.255.74l2.2 3.487A.498.498 0 0 1 15 5.5v8a1.5 1.5 0 0 1-1.5 1.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 0 .5-.5V6H2v7.5a.5.5 0 0 0 .5.5h2a.5.5 0 0 1 0 1h-2A1.5 1.5 0 0 1 1 13.5v-8c0-.1.03-.195.081-.273L3.282 1.74A1.5 1.5 0 0 1 4.537 1L4.55 1h6.913ZM7.5 2H4.558a.5.5 0 0 0-.425.267L2.407 5H7.5V2Zm1 3V2h2.942a.5.5 0 0 1 .425.267L13.593 5H8.5Z"
      fill="#000"
      fillOpacity={0.25}
    />
    <path
      d="m8.252 10.118 1.78 1.78a.356.356 0 1 1-.503.504L8.356 11.23v3.414a.356.356 0 0 1-.712 0v-3.415L6.47 12.402a.356.356 0 0 1-.504-.503l1.781-1.781a.355.355 0 0 1 .499-.005l.005.005Z"
      fill="#000"
      fillOpacity={0.25}
    />
  </svg>
);
export default SvgDisabledLoading;
