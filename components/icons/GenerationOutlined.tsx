import * as React from "react";
import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgGenerationOutlined = ({
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
    <g clipPath="url(#generation-outlined_svg__a)" fill="#3A8DDB">
      <path d="M6 .857a.857.857 0 0 0-1.714 0v4.286a.857.857 0 0 0 1.714 0v-.857h3.429a.857.857 0 1 0 0-1.715H6V.857Z" />
      <path d="M0 4.286C0 3.339.768 2.57 1.714 2.57h.857a.857.857 0 1 1 0 1.715h-.857v2.571H15.43V4.286h-2.572v.857a.857.857 0 1 1-1.714 0V.857a.857.857 0 1 1 1.714 0v1.714h2.572c.946 0 1.714.768 1.714 1.715v5.143a.857.857 0 0 1-1.714 0V8.57H1.714v7.715H3.43a.857.857 0 0 1 0 1.714H1.714A1.714 1.714 0 0 1 0 16.286v-12Z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.866 11.143c-.701 0-1.331.427-1.592 1.077L7.991 15.43H6.857c-.947 0-1.714.767-1.714 1.714v3.428c0 .947.767 1.715 1.714 1.715h1.004a2.572 2.572 0 0 0 4.85 0h3.721a2.572 2.572 0 0 0 4.85 0h1.004c.947 0 1.714-.768 1.714-1.715v-3.428c0-.947-.767-1.714-1.714-1.714h-1.134l-1.284-3.209a1.714 1.714 0 0 0-1.591-1.077h-7.411Zm1.845 9.428h3.721a2.573 2.573 0 0 1 4.85 0h1.004v-3.428H6.857v3.428h1.004a2.573 2.573 0 0 1 4.85 0ZM9.837 15.43l1.029-2.572h7.41l1.03 2.572H9.836Zm9.02 6.857a.857.857 0 1 1 0-1.715.857.857 0 0 1 0 1.715Zm-9.428-.857a.857.857 0 1 1 1.714 0 .857.857 0 0 1-1.714 0Z"
      />
    </g>
    <defs>
      <clipPath id="generation-outlined_svg__a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgGenerationOutlined;
