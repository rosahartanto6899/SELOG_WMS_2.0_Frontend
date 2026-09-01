import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgPoolOutlined = ({
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
    <g clipPath="url(#pool-outlined_svg__a)" fill="#3A8DDB">
      <path d="m11.315 23.656.686-.513c.686.514.687.513.687.513a.86.86 0 0 1-1.373 0Z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.001 5.143a3.429 3.429 0 1 0 0 6.857 3.429 3.429 0 0 0 0-6.857ZM10.287 8.57a1.714 1.714 0 1 1 3.428 0 1.714 1.714 0 0 1-3.428 0Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="m11.315 23.656.686-.513.687.513.006-.008.017-.023.066-.09a86.093 86.093 0 0 0 1.131-1.577 88.722 88.722 0 0 0 2.679-4.048c.973-1.57 1.957-3.29 2.701-4.902.729-1.578 1.285-3.169 1.285-4.437a8.571 8.571 0 1 0-17.143 0c0 1.268.555 2.86 1.284 4.437.744 1.611 1.728 3.332 2.702 4.902a88.745 88.745 0 0 0 3.809 5.625l.066.09.018.023.006.008ZM7.152 3.723A6.857 6.857 0 0 1 18.858 8.57c0 .867-.408 2.164-1.126 3.719-.703 1.521-1.647 3.176-2.602 4.716A87.062 87.062 0 0 1 12 21.686a90.241 90.241 0 0 1-3.129-4.68c-.955-1.54-1.9-3.195-2.602-4.716-.717-1.555-1.126-2.852-1.126-3.719 0-1.818.722-3.562 2.008-4.848Z"
      />
    </g>
    <defs>
      <clipPath id="pool-outlined_svg__a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgPoolOutlined;
