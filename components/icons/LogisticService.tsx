import * as React from "react";
import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgLogisticService = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 23"
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
      d="M9.429 12.783a.857.857 0 0 0 0 1.714h5.142a.857.857 0 0 0 0-1.714H9.43Z"
      fill="#fff"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 6.783c0 1.12.716 2.072 1.714 2.425v11.29a2.572 2.572 0 0 0 2.572 2.57h15.428a2.572 2.572 0 0 0 2.572-2.57V9.207A2.572 2.572 0 0 0 24 6.783V3.354A2.571 2.571 0 0 0 21.429.783H2.57A2.571 2.571 0 0 0 0 3.354v3.429Zm22.286-3.429a.857.857 0 0 0-.857-.857H2.57a.857.857 0 0 0-.857.857v3.429c0 .473.384.857.857.857H21.43a.857.857 0 0 0 .857-.857V3.354ZM3.429 20.497V9.354H20.57v11.143a.857.857 0 0 1-.857.857H4.286a.857.857 0 0 1-.857-.857Z"
      fill="#fff"
    />
  </svg>
);
export default SvgLogisticService;
