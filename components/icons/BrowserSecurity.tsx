import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgBrowserSecurity = ({
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
      d="m20.767 10.96 1.765 1.795a.857.857 0 1 0 1.222-1.202l-1.937-1.97-.004-.005a1.475 1.475 0 0 0-2.088 0l-6.081 6.08a4.577 4.577 0 1 0 1.202 1.222l3.051-3.05 1.16 1.159a.857.857 0 1 0 1.212-1.212l-1.16-1.16 1.658-1.658Zm-9.727 5.6a2.863 2.863 0 1 0 0 5.726 2.863 2.863 0 0 0 0-5.726Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 2.571A2.571 2.571 0 0 1 2.571 0H21.43A2.571 2.571 0 0 1 24 2.571v4.286a.857.857 0 0 1-1.714 0H1.714v12.857a.857.857 0 0 0 .857.857h.858a.857.857 0 0 1 0 1.715H2.57A2.572 2.572 0 0 1 0 19.714V2.571Zm1.965-.606a.857.857 0 0 1 .606-.25H21.43a.857.857 0 0 1 .857.856v2.572H1.714V2.57c0-.227.09-.445.251-.606Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgBrowserSecurity;
