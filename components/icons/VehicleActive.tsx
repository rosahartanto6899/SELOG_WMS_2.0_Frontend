import * as React from "react";
import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgVehicleActive = ({
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
      d="M20.427 4.761a.857.857 0 0 0-1.426-.95l-2.849 4.272-.975-.975a.857.857 0 0 0-1.212 1.212l1.715 1.715a.857.857 0 0 0 1.319-.131l3.428-5.143Z"
      fill="#fff"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.286 6.857a6.857 6.857 0 1 1 13.714 0 6.857 6.857 0 0 1-13.714 0Zm6.857-5.143a5.143 5.143 0 1 0 0 10.286 5.143 5.143 0 0 0 0-10.286Z"
      fill="#fff"
    />
    <path
      d="M3.454 4.078a.857.857 0 0 1 .832-.65h4.286a.857.857 0 0 1 0 1.715H4.955L3.67 10.286h4.902a.857.857 0 0 1 0 1.714H2.56a.857.857 0 0 0-.845.857V18c0 .473.384.857.857.857H15.43a.857.857 0 0 0 .857-.857v-2.571a.857.857 0 0 1 1.714 0V18a2.571 2.571 0 0 1-2.571 2.571v2.572a.857.857 0 0 1-1.715 0V20.57H3.43v2.572a.857.857 0 0 1-1.715 0v-2.718A2.572 2.572 0 0 1 0 18v-5.143c0-1.18.795-2.175 1.879-2.477l1.575-6.302Z"
      fill="#fff"
    />
    <path
      d="M5.143 13.714a1.714 1.714 0 1 0 0 3.429 1.714 1.714 0 0 0 0-3.429ZM12.857 13.714a1.714 1.714 0 1 0 0 3.429 1.714 1.714 0 0 0 0-3.429Z"
      fill="#fff"
    />
  </svg>
);
export default SvgVehicleActive;
