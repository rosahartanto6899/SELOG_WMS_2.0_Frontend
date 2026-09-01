import * as React from "react";
import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgDisabledCheckpoint = ({
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
    <g
      clipPath="url(#disabled-checkpoint_svg__a)"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="#000"
      fillOpacity={0.25}
    >
      <path d="M10.876 7.83a.5.5 0 0 0-.752-.66l-3.195 3.652L5.3 9.6a.5.5 0 1 0-.6.8l2 1.5a.5.5 0 0 0 .676-.07l3.5-4Z" />
      <path d="M1 2.5v11A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-11A1.5 1.5 0 0 0 13.5 1h-11A1.5 1.5 0 0 0 1 2.5ZM2.5 2a.5.5 0 0 0-.5.5V4h12V2.5a.5.5 0 0 0-.5-.5h-11ZM14 13.5V5H2v8.5a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5Z" />
    </g>
    <defs>
      <clipPath id="disabled-checkpoint_svg__a">
        <path fill="#fff" transform="translate(1 1)" d="M0 0h14v14H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgDisabledCheckpoint;
