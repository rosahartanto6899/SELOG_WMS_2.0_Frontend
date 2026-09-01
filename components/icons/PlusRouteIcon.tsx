import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgPlusRouteIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 12 12"
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
      d="M6 3c.237 0 .429.192.429.429V5.57H8.57a.429.429 0 0 1 0 .858H6.43V8.57a.429.429 0 0 1-.858 0V6.43H3.43a.429.429 0 0 1 0-.858H5.57V3.43C5.571 3.192 5.763 3 6 3Z"
      fill="#3A8DDB"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 0a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3H3ZM.857 3C.857 1.817 1.817.857 3 .857h6c1.184 0 2.143.96 2.143 2.143v6c0 1.184-.96 2.143-2.143 2.143H3A2.143 2.143 0 0 1 .857 9V3Z"
      fill="#3A8DDB"
    />
  </svg>
);
export default SvgPlusRouteIcon;
