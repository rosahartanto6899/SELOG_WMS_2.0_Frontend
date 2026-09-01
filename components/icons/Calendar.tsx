import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgCalendar = ({
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
      d="M6.857.857a.857.857 0 1 0-1.714 0v6.857a.857.857 0 0 0 1.714 0V5.143h7.714a.857.857 0 1 0 0-1.714H6.857V.857Z"
      fill="currentColor"
    />
    <path
      d="M2.571 3.429A2.571 2.571 0 0 0 0 6v15.429A2.571 2.571 0 0 0 2.571 24H21.43A2.57 2.57 0 0 0 24 21.429V6a2.571 2.571 0 0 0-2.571-2.571h-2.572V.857a.857.857 0 1 0-1.714 0v6.857a.857.857 0 1 0 1.714 0V5.143h2.572a.857.857 0 0 1 .857.857v15.429a.857.857 0 0 1-.857.857H2.57a.857.857 0 0 1-.857-.857V6a.857.857 0 0 1 .857-.857.857.857 0 0 0 0-1.714Z"
      fill="currentColor"
    />
    <path
      d="M4.286 12.857a1.714 1.714 0 1 1 3.428 0 1.714 1.714 0 0 1-3.428 0ZM12 11.143a1.714 1.714 0 1 0 0 3.428 1.714 1.714 0 0 0 0-3.428ZM16.286 12.857a1.714 1.714 0 1 1 3.428 0 1.714 1.714 0 0 1-3.428 0ZM6 16.286a1.714 1.714 0 1 0 0 3.428 1.714 1.714 0 0 0 0-3.428Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCalendar;
