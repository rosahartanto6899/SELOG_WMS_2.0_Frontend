import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgAddLocVendorIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 25 24"
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
      d="M12.667 0a6 6 0 0 0-5.938 5.143h-3.49A2.571 2.571 0 0 0 .666 7.714V21.43A2.571 2.571 0 0 0 3.238 24h18.858a2.571 2.571 0 0 0 2.571-2.571V7.714a2.571 2.571 0 0 0-2.571-2.571h-3.49A6 6 0 0 0 12.666 0Zm4.2 5.143a4.285 4.285 0 0 0-8.4 0h8.4ZM3.237 6.857a.857.857 0 0 0-.857.857v6h9.429v-.857a.857.857 0 0 1 1.714 0v.857h9.429v-6a.857.857 0 0 0-.857-.857H3.238Zm8.572 9.429v-.857H2.38v6c0 .473.384.857.857.857h18.858a.857.857 0 0 0 .857-.857v-6h-9.429v.857a.857.857 0 1 1-1.714 0Z"
      fill="#F6FAFD"
    />
  </svg>
);

export default SvgAddLocVendorIcon;
