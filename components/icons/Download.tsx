import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgDownload = ({
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
      d="M8.571.571a.571.571 0 0 0-1.142 0v8.741L5.005 6.485a.571.571 0 0 0-.867.744l3.425 3.996A.57.57 0 0 0 8 11.43h.01H8m.432-.197.002-.003-.002.003Zm.14-10.66v8.74-8.74Zm-.137 10.656 3.427-3.999a.571.571 0 1 0-.867-.744L8.57 9.312m-8 2.117c.316 0 .572.255.572.571v1.143a1.714 1.714 0 0 0 1.714 1.714h10.286a1.714 1.714 0 0 0 1.714-1.714V12A.571.571 0 0 1 16 12v1.143A2.857 2.857 0 0 1 13.143 16H2.857A2.857 2.857 0 0 1 0 13.143V12c0-.316.256-.571.571-.571Z"
      fill="currentColor"
      fillOpacity={0.85}
    />
  </svg>
);

export default SvgDownload;
