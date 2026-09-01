import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgMarkerStartJourneyIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 19 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="'fms-icon'"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path d="M7.996 17h3v6a1.5 1.5 0 0 1-3 0v-6Z" fill="#fff" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.996 17v6a1.5 1.5 0 0 0 3 0v-6h-3Z"
      fill="#0EC642"
    />
    <path d="M16.996 9.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" fill="#fff" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.496 3.5a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm-9 6a9 9 0 1 1 18 0 9 9 0 0 1-18 0Z"
      fill="#0EC642"
    />
  </svg>
);
export default SvgMarkerStartJourneyIcon;
