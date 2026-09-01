import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgStockManagement = ({
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
      d="M9.143 12.571c0-.315.256-.571.571-.571h2.857a.571.571 0 1 1 0 1.143H9.714a.571.571 0 0 1-.571-.572Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="m.065 4.877 1.65-3.298A2.857 2.857 0 0 1 4.27 0h7.46c1.082 0 2.072.611 2.556 1.58l1.649 3.297c.04.076.063.162.065.253V14.286c0 .947-.768 1.714-1.714 1.714H1.714A1.714 1.714 0 0 1 0 14.286V5.139M2.736 2.09c.29-.58.884-.947 1.534-.947h3.159V4.57H1.496l1.24-2.48Zm11.768 2.481-1.24-2.48a1.714 1.714 0 0 0-1.534-.948H8.571V4.57h5.933ZM1.143 5.714v8.572c0 .315.256.571.571.571h12.572a.571.571 0 0 0 .571-.571V5.714H1.143Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgStockManagement;
