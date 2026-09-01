import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgCustomerManagement = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 16 15"
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
      d="M5.714.143a3.143 3.143 0 1 0 0 6.285 3.143 3.143 0 0 0 0-6.285Zm-2 3.142a2 2 0 1 1 4 0 2 2 0 0 1-4 0ZM5.714 7.571A5.714 5.714 0 0 0 0 13.285v1.143c0 .316.256.572.571.572h10.286a.571.571 0 0 0 .572-.572v-1.143a5.714 5.714 0 0 0-5.715-5.714Zm-3.232 2.482a4.572 4.572 0 0 1 7.804 3.232v.572H1.143v-.572c0-1.212.481-2.375 1.339-3.232Z"
      fill="currentColor"
    />
    <path
      d="M9.714.714c0-.316.256-.571.572-.571a3.143 3.143 0 1 1 0 6.285.571.571 0 0 1 0-1.143 2 2 0 1 0 0-4 .571.571 0 0 1-.572-.571ZM12.317 7.826a.571.571 0 1 0-.406 1.068 4.57 4.57 0 0 1 2.946 4.266v.697h-1.143a.572.572 0 0 0 0 1.143h1.715a.571.571 0 0 0 .571-.572V13.16a5.716 5.716 0 0 0-3.683-5.334Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCustomerManagement;
