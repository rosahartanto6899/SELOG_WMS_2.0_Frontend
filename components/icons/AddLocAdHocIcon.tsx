import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgAddLocAdHocIcon = ({
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
      d="M6 1.714a.857.857 0 0 0-.857.857V9.43a.857.857 0 0 1-1.714 0V2.57A2.571 2.571 0 0 1 6 0h8.571c.228 0 .446.09.607.251l8.57 8.571c.162.161.252.38.252.607v12A2.57 2.57 0 0 1 21.429 24h-8.572a.857.857 0 0 1 0-1.714h8.572a.857.857 0 0 0 .857-.857V9.784l-8.07-8.07H6Z"
      fill="#F6FAFD"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.571 0c.474 0 .858.384.858.857v7.714h7.714a.857.857 0 0 1 0 1.715H14.57a.857.857 0 0 1-.857-.857V.857c0-.473.384-.857.857-.857ZM6 12c.473 0 .857.384.857.857v10.286a.857.857 0 0 1-1.714 0V12.857c0-.473.384-.857.857-.857Z"
      fill="#F6FAFD"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 18c0-.473.384-.857.857-.857h10.286a.857.857 0 0 1 0 1.714H.857A.857.857 0 0 1 0 18Z"
      fill="#F6FAFD"
    />
  </svg>
);

export default SvgAddLocAdHocIcon;
