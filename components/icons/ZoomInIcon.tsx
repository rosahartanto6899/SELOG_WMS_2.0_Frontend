import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgZoomInIcon = ({
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
    <path
      d="M6 3a.5.5 0 0 1 .5.5v2h2a.5.5 0 0 1 0 1h-2v2a.5.5 0 0 1-1 0v-2h-2a.5.5 0 0 1 0-1h2v-2A.5.5 0 0 1 6 3Z"
      fill="#3A8DDB"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.738 10.445a5.92 5.92 0 1 1 .707-.707l3.409 3.408a.5.5 0 0 1-.708.708l-3.408-3.41ZM1 5.92a4.92 4.92 0 1 1 8.44 3.438.502.502 0 0 0-.082.081A4.92 4.92 0 0 1 1 5.92Z"
      fill="#3A8DDB"
    />
  </svg>
);

export default SvgZoomInIcon;
