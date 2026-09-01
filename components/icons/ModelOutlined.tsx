import * as React from "react";
import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgModelOutlined = ({
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
      d="M12.857.857a.857.857 0 1 0-1.714 0V3.43h-6A2.571 2.571 0 0 0 2.57 6v10.286H.857a.857.857 0 0 0 0 1.714h6.906l-3.318 4.645a.857.857 0 1 0 1.395.996L9.87 18h4.26l4.03 5.641a.857.857 0 1 0 1.395-.996L16.237 18h6.906a.857.857 0 0 0 0-1.714h-1.714V6a2.571 2.571 0 0 0-2.572-2.571h-6V.857Zm6.857 15.429V6a.857.857 0 0 0-.857-.857H5.143A.857.857 0 0 0 4.286 6v10.286h15.428Z"
      fill="#3A8DDB"
    />
  </svg>
);
export default SvgModelOutlined;
