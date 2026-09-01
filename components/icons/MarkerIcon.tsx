import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgMarkerIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 46 46"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="fms-icon"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M24.317 45.34a1.644 1.644 0 0 1-2.632 0l-.012-.015-.033-.044-.127-.172c-.11-.15-.272-.369-.476-.65-.41-.563-.993-1.374-1.692-2.373a170.017 170.017 0 0 1-5.133-7.76c-1.866-3.007-3.752-6.306-5.178-9.393-1.397-3.025-2.462-6.074-2.462-8.504a16.428 16.428 0 1 1 32.857 0c0 2.43-1.065 5.48-2.461 8.504-1.426 3.087-3.313 6.386-5.178 9.394a169.925 169.925 0 0 1-5.133 7.76 164.93 164.93 0 0 1-2.169 3.022l-.127.172-.033.044-.011.015Zm-1.316-32.197a3.286 3.286 0 1 0 0 6.571 3.286 3.286 0 0 0 0-6.571Z"
      fill="#3A8DDB"
    />
  </svg>
);

export default SvgMarkerIcon;
