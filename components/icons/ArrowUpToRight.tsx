import * as React from "react";
import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const ArrowUpToRight = ({
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
      d="M12.4748 13.5469C12.2569 13.7701 11.9037 13.7701 11.6858 13.5469C11.4679 13.3238 11.4679 12.9619 11.6858 12.7388L14.081 10.2857H5.38487C4.05306 10.2857 2.7758 9.74387 1.83407 8.7794C0.89234 7.81493 0.363281 6.50682 0.363281 5.14285V2.85714C0.363281 2.54154 0.613086 2.28571 0.921235 2.28571C1.22938 2.28571 1.47919 2.54154 1.47919 2.85714V5.14285C1.47919 6.20372 1.89068 7.22113 2.62314 7.97128C3.35559 8.72142 4.34902 9.14285 5.38487 9.14285H14.081L11.6858 6.68977C11.4679 6.46661 11.4679 6.1048 11.6858 5.88165C11.9037 5.65849 12.2569 5.65849 12.4748 5.88165L15.8226 9.31022C16.0405 9.53337 16.0405 9.89518 15.8226 10.1183L12.4748 13.5469Z"
      fill="currentColor"
    />
  </svg>
);

export default ArrowUpToRight;
