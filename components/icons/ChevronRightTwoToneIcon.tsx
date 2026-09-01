import * as React from "react";
import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
  width?: string;
}

const ChevronRightTwoToneIcon = ({
  title,
  titleId,
  width = "32",
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width={width}
    height={width}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="sera-icon"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path opacity="0.2" d="M22 16L12 26V6L22 16Z" fill="#0F2072" />
    <path
      d="M22.7075 15.2926L12.7075 5.29256C12.5676 5.15254 12.3894 5.05718 12.1953 5.01853C12.0012 4.97988 11.8 4.99968 11.6172 5.07543C11.4344 5.15119 11.2782 5.27948 11.1683 5.44407C11.0584 5.60867 10.9998 5.80216 11 6.00006V26.0001C10.9998 26.198 11.0584 26.3914 11.1683 26.556C11.2782 26.7206 11.4344 26.8489 11.6172 26.9247C11.8 27.0004 12.0012 27.0202 12.1953 26.9816C12.3894 26.9429 12.5676 26.8476 12.7075 26.7076L22.7075 16.7076C22.8005 16.6147 22.8742 16.5044 22.9246 16.383C22.9749 16.2616 23.0008 16.1315 23.0008 16.0001C23.0008 15.8686 22.9749 15.7385 22.9246 15.6171C22.8742 15.4957 22.8005 15.3854 22.7075 15.2926ZM13 23.5863V8.4138L20.5863 16.0001L13 23.5863Z"
      fill="#0F2072"
    />
  </svg>
);

export default ChevronRightTwoToneIcon;
