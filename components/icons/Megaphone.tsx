import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgMegaphone = ({
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
      d="M15.024.554a1.143 1.143 0 0 0-.533.047L1.15 5.243A1.714 1.714 0 0 0 0 6.855v1.268a1.714 1.714 0 0 0 1.149 1.56l1.708.595v1.438a3.714 3.714 0 0 0 7.26 1.094l4.37 1.524.004.002A1.143 1.143 0 0 0 16 13.26V1.676a1.143 1.143 0 0 0-.976-1.122Zm-5.987 11.88L4 10.676v1.036a2.571 2.571 0 0 0 5.037.72ZM1.526 6.321l13.331-4.638v11.569L1.525 8.603a.571.571 0 0 1-.382-.512V6.858a.571.571 0 0 1 .383-.536Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgMegaphone;
