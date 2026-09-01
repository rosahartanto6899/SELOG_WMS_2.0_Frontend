import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgFileDelete = ({
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
      d="M5.394 1.965A.857.857 0 0 1 6 1.715h7.714v7.714c0 .473.384.857.857.857h7.715v11.143a.857.857 0 0 1-.857.857h-7.715a.857.857 0 0 0 0 1.714h7.715A2.57 2.57 0 0 0 24 21.429v-12a.854.854 0 0 0-.245-.6l-.006-.007-8.57-8.57A.854.854 0 0 0 14.57 0H6a2.571 2.571 0 0 0-2.571 2.571V12a.857.857 0 1 0 1.714 0V2.571c0-.227.09-.445.25-.606Zm10.035.961v5.645h5.644L15.43 2.926Z"
      fill="currentColor"
    />
    <path
      d="M8.732 15.268a.857.857 0 0 1 0 1.212L5.704 19.51l3.028 3.028a.857.857 0 0 1-1.212 1.212L4.49 20.721l-3.028 3.028a.857.857 0 0 1-1.212-1.212l3.028-3.028L.251 16.48a.857.857 0 0 1 1.212-1.212l3.028 3.028 3.029-3.028a.857.857 0 0 1 1.212 0Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgFileDelete;
