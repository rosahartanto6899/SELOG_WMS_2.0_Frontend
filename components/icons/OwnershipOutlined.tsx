import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgOwnershipOutlined = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 22"
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
      d="M19.108.965a.857.857 0 0 1 1.212 0l3.429 3.429a.857.857 0 1 1-1.212 1.212l-2.823-2.822-2.645 2.645 2.394 2.393a.857.857 0 1 1-1.212 1.213L15.857 6.64l-5.051 5.051a6 6 0 1 1-1.212-1.212L19.107.965ZM8.982 12.207a4.286 4.286 0 1 0 .096.096.858.858 0 0 1-.096-.096Z"
      fill="#3A8DDB"
    />
  </svg>
);
export default SvgOwnershipOutlined;
