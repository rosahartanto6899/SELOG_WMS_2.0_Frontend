import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgLoadingIcon = ({
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
    className="'fms-icon'"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.463 0a1.5 1.5 0 0 1 1.255.74l2.2 3.487A.498.498 0 0 1 14 4.5v8a1.5 1.5 0 0 1-1.5 1.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 0 .5-.5V5H1v7.5a.5.5 0 0 0 .5.5h2a.5.5 0 0 1 0 1h-2A1.5 1.5 0 0 1 0 12.5v-8c0-.1.03-.195.081-.273L2.282.74A1.5 1.5 0 0 1 3.537 0L3.55 0h6.913ZM6.5 1H3.558a.5.5 0 0 0-.425.267L1.407 4H6.5V1Zm1 3V1h2.942a.5.5 0 0 1 .425.267L12.593 4H7.5Z"
      fill="#F47920"
    />
    <path
      d="m7.252 9.118 1.78 1.78a.356.356 0 1 1-.503.504L7.356 10.23v3.414a.356.356 0 0 1-.712 0v-3.415L5.47 11.402a.356.356 0 0 1-.504-.503l1.781-1.781a.355.355 0 0 1 .499-.005l.005.005Z"
      fill="#F47920"
    />
  </svg>
);
export default SvgLoadingIcon;
