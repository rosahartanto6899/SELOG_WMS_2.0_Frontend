import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgAddDetailsIcon = ({
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
      d="M0 .571C0 .256.256 0 .571 0h1.143a.571.571 0 0 1 0 1.143H.571A.571.571 0 0 1 0 .57ZM0 4c0-.316.256-.571.571-.571h1.143a.571.571 0 0 1 0 1.142H.571A.571.571 0 0 1 0 4ZM0 7.429c0-.316.256-.572.571-.572h1.143a.571.571 0 0 1 0 1.143H.571A.571.571 0 0 1 0 7.429ZM3.429.571C3.429.256 3.684 0 4 0h9.143a.571.571 0 0 1 0 1.143H4A.571.571 0 0 1 3.429.57ZM3.429 4c0-.316.255-.571.571-.571h9.143a.571.571 0 0 1 0 1.142H4A.571.571 0 0 1 3.429 4ZM3.429 7.429c0-.316.255-.572.571-.572h2.286a.571.571 0 1 1 0 1.143H4a.571.571 0 0 1-.571-.571Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.429 16a4.571 4.571 0 1 0 0-9.143 4.571 4.571 0 0 0 0 9.143Zm-.572-6.286a.571.571 0 0 1 1.143 0v1.143h1.143a.572.572 0 0 1 0 1.143H12v1.143a.571.571 0 0 1-1.143 0V12H9.714a.571.571 0 1 1 0-1.143h1.143V9.714Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgAddDetailsIcon;
