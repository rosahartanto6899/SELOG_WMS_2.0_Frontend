import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgOrgHierarchy = ({
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
      d="M7.714 1.714C7.714.768 8.482 0 9.43 0h5.142c.947 0 1.715.768 1.715 1.714v5.143c0 .172-.026.337-.072.493l4.053 8.936h2.019c.947 0 1.714.767 1.714 1.714v4.286c0 .947-.767 1.714-1.714 1.714H18a1.714 1.714 0 0 1-1.714-1.714v-.857H7.714v.857C7.714 23.233 6.947 24 6 24H1.714A1.714 1.714 0 0 1 0 22.286V18c0-.947.768-1.714 1.714-1.714h2.02L7.785 7.35a1.714 1.714 0 0 1-.072-.493V1.714ZM19.698 18H22.286v4.286H18V18h1.698Zm-1.314-1.714-3.51-7.741a1.723 1.723 0 0 1-.303.026H9.43c-.103 0-.204-.009-.302-.026l-3.511 7.74H6c.947 0 1.714.768 1.714 1.715v1.714h8.572V18c0-.947.767-1.714 1.714-1.714h.384ZM4.302 18H1.714v4.286H6V18H4.302Zm10.27-16.286H9.428v5.143h5.142V1.714Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgOrgHierarchy;
