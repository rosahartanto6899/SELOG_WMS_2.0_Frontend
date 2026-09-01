import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgTrainingManagement = ({
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
      d="M0 1.714C0 .768.768 0 1.714 0h12.572C15.233 0 16 .768 16 1.714v9.143c0 .947-.768 1.714-1.714 1.714h-3.192l2.453 2.454a.571.571 0 1 1-.808.808L9.478 12.57H8.57v2.858a.571.571 0 0 1-1.142 0V12.57h-.907l-3.26 3.262a.571.571 0 1 1-.809-.809l2.453-2.453H1.714A1.714 1.714 0 0 1 0 10.857V1.714Zm1.714 9.715a.571.571 0 0 1-.571-.572V4.571h13.714v6.286a.571.571 0 0 1-.571.572H1.714Zm13.143-8H1.143V1.714c0-.315.256-.571.571-.571h12.572c.315 0 .571.256.571.571V3.43Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgTrainingManagement;
