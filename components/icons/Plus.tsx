import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgPlus = ({
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
    className="fms-icon"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      d="M8.571.617a.571.571 0 0 0-1.142 0V7.43H.57a.571.571 0 1 0 0 1.142H7.43v6.903a.571.571 0 1 0 1.142 0V8.571h6.858a.571.571 0 1 0 0-1.142H8.57V.617Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgPlus;
