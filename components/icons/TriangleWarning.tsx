import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgTriangleWarning = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 16 16"
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
      d="M8 5.143c.316 0 .571.256.571.571v3.429a.571.571 0 0 1-1.142 0V5.714c0-.315.255-.571.571-.571ZM6.857 12.571a1.143 1.143 0 1 1 2.286 0 1.143 1.143 0 0 1-2.286 0Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.106.258a1.714 1.714 0 0 1 2.42.681l.002.005 6.285 12.57a1.717 1.717 0 0 1-.691 2.267 1.715 1.715 0 0 1-.835.219H1.713a1.715 1.715 0 0 1-1.527-2.485L6.474.94c.144-.28.363-.516.632-.68ZM8 1.15a.571.571 0 0 0-.508.308L1.208 14.027v.002a.571.571 0 0 0 .507.828h12.57a.571.571 0 0 0 .508-.828l-.001-.002L8.507 1.458A.571.571 0 0 0 8 1.15Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgTriangleWarning;
