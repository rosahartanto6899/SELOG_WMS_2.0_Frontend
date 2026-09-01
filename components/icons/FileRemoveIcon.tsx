import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgFileRemoveIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 18 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    className="fms-icon"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.772 1.429a.714.714 0 0 0-.715.714v15.714a.714.714 0 0 0 .715.714h12.857a.714.714 0 0 0 .714-.714V8.153L9.62 1.429H2.772ZM1.257.628A2.143 2.143 0 0 1 2.772 0h7.143c.19 0 .37.075.505.21l7.143 7.142c.134.134.209.316.209.505v10A2.143 2.143 0 0 1 15.629 20H2.772a2.143 2.143 0 0 1-2.143-2.143V2.143c0-.568.226-1.114.628-1.515Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.272 10.714c0-.394.32-.714.714-.714h5a.714.714 0 1 1 0 1.429h-5a.714.714 0 0 1-.714-.715Z"
      fill="currentColor"
    />
  </svg>
);
export default SvgFileRemoveIcon;
