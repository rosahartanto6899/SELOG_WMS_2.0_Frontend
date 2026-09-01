import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgPhonenumberIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 42 42"
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
      d="M15.857 14.143c0-.474.384-.857.857-.857h8.572c.473 0 .857.383.857.857v8.571a.857.857 0 0 1-.857.857h-8.572a.857.857 0 0 1-.857-.857v-8.571Zm1.714.857v6.857h6.857V15h-6.857ZM21 25.714a1.714 1.714 0 1 0 0 3.429 1.714 1.714 0 0 0 0-3.429Z"
      fill="#3A8DDB"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.571 11.571A2.571 2.571 0 0 1 14.143 9h13.714a2.571 2.571 0 0 1 2.571 2.571V30.43A2.571 2.571 0 0 1 27.857 33H14.143a2.571 2.571 0 0 1-2.572-2.571V11.57Zm2.572-.857a.857.857 0 0 0-.857.857V30.43c0 .473.383.857.857.857h13.714a.857.857 0 0 0 .857-.857V11.57a.857.857 0 0 0-.857-.857H14.143Z"
      fill="#3A8DDB"
    />
  </svg>
);
export default SvgPhonenumberIcon;
