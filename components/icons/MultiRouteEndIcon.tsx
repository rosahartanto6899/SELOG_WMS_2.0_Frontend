import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgMultiRouteEndIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 34 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="fms-icon"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <g filter="url(#multi-route-end-icon_svg__a)" fill="currentColor">
      <path d="M17.258 25.656a.859.859 0 0 1-1.373 0l-.006-.008-.018-.023-.066-.09a86.898 86.898 0 0 1-1.131-1.577 88.73 88.73 0 0 1-2.678-4.048c-.974-1.57-1.958-3.29-2.702-4.902C8.556 13.43 8 11.84 8 10.571a8.571 8.571 0 0 1 17.143 0c0 1.268-.556 2.86-1.285 4.437-.743 1.611-1.728 3.332-2.701 4.902a88.814 88.814 0 0 1-3.81 5.625l-.066.09-.017.023-.006.008Z" />
      <path d="m15.885 25.656.686-.513.687.513a.859.859 0 0 1-1.373 0Z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.571 7.143a3.429 3.429 0 1 0 0 6.857 3.429 3.429 0 0 0 0-6.857Zm-1.714 3.428a1.714 1.714 0 1 1 3.429 0 1.714 1.714 0 0 1-3.429 0Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="m15.885 25.656.686-.513.687.513.006-.008.017-.023.067-.09.248-.34a88.814 88.814 0 0 0 3.56-5.286c.974-1.569 1.959-3.29 2.703-4.9.728-1.579 1.284-3.17 1.284-4.438a8.571 8.571 0 0 0-17.143 0c0 1.268.556 2.86 1.284 4.437.744 1.611 1.728 3.332 2.702 4.902a88.73 88.73 0 0 0 3.81 5.625l.066.09.017.023.006.008ZM11.723 5.723a6.857 6.857 0 0 1 11.706 4.848c0 .867-.41 2.164-1.127 3.719-.702 1.521-1.647 3.176-2.602 4.716a87.062 87.062 0 0 1-3.129 4.68 90.241 90.241 0 0 1-3.128-4.68c-.955-1.54-1.9-3.195-2.602-4.716-.718-1.555-1.127-2.852-1.127-3.719 0-1.818.723-3.562 2.009-4.848Z"
      />
    </g>
    <defs>
      <filter
        id="multi-route-end-icon_svg__a"
        x={0}
        y={0}
        width={33.143}
        height={40}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy={6} />
        <feGaussianBlur stdDeviation={4} />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
        <feBlend
          in2="BackgroundImageFix"
          result="effect1_dropShadow_6358_130996"
        />
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_6358_130996"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);

export default SvgMultiRouteEndIcon;
