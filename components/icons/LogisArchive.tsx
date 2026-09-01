import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgLogisArchive = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1.25em"
    height="1.25em"
    viewBox="0 0 24 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="'logis-icon'"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.107422 7.79353C0.107422 7.53155 0.168417 7.27318 0.285576 7.03886L3.07539 1.45922C3.45653 0.696959 4.23562 0.215454 5.08785 0.215454H13.127C13.9792 0.215454 14.7583 0.696959 15.1395 1.45922L17.9293 7.03886C18.0464 7.27318 18.1074 7.53155 18.1074 7.79353V11.1842C18.1074 12.5822 16.9741 13.7155 15.5762 13.7155H2.63867C1.2407 13.7155 0.107422 12.5822 0.107422 11.1842V7.79353ZM4.08162 1.96234C4.27219 1.58121 4.66174 1.34045 5.08785 1.34045H13.127C13.5531 1.34045 13.9427 1.58121 14.1332 1.96234L16.7754 7.2467H11.3574V8.09045C11.3574 9.33309 10.3501 10.3405 9.10742 10.3405C7.86478 10.3405 6.85742 9.33309 6.85742 8.09045V7.2467H1.43944L4.08162 1.96234Z"
      fill="currentColor"
    />
  </svg>
);
export default SvgLogisArchive;
