import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgSupportToolsIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1.25em"
    height="1.25em"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="sera-icon"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    {/* wrench, top-left to bottom-right */}
    <circle cx="5.5" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M7.6 7.6L17 17"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M15.3 15.3L17.5 13.1L19 14.6L16.8 16.8L15.3 15.3Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* screwdriver, bottom-left to top-right */}
    <rect
      x="2.3"
      y="16.5"
      width="5.5"
      height="3.4"
      rx="1"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      transform="rotate(-45 2.3 16.5)"
    />
    <path
      d="M8.8 15L16.5 7.3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M15.5 8.3L16.5 7.3L17.8 6L19 7.2L17.7 8.5L16.7 9.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default SvgSupportToolsIcon;
