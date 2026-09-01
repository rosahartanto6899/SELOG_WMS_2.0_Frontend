import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgUserSquare = ({
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
      d="M6.857 9.429a5.143 5.143 0 1 1 10.286 0 5.143 5.143 0 0 1-10.286 0ZM12 6a3.429 3.429 0 1 0 0 6.857A3.429 3.429 0 0 0 12 6Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.583 24H21.43A2.571 2.571 0 0 0 24 21.429V2.57A2.571 2.571 0 0 0 21.429 0H2.57A2.571 2.571 0 0 0 0 2.571V21.43A2.571 2.571 0 0 0 2.571 24h1.012ZM1.714 2.571c0-.473.384-.857.857-.857H21.43c.473 0 .857.384.857.857V21.43a.857.857 0 0 1-.857.857h-.355a9.428 9.428 0 0 0-18.148 0h-.355a.857.857 0 0 1-.857-.857V2.57Zm17.562 19.715H4.724a7.714 7.714 0 0 1 14.552 0Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgUserSquare;
