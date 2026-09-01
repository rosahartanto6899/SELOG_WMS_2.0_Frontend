import * as React from "react";
import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const BarChartOutlined = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="sera-icon"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.571429 0C0.255837 0 0 0.255837 0 0.571429V15.4286C0 15.7442 0.255837 16 0.571429 16H15.4286C15.7442 16 16 15.7442 16 15.4286C16 15.113 15.7442 14.8571 15.4286 14.8571H14.8571V4C14.8571 3.68441 14.6013 3.42857 14.2857 3.42857H9.71429C9.3987 3.42857 9.14286 3.68441 9.14286 4V6.85714H5.71429V0.571429C5.71429 0.255837 5.45845 0 5.14286 0H0.571429ZM9.14286 8H5.71429V14.8571H9.14286V8ZM13.7143 14.8571V4.57143H10.2857V14.8571H13.7143ZM4.57143 14.8571H1.14286V1.14286H4.57143V14.8571Z"
      fill="currentColor"
    />
  </svg>
);

export default BarChartOutlined;
