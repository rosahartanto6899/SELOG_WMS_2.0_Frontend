import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgInsertIcon = ({
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
      d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16ZM8 4a1.143 1.143 0 1 0 0 2.286A1.143 1.143 0 0 0 8 4Zm.571 4A.571.571 0 0 0 7.43 8v4a.571.571 0 0 0 1.142 0V8Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgInsertIcon;
