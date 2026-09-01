import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgZoomOutIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="fms-icon"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path d="M3.5 5.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5Z" fill="#3A8DDB" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.92 11.84a5.896 5.896 0 0 0 3.818-1.395l3.408 3.409a.5.5 0 0 0 .708-.708l-3.41-3.408A5.92 5.92 0 1 0 5.92 11.84ZM5.92 1a4.92 4.92 0 1 0 3.438 8.44.502.502 0 0 1 .081-.082A4.92 4.92 0 0 0 5.92 1Z"
      fill="#3A8DDB"
    />
  </svg>
);

export default SvgZoomOutIcon;
