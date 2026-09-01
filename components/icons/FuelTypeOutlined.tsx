import * as React from "react";
import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgFuelTypeOutlined = ({
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
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.571 4.286c0-.947.768-1.715 1.715-1.715h3.428c.947 0 1.715.768 1.715 1.715v.857c0 .947-.768 1.714-1.715 1.714h-3.428a1.714 1.714 0 0 1-1.715-1.714v-.857Zm5.143 0h-3.428v.857h3.428v-.857Z"
      fill="#3A8DDB"
    />
    <path
      d="m17.498 14.571 3.68 3.68a.857.857 0 1 1-1.213 1.212l-3.68-3.68-3.679 3.68a.857.857 0 1 1-1.212-1.212l3.68-3.68-3.68-3.68a.857.857 0 0 1 1.212-1.211l3.68 3.68 3.68-3.68a.857.857 0 0 1 1.211 1.212l-3.68 3.68Z"
      fill="#3A8DDB"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.178.251a.857.857 0 0 0-1.213 0L.251 1.965a.857.857 0 0 0 0 1.213L5.645 8.57l-.502.503c-.67.669-.67 1.754 0 2.424l.502.502-.251.251a.857.857 0 0 0-.251.606v10.286c0 .473.384.857.857.857h17.143a.857.857 0 0 0 .857-.857V2.57A2.571 2.571 0 0 0 21.429 0H14.57A2.571 2.571 0 0 0 12 2.571v3.074l-.502-.502a1.714 1.714 0 0 0-2.424 0l-.503.502L3.178.25Zm4.28 8.932.005-.005 1.715-1.715.005-.005 1.103-1.103.502.502-3.93 3.93-.503-.501 1.103-1.103Zm-.099-2.326L2.571 2.07l-.502.502L6.857 7.36l.502-.502Zm6.355-4.286c0-.473.384-.857.857-.857h6.858c.473 0 .857.384.857.857v19.715H6.857v-9.074l6.606-6.606A.857.857 0 0 0 13.714 6V2.571Z"
      fill="#3A8DDB"
    />
  </svg>
);
export default SvgFuelTypeOutlined;
