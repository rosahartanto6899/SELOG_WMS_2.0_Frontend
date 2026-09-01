import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgHistoryLogIcon = ({
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
      d="M4.143 0a.571.571 0 0 0 0 1.143h7.429a.571.571 0 0 1 .571.571v10.857a.572.572 0 0 0 1.143 0V1.714A1.714 1.714 0 0 0 11.572 0H4.143Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 5.714c0-.315.256-.571.572-.571h4.571a.571.571 0 1 1 0 1.143H3.572a.571.571 0 0 1-.571-.572ZM3.572 8a.571.571 0 0 0 0 1.143h4.571a.571.571 0 1 0 0-1.143H3.572ZM3 11.429c0-.316.256-.572.572-.572h2.286a.571.571 0 0 1 0 1.143H3.572a.571.571 0 0 1-.571-.571Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M.715 4c0-.947.767-1.714 1.714-1.714h6.857c.947 0 1.715.767 1.715 1.714v10.286C11 15.233 10.233 16 9.286 16H2.43a1.714 1.714 0 0 1-1.714-1.714V4Zm1.714-.571A.571.571 0 0 0 1.858 4v10.286c0 .315.256.571.571.571h6.857a.571.571 0 0 0 .572-.571V4a.571.571 0 0 0-.572-.571H2.43Z"
      fill="currentColor"
    />
  </svg>
);
export default SvgHistoryLogIcon;
