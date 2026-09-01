import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgMedalIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
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
      d="M11.777 4.286a4.286 4.286 0 1 0 0 8.571 4.286 4.286 0 0 0 0-8.571ZM9.206 8.57a2.571 2.571 0 1 1 5.142 0 2.571 2.571 0 0 1-5.143 0Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.777 0A8.571 8.571 0 0 0 4.91 13.704L.925 18.699a1.731 1.731 0 0 0 .611 2.647l.024.011 5.691 2.486h.002a1.783 1.783 0 0 0 1.473-.025 1.732 1.732 0 0 0 .883-1.12l1.33-5.596a8.678 8.678 0 0 0 2.13-.056l1.354 5.646.002.008a1.716 1.716 0 0 0 .926 1.131l.016.007a1.732 1.732 0 0 0 1.42.002l5.655-2.484.013-.006a1.713 1.713 0 0 0 .957-1.184 1.68 1.68 0 0 0-.341-1.473l-4.188-5.327A8.571 8.571 0 0 0 11.777 0ZM4.92 8.571a6.857 6.857 0 1 1 13.714 0 6.857 6.857 0 0 1-13.714 0Zm12.84 6.139a8.576 8.576 0 0 1-3.03 1.91l1.357 5.656.008-.004 5.644-2.48.003-.015-.01-.013-3.973-5.054ZM2.263 19.769l3.822-4.788a8.558 8.558 0 0 0 3.171 1.786l-1.31 5.508a.087.087 0 0 1-.008-.003l-.004-.001-5.669-2.476a.017.017 0 0 1-.006-.018l.004-.008Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgMedalIcon;
