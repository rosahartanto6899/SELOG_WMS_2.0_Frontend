import * as React from "react";
import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgDisabledUnloading = ({
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
      d="M11.463 1H4.537a1.5 1.5 0 0 0-1.255.74l-2.2 3.487A.498.498 0 0 0 1 5.5v8A1.5 1.5 0 0 0 2.5 15h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 1-.5-.5V6h12v7.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 0 0 1h1a1.5 1.5 0 0 0 1.5-1.5v-8c0-.1-.03-.195-.081-.273L12.718 1.74A1.5 1.5 0 0 0 11.463 1ZM4.558 2H7.5v3H2.407l1.726-2.733A.5.5 0 0 1 4.558 2ZM8.5 2v3h5.093l-1.726-2.733A.5.5 0 0 0 11.442 2H8.5Z"
      fill="#000"
      fillOpacity={0.25}
    />
    <path
      d="m8.346 14.895 1.78-1.78a.356.356 0 1 0-.504-.504L8.45 13.784V10.37a.356.356 0 0 0-.713 0v3.414L6.564 12.61a.356.356 0 0 0-.503.504l1.78 1.78a.355.355 0 0 0 .5.005l.005-.005Z"
      fill="#000"
      fillOpacity={0.25}
    />
  </svg>
);
export default SvgDisabledUnloading;
