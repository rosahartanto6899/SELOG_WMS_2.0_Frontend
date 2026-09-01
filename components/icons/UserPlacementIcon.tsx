import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgUserPlacementIcon = ({
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
      d="M1.714 1.143a.571.571 0 0 0-.571.571V4A.571.571 0 0 1 0 4V1.714A1.714 1.714 0 0 1 1.714 0H4a.571.571 0 0 1 0 1.143H1.714ZM12 0a.571.571 0 1 0 0 1.143h2.286a.572.572 0 0 1 .571.571V4A.571.571 0 0 0 16 4V1.714A1.714 1.714 0 0 0 14.286 0H12ZM16 12a.571.571 0 1 0-1.143 0v2.286a.572.572 0 0 1-.571.571H12A.571.571 0 0 0 12 16h2.286A1.714 1.714 0 0 0 16 14.286V12ZM1.143 12A.571.571 0 0 0 0 12v2.286A1.714 1.714 0 0 0 1.714 16H4a.571.571 0 1 0 0-1.143H1.714a.572.572 0 0 1-.571-.571V12ZM5.143 5.143a2.857 2.857 0 1 1 5.714 0 2.857 2.857 0 0 1-5.714 0ZM12.427 12.571H3.573a4.573 4.573 0 0 1 8.854 0Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgUserPlacementIcon;
