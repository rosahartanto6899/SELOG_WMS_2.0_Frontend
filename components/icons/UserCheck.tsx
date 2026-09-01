import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgUserCheck = ({
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
      d="M3.857 4.714a4.714 4.714 0 1 1 9.429 0 4.714 4.714 0 0 1-9.429 0Zm4.714-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"
      fill="currentColor"
    />
    <path
      d="M8.571 12c-1.793 0-3.53.777-4.823 2.187-1.295 1.413-2.034 3.344-2.034 5.371v1.013h5.143a.857.857 0 0 1 0 1.715h-6A.857.857 0 0 1 0 21.429v-1.87c0-2.437.887-4.787 2.485-6.53 1.6-1.746 3.788-2.743 6.086-2.743 2.299 0 4.487.997 6.087 2.742a.857.857 0 0 1-1.264 1.159C12.101 12.777 10.364 12 8.571 12ZM23.829 14.228a.857.857 0 1 0-1.372-1.028l-6.55 8.743-4.027-3.018a.857.857 0 0 0-1.028 1.372l4.714 3.532a.857.857 0 0 0 1.2-.172l7.063-9.429Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgUserCheck;
