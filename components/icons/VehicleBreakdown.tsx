import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgVehicleBreakdown = ({
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
      d="M3.429 12.714a1.714 1.714 0 1 1 3.428 0 1.714 1.714 0 0 1-3.428 0ZM12 12.714a1.714 1.714 0 1 1 3.429 0 1.714 1.714 0 0 1-3.429 0ZM4.26 1.279a.857.857 0 0 1 .805-.565h8.727c.36 0 .683.226.806.565l2.493 6.857a.857.857 0 0 1-.805 1.15H2.57a.857.857 0 0 1-.805-1.15l2.493-6.857Zm1.405 1.15-1.87 5.143h11.267l-1.87-5.143H5.665ZM2.571 16.143c.474 0 .858.384.858.857v3.429a.857.857 0 1 1-1.715 0V17c0-.473.384-.857.857-.857ZM13.714 17.857a1.714 1.714 0 1 0 0 3.429 1.714 1.714 0 0 0 0-3.429Zm-3.428 1.715a3.429 3.429 0 1 1 6.857 0 3.429 3.429 0 0 1-6.857 0ZM17.143 12.714a3.429 3.429 0 0 1 3.428-3.428V11a1.714 1.714 0 1 0 1.715 1.714H24a3.429 3.429 0 0 1-6.857 0Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19.035 14.251a.857.857 0 0 1 0 1.212l-2.572 2.572a.857.857 0 1 1-1.212-1.212l2.572-2.572a.857.857 0 0 1 1.212 0Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgVehicleBreakdown;
