import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgStoreMenu = ({
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
      d="M1.76.346A.571.571 0 0 1 2.286 0h11.428c.229 0 .435.136.525.346l1.71 3.99a.566.566 0 0 1 .05.218l.001.021v1.15a2.87 2.87 0 0 1-2.88 2.88h-.32a2.871 2.871 0 0 1-2.314-1.16 2.87 2.87 0 0 1-2.314 1.161h-.32a2.87 2.87 0 0 1-2.32-1.17 2.87 2.87 0 0 1-2.32 1.169h-.32a2.87 2.87 0 0 1-2.88-2.88v-1.04a.571.571 0 0 1 .034-.339l1.714-4ZM10.49 4h4.072l-1.224-2.857H2.662L1.438 4h9.053Zm.573 1.143v.583A1.728 1.728 0 0 0 12.8 7.463h.32a1.728 1.728 0 0 0 1.737-1.737v-.583h-3.794Zm-1.154 0H6.114v.583a1.728 1.728 0 0 0 1.737 1.737h.32A1.728 1.728 0 0 0 9.91 5.726v-.583Zm-8.755 0v.583a1.728 1.728 0 0 0 1.737 1.737h.32A1.728 1.728 0 0 0 4.95 5.726v-.583H1.154ZM1.714 9.143c.316 0 .572.256.572.571v1.143H8.57V9.714a.571.571 0 1 1 1.143 0v5.143h3.992l.004-.004.002-.002.002-.004V9.714a.571.571 0 1 1 1.143 0v5.143c0 .31-.135.596-.328.794-.224.241-.53.349-.815.349H2.286c-.31 0-.596-.136-.794-.328a1.108 1.108 0 0 1-.35-.815V9.714c0-.315.257-.571.572-.571ZM2.286 12v2.85l.004.003.002.002.004.002h6.275V12H2.286Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgStoreMenu;
