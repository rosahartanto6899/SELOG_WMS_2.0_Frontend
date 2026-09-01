import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgVehicleOnContract = ({
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
      d="M2.571 9.286a.857.857 0 0 0-.857.857v5.143c0 .473.384.857.857.857H9.43a.857.857 0 0 1 0 1.714H2.57A2.571 2.571 0 0 1 0 15.286v-5.143A2.571 2.571 0 0 1 2.571 7.57h13.286a.857.857 0 1 1 0 1.715H2.571Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.429 12.714a1.714 1.714 0 1 1 3.428 0 1.714 1.714 0 0 1-3.428 0ZM4.26 1.279a.857.857 0 0 1 .805-.565h8.727c.36 0 .683.226.806.565l2.493 6.857a.857.857 0 0 1-.805 1.15H2.57a.857.857 0 0 1-.805-1.15l2.493-6.857Zm1.405 1.15-1.87 5.143h11.267l-1.87-5.143H5.665ZM2.571 16.143c.474 0 .858.384.858.857v3.429a.857.857 0 1 1-1.715 0V17c0-.473.384-.857.857-.857ZM12 13.572A2.571 2.571 0 0 1 14.571 11h6.858A2.571 2.571 0 0 1 24 13.572v6.857A2.571 2.571 0 0 1 21.429 23H14.57A2.571 2.571 0 0 1 12 20.43v-6.857Zm2.571-.858a.857.857 0 0 0-.857.857v6.858c0 .473.384.857.857.857h6.858a.857.857 0 0 0 .857-.857v-6.857a.857.857 0 0 0-.857-.858H14.57Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.429 15.286c0-.474.383-.857.857-.857h3.428a.857.857 0 0 1 0 1.714h-3.428a.857.857 0 0 1-.857-.857ZM15.429 18.714c0-.473.383-.857.857-.857h3.428a.857.857 0 0 1 0 1.715h-3.428a.857.857 0 0 1-.857-.858Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgVehicleOnContract;
