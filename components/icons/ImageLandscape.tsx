import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgImageLandscape = ({
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
      d="M7.714 4.286a3.429 3.429 0 1 0 0 6.857 3.429 3.429 0 0 0 0-6.857ZM6 7.714a1.714 1.714 0 1 1 3.429 0 1.714 1.714 0 0 1-3.429 0Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M24 2.571V21.43A2.571 2.571 0 0 1 21.429 24H2.57A2.571 2.571 0 0 1 0 21.429V2.57A2.571 2.571 0 0 1 2.571 0H21.43A2.571 2.571 0 0 1 24 2.571ZM22.286 21.43a.857.857 0 0 1-.857.857H2.57a.857.857 0 0 1-.857-.857v-1.715h20.572v1.715Zm0-3.429H8.752l7.312-6.85a.86.86 0 0 0 .048.038l6.174 4.424V18ZM1.714 18h4.53l8.684-8.134a1.714 1.714 0 0 1 2.203-.056l5.155 3.693V2.57a.857.857 0 0 0-.857-.857H2.57a.857.857 0 0 0-.857.857V18Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgImageLandscape;
