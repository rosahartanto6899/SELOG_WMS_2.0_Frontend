import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgSegiLima = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 25"
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
      d="M11.419.727a.857.857 0 0 1 1.162 0l10.592 9.777c.527.487.827 1.172.827 1.89v9.535a2.571 2.571 0 0 1-2.571 2.571H2.57A2.571 2.571 0 0 1 0 21.929v-9.536c0-.717.3-1.402.827-1.89L11.42.728ZM12 2.524l-10.01 9.24a.857.857 0 0 0-.276.63v9.535c0 .473.384.857.857.857H21.43a.857.857 0 0 0 .857-.857v-9.536c0-.239-.1-.467-.276-.63L12 2.524Z"
      fill="currentColor"
    />
  </svg>
);
export default SvgSegiLima;
