import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgIdHumanIcon = ({
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
      d="M2.571 1.714a.857.857 0 0 0-.857.857V6A.857.857 0 0 1 0 6V2.571A2.571 2.571 0 0 1 2.571 0H6a.857.857 0 1 1 0 1.714H2.571ZM18 0a.857.857 0 1 0 0 1.714h3.429a.857.857 0 0 1 .857.857V6A.857.857 0 0 0 24 6V2.571A2.571 2.571 0 0 0 21.429 0H18ZM24 18a.857.857 0 0 0-1.714 0v3.429a.857.857 0 0 1-.857.857H18A.857.857 0 0 0 18 24h3.429A2.57 2.57 0 0 0 24 21.429V18ZM1.714 18A.857.857 0 0 0 0 18v3.429A2.571 2.571 0 0 0 2.571 24H6a.857.857 0 0 0 0-1.714H2.571a.857.857 0 0 1-.857-.857V18ZM7.714 7.714a4.286 4.286 0 1 1 8.572 0 4.286 4.286 0 0 1-8.572 0ZM12 5.143a2.571 2.571 0 1 0 0 5.143 2.571 2.571 0 0 0 0-5.143ZM12 13.723a6.857 6.857 0 0 0-6.191 3.908.857.857 0 0 0 1.548.738 5.142 5.142 0 0 1 9.286 0 .857.857 0 0 0 1.548-.738A6.858 6.858 0 0 0 12 13.723Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgIdHumanIcon;
