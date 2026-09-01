import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgUserHome = ({
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
      d="M6.857 12a5.143 5.143 0 1 1 10.286 0 5.143 5.143 0 0 1-10.286 0ZM12 8.571a3.429 3.429 0 1 0 0 6.858 3.429 3.429 0 0 0 0-6.858Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.419.227a.857.857 0 0 1 1.162 0l10.592 9.777c.527.487.827 1.172.827 1.89v9.535A2.571 2.571 0 0 1 21.429 24h-2.504a.858.858 0 0 1-.135 0H5.21a.858.858 0 0 1-.135 0H2.57A2.571 2.571 0 0 1 0 21.429v-9.536c0-.717.3-1.402.827-1.89L11.42.228ZM6.756 22.286h10.488a7.377 7.377 0 0 0-1.766-1.555A6.55 6.55 0 0 0 12 19.717a6.55 6.55 0 0 0-3.478 1.014 7.377 7.377 0 0 0-1.766 1.555Zm12.592 0a9.276 9.276 0 0 0-2.961-3.008A8.263 8.263 0 0 0 12 18.003a8.263 8.263 0 0 0-4.387 1.275 9.276 9.276 0 0 0-2.961 3.008h-2.08a.857.857 0 0 1-.858-.857v-9.536c0-.239.1-.467.276-.63L12 2.024l10.01 9.24c.176.163.276.391.276.63v9.536a.857.857 0 0 1-.857.857h-2.08Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgUserHome;
