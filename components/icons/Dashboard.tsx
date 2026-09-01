import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgDashboard = ({
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
      d="M0 1.714C0 .768.768 0 1.714 0h12.572C15.233 0 16 .768 16 1.714v12.572c0 .947-.768 1.714-1.714 1.714H1.714A1.714 1.714 0 0 1 0 14.286V1.714Zm1.143 0c0-.315.256-.571.571-.571h12.572c.315 0 .571.256.571.571V3.43H1.143V1.714Zm13.714 2.857v9.715a.571.571 0 0 1-.571.571H1.714a.571.571 0 0 1-.571-.571V4.57h13.714Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.404 7.596a.572.572 0 0 1 0 .808l-4 4a.572.572 0 0 1-.808-.808l4-4a.572.572 0 0 1 .808 0ZM11.429 12c0-.316.255-.571.571-.571h1.143a.571.571 0 0 1 0 1.142H12a.571.571 0 0 1-.571-.571ZM8 6.286c.316 0 .571.256.571.571V8A.571.571 0 0 1 7.43 8V6.857c0-.315.255-.571.571-.571ZM3.962 7.962a.571.571 0 0 1 .808 0l.811.811a.571.571 0 1 1-.808.808l-.811-.811a.571.571 0 0 1 0-.808ZM2.286 12c0-.316.256-.571.571-.571H4a.571.571 0 1 1 0 1.142H2.857A.571.571 0 0 1 2.286 12Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgDashboard;
