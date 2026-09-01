import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgBookShelf = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
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
      d="M1.813 0A1.72 1.72 0 0 0 .086 1.714v20.572A1.72 1.72 0 0 0 1.813 24h4.318c.315 0 .61-.084.864-.23.254.146.548.23.863.23h4.318a1.72 1.72 0 0 0 1.727-1.714V8.927l3.429 13.6a1.728 1.728 0 0 0 2.095 1.246l3.35-.832a1.714 1.714 0 0 0 1.257-2.08l-.848-3.36a.86.86 0 0 0-.042-.17l-3.303-13.1a1.728 1.728 0 0 0-2.095-1.246l-3.35.832a1.723 1.723 0 0 0-.76.41 1.729 1.729 0 0 0-1.46-.798H7.858V1.714A1.72 1.72 0 0 0 6.131 0H1.813ZM21.28 17 18.165 4.648l-3.35.832 3.114 12.352 3.35-.832Zm-2.932 2.495.66 2.615 3.35-.832-.659-2.615-3.351.832ZM12.176 5.143v9.428H7.858V5.143h4.318Zm0 11.143H7.858v6h4.318v-6Zm-6.045 0H1.813V1.714h4.318v14.572ZM1.813 18v4.286h4.318V18H1.813Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgBookShelf;
