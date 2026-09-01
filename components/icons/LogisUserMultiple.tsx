import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgLogisUserMultiple = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1.25em"
    height="1.25em"
    viewBox="0 0 24 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="'logis-icon'"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <g clipPath="url(#clip0_1808_1175)">
      <path
        d="M15.6207 17.6036H16.0292C16.9874 17.6036 17.7495 17.1671 18.4338 16.5566C20.1723 15.0058 16.0857 13.437 14.6906 13.437M13.0239 5.16094C13.2131 5.12341 13.4096 5.10364 13.6112 5.10364C15.1278 5.10364 16.3573 6.22293 16.3573 7.60364C16.3573 8.98435 15.1278 10.1036 13.6112 10.1036C13.4096 10.1036 13.2131 10.0839 13.0239 10.0463"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M3.84185 14.363C2.85937 14.8895 0.28337 15.9645 1.85233 17.3098C2.61875 17.967 3.47235 18.437 4.54552 18.437H10.6693C11.7425 18.437 12.5961 17.967 13.3625 17.3098C14.9315 15.9645 12.3555 14.8895 11.373 14.363C9.0691 13.1283 6.14575 13.1283 3.84185 14.363Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M10.9408 7.18697C10.9408 9.02792 9.44837 10.5203 7.60742 10.5203C5.76647 10.5203 4.27409 9.02792 4.27409 7.18697C4.27409 5.34602 5.76647 3.85364 7.60742 3.85364C9.44837 3.85364 10.9408 5.34602 10.9408 7.18697Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </g>
    <defs>
      <clipPath id="clip0_1808_1175">
        <rect
          width="20"
          height="20"
          fill="white"
          transform="translate(0.107422 0.937012)"
        />
      </clipPath>
    </defs>
  </svg>
);
export default SvgLogisUserMultiple;
