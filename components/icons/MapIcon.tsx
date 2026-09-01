import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgMapIcon = ({
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
      d="M23.676.186c.205.163.324.41.324.671V21.43c0 .399-.275.745-.664.835l-7.423 1.714a.857.857 0 0 1-1.05-.835V2.57c0-.399.275-.745.664-.835L22.95.022a.857.857 0 0 1 .726.164Zm-7.099 3.067v18.812l5.709-1.318V1.935l-5.709 1.318Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="m8.28 22.308-7.23 1.67A.857.857 0 0 1 0 23.143V2.57c0-.399.275-.745.664-.835L8.087.022a.857.857 0 0 1 .385 0l7.44 1.714c.39.09.665.436.665.835v20.572a.857.857 0 0 1-1.05.835l-7.247-1.67Zm6.583-.242-5.726-1.32V1.934l5.726 1.32v18.812Zm-13.149 0V3.252l5.709-1.318v18.812l-5.709 1.318Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgMapIcon;
