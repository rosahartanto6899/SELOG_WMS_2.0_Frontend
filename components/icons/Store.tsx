import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgStore = ({
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
      d="M0 6v3.429a1.714 1.714 0 0 0 1.714 1.714h20.572A1.714 1.714 0 0 0 24 9.429V6a.853.853 0 0 0-.098-.398l-2.083-4.184-.002-.004A2.572 2.572 0 0 0 19.506 0h.003v.857L19.503 0h.003H4.494a2.571 2.571 0 0 0-2.31 1.414L.097 5.602A.854.854 0 0 0 0 6Zm4.485-4.286a.857.857 0 0 0-.77.47L2.242 5.143h19.517l-1.473-2.957a.863.863 0 0 0-.771-.472H4.485Zm17.8 5.143H1.716V9.43h20.57V6.857ZM2.571 13.714c.474 0 .858.384.858.857v1.715h9.428V14.57a.857.857 0 0 1 1.714 0v7.715h6V14.57a.857.857 0 0 1 1.715 0v7.715A1.714 1.714 0 0 1 20.57 24H3.43a1.714 1.714 0 0 1-1.715-1.714V14.57c0-.473.384-.857.857-.857Zm.858 8.572V18h9.428v4.286H3.43Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgStore;
