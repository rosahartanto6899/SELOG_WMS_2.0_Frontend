import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
  fillIn?: string;
  fillOut?: string;
}
const SvgAttendanceData = ({
  title,
  titleId,
  fillIn,
  fillOut,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    {...props}
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="fms-icon"
    aria-labelledby={titleId}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <rect width={24} height={24} rx={12} fill={fillOut} />
    <g
      clipPath="url(#attendance-data_svg__a)"
      fillRule="evenodd"
      clipRule="evenodd"
      fill={fillIn}
    >
      <path d="M8.571 4.571a.571.571 0 0 0-1.142 0v4.572a.571.571 0 0 0 1.142 0V7.429h5.143a.571.571 0 0 0 0-1.143H8.571V4.57Z" />
      <path d="M4.502 6.788a1.714 1.714 0 0 1 1.212-.502.571.571 0 0 1 0 1.143.571.571 0 0 0-.571.571v2.857h13.714V8a.572.572 0 0 0-.571-.571H16.57v1.714a.571.571 0 1 1-1.142 0V4.57a.571.571 0 1 1 1.142 0v1.715h1.715A1.714 1.714 0 0 1 20 8v10.286A1.714 1.714 0 0 1 18.286 20H5.714A1.714 1.714 0 0 1 4 18.286V8c0-.455.18-.89.502-1.212Zm.64 11.498V12h13.715v6.286a.572.572 0 0 1-.571.571H5.714a.572.572 0 0 1-.571-.571Z" />
    </g>
    <defs>
      <clipPath id="attendance-data_svg__a">
        <path fill="#fff" transform="translate(4 4)" d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgAttendanceData;
