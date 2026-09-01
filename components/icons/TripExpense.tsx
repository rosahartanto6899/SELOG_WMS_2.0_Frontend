import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgTripExpense = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 16 14"
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
      d="M4.286 5.572a2.286 2.286 0 1 1 4.571 0 2.286 2.286 0 0 1-4.571 0ZM6.57 4.429a1.143 1.143 0 1 0 0 2.285 1.143 1.143 0 0 0 0-2.285Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 2.143C0 1.196.768.429 1.714.429h9.715c.946 0 1.714.767 1.714 1.714V9c0 .947-.768 1.714-1.714 1.714H1.714A1.714 1.714 0 0 1 0 9V2.143Zm1.714-.571a.571.571 0 0 0-.571.571V9c0 .316.256.572.571.572h9.715A.571.571 0 0 0 12 9V2.143a.571.571 0 0 0-.571-.571H1.714Z"
      fill="currentColor"
    />
    <path
      d="M16 6.143a.571.571 0 1 0-1.143 0v5.714a.571.571 0 0 1-.571.572H4a.571.571 0 1 0 0 1.143h10.286A1.714 1.714 0 0 0 16 11.857V6.143Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgTripExpense;
