import * as React from "react";
import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgStartRentalFlagIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="fms-icon"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      d="M14.273 21.175h3.45v6.9a1.725 1.725 0 1 1-3.45 0v-6.9Z"
      fill="#fff"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.273 21.175v6.9a1.725 1.725 0 1 0 3.45 0v-6.9h-3.45Z"
      fill="#0EC642"
    />
    <path
      d="M24.623 12.55a8.625 8.625 0 1 1-17.25 0 8.625 8.625 0 0 1 17.25 0Z"
      fill="#fff"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.998 5.65a6.9 6.9 0 1 0 0 13.8 6.9 6.9 0 0 0 0-13.8Zm-10.35 6.9c0-5.716 4.634-10.35 10.35-10.35 5.717 0 10.35 4.634 10.35 10.35 0 5.716-4.633 10.35-10.35 10.35-5.716 0-10.35-4.634-10.35-10.35Z"
      fill="#0EC642"
    />
  </svg>
);
export default SvgStartRentalFlagIcon;
