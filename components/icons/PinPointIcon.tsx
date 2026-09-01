import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgPinPointIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 12 16"
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
      d="M6.457 15.77a.573.573 0 0 1-.915 0l-.004-.005-.012-.015-.044-.06a57.922 57.922 0 0 1-.754-1.052 59.135 59.135 0 0 1-1.786-2.698c-.648-1.046-1.305-2.194-1.8-3.268C.655 7.62.284 6.56.284 5.714a5.714 5.714 0 1 1 11.429 0c0 .846-.37 1.906-.857 2.958-.495 1.074-1.152 2.222-1.8 3.268a59.126 59.126 0 0 1-2.54 3.75l-.044.06-.012.015-.004.006ZM6 4.572a1.143 1.143 0 1 0 0 2.286 1.143 1.143 0 0 0 0-2.286Z"
      fill="#3A8DDB"
    />
  </svg>
);

export default SvgPinPointIcon;
