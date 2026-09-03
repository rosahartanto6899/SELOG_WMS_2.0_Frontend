import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgTruckUnloadingIcon = ({
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
    {/* cargo bed with box already loaded */}
    <rect
      x="5"
      y="7"
      width="11"
      height="7"
      rx="1"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M8.5 7V4.5C8.5 3.94772 8.94772 3.5 9.5 3.5H11.5C12.0523 3.5 12.5 3.94772 12.5 4.5V7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* cab */}
    <path
      d="M16 9.5H19.7208C20.1276 9.5 20.5057 9.71014 20.7211 10.0553L22.2003 12.4285C22.3255 12.6289 22.3917 12.8604 22.3917 13.0966V14H16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* wheels */}
    <circle cx="9" cy="16" r="1.8" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="19.5" cy="16" r="1.8" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M10.8 16H17.9M21.3 16H20.2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* motion lines trailing behind */}
    <path
      d="M1.5 8.5H4M0.5 11H3.5M1.5 13.5H4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.6"
    />
  </svg>
);
export default SvgTruckUnloadingIcon;
