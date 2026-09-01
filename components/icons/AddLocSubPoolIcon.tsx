import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgAddLocSubPoolIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 15 24"
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
      d="M14.524 6.857a6.858 6.858 0 0 1-6 6.804v8.625h1.714a.857.857 0 0 1 0 1.714H5.095a.857.857 0 0 1 0-1.714H6.81V13.66a6.858 6.858 0 1 1 7.714-6.804ZM7.667 1.714a5.143 5.143 0 1 0 0 10.286 5.143 5.143 0 0 0 0-10.286Z"
      fill="#F6FAFD"
    />
  </svg>
);

export default SvgAddLocSubPoolIcon;
