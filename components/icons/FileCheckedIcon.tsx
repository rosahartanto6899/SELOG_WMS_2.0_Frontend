import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgFileCheckedIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 21 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    className="fms-icon"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.348 8.236a.714.714 0 1 0-1.211-.757l-3.182 5.09-1.53-1.02a.714.714 0 0 0-.793 1.188l2.143 1.429a.714.714 0 0 0 1.002-.216l3.571-5.714Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.171 0a2.143 2.143 0 0 0-2.143 2.143v15.714A2.143 2.143 0 0 0 4.171 20h12.857a2.143 2.143 0 0 0 2.143-2.143v-10a.714.714 0 0 0-.209-.505L11.819.21A.714.714 0 0 0 11.314 0H4.171Zm-.505 1.638a.714.714 0 0 1 .505-.21h6.847l6.725 6.725v9.704a.714.714 0 0 1-.715.714H4.171a.714.714 0 0 1-.714-.714V2.143c0-.19.075-.371.21-.505Z"
      fill="currentColor"
    />
  </svg>
);
export default SvgFileCheckedIcon;
