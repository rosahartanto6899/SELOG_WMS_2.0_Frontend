import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgCheckIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 16 14"
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
      d="M15.793.331a.571.571 0 0 1 .076.805L5.915 13.18l-.002.002a1.714 1.714 0 0 1-2.673-.05l-.001-.001L.12 9.122a.571.571 0 1 1 .903-.701l3.121 4.014a.571.571 0 0 0 .89.017L14.989.408a.571.571 0 0 1 .805-.077Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCheckIcon;
