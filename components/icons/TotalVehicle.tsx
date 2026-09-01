import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgTotalVehicle = ({
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
      d="M1.5 6a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-8ZM0 6.5A1.5 1.5 0 0 1 1.5 5h8A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-8A1.5 1.5 0 0 1 0 9.5v-3ZM11.75 5.5a.5.5 0 0 1 .5-.5h.25A1.5 1.5 0 0 1 14 6.5v3a1.5 1.5 0 0 1-1.5 1.5h-.25a.5.5 0 0 1 0-1h.25a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-.25a.5.5 0 0 1-.5-.5Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 8a1 1 0 1 1 2 0 1 1 0 0 1-2 0ZM2.485 1.33a.5.5 0 0 1 .47-.33h5.09a.5.5 0 0 1 .47.33l1.455 4A.5.5 0 0 1 9.5 6h-8a.5.5 0 0 1-.47-.67l1.455-4Zm.82.67L2.214 5h6.572l-1.09-3H3.304ZM7 8a1 1 0 1 1 2 0 1 1 0 0 1-2 0ZM9.5 10a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2a.5.5 0 0 1 .5-.5ZM9.273 1.5a.5.5 0 0 1 .5-.5h1.273a.5.5 0 0 1 .47.33l1.454 4a.5.5 0 0 1-.47.67h-1a.5.5 0 0 1 0-1h.286l-1.09-3h-.923a.5.5 0 0 1-.5-.5ZM1.5 10a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2a.5.5 0 0 1 .5-.5ZM12.5 10a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2a.5.5 0 0 1 .5-.5Z"
      fill="currentColor"
    />
  </svg>
);
export default SvgTotalVehicle;
