import * as React from "react";
import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const StartPoint = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="14"
    height="16"
    viewBox="0 0 27 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="sera-icon"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <g filter="url(#filter0_d_3078_712)">
      <path
        d="M15.5 18.5H18.5V24.5C18.5 25.3284 17.8284 26 17 26C16.1716 26 15.5 25.3284 15.5 24.5V18.5Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.5 18.5V24.5C15.5 25.3284 16.1716 26 17 26C17.8284 26 18.5 25.3284 18.5 24.5V18.5H15.5Z"
        fill="#0EC642"
      />
      <path
        d="M24.5 11C24.5 15.1421 21.1421 18.5 17 18.5C12.8579 18.5 9.5 15.1421 9.5 11C9.5 6.85786 12.8579 3.5 17 3.5C21.1421 3.5 24.5 6.85786 24.5 11Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17 5C13.6863 5 11 7.68629 11 11C11 14.3137 13.6863 17 17 17C20.3137 17 23 14.3137 23 11C23 7.68629 20.3137 5 17 5ZM8 11C8 6.02944 12.0294 2 17 2C21.9706 2 26 6.02944 26 11C26 15.9706 21.9706 20 17 20C12.0294 20 8 15.9706 8 11Z"
        fill="#0EC642"
      />
    </g>
  </svg>
);

export default StartPoint;
