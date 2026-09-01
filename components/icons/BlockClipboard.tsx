import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgBlockClipboard = ({
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
      d="M4.432 1.714h-1.86A2.571 2.571 0 0 0 0 4.286v17.143A2.571 2.571 0 0 0 2.571 24H9.43a.857.857 0 0 0 0-1.714H2.57a.857.857 0 0 1-.857-.857V4.286a.857.857 0 0 1 .857-.857h1.715A2.571 2.571 0 0 0 6.857 6H12a2.571 2.571 0 0 0 2.571-2.571h1.715a.857.857 0 0 1 .857.857v3.428a.857.857 0 1 0 1.714 0V4.286a2.572 2.572 0 0 0-2.571-2.572h-1.86A2.572 2.572 0 0 0 12 0H6.857c-1.12 0-2.072.716-2.425 1.714ZM6 2.571c0-.473.384-.857.857-.857H12c.473 0 .857.384.857.857v.858a.857.857 0 0 1-.857.857H6.857A.857.857 0 0 1 6 3.429V2.57Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M22.05 12.959a6.428 6.428 0 0 0-9.091 9.09.876.876 0 0 0 .136.136 6.429 6.429 0 0 0 9.09-9.091.866.866 0 0 0-.136-.135Zm-4.479-.102a4.714 4.714 0 0 0-3.884 7.387l6.557-6.557a4.692 4.692 0 0 0-2.673-.83Zm3.885 2.042-6.557 6.557a4.714 4.714 0 0 0 6.557-6.557Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgBlockClipboard;
