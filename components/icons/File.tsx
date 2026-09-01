import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgFile = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 22 24"
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
      d="M21.285 9.429v12A2.57 2.57 0 0 1 18.714 24H3.285a2.571 2.571 0 0 1-2.571-2.571V2.57A2.571 2.571 0 0 1 3.285 0h8.572c.236 0 .45.096.606.251l8.571 8.571c.155.156.251.37.251.607ZM2.68 1.965a.857.857 0 0 1 .606-.25H11v7.714c0 .473.383.857.857.857h7.714v11.143a.857.857 0 0 1-.857.857H3.285a.857.857 0 0 1-.857-.857V2.57c0-.227.09-.445.251-.606Zm10.035.961 5.645 5.645h-5.645V2.926Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgFile;
