import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgMissingVehicle = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 14 14"
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
      d="M1.5 6a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 9.5v-3A1.5 1.5 0 0 1 1.5 5h7.75a.5.5 0 0 1 0 1H1.5Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 8a1 1 0 1 1 2 0 1 1 0 0 1-2 0ZM2.485 1.33a.5.5 0 0 1 .47-.33h5.09a.5.5 0 0 1 .47.33l1.455 4A.5.5 0 0 1 9.5 6h-8a.5.5 0 0 1-.47-.67l1.455-4Zm.82.67L2.214 5h6.572l-1.09-3H3.304ZM1.5 10a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2a.5.5 0 0 1 .5-.5ZM7 10.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0ZM10.5 8a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.854 8.146a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708l4-4a.5.5 0 0 1 .708 0Z"
      fill="currentColor"
    />
  </svg>
);
export default SvgMissingVehicle;
