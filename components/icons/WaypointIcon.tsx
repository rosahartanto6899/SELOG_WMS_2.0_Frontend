import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgWaypointIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 33 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="'fms-icon'"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      d="M15.85 2.1a1 1 0 0 1 1.414 0l14.142 14.143a1 1 0 0 1 0 1.414L17.264 31.799a1 1 0 0 1-1.415 0L1.707 17.657a1 1 0 0 1 0-1.414L15.85 2.1Z"
      fill="#C8E2FB"
      stroke="#3A8DDB"
      strokeWidth={2}
    />
  </svg>
);
export default SvgWaypointIcon;
