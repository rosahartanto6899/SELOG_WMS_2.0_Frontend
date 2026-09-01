import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgDetailOutlined = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="'fms-icon'"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M.983.983c.08-.08.19-.126.303-.126h3.857a.429.429 0 0 0 0-.857H1.286A1.286 1.286 0 0 0 0 1.286v9.428A1.286 1.286 0 0 0 1.286 12h9.428A1.286 1.286 0 0 0 12 10.714V6.857a.429.429 0 0 0-.857 0v3.857a.428.428 0 0 1-.429.429H1.286a.429.429 0 0 1-.429-.429V1.286c0-.114.045-.223.126-.303Z"
      fill="#3A8DDB"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.143.429c0-.237.192-.429.428-.429h3c.237 0 .429.192.429.429v3a.429.429 0 0 1-.857 0V1.463l-4.84 4.84a.429.429 0 0 1-.606-.606l4.84-4.84H8.57A.429.429 0 0 1 8.143.43Z"
      fill="#3A8DDB"
    />
  </svg>
);
export default SvgDetailOutlined;
