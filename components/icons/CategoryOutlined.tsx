import * as React from "react";
import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgCategoryOutlined = ({
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
      clipPath="url(#category-outlined_svg__a)"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="#3A8DDB"
    >
      <path d="M2.571 0A2.571 2.571 0 0 0 0 2.571v5.143a2.571 2.571 0 0 0 2.571 2.572h5.143a2.571 2.571 0 0 0 2.572-2.572V2.571A2.571 2.571 0 0 0 7.714 0H2.571Zm-.857 2.571c0-.473.384-.857.857-.857h5.143c.474 0 .857.384.857.857v5.143a.857.857 0 0 1-.857.857H2.571a.857.857 0 0 1-.857-.857V2.571ZM16.286 0a2.571 2.571 0 0 0-2.572 2.571v5.143a2.571 2.571 0 0 0 2.572 2.572h5.143A2.571 2.571 0 0 0 24 7.714V2.571A2.571 2.571 0 0 0 21.429 0h-5.143Zm-.857 2.571c0-.473.383-.857.857-.857h5.143c.473 0 .857.384.857.857v5.143a.857.857 0 0 1-.857.857h-5.143a.857.857 0 0 1-.857-.857V2.571ZM0 16.286a2.571 2.571 0 0 1 2.571-2.572h5.143a2.571 2.571 0 0 1 2.572 2.572v5.143A2.571 2.571 0 0 1 7.714 24H2.571A2.571 2.571 0 0 1 0 21.429v-5.143Zm2.571-.857a.857.857 0 0 0-.857.857v5.143c0 .473.384.857.857.857h5.143a.857.857 0 0 0 .857-.857v-5.143a.857.857 0 0 0-.857-.857H2.571ZM16.286 13.714a2.571 2.571 0 0 0-2.572 2.572v5.143A2.571 2.571 0 0 0 16.286 24h5.143A2.571 2.571 0 0 0 24 21.429v-5.143a2.571 2.571 0 0 0-2.571-2.572h-5.143Zm-.857 2.572c0-.474.383-.857.857-.857h5.143c.473 0 .857.383.857.857v5.143a.857.857 0 0 1-.857.857h-5.143a.857.857 0 0 1-.857-.857v-5.143Z" />
    </g>
    <defs>
      <clipPath id="category-outlined_svg__a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgCategoryOutlined;
