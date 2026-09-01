import * as React from "react";
import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgTransmissionOutlined = ({
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
      d="M4.997 1.714a2.572 2.572 0 1 0 0 1.715h4.578c.258.73.837 1.31 1.568 1.568v4.578a2.572 2.572 0 0 0 0 4.85v4.578c-.73.259-1.31.838-1.568 1.568H4.997a2.573 2.573 0 1 0 0 1.715h4.578a2.572 2.572 0 1 0 3.282-3.283v-4.578a2.578 2.578 0 0 0 1.568-1.568h7.004a.857.857 0 0 0 .857-.857V4.997a2.572 2.572 0 1 0-1.715 0v6.146h-6.146a2.578 2.578 0 0 0-1.568-1.568V4.997a2.572 2.572 0 1 0-3.282-3.283H4.997Zm-2.426 0a.857.857 0 1 0 0 1.715.857.857 0 0 0 0-1.715Zm8.572.857a.857.857 0 1 0 1.714 0 .857.857 0 0 0-1.714 0Zm-8.572 18a.857.857 0 1 0 0 1.715.857.857 0 0 0 0-1.715ZM11.143 12a.857.857 0 1 1 1.714 0 .857.857 0 0 1-1.714 0Zm10.286-8.571a.857.857 0 1 0 0-1.715.857.857 0 0 0 0 1.715Zm-10.286 18a.857.857 0 1 1 1.714 0 .857.857 0 0 1-1.714 0Z"
      fill="#3A8DDB"
    />
  </svg>
);
export default SvgTransmissionOutlined;
