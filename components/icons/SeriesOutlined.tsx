import * as React from "react";
import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgSeriesOutlined = ({
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
      clipPath="url(#series-outlined_svg__a)"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="#3A8DDB"
    >
      <path d="M1.714.857A.857.857 0 0 0 0 .857V18a.857.857 0 1 0 1.714 0V.857ZM6.857.857a.857.857 0 1 0-1.714 0V18a.857.857 0 1 0 1.714 0V.857ZM11.143 0c.473 0 .857.384.857.857V18a.857.857 0 0 1-1.714 0V.857c0-.473.383-.857.857-.857ZM19.714.857a.857.857 0 0 0-1.714 0V18a.857.857 0 0 0 1.714 0V.857ZM23.143 0c.473 0 .857.384.857.857V18a.857.857 0 0 1-1.714 0V.857c0-.473.383-.857.857-.857ZM.857 22.286a.857.857 0 0 0 0 1.714h22.286a.857.857 0 0 0 0-1.714H.857Z" />
    </g>
    <defs>
      <clipPath id="series-outlined_svg__a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgSeriesOutlined;
