import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgFileCopiedIcon = ({
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
    role="img"
    className="fms-icon"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.572 0a2.571 2.571 0 0 0-2.571 2.571v14.572a2.571 2.571 0 0 0 2.571 2.571h11.143a2.571 2.571 0 0 0 2.571-2.571V6a.857.857 0 0 0-.25-.606L16.891.25A.857.857 0 0 0 16.286 0H8.572Zm-.606 1.965a.857.857 0 0 1 .606-.25h7.36l4.64 4.64v10.788a.857.857 0 0 1-.857.857H8.572a.857.857 0 0 1-.857-.857V2.57c0-.227.09-.445.25-.606Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.43 6a.857.857 0 0 0-1.715 0v15.429A2.571 2.571 0 0 0 4.286 24h12a.857.857 0 0 0 0-1.714h-12a.857.857 0 0 1-.857-.857V6Z"
      fill="currentColor"
    />
  </svg>
);
export default SvgFileCopiedIcon;
