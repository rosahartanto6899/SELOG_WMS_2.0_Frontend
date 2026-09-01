import * as React from "react";
import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const ArrowLeftAlt = ({
  title,
  titleId,
  className,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 14 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`sera-icon ${className}`}
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.87799 0.167039C9.10133 0.390014 9.10163 0.751823 8.87865 0.975161L1.86523 8L8.87865 15.0248C9.10163 15.2482 9.10133 15.61 8.87799 15.833C8.65465 16.0559 8.29285 16.0556 8.06987 15.8323L1.05813 8.80915C0.950243 8.70589 0.864063 8.58207 0.804704 8.44495C0.743896 8.30449 0.712524 8.15306 0.712524 8C0.712524 7.84694 0.743896 7.69551 0.804704 7.55505C0.864063 7.41793 0.950243 7.29411 1.05813 7.19085L8.06987 0.167697C8.29285 -0.0556418 8.65465 -0.0559362 8.87799 0.167039Z"
      fill="currentColor"
      fillOpacity="0.85"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.7143 0C13.0299 0 13.2857 0.255837 13.2857 0.571429V15.4286C13.2857 15.7442 13.0299 16 12.7143 16C12.3987 16 12.1428 15.7442 12.1428 15.4286V0.571429C12.1428 0.255837 12.3987 0 12.7143 0Z"
      fill="currentColor"
      fillOpacity="0.85"
    />
  </svg>
);

export default ArrowLeftAlt;
