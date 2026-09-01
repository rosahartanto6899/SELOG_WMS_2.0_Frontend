import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgSupport = ({
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
      d="M8 1.143a6.857 6.857 0 1 0 0 13.714A6.857 6.857 0 0 0 8 1.143ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.223 5.165a1.143 1.143 0 0 0-1.366 1.12.571.571 0 1 1-1.143 0A2.286 2.286 0 1 1 8.571 8.5v.644a.571.571 0 0 1-1.142 0V8c0-.316.255-.571.571-.571a1.143 1.143 0 0 0 .223-2.264Z"
      fill="currentColor"
    />
    <path
      d="M8 10.857a.857.857 0 1 1 0 1.714.857.857 0 0 1 0-1.714Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgSupport;
