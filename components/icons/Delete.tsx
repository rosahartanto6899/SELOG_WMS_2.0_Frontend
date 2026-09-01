import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgDelete = ({
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
      d="M4.571 3.429a3.429 3.429 0 1 1 6.857 0h3.429a.571.571 0 0 1 0 1.142h-1.143v9.715A1.714 1.714 0 0 1 12 16H4a1.714 1.714 0 0 1-1.714-1.714V4.57H1.143a.571.571 0 1 1 0-1.142H4.57Zm1.813-1.617a2.286 2.286 0 0 1 3.902 1.617H5.714c0-.607.241-1.188.67-1.617Zm.473 4.474a.571.571 0 1 0-1.143 0v6.285a.571.571 0 1 0 1.143 0V6.286Zm2.857-.572c.316 0 .572.256.572.572v6.285a.572.572 0 0 1-1.143 0V6.286c0-.316.256-.572.571-.572Z"
      fill="currentColor"
      fillOpacity={0.85}
    />
  </svg>
);

export default SvgDelete;
