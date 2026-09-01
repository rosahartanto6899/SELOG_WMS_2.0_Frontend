import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgTriangleWarningFilledIcon = ({
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
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7 .006a1.5 1.5 0 0 0-1.334.816L.164 11.826A1.5 1.5 0 0 0 1.499 14h11.003a1.5 1.5 0 0 0 1.335-2.175L8.338.826 8.336.822A1.5 1.5 0 0 0 7 .006ZM7.5 5a.5.5 0 1 0-1 0v3a.5.5 0 0 0 1 0V5ZM7 10a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgTriangleWarningFilledIcon;
