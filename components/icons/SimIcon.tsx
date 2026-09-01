import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgSimIcon = ({
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
      d="M25.286 24a.857.857 0 0 0 0 1.714h2.571a.857.857 0 0 0 0-1.714h-2.571Z"
      fill="#3A8DDB"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9 14.571V27.43A2.571 2.571 0 0 0 11.571 30H30.43A2.571 2.571 0 0 0 33 27.429V14.57A2.571 2.571 0 0 0 30.429 12H11.57A2.571 2.571 0 0 0 9 14.571Zm2.571-.857a.857.857 0 0 0-.857.857V18h20.572v-3.429a.857.857 0 0 0-.857-.857H11.57ZM31.286 27.43v-7.715H10.714v7.715c0 .473.384.857.857.857H30.43a.857.857 0 0 0 .857-.857Z"
      fill="#3A8DDB"
    />
  </svg>
);
export default SvgSimIcon;
