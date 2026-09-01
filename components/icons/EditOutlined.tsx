import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgEditOutlined = ({
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
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.806-.005a1.286 1.286 0 0 0-.912.38l-4.91 4.893a.429.429 0 0 0-.121.234l-.429 2.606a.429.429 0 0 0 .5.491l2.57-.463a.429.429 0 0 0 .228-.12l4.893-4.909a1.286 1.286 0 0 0 0-1.825l-.906-.907h-.001a1.286 1.286 0 0 0-.912-.38Zm-.165.89a.429.429 0 0 1 .469.094l.91.91.001.001a.43.43 0 0 1 0 .609l-.002.001L6.22 7.316l-1.841.332.307-1.87L9.5.98 9.5.979a.429.429 0 0 1 .14-.094Z"
      fill="currentColor"
    />
    <path
      d="M.983 2.268c.08-.08.19-.125.303-.125h2.571a.429.429 0 1 0 0-.857H1.286A1.286 1.286 0 0 0 0 2.57v8.143A1.286 1.286 0 0 0 1.286 12h8.143a1.286 1.286 0 0 0 1.285-1.286V8.143a.429.429 0 0 0-.857 0v2.571a.429.429 0 0 1-.428.429H1.286a.429.429 0 0 1-.429-.429V2.571c0-.113.045-.222.126-.303Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgEditOutlined;
