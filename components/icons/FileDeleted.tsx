import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgFileDeleted = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 22 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="fms-icon"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      d="M14.588 9.68a.857.857 0 0 1 0 1.212L11.56 13.92l3.028 3.028a.857.857 0 1 1-1.212 1.212l-3.028-3.028L7.32 18.16a.857.857 0 0 1-1.212-1.212l3.028-3.028-3.028-3.028A.857.857 0 1 1 7.32 9.68l3.028 3.028 3.028-3.028a.857.857 0 0 1 1.213 0Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.467.753A2.571 2.571 0 0 1 3.285 0h8.572c.227 0 .445.09.606.251l8.571 8.571c.161.161.251.38.251.607v12A2.57 2.57 0 0 1 18.714 24H3.285a2.571 2.571 0 0 1-2.571-2.571V2.57c0-.682.27-1.336.753-1.818Zm1.818.961a.857.857 0 0 0-.857.857V21.43a.857.857 0 0 0 .857.857h15.429a.857.857 0 0 0 .857-.857V9.784l-8.07-8.07H3.286Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgFileDeleted;
