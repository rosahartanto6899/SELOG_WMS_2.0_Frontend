import * as React from "react";
import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgCrossIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 15 15"
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
      d="M7.582 14.5a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm2.474-8.766a.5.5 0 1 0-.708-.708L7.582 6.793 5.816 5.026a.5.5 0 0 0-.708.708L6.875 7.5 5.108 9.266a.5.5 0 0 0 .708.708l1.766-1.767 1.766 1.767a.5.5 0 0 0 .708-.708L8.289 7.5l1.767-1.766Z"
      fill="#F52C48"
    />
  </svg>
);
export default SvgCrossIcon;
