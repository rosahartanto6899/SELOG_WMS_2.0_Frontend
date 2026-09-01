import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgDeleteCircleIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 20 20"
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
      d="M13.534 6.466a.714.714 0 0 1 0 1.01L11.01 10l2.524 2.524a.714.714 0 0 1-1.01 1.01L10 11.01l-2.523 2.524a.714.714 0 0 1-1.01-1.01L8.99 10 6.466 7.477a.714.714 0 1 1 1.01-1.01L10 8.99l2.524-2.524a.714.714 0 0 1 1.01 0Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0ZM1.429 10a8.571 8.571 0 1 1 17.142 0A8.571 8.571 0 0 1 1.43 10Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgDeleteCircleIcon;
