import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgSearch = ({
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
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.129 11.937a6.766 6.766 0 1 1 .808-.808l3.896 3.895a.571.571 0 1 1-.809.809l-3.895-3.896ZM1.143 6.766a5.623 5.623 0 1 1 9.645 3.93.587.587 0 0 0-.093.092 5.623 5.623 0 0 1-9.552-4.022Z"
      fill="currentColor"
      fillOpacity={0.85}
    />
  </svg>
);

export default SvgSearch;
