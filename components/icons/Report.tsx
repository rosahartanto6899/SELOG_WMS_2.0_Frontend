import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgReport = ({
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
    className="fms-icon"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M.571 0A.571.571 0 0 0 0 .571V15.43c0 .315.256.571.571.571H15.43a.571.571 0 1 0 0-1.143h-.572V4a.571.571 0 0 0-.571-.571H9.714A.571.571 0 0 0 9.143 4v2.857H5.714V.571A.571.571 0 0 0 5.143 0H.57Zm8.572 8H5.714v6.857h3.429V8Zm4.571 6.857V4.571h-3.428v10.286h3.428Zm-9.143 0H1.143V1.143H4.57v13.714Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgReport;
