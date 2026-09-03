import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgTruckLoadingIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1.25em"
    height="1.25em"
    viewBox="0 0 24 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="sera-icon"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <rect
      x="2"
      y="8"
      width="11"
      height="7"
      rx="1"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M13 10.5H16.7208C17.1276 10.5 17.5057 10.7101 17.7211 11.0553L19.2003 13.4285C19.3255 13.6289 19.3917 13.8604 19.3917 14.0966V15H13"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="6" cy="17" r="1.8" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="16.5" cy="17" r="1.8" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M7.8 17H4.2M18.3 17H14.9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <rect
      x="4.5"
      y="1"
      width="6"
      height="6"
      rx="0.8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M4.5 4H10.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M7.5 7V9.5M7.5 9.5L6 8M7.5 9.5L9 8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default SvgTruckLoadingIcon;
