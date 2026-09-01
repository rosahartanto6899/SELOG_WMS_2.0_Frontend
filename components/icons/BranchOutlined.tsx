import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgBranchOutlined = ({
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
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.286 14.571c0-.473.383-.857.857-.857h5.143a.857.857 0 1 1 0 1.715H5.143a.857.857 0 0 1-.857-.858ZM5.143 8.571a.857.857 0 1 0 0 1.715h5.143a.857.857 0 1 0 0-1.715H5.143Z"
      fill="#3A8DDB"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.15.212a.857.857 0 0 1 1.129 0l6.857 6a.857.857 0 0 1 .293.645v3.429h7.714c.473 0 .857.383.857.857v12a.857.857 0 0 1-.857.857H.857A.857.857 0 0 1 0 23.143V6.857c0-.247.107-.482.293-.645l6.857-6ZM8.57 22.286v-2.572a.857.857 0 1 0-1.714 0v2.572H1.714V7.246l6-5.25 6 5.25v15.04H8.571ZM22.286 12h-6.857v10.286h6.857V12Z"
      fill="#3A8DDB"
    />
  </svg>
);
export default SvgBranchOutlined;
