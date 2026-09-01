import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgClockIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 21 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    className="fms-icon"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.115 6.429a.714.714 0 0 0-1.429 0V10c0 .17.061.336.172.465l3.629 4.229a.714.714 0 1 0 1.084-.93l-3.456-4.028V6.429Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.4 0C4.878 0 .4 4.477.4 10s4.478 10 10 10c5.523 0 10-4.477 10-10s-4.477-10-10-10ZM1.83 10a8.571 8.571 0 1 1 17.143 0 8.571 8.571 0 0 1-17.143 0Z"
      fill="currentColor"
    />
  </svg>
);
export default SvgClockIcon;
