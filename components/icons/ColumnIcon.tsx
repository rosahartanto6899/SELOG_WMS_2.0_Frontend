import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgColumnIcon = ({
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
      d="M1.714 16A1.714 1.714 0 0 1 0 14.286V1.714C0 .768.768 0 1.714 0h12.572C15.233 0 16 .768 16 1.714v12.572c0 .947-.768 1.714-1.714 1.714H1.714ZM1.143 1.714c0-.315.256-.571.571-.571H7.43v13.714H1.714a.571.571 0 0 1-.571-.571V1.714ZM8.57 14.857V1.143h5.715c.315 0 .571.256.571.571v12.572a.571.571 0 0 1-.571.571H8.57Z"
      fill="currentColor"
      fillOpacity={0.85}
    />
  </svg>
);

export default SvgColumnIcon;
