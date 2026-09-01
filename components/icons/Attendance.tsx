import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgAttendance = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="fms-icon"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      d="M4.571.571a.571.571 0 0 0-1.142 0v4.572a.571.571 0 0 0 1.142 0V3.429h5.143a.571.571 0 1 0 0-1.143H4.571V.57Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M.502 2.788a1.714 1.714 0 0 1 1.212-.502.571.571 0 0 1 0 1.143.571.571 0 0 0-.571.571v2.857h13.714V4a.572.572 0 0 0-.571-.571H12.57v1.714a.571.571 0 1 1-1.142 0V.57a.571.571 0 1 1 1.142 0v1.715h1.715A1.714 1.714 0 0 1 16 4v10.286A1.714 1.714 0 0 1 14.286 16H1.714A1.714 1.714 0 0 1 0 14.286V4c0-.455.18-.89.502-1.212Zm.64 11.498V8h13.715v6.286a.572.572 0 0 1-.571.571H1.714a.572.572 0 0 1-.571-.571Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgAttendance;
