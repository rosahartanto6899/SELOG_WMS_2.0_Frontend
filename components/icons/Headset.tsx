import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgHeadset = ({
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
      d="M11.985 1.714A5.88 5.88 0 0 0 6 7.498v7.93a1.714 1.714 0 0 1-1.714 1.715H2.57A2.571 2.571 0 0 1 0 14.572v-3.429a2.571 2.571 0 0 1 2.571-2.571h1.715V7.479A7.595 7.595 0 0 1 12 0a7.594 7.594 0 0 1 7.714 7.479v1.093h1.715A2.571 2.571 0 0 1 24 11.143v3.429a2.571 2.571 0 0 1-2.571 2.571h-1.715v.429a4.285 4.285 0 0 1-3.534 4.219 3 3 0 0 1-2.894 2.21h-2.572a3 3 0 1 1 0-6h2.572a3 3 0 0 1 2.844 2.044A2.57 2.57 0 0 0 18 17.573V7.498a5.88 5.88 0 0 0-5.985-5.784L12 .857l-.015.857ZM14.57 21a1.286 1.286 0 0 0-1.285-1.286h-2.572a1.286 1.286 0 0 0 0 2.572h2.572A1.286 1.286 0 0 0 14.57 21Zm6.858-5.571h-1.715v-5.143h1.715a.857.857 0 0 1 .857.857v3.429a.857.857 0 0 1-.857.857ZM2.57 10.286h1.715v5.143H2.57a.857.857 0 0 1-.857-.857v-3.429a.857.857 0 0 1 .857-.857Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgHeadset;
