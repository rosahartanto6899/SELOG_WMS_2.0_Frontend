import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const CollapseIcon = ({
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
      d="M1.14645 1.14645C1.24021 1.05268 1.36739 1 1.5 1H6C6.27614 1 6.5 0.776142 6.5 0.5C6.5 0.223858 6.27614 0 6 0H1.5C1.10218 0 0.720644 0.158035 0.43934 0.43934C0.158035 0.720644 0 1.10218 0 1.5V12.5C0 12.8978 0.158035 13.2794 0.43934 13.5607C0.720644 13.842 1.10217 14 1.5 14H12.5C12.8978 14 13.2794 13.842 13.5607 13.5607C13.842 13.2794 14 12.8978 14 12.5V8C14 7.72386 13.7761 7.5 13.5 7.5C13.2239 7.5 13 7.72386 13 8V12.5C13 12.6326 12.9473 12.7598 12.8536 12.8536C12.7598 12.9473 12.6326 13 12.5 13H1.5C1.36739 13 1.24022 12.9473 1.14645 12.8536C1.05268 12.7598 1 12.6326 1 12.5V1.5C1 1.36739 1.05268 1.24021 1.14645 1.14645Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.5 0.5C9.5 0.223858 9.72386 0 10 0H13.5C13.7761 0 14 0.223858 14 0.5V4C14 4.27614 13.7761 4.5 13.5 4.5C13.2239 4.5 13 4.27614 13 4V1.70712L7.35355 7.35357C7.15829 7.54883 6.84171 7.54883 6.64645 7.35357C6.45118 7.15831 6.45118 6.84173 6.64645 6.64646L12.2929 1H10C9.72386 1 9.5 0.776142 9.5 0.5Z"
      fill="currentColor"
    />
  </svg>
);

export default CollapseIcon;
