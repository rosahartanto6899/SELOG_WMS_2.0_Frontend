import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgProduct = ({
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
      d="M.857 13.714a.857.857 0 1 0 0 1.715H6A3.429 3.429 0 0 1 9.32 18H5.143a.857.857 0 0 0 0 1.714h8.571a2.572 2.572 0 0 1 2.572 2.572H.857a.857.857 0 0 0 0 1.714h15.429A1.714 1.714 0 0 0 18 22.286 4.285 4.285 0 0 0 13.714 18h-2.643a5.135 5.135 0 0 0-1.434-2.78A5.141 5.141 0 0 0 6 13.715H.857Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.766.087a.857.857 0 0 1 .754 0l6 2.94c.294.143.48.442.48.769v7.837a.857.857 0 0 1-.48.77l-6 2.938a.857.857 0 0 1-.754 0l-6-2.939a.857.857 0 0 1-.48-.77V3.797c0-.327.186-.626.48-.77l6-2.939ZM12 5.17v5.928l4.286 2.1V7.268L12 5.17Zm6 2.1v5.927l4.286-2.099V5.17L18 7.27Zm3.194-3.474L17.143 5.78 13.09 3.796l4.052-1.984 4.051 1.984Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgProduct;
