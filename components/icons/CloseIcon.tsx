import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgCloseIcon = ({
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
      d="M15.833.975a.571.571 0 1 0-.809-.808L8 7.192.975.167a.571.571 0 1 0-.808.808L7.192 8 .167 15.024a.571.571 0 1 0 .808.809L8 8.808l7.024 7.025a.571.571 0 1 0 .809-.809L8.808 8 15.833.975Z"
      fill="currentColor"
      fillOpacity={0.25}
    />
  </svg>
);

export default SvgCloseIcon;
