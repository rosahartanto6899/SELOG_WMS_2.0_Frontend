import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgApproval = ({
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
      d="M8 0a3.429 3.429 0 0 0-3.429 3.429v2.857A.571.571 0 0 1 4 6.857H2.857A2.857 2.857 0 0 0 0 9.714v1.143a1.714 1.714 0 0 0 1.143 1.616v1.813A1.714 1.714 0 0 0 2.857 16h10.286a1.714 1.714 0 0 0 1.714-1.714v-1.813A1.714 1.714 0 0 0 16 10.857V9.714a2.857 2.857 0 0 0-2.857-2.857H12a.572.572 0 0 1-.571-.571V3.429A3.429 3.429 0 0 0 8 0Zm5.714 12.571H2.286v1.715a.572.572 0 0 0 .571.571h10.286a.571.571 0 0 0 .571-.571V12.57Zm-12-1.142h12.572a.571.571 0 0 0 .571-.572V9.714A1.714 1.714 0 0 0 13.143 8H12a1.714 1.714 0 0 1-1.714-1.714V3.429a2.286 2.286 0 1 0-4.572 0v2.857A1.714 1.714 0 0 1 4 8H2.857a1.714 1.714 0 0 0-1.714 1.714v1.143a.572.572 0 0 0 .571.572Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgApproval;
