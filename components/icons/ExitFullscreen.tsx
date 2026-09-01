import * as React from "react";
import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgExitFullscreen = ({
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
      d="M1.143 10.286a.571.571 0 0 0 0 1.143h2.62L.167 15.024a.572.572 0 0 0 .808.809l3.596-3.596v2.62a.571.571 0 1 0 1.143 0v-4a.571.571 0 0 0-.571-.571h-4ZM10.857 10.286a.571.571 0 0 0-.571.571v4a.572.572 0 0 0 1.143 0v-2.62l3.595 3.596a.572.572 0 0 0 .809-.809l-3.596-3.595h2.62a.572.572 0 0 0 0-1.143h-4ZM.975.167a.571.571 0 1 0-.808.808l3.596 3.596h-2.62a.571.571 0 1 0 0 1.143h4a.571.571 0 0 0 .571-.571v-4a.571.571 0 1 0-1.143 0v2.62L.975.167ZM12.237 4.571 15.833.975a.572.572 0 0 0-.809-.808L11.43 3.763v-2.62a.571.571 0 0 0-1.143 0v4c0 .315.256.571.571.571h4a.571.571 0 1 0 0-1.143h-2.62Z"
      fill="#2A3DDE"
    />
  </svg>
);
export default SvgExitFullscreen;
