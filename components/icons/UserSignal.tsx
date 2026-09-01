import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgUserSignal = ({
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
      d="M12.069.012a11.571 11.571 0 0 0-9.184 18.612.857.857 0 0 0 1.36-1.043 9.857 9.857 0 1 1 15.646 0 .857.857 0 0 0 1.36 1.043A11.572 11.572 0 0 0 12.069.012Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.286 11.571a4.714 4.714 0 1 1 9.428 0 4.714 4.714 0 0 1-9.428 0Zm4.714-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"
      fill="currentColor"
    />
    <path
      d="M7.538 19.358a8.571 8.571 0 0 1 12.08 3.392.857.857 0 0 1-1.523.785 6.857 6.857 0 0 0-12.19 0 .857.857 0 0 1-1.524-.785 8.571 8.571 0 0 1 3.157-3.392Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgUserSignal;
