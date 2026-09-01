import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgTriggerIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 14 16"
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
      d="M8.878.167a.571.571 0 0 1 .001.808L1.866 8l7.013 7.025a.572.572 0 0 1-.809.807L1.06 8.81a1.12 1.12 0 0 1 0-1.618L8.07.168a.571.571 0 0 1 .808-.001ZM12.715 0c.315 0 .571.256.571.571V15.43a.571.571 0 0 1-1.143 0V.57c0-.315.256-.571.572-.571Z"
      fill="#000"
      fillOpacity={0.85}
    />
  </svg>
);
export default SvgTriggerIcon;
