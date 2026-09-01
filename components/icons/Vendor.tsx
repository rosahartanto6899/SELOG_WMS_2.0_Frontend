import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
  fillIn?: string;
  fillOut?: string;
}
const SvgVendor = ({
  title,
  titleId,
  fillIn,
  fillOut,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    {...props}
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="fms-icon"
    aria-labelledby={titleId}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <rect width={24} height={24} rx={12} fill={fillOut} />
    <g
      clipPath="url(#vendor_svg__a)"
      fillRule="evenodd"
      clipRule="evenodd"
      fill={fillIn}
    >
      <path d="M5.76 4.346A.571.571 0 0 1 6.286 4h11.428c.229 0 .436.136.526.346l1.709 3.99a.566.566 0 0 1 .05.218l.001.021v1.15a2.87 2.87 0 0 1-2.88 2.88h-.32a2.871 2.871 0 0 1-2.314-1.16 2.871 2.871 0 0 1-2.314 1.161h-.32a2.87 2.87 0 0 1-2.32-1.17 2.871 2.871 0 0 1-2.32 1.169h-.32a2.871 2.871 0 0 1-2.88-2.88v-1.04a.571.571 0 0 1 .034-.339l1.714-4ZM14.49 8h4.072l-1.225-2.857H6.663L5.438 8h9.053Zm.573 1.143v.583a1.728 1.728 0 0 0 1.737 1.737h.32a1.728 1.728 0 0 0 1.737-1.737v-.583h-3.794Zm-1.154 0h-3.795v.583a1.728 1.728 0 0 0 1.737 1.737h.32a1.728 1.728 0 0 0 1.738-1.737v-.583Zm-8.755 0v.583a1.728 1.728 0 0 0 1.737 1.737h.32A1.728 1.728 0 0 0 8.95 9.726v-.583H5.154ZM5.714 13.143c.316 0 .572.256.572.571v1.143h6.285v-1.143a.571.571 0 0 1 1.143 0v5.143h3.992l.004-.004.002-.002.002-.004v-5.133a.571.571 0 1 1 1.143 0v5.143c0 .31-.136.596-.328.794-.224.241-.53.349-.815.349H6.286c-.31 0-.596-.136-.794-.328a1.108 1.108 0 0 1-.35-.815v-5.143c0-.315.257-.571.572-.571ZM6.286 16v2.85l.004.003.002.002.004.002h6.275V16H6.286Z" />
    </g>
    <defs>
      <clipPath id="vendor_svg__a">
        <path fill="#fff" transform="translate(4 4)" d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgVendor;
