import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgPopupIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="fms-icon"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      d="M1.146 1.146A.5.5 0 0 1 1.5 1H6a.5.5 0 0 0 0-1H1.5A1.5 1.5 0 0 0 0 1.5v11A1.5 1.5 0 0 0 1.5 14h11a1.5 1.5 0 0 0 1.5-1.5V8a.5.5 0 0 0-1 0v4.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .146-.354Z"
      fill="#3A8DDB"
    />
    <path
      d="M9.5.5A.5.5 0 0 1 10 0h3.5a.5.5 0 0 1 .5.5V4a.5.5 0 0 1-1 0V1.707L7.354 7.353a.5.5 0 0 1-.708-.707L12.293 1H10a.5.5 0 0 1-.5-.5Z"
      fill="#3A8DDB"
    />
  </svg>
);

export default SvgPopupIcon;
