import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgDeleteUndo = ({
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
      d="M5.504 1.004A3.429 3.429 0 0 0 4.5 3.43H1.071a.571.571 0 0 0 0 1.142h1.143v9.715A1.714 1.714 0 0 0 3.93 16h7.047L6.71 12.8a1.714 1.714 0 0 1 0-2.743L10.52 7.2a1.714 1.714 0 0 1 1.028-.343h2.095V4.571h1.143a.571.571 0 0 0 0-1.142h-3.429a3.428 3.428 0 0 0-5.853-2.425Zm2.425.139a2.286 2.286 0 0 0-2.286 2.286h4.571A2.286 2.286 0 0 0 7.93 1.143Zm-.61 10.686a.5.5 0 0 1 0-.8L10.557 8.6a.5.5 0 0 1 .8.4v1.929h2a2.5 2.5 0 1 1 0 5H12.5a.5.5 0 0 1 0-1h.857a1.5 1.5 0 1 0 0-3h-2v1.928a.5.5 0 0 1-.8.4L7.32 11.83Z"
      fill="#3A8DDB"
    />
  </svg>
);

export default SvgDeleteUndo;
