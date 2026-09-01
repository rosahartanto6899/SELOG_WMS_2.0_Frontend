import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgCustomerOrder = ({
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
    className="fms-icon"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      d="M4.142 5.714a.571.571 0 1 0 0 1.143h5.715a.571.571 0 1 0 0-1.143H4.142ZM3.571 9.143c0-.316.256-.572.571-.572h5.715a.571.571 0 0 1 0 1.143H4.142a.571.571 0 0 1-.571-.571ZM4.142 11.429a.571.571 0 1 0 0 1.142h5.715a.571.571 0 1 0 0-1.142H4.142Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.285 0C4.54 0 3.904.477 3.67 1.143h-1.24A1.714 1.714 0 0 0 .713 2.857v11.429A1.714 1.714 0 0 0 2.428 16h9.143a1.714 1.714 0 0 0 1.714-1.714V2.857a1.714 1.714 0 0 0-1.714-1.714h-1.24A1.715 1.715 0 0 0 8.714 0H5.285Zm0 1.143a.571.571 0 0 0-.571.571v.572c0 .315.256.571.571.571h3.429a.571.571 0 0 0 .571-.571v-.572a.571.571 0 0 0-.571-.571H5.285ZM8.714 4c.947 0 1.714-.768 1.714-1.714h1.143a.572.572 0 0 1 .571.571v11.429a.572.572 0 0 1-.571.571H2.428a.572.572 0 0 1-.571-.571V2.857a.571.571 0 0 1 .571-.571h1.143C3.571 3.232 4.339 4 5.285 4h3.429Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCustomerOrder;
