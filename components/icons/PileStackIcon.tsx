import * as React from "react";
import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const PileStackIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="sera-icon"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5 1.5C5 0.671573 5.67157 0 6.5 0H12.5C13.3284 0 14 0.671573 14 1.5V5.5C14 6.32843 13.3284 7 12.5 7H6.5C5.67157 7 5 6.32843 5 5.5V1.5ZM6.5 1C6.22386 1 6 1.22386 6 1.5V5.5C6 5.77614 6.22386 6 6.5 6H12.5C12.7761 6 13 5.77614 13 5.5V1.5C13 1.22386 12.7761 1 12.5 1H6.5Z"
      fill="#3A8DDB"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 2.5C3.27614 2.5 3.5 2.72386 3.5 3V8C3.5 8.13261 3.55268 8.25978 3.64645 8.35355C3.74021 8.44732 3.86739 8.5 4 8.5H11C11.2761 8.5 11.5 8.72386 11.5 9C11.5 9.27614 11.2761 9.5 11 9.5H4C3.60217 9.5 3.22064 9.34196 2.93934 9.06066C2.65804 8.77936 2.5 8.39783 2.5 8V3C2.5 2.72386 2.72386 2.5 3 2.5Z"
      fill="#3A8DDB"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1 5C1 4.72386 0.776142 4.5 0.5 4.5C0.223858 4.5 0 4.72386 0 5V10.5C0 10.8978 0.158035 11.2794 0.43934 11.5607C0.720644 11.842 1.10217 12 1.5 12H9C9.27614 12 9.5 11.7761 9.5 11.5C9.5 11.2239 9.27614 11 9 11H1.5C1.36739 11 1.24022 10.9473 1.14645 10.8536C1.05268 10.7598 1 10.6326 1 10.5V5Z"
      fill="#3A8DDB"
    />
  </svg>
);

export default PileStackIcon;
