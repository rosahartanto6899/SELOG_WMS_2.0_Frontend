import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
  fillIn?: string;
  fillOut?: string;
}
const SvgVehicleData = ({
  title,
  titleId,
  fillIn,
  fillOut,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    {...props}
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="fms-icon"
    aria-labelledby={titleId}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <rect width={24} height={24} rx={12} fill={fillOut} />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.571 5.714a.571.571 0 1 0-1.142 0V7.43h-1.45a1.714 1.714 0 0 0-1.698 1.166l-.702 2.262H5.714A1.714 1.714 0 0 0 4 12.572v2.285a1.714 1.714 0 0 0 1.184 1.63 2.858 2.858 0 0 0 5.616.085h2.4a2.858 2.858 0 0 0 5.616-.084A1.713 1.713 0 0 0 20 14.858v-2.286a1.714 1.714 0 0 0-1.714-1.715h-1.302l-.75-2.26v-.002a1.714 1.714 0 0 0-1.699-1.166h-1.964V5.714Zm-.575 2.858h2.553l.03-.001a.571.571 0 0 1 .57.388l.88 2.65a.571.571 0 0 0 .542.391h1.715a.571.571 0 0 1 .571.572v2.285c0 .124-.04.244-.114.343a2.858 2.858 0 0 0-5.543.229h-2.4a2.858 2.858 0 0 0-5.543-.23.572.572 0 0 1-.114-.342v-2.285A.571.571 0 0 1 5.714 12H8c.25 0 .472-.163.546-.402l.82-2.644a.571.571 0 0 1 .6-.382h2.03ZM16 17.715a1.714 1.714 0 1 1 0-3.43 1.714 1.714 0 0 1 0 3.43Zm-8-3.43a1.714 1.714 0 1 1 0 3.43 1.714 1.714 0 0 1 0-3.43Z"
      fill={fillIn}
    />
  </svg>
);
export default SvgVehicleData;
