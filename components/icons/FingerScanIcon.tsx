import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgFingerScanIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 16 20"
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
      d="M4.27 2.455a6.071 6.071 0 0 1 7.668 9.34.714.714 0 1 0 1.01 1.01 7.5 7.5 0 1 0-10.61 0 .714.714 0 0 0 1.01-1.01 6.071 6.071 0 0 1 .922-9.34Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.885 11.028a1.072 1.072 0 0 1 1.83.758v3.928c0 .395.32.715.714.715h2.857a2.143 2.143 0 0 1 2.143 2.142v.715a.714.714 0 1 0 1.428 0v-.715A3.571 3.571 0 0 0 12.286 15h-2.143v-3.214a2.5 2.5 0 1 0-5 0v7.5a.714.714 0 1 0 1.428 0v-7.5c0-.284.113-.557.314-.758Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgFingerScanIcon;
