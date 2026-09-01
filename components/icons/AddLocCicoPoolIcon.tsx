import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgAddLocCicoPoolIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 20 24"
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
      d="M5.524 2.946a7.286 7.286 0 0 1 9.201 11.208.857.857 0 1 0 1.213 1.212 9 9 0 1 0-12.733 0 .857.857 0 1 0 1.213-1.212A7.286 7.286 0 0 1 5.524 2.946Z"
      fill="#F6FAFD"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.662 13.234a1.286 1.286 0 0 1 2.195.909v4.714c0 .474.384.857.857.857h3.429a2.572 2.572 0 0 1 2.571 2.572v.857a.857.857 0 0 0 1.714 0v-.857A4.286 4.286 0 0 0 15.143 18H12.57v-3.857a3 3 0 0 0-6 0v9a.857.857 0 1 0 1.715 0v-9c0-.341.135-.668.376-.91Z"
      fill="#F6FAFD"
    />
  </svg>
);

export default SvgAddLocCicoPoolIcon;
