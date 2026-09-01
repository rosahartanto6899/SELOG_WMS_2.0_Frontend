import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgRestrictedAccessIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="101px"
    height="99px"
    viewBox="0 0 102 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    className="fms-icon"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      d="M51 99.5c25.129 0 45.5-3.582 45.5-8s-20.371-8-45.5-8-45.5 3.582-45.5 8 20.371 8 45.5 8Z"
      fill="#F5F5F7"
      fillOpacity={0.8}
    />
    <path
      d="M.5 21.5a4 4 0 0 1 4-4h93a4 4 0 0 1 4 4v51a4 4 0 0 1-4 4h-93a4 4 0 0 1-4-4v-51Z"
      fill="#DCE0E6"
    />
    <path
      d="M3.5 24.5a4 4 0 0 1 4-4h87a4 4 0 0 1 4 4v41a4 4 0 0 1-4 4h-87a4 4 0 0 1-4-4v-41Z"
      fill="#AEB8C2"
    />
    <path
      d="M15.5 4.5a4 4 0 0 1 4-4h63a4 4 0 0 1 4 4v65h-71v-65Z"
      fill="#F5F5F7"
    />
    <path
      d="M15.5 4.5a4 4 0 0 1 4-4h63a4 4 0 0 1 4 4v5h-71v-5Z"
      fill="#DCE0E6"
    />
    <path
      d="M21.5 5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM26.5 5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM31.5 5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
      fill="#F5F5F7"
    />
    <path
      d="M30.5 90.5a3 3 0 0 1 3-3h35a3 3 0 0 1 3 3v3h-41v-3ZM43.5 76.5h15v11h-15v-11ZM55.5 29a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0Z"
      fill="#DCE0E6"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M47 37.5c-8.008 0-14.5 6.492-14.5 14.5v1.5a2 2 0 0 0 2 2h18.338a9.955 9.955 0 0 1-1.338-5 10 10 0 0 1 5.546-8.956A14.452 14.452 0 0 0 47 37.5Z"
      fill="#DCE0E6"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M69.5 50.5a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-2 0a6 6 0 0 1-9.23 5.058l8.288-8.287c.596.932.942 2.04.942 3.229Zm-2.287-4.713a6 6 0 0 0-8.426 8.426l8.426-8.426Z"
      fill="#DCE0E6"
    />
  </svg>
);
export default SvgRestrictedAccessIcon;
