import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgEdit = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 16 16"
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
      d="M14.074 0a.615.615 0 0 0-.437.182l-.003.003-6.908 6.884-.442 2.685 2.643-.476 6.889-6.912.002-.003a.615.615 0 0 0 0-.873l-.002-.002L14.51.182A.615.615 0 0 0 14.074 0ZM5.717 6.338 9.6 2.468H2.46A2.46 2.46 0 0 0 0 4.928v8.612A2.46 2.46 0 0 0 2.46 16h8.612a2.46 2.46 0 0 0 2.46-2.46V6.4l-3.87 3.883a.615.615 0 0 1-.326.171l-3.691.665a.615.615 0 0 1-.716-.706l.615-3.74a.615.615 0 0 1 .173-.335Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgEdit;
