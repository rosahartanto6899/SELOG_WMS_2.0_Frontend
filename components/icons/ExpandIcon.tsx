import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const ExpandIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    // className="sera-icon"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.5 1C1.36739 1 1.24021 1.05268 1.14645 1.14645C1.05268 1.24021 1 1.36739 1 1.5V6C1 6.27614 0.776142 6.5 0.5 6.5C0.223858 6.5 0 6.27614 0 6V1.5C0 1.10218 0.158035 0.720644 0.43934 0.43934C0.720644 0.158035 1.10218 0 1.5 0H12.5C12.8978 0 13.2794 0.158035 13.5607 0.43934C13.842 0.720644 14 1.10217 14 1.5V12.5C14 12.8978 13.842 13.2794 13.5607 13.5607C13.2794 13.842 12.8978 14 12.5 14H8C7.72386 14 7.5 13.7761 7.5 13.5C7.5 13.2239 7.72386 13 8 13H12.5C12.6326 13 12.7598 12.9473 12.8536 12.8536C12.9473 12.7598 13 12.6326 13 12.5V1.5C13 1.36739 12.9473 1.24022 12.8536 1.14645C12.7598 1.05268 12.6326 1 12.5 1H1.5Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.35357 7.35355C7.54883 7.15829 7.54883 6.84171 7.35357 6.64645C7.15831 6.45118 6.84173 6.45118 6.64646 6.64645L1 12.2929V10C1 9.72386 0.776142 9.5 0.5 9.5C0.223858 9.5 0 9.72386 0 10V13.5C0 13.7761 0.223858 14 0.5 14H4C4.27614 14 4.5 13.7761 4.5 13.5C4.5 13.2239 4.27614 13 4 13H1.70712L7.35357 7.35355Z"
      fill="currentColor"
    />
  </svg>
);

export default ExpandIcon;
