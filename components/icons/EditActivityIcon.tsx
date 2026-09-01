import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgEditActivityIcon = ({
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
      d="M11.44-.006a1.5 1.5 0 0 0-1.064.443L4.647 6.146a.5.5 0 0 0-.14.273l-.5 3.04a.5.5 0 0 0 .582.573l3-.54a.5.5 0 0 0 .265-.14l5.708-5.727.001-.001a1.5 1.5 0 0 0 0-2.128v-.001L12.504.438V.437a1.5 1.5 0 0 0-1.065-.443Zm-.192 1.039a.5.5 0 0 1 .547.109l1.062 1.061v.002a.5.5 0 0 1 0 .71l-.001.002-5.6 5.619-2.148.386.36-2.182 5.615-5.596.002-.002a.5.5 0 0 1 .163-.11Z"
      fill="#3A8DDB"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.146 2.646A.5.5 0 0 1 1.5 2.5h3a.5.5 0 0 0 0-1h-3A1.5 1.5 0 0 0 0 3v9.5A1.5 1.5 0 0 0 1.5 14H11a1.5 1.5 0 0 0 1.5-1.5v-3a.5.5 0 0 0-1 0v3a.5.5 0 0 1-.5.5H1.5a.5.5 0 0 1-.5-.5V3a.5.5 0 0 1 .146-.354Z"
      fill="#3A8DDB"
    />
  </svg>
);
export default SvgEditActivityIcon;
