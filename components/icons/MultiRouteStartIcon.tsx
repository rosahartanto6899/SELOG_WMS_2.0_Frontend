import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgMultiRouteStartIcon = ({
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
    <g filter="url(#multi-route-start-icon_svg__a)">
      <path d="M15.5 18.5h3v6a1.5 1.5 0 0 1-3 0v-6Z" fill="#fff" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.5 18.5v6a1.5 1.5 0 0 0 3 0v-6h-3Z"
        fill="currentColor"
      />
      <path d="M24.5 11a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" fill="#fff" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm-9 6a9 9 0 1 1 18 0 9 9 0 0 1-18 0Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <filter
        id="multi-route-start-icon_svg__a"
        x={0}
        y={0}
        width={34}
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
          result="effect1_dropShadow_6358_131004"
        />
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_6358_131004"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);

export default SvgMultiRouteStartIcon;
