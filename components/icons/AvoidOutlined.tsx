import * as React from "react";
import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgAvoidOutlined = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 17 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="fms-icon"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <g clipPath="url(#avoid-outlined_svg__a)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.615 13.595a.578.578 0 0 0 .123.123A8 8 0 0 0 14.051 2.405a.581.581 0 0 0-.123-.123A8 8 0 0 0 2.615 13.595ZM1.475 8a6.857 6.857 0 0 1 11.286-5.236l-9.664 9.664A6.83 6.83 0 0 1 1.476 8ZM13.57 3.572a6.857 6.857 0 0 1-9.664 9.664l9.664-9.664Z"
        fill="#212121"
      />
    </g>
    <defs>
      <clipPath id="avoid-outlined_svg__a">
        <path fill="#fff" transform="translate(.333)" d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgAvoidOutlined;
