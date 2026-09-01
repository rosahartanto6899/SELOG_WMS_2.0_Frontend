import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgAddLocCheckPointIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 18 24"
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
      d="M1.619 0h15.428a.857.857 0 0 1 .651 1.415l-4.665 5.442 4.665 5.442a.857.857 0 0 1-.65 1.415H2.475v9.429a.857.857 0 0 1-1.714 0V.857c0-.473.383-.857.857-.857Zm.857 12h12.708l-3.93-4.585a.857.857 0 0 1 0-1.116l3.93-4.585H2.476V12Z"
      fill="#F6FAFD"
    />
  </svg>
);

export default SvgAddLocCheckPointIcon;
