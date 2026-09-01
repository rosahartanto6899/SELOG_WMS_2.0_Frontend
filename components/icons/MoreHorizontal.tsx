import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgMoreHorizontal = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 4 14"
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
      d="M0 2a2 2 0 1 1 4 0 2 2 0 0 1-4 0ZM0 7a2 2 0 1 1 4 0 2 2 0 0 1-4 0ZM2 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgMoreHorizontal;
