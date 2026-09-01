import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgEditPencilIcon = ({
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
    className="'fms-icon'"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.074-.006a1.714 1.714 0 0 0-1.216.505L5.311 7.024a.571.571 0 0 0-.16.312l-.572 3.474a.571.571 0 0 0 .665.655l3.429-.617a.57.57 0 0 0 .303-.159L15.5 4.143l.002-.001a1.715 1.715 0 0 0 0-2.432l-.002-.001L14.291.5V.5a1.715 1.715 0 0 0-1.217-.506Zm-.22 1.186a.572.572 0 0 1 .626.126l1.213 1.213.002.001a.57.57 0 0 1 0 .812l-.003.002-6.399 6.421-2.455.442.41-2.494 6.418-6.395.003-.002a.571.571 0 0 1 .185-.126Z"
      fill="#3A8DDB"
    />
    <path
      d="M1.31 3.025a.571.571 0 0 1 .404-.168h3.429a.571.571 0 0 0 0-1.143H1.714A1.714 1.714 0 0 0 0 3.43v10.857A1.714 1.714 0 0 0 1.714 16h10.857a1.714 1.714 0 0 0 1.715-1.714v-3.429a.571.571 0 1 0-1.143 0v3.429a.571.571 0 0 1-.572.571H1.714a.572.572 0 0 1-.571-.571V3.429c0-.152.06-.297.167-.404Z"
      fill="#3A8DDB"
    />
  </svg>
);

export default SvgEditPencilIcon;
