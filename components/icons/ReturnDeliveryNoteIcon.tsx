import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgReturnDeliveryNoteIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1.25em"
    height="1.25em"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="sera-icon"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    {/* document with folded corner */}
    <path
      d="M6.5 1H14L18 5V12.5C18 13.0523 17.5523 13.5 17 13.5H6.5C5.94772 13.5 5.5 13.0523 5.5 12.5V2C5.5 1.44772 5.94772 1 6.5 1Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M14 1V5H18"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M8 7.5H15M8 10H12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* hand presenting the document */}
    <path
      d="M7 16.3V14.8C7 14.4686 7.26863 14.2 7.6 14.2C7.93137 14.2 8.2 14.4686 8.2 14.8V16.3"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
    <path
      d="M10.4 16.3V13.8C10.4 13.4686 10.6686 13.2 11 13.2C11.3314 13.2 11.6 13.4686 11.6 13.8V16.3"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
    <path
      d="M13.2 16.3V13.8C13.2 13.4686 13.4686 13.2 13.8 13.2C14.1314 13.2 14.4 13.4686 14.4 13.8V16.3"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
    <path
      d="M16 16.3V14.8C16 14.4686 16.2686 14.2 16.6 14.2C16.9314 14.2 17.2 14.4686 17.2 14.8V16.3"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
    <path
      d="M4.5 17.5C4.5 16.6716 5.17157 16 6 16H18C18.8284 16 19.5 16.6716 19.5 17.5V18.5C19.5 20.1569 18.1569 21.5 16.5 21.5H7.5C5.84315 21.5 4.5 20.1569 4.5 18.5V17.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);
export default SvgReturnDeliveryNoteIcon;
