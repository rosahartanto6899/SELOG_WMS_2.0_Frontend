import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgBottomLogin = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 171 168"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="fms-icon"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      d="M263 30.883h-38.906c-6.753 0-13.507 1.156-19.894 3.664-15.012 5.903-24.583 16.724-30.497 43.556-8.409 38.145-37.788 39.35-37.788 39.35H82.642c-4.71 0-9.377.91-13.743 2.878-12.904 5.829-36.024 22.626-36.024 67.953h120.977c15.506 0 30.905-3.738 44.842-11.534.839-.468 1.699-.96 2.559-1.476 20.066-12.002 34.584-33.374 40.692-58.312L263 30.882Z"
      fill="url(#bottom-login_svg__a)"
    />
    <path
      d="M229.129 0h-38.738c-6.724 0-13.448 1.153-19.808 3.653-14.947 5.884-24.476 16.671-30.365 43.418-8.373 38.025-37.624 39.226-37.624 39.226H49.552c-4.69 0-9.337.907-13.684 2.869C23.02 94.976 0 111.72 0 156.904h120.453c15.44 0 30.772-3.727 44.648-11.498a90.343 90.343 0 0 0 2.548-1.471c19.98-11.964 34.434-33.269 40.516-58.128L229.129 0Z"
      fill="url(#bottom-login_svg__b)"
      style={{
        mixBlendMode: "multiply",
      }}
      opacity={0.5}
    />
    <defs>
      <linearGradient
        id="bottom-login_svg__a"
        x1={158.031}
        y1={179.951}
        x2={230.199}
        y2={38.233}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#759EFA" stopOpacity={0.3} />
        <stop offset={1} stopColor="#A5CAFA" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="bottom-login_svg__b"
        x1={114.564}
        y1={156.904}
        x2={235.275}
        y2={101.545}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#759EFA" stopOpacity={0.3} />
        <stop offset={1} stopColor="#28AAE1" stopOpacity={0} />
      </linearGradient>
    </defs>
  </svg>
);
export default SvgBottomLogin;
