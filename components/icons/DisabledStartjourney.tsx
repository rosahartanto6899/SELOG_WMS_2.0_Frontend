import * as React from "react";
import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgDisabledStartjourney = ({
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
    className="'fms-icon'"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path d="M7 11h2v4a1 1 0 1 1-2 0v-4Z" fill="#fff" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7 11v4a1 1 0 1 0 2 0v-4H7Z"
      fill="#000"
      fillOpacity={0.25}
    />
    <path d="M13 6A5 5 0 1 1 3 6a5 5 0 0 1 10 0Z" fill="#fff" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM2 6a6 6 0 1 1 12 0A6 6 0 0 1 2 6Z"
      fill="#000"
      fillOpacity={0.25}
    />
  </svg>
);
export default SvgDisabledStartjourney;
