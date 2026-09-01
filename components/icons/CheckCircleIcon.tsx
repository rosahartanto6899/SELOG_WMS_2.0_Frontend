import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgCheckCircleIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 20 20"
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
      d="M18.314 4.443A10.011 10.011 0 0 0 13.828.757 10.025 10.025 0 0 0 8.043.186a9.918 9.918 0 0 0-5.114 2.743A10.137 10.137 0 0 0 .186 8.043a10.025 10.025 0 0 0 .571 5.786A10.012 10.012 0 0 0 10 20a10.001 10.001 0 0 0 8.314-15.557Zm-5.028 13.471a8.652 8.652 0 0 1-4.957.486A8.56 8.56 0 0 1 1.6 11.671a8.663 8.663 0 0 1 .486-4.957 8.472 8.472 0 0 1 3.157-3.843A8.58 8.58 0 0 1 10 1.43c2.271 0 4.457.9 6.057 2.514A8.553 8.553 0 0 1 18.571 10c0 1.7-.5 3.357-1.443 4.757a8.547 8.547 0 0 1-3.842 3.157Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.643 5.1a.705.705 0 0 0-.972.257l-4.585 7.857-2.929-2.343a.707.707 0 0 0-1 .115.707.707 0 0 0 .114 1L8.2 14.329a1.39 1.39 0 0 0 .886.314c.085 0 .171 0 .257-.029.2-.043.4-.114.557-.243.171-.114.314-.271.414-.442L14.9 6.07a.705.705 0 0 0-.257-.971Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCheckCircleIcon;
