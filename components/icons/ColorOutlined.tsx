import * as React from "react";
import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgColorOutlined = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="fms-icon"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <g
      clipPath="url(#color-outlined_svg__a)"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="#3A8DDB"
    >
      <path d="M14.57 4.286a2.571 2.571 0 1 0 0 5.142 2.571 2.571 0 0 0 0-5.142Zm-.857 2.571a.857.857 0 1 1 1.714 0 .857.857 0 0 1-1.714 0ZM7.713 14.571a1.714 1.714 0 1 0 0 3.429 1.714 1.714 0 0 0 0-3.429ZM5.142 9.429a2.571 2.571 0 1 1 5.142 0 2.571 2.571 0 0 1-5.142 0Zm2.571-.858a.857.857 0 1 0 0 1.715.857.857 0 0 0 0-1.715Z" />
      <path d="M13.872.113A12 12 0 1 0 12.22 24a11.66 11.66 0 0 0 3.217-.444 2.4 2.4 0 0 0 1.736-2.583 2.571 2.571 0 0 0-1.701-2.244 2.572 2.572 0 0 1 .81-5.015h3.207a4.287 4.287 0 0 0 4.049-5.721 12 12 0 0 0-9.666-7.88Zm3.3 20.86.002.03-.005-.06.004.03ZM8.138 2.563a10.286 10.286 0 0 1 13.785 6.004A2.57 2.57 0 0 1 19.492 12h-3.206a4.286 4.286 0 0 0-1.368 8.35.858.858 0 0 1 .545.75l.005.06a.686.686 0 0 1-.495.746h-.003a9.942 9.942 0 0 1-2.746.38h-.002A10.285 10.285 0 0 1 8.137 2.562Z" />
    </g>
    <defs>
      <clipPath id="color-outlined_svg__a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgColorOutlined;
