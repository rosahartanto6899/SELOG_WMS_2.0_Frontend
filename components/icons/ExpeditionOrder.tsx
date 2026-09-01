import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgExpeditionOrder = ({
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
      d="M8 1.143a6.857 6.857 0 1 0 0 13.714A6.857 6.857 0 0 0 8 1.143ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Z"
      fill="#3A8DDB"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.261 4.739c.153.153.207.38.138.585L9.114 12.18a.571.571 0 0 1-1.033.113l-1.64-2.735-2.735-1.64a.571.571 0 0 1 .113-1.033l6.857-2.285a.571.571 0 0 1 .585.138ZM5.36 7.578l1.792 1.075c.08.048.148.115.196.196l1.075 1.792 1.532-4.595-4.595 1.532Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgExpeditionOrder;
