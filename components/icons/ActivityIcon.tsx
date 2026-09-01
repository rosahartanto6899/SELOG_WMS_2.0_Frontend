import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgActivityIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 20"
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
      d="M11.37.327a1.196 1.196 0 0 1 0 1.581L3.84 10.17.298 6.284a1.196 1.196 0 0 1 0-1.58.956.956 0 0 1 1.441 0L3.84 7.007 9.93.328a.956.956 0 0 1 1.44 0ZM11.37 10.158a1.196 1.196 0 0 1 0 1.58L3.84 20 .298 16.114a1.196 1.196 0 0 1 0-1.58.956.956 0 0 1 1.441 0l2.101 2.305 6.09-6.681a.956.956 0 0 1 1.44 0ZM13.812 5.662c0-.618.456-1.118 1.019-1.118h8.15c.563 0 1.019.5 1.019 1.118 0 .617-.456 1.117-1.019 1.117h-8.15c-.563 0-1.02-.5-1.02-1.117ZM13.812 15.492c0-.617.456-1.118 1.019-1.118h8.15c.563 0 1.019.5 1.019 1.118 0 .617-.456 1.118-1.019 1.118h-8.15c-.563 0-1.02-.5-1.02-1.118Z"
      fill="currentColor"
    />
  </svg>
);
export default SvgActivityIcon;
