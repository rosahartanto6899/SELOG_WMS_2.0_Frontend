import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgMarkerWaypointIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 23"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="'fms-icon'"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="#C8E2FB"
      stroke="#3A8DDB"
      strokeWidth={2}
      d="m12 1.668 9.9 9.9-9.9 9.899-9.9-9.9z"
    />
  </svg>
);
export default SvgMarkerWaypointIcon;
