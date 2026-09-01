import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
  currentSlide?: string;
  slideCount?: any;
}

const SvgArrowRightFill = ({
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
    className={`fms-icon ${className} ${Number(props.currentSlide) === Number(props.slideCount) - 1 ? "disabled" : ""}`}
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      d="M10.308 6.504 3.032.43C1.814-.585 0 .31 0 1.927v12.146c0 1.617 1.814 2.512 3.032 1.496l7.276-6.073c.923-.77.923-2.223 0-2.992Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgArrowRightFill;
