import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
  colorIcon?: string;
}
const SvgTriangleDangerIcon = ({
  colorIcon,
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
      d="M8 .008A1.714 1.714 0 0 0 6.474.94L.186 13.516a1.714 1.714 0 0 0 1.527 2.485H14.287a1.715 1.715 0 0 0 1.526-2.486L9.528.945 9.526.94A1.714 1.714 0 0 0 8 .008Zm.571 5.707a.571.571 0 0 0-1.143 0v3.429a.571.571 0 0 0 1.143 0V5.715ZM8 11.43a1.143 1.143 0 1 0 0 2.285 1.143 1.143 0 0 0 0-2.285Z"
      fill={colorIcon ?? "currentColor"}
    />
  </svg>
);
export default SvgTriangleDangerIcon;
