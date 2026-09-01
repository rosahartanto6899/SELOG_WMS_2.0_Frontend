import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgAvailableVehicle = ({
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
    <g
      clipPath="url(#available-vehicle_svg__a)"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="currentColor"
    >
      <path d="M1.5 6a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 9.5v-3A1.5 1.5 0 0 1 1.5 5h7.75a.5.5 0 0 1 0 1H1.5Z" />
      <path d="M2 8a1 1 0 1 1 2 0 1 1 0 0 1-2 0ZM2.485 1.33a.5.5 0 0 1 .47-.33h5.09a.5.5 0 0 1 .47.33l1.455 4A.5.5 0 0 1 9.5 6h-8a.5.5 0 0 1-.47-.67l1.455-4Zm.82.67L2.214 5h6.572l-1.09-3H3.304ZM1.5 10a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2a.5.5 0 0 1 .5-.5ZM10.5 8a2.5 2.5 0 1 0 2.5 2.5.5.5 0 0 1 1 0 3.5 3.5 0 1 1-.891-2.333.5.5 0 0 1-.745.666A2.492 2.492 0 0 0 10.5 8Z" />
      <path d="M13.8 7.1a.5.5 0 0 1 .1.7l-3 4a.5.5 0 0 1-.754.054l-1.5-1.5a.5.5 0 0 1 .708-.708l1.092 1.093L13.1 7.2a.5.5 0 0 1 .7-.1Z" />
    </g>
    <defs>
      <clipPath id="available-vehicle_svg__a">
        <path fill="#fff" d="M0 0h14v14H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgAvailableVehicle;
