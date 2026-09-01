import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgUserBlock = ({
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
      d="M8.571 0a4.714 4.714 0 1 0 0 9.429 4.714 4.714 0 0 0 0-9.429Zm-3 4.714a3 3 0 1 1 6 0 3 3 0 0 1-6 0Z"
      fill="currentColor"
    />
    <path
      d="M3.748 14.187C5.041 12.777 6.778 12 8.571 12a6.24 6.24 0 0 1 1.508.185.857.857 0 0 0 .414-1.664 7.956 7.956 0 0 0-1.922-.235c-2.298 0-4.486.997-6.086 2.742C.887 14.772 0 17.122 0 19.558v1.87c0 .474.384.858.857.858h6.857a.857.857 0 1 0 0-1.715h-6v-1.013c0-2.027.74-3.958 2.034-5.371Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M22.051 12.96a6.428 6.428 0 0 0-9.095 9.086.867.867 0 0 0 .14.14 6.429 6.429 0 0 0 9.086-9.095.859.859 0 0 0-.131-.13Zm-4.48-.103a4.714 4.714 0 0 0-3.884 7.387l6.557-6.557a4.693 4.693 0 0 0-2.673-.83Zm3.885 2.042-6.557 6.557a4.714 4.714 0 0 0 6.556-6.556Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgUserBlock;
