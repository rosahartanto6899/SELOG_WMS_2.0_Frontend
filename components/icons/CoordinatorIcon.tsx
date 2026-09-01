import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgCoordinatorIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 42 42"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="fms-icon"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <g
      clipPath="url(#coordinator-icon_svg__a)"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="#3A8DDB"
    >
      <path d="M21 9a6.429 6.429 0 1 0 0 12.857A6.429 6.429 0 0 0 21 9Zm-4.714 6.429a4.714 4.714 0 1 1 9.428 0 4.714 4.714 0 0 1-9.428 0ZM21 23.558A11.982 11.982 0 0 0 9.59 31.88.857.857 0 0 0 10.405 33h21.188a.857.857 0 0 0 .816-1.119A11.984 11.984 0 0 0 21 23.558Zm-6.052 3.686a10.268 10.268 0 0 1 15.398 4.042H11.654a10.268 10.268 0 0 1 3.294-4.042Z" />
    </g>
    <defs>
      <clipPath id="coordinator-icon_svg__a">
        <path fill="#fff" transform="translate(9 9)" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgCoordinatorIcon;
