import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgLogisFile = ({
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
    className="'logis-icon'"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      d="M13.333 14.1667L7.49967 14.1667"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.333 10.8334L10.833 10.8334"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.083 11.6667C17.083 14.8094 17.083 16.3808 16.0457 17.3571C15.0083 18.3334 13.3388 18.3334 9.99967 18.3334H9.35574C6.63806 18.3334 5.27923 18.3334 4.33557 17.6685C4.06519 17.478 3.82516 17.2521 3.62276 16.9976C2.91634 16.1095 2.91634 14.8306 2.91634 12.2728V10.1516C2.91634 7.68225 2.91634 6.44759 3.30712 5.4615C3.93535 3.87623 5.26395 2.62578 6.94831 2.0345C7.99603 1.66671 9.30785 1.66671 11.9315 1.66671C13.4307 1.66671 14.1803 1.66671 14.779 1.87687C15.7415 2.21475 16.5007 2.92929 16.8597 3.83516C17.083 4.39864 17.083 5.10416 17.083 6.51519V11.6667Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M2.91667 10C2.91667 8.46588 4.16032 7.22222 5.69444 7.22222C6.24926 7.22222 6.90336 7.31944 7.4428 7.1749C7.9221 7.04647 8.29647 6.6721 8.4249 6.1928C8.56944 5.65336 8.47222 4.99926 8.47222 4.44444C8.47222 2.91032 9.71588 1.66667 11.25 1.66667"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default SvgLogisFile;
