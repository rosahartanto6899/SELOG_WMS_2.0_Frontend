import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
  fillColor?: string;
}

const SvgLayerIcon = ({
  title,
  titleId,
  fillColor = "#3A8DDB",
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
      d="M7.235.162a1.92 1.92 0 0 1 1.53 0l.013.005 6.514 3.018.017.008a1.211 1.211 0 0 1 0 2.163l-.016.008L8.765 8.41a1.92 1.92 0 0 1-1.53 0l-.012-.005L.709 5.387.69 5.38a1.211 1.211 0 0 1 0-2.163l.016-.008L7.235.162Zm.462 1.045L1.202 4.238a.068.068 0 0 0 0 .118l6.494 3.008a.777.777 0 0 0 .608 0l6.494-3.03a.069.069 0 0 0 0-.118L8.304 1.208a.777.777 0 0 0-.607 0Z"
      fill={fillColor}
    />
    <path
      d="M15.948 8.161a.571.571 0 0 1-.28.758l-6.972 3.212h-.002a1.715 1.715 0 0 1-1.422 0h-.003L.332 8.918a.571.571 0 0 1 .48-1.037l6.935 3.21a.571.571 0 0 0 .472 0l6.97-3.21a.571.571 0 0 1 .759.28Z"
      fill={fillColor}
    />
    <path
      d="M15.668 12.633a.571.571 0 1 0-.478-1.037l-6.97 3.21a.574.574 0 0 1-.473 0l-6.935-3.21a.571.571 0 1 0-.48 1.037l6.937 3.212h.003a1.714 1.714 0 0 0 1.422 0h.002l6.972-3.212Z"
      fill={fillColor}
    />
  </svg>
);

export default SvgLayerIcon;
