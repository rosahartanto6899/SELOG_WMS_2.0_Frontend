import * as React from "react";
import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgResourceLockingImage = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 122 99"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="'fms-icon'"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      d="M61 99c25.129 0 45.5-3.582 45.5-8S86.129 83 61 83s-45.5 3.582-45.5 8 20.371 8 45.5 8Z"
      fill="#F5F5F7"
      fillOpacity={0.8}
    />
    <rect x={10.5} y={17} width={101} height={59} rx={4} fill="#DCE0E6" />
    <rect x={13.5} y={20} width={95} height={49} rx={4} fill="#AEB8C2" />
    <path d="M25.5 4a4 4 0 0 1 4-4h63a4 4 0 0 1 4 4v65h-71V4Z" fill="#F5F5F7" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M44.5 20a2 2 0 0 0-2 2v5.429a2 2 0 0 0 2 2h29a2 2 0 0 0 2-2V22a2 2 0 0 0-2-2h-29Zm2.714 7.071a2.357 2.357 0 1 0 0-4.714 2.357 2.357 0 0 0 0 4.714ZM44.5 31.786a2 2 0 0 0-2 2v5.428a2 2 0 0 0 2 2h23.22A9.955 9.955 0 0 1 72.5 40c.915 0 1.802.123 2.644.353a1.99 1.99 0 0 0 .356-1.139v-5.428a2 2 0 0 0-2-2h-29Zm0 11.785h20.34a9.819 9.819 0 0 0-.183.225l-3.078 1.12 1.121 3.082A10.053 10.053 0 0 0 62.958 53H44.5a2 2 0 0 1-2-2v-5.429a2 2 0 0 1 2-2Zm2.714-4.714a2.357 2.357 0 1 0 0-4.714 2.357 2.357 0 0 0 0 4.714Zm2.357 9.429a2.357 2.357 0 1 1-4.714 0 2.357 2.357 0 0 1 4.714 0ZM72.5 42a8 8 0 0 0-7.17 4.45l-.59-1.62-1.88.684 1.793 4.926 4.927-1.793-.684-1.88-1.82.663a6 6 0 0 1 11.37 1.758l1.912-.697A8.003 8.003 0 0 0 72.5 42Zm7.171 11.55a8.003 8.003 0 0 1-15.029-2.042l1.913-.696a6.001 6.001 0 0 0 11.368 1.758l-1.819.662-.684-1.88 4.927-1.792 1.793 4.926-1.88.684-.589-1.62Z"
      fill="#DCE0E6"
    />
    <path d="M25.5 4a4 4 0 0 1 4-4h63a4 4 0 0 1 4 4v5h-71V4Z" fill="#DCE0E6" />
    <circle cx={30} cy={4.5} r={1.5} fill="#F5F5F7" />
    <circle cx={35} cy={4.5} r={1.5} fill="#F5F5F7" />
    <circle cx={40} cy={4.5} r={1.5} fill="#F5F5F7" />
    <path
      d="M40.5 90a3 3 0 0 1 3-3h35a3 3 0 0 1 3 3v3h-41v-3ZM53.5 76h15v11h-15V76Z"
      fill="#DCE0E6"
    />
  </svg>
);
export default SvgResourceLockingImage;
