import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgInternet = ({
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
      d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0Zm-1.811 1.873c-4.542.807-8.054 4.595-8.44 9.27h5.168a20.092 20.092 0 0 1 3.272-9.27Zm3.622 0a20.092 20.092 0 0 1 3.272 9.27h5.168c-.386-4.675-3.898-8.463-8.44-9.27Zm1.55 9.27A18.378 18.378 0 0 0 12 2.267a18.378 18.378 0 0 0-3.36 8.876h6.72Zm-6.722 1.714h6.722A18.377 18.377 0 0 1 12 21.733a18.378 18.378 0 0 1-3.36-8.876Zm-1.722 0H1.749c.386 4.675 3.898 8.463 8.44 9.27a20.092 20.092 0 0 1-3.272-9.27Zm6.894 9.27a20.093 20.093 0 0 0 3.272-9.27h5.168c-.386 4.675-3.898 8.463-8.44 9.27Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgInternet;
