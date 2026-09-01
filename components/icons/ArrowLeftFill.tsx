import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
  currentSlide?: string;
}

const SvgArrowLeftFill = ({
  title,
  titleId,
  className,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 11 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`fms-icon ${className} ${Number(props.currentSlide) === 0 ? "disabled" : ""}`}
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      d="m.692 9.496 7.276 6.073C9.186 16.585 11 15.69 11 14.073V1.927C11 .31 9.186-.585 7.968.431L.692 6.504c-.923.77-.923 2.223 0 2.992Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgArrowLeftFill;
