import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgDataGraph = ({
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
      d="M5.143 4.286a.857.857 0 0 0 0 1.714H8.57a.857.857 0 0 0 0-1.714H5.143ZM4.286 9.429c0-.474.383-.858.857-.858h7.714a.857.857 0 1 1 0 1.715H5.143a.857.857 0 0 1-.857-.857ZM20.45 9.87a.857.857 0 0 0-1.47-.882l-4.712 7.852-5.271-3.013a.857.857 0 0 0-1.139.269L4.43 19.239a.857.857 0 1 0 1.426.95l2.985-4.476 5.305 3.031a.857.857 0 0 0 1.16-.303L20.45 9.87Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21.429 24A2.571 2.571 0 0 0 24 21.429V2.57A2.571 2.571 0 0 0 21.429 0H2.57A2.571 2.571 0 0 0 0 2.571V21.43A2.571 2.571 0 0 0 2.571 24H21.43Zm.857-2.571a.857.857 0 0 1-.857.857H2.57a.857.857 0 0 1-.857-.857V2.57c0-.473.384-.857.857-.857H21.43c.473 0 .857.384.857.857V21.43Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgDataGraph;
