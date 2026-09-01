import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgFileWaiting = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="'fms-icon'"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <g
      clipPath="url(#file-waiting_svg__a)"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="#fff"
    >
      <path d="M14.904 0c.228 0 .446.09.607.251l8.571 8.571c.155.156.251.37.251.607v12A2.571 2.571 0 0 1 21.762 24h-7.715a.857.857 0 0 1 0-1.714h7.715a.857.857 0 0 0 .857-.857V10.286h-7.715a.857.857 0 0 1-.857-.857V1.714H6.333a.857.857 0 0 0-.857.857v6a.857.857 0 1 1-1.714 0v-6A2.571 2.571 0 0 1 6.333 0h8.571Zm6.503 8.571-5.645-5.645v5.645h5.645Z" />
      <path d="M7.19 12.857c.474 0 .857.384.857.857v3.429c0 .227-.09.445-.25.606l-1.715 1.714a.857.857 0 1 1-1.212-1.212l1.463-1.463v-3.074c0-.473.384-.857.857-.857Z" />
      <path d="M7.19 10.286A6.857 6.857 0 1 0 7.19 24a6.857 6.857 0 0 0 0-13.714Zm-5.143 6.857a5.143 5.143 0 1 1 10.286 0 5.143 5.143 0 0 1-10.286 0Z" />
    </g>
    <defs>
      <clipPath id="file-waiting_svg__a">
        <path fill="#fff" transform="translate(.333)" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgFileWaiting;
