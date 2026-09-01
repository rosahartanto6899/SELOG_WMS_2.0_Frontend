import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgRecruitment = ({
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
      d="M5.714 0a3.143 3.143 0 1 0 0 6.286 3.143 3.143 0 0 0 0-6.286Zm-2 3.143a2 2 0 1 1 4 0 2 2 0 0 1-4 0Z"
      fill="#3A8DDB"
    />
    <path
      d="M2.499 9.458C3.361 8.518 4.519 8 5.714 8c.34 0 .678.042 1.005.123a.571.571 0 1 0 .276-1.109 5.304 5.304 0 0 0-1.28-.157c-1.533 0-2.991.665-4.058 1.829C.59 9.848 0 11.415 0 13.039v1.247c0 .315.256.571.571.571h4.572a.571.571 0 1 0 0-1.143h-4v-.675c0-1.352.493-2.64 1.356-3.581Z"
      fill="#3A8DDB"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.429 10.286a2.857 2.857 0 1 1 5.24 1.575l3.164 3.163a.572.572 0 0 1-.808.809l-3.164-3.164a2.857 2.857 0 0 1-4.433-2.384Zm2.857-1.715a1.714 1.714 0 1 0 0 3.429 1.714 1.714 0 0 0 0-3.429Z"
      fill="#3A8DDB"
    />
  </svg>
);

export default SvgRecruitment;
