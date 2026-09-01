import * as React from "react";
import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgDisabledEndpoint = ({
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
      d="M8.172 15.77a.573.573 0 0 1-.915 0l-.004-.005-.012-.015-.044-.06a57.936 57.936 0 0 1-.754-1.052 59.126 59.126 0 0 1-1.786-2.698c-.649-1.046-1.305-2.194-1.8-3.268C2.37 7.62 2 6.56 2 5.714a5.714 5.714 0 1 1 11.429 0c0 .846-.37 1.906-.857 2.958-.495 1.074-1.152 2.222-1.8 3.268a59.127 59.127 0 0 1-2.54 3.75l-.044.06-.012.015-.004.006Z"
      fill="#fff"
    />
    <path
      d="m7.257 15.77.457-.341.458.342a.573.573 0 0 1-.915 0Z"
      fill="#000"
      fillOpacity={0.25}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.714 3.429a2.286 2.286 0 1 0 0 4.571 2.286 2.286 0 0 0 0-4.571ZM6.571 5.714a1.143 1.143 0 1 1 2.286 0 1.143 1.143 0 0 1-2.286 0Z"
      fill="#000"
      fillOpacity={0.25}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="m7.257 15.77.457-.341.458.342.004-.006.012-.015.044-.06.165-.226a59.127 59.127 0 0 0 2.374-3.524c.65-1.046 1.305-2.194 1.801-3.268.486-1.052.857-2.112.857-2.958A5.714 5.714 0 0 0 2 5.714c0 .846.37 1.906.856 2.958.496 1.074 1.152 2.222 1.801 3.268a59.126 59.126 0 0 0 2.54 3.75l.044.06.012.015.004.006ZM4.482 2.483a4.571 4.571 0 0 1 7.804 3.232c0 .578-.273 1.443-.751 2.48-.469 1.013-1.098 2.117-1.735 3.143a58.031 58.031 0 0 1-2.086 3.12 60.458 60.458 0 0 1-2.086-3.12c-.636-1.026-1.266-2.13-1.734-3.144-.479-1.036-.751-1.901-.751-2.479 0-1.212.481-2.375 1.339-3.232Z"
      fill="#000"
      fillOpacity={0.25}
    />
  </svg>
);
export default SvgDisabledEndpoint;
