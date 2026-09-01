import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgHistory = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="fms-icon"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      d="M6 .857a5.143 5.143 0 1 0 4.068 1.996l-.224.894a.429.429 0 0 1-.831-.208l.428-1.714c.058-.23.29-.37.52-.312l1.714.428a.429.429 0 0 1-.208.832l-.488-.122A6 6 0 1 1 6 0a.429.429 0 0 1 0 .856Z"
      fill="currentColor"
    />
    <path
      d="M5.571 3a.429.429 0 1 1 .858 0v3.429c0 .162-.092.31-.237.383L3.963 7.926a.429.429 0 1 1-.383-.766l1.991-.996V3Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgHistory;
