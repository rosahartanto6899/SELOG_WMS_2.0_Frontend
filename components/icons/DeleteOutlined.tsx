import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgDeleteOutlined = ({
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
    className="fms-icon"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      d="M4.714 4.286c.237 0 .429.192.429.428V9.43a.429.429 0 1 1-.857 0V4.714c0-.236.192-.428.428-.428ZM7.714 4.714a.429.429 0 1 0-.857 0V9.43a.429.429 0 1 0 .857 0V4.714Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.429 2.571a2.571 2.571 0 0 1 5.142 0h2.572a.429.429 0 0 1 0 .858h-.857v7.285A1.285 1.285 0 0 1 9 12H3a1.286 1.286 0 0 1-1.286-1.286V3.43H.857a.429.429 0 0 1 0-.858H3.43ZM4.788 1.36a1.714 1.714 0 0 1 2.926 1.212H4.286c0-.454.18-.89.502-1.212ZM2.57 3.43v7.285a.428.428 0 0 0 .429.429h6a.429.429 0 0 0 .429-.429V3.43H2.57Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgDeleteOutlined;
