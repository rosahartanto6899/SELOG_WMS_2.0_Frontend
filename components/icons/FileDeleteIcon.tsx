import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgFileDeleteIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 14 16"
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
      d="M1.857 0A1.714 1.714 0 0 0 .143 1.714v12.572A1.714 1.714 0 0 0 1.857 16h10.286a1.714 1.714 0 0 0 1.714-1.714v-8a.572.572 0 0 0-.167-.404L7.976.167A.571.571 0 0 0 7.572 0H1.857Zm7.536 7.261a.571.571 0 1 0-.808-.808l-2.02 2.019-2.018-2.019a.571.571 0 0 0-.808.808L5.758 9.28l-2.019 2.019a.571.571 0 1 0 .808.808l2.019-2.019 2.019 2.019a.571.571 0 1 0 .808-.808L7.374 9.28l2.019-2.019Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgFileDeleteIcon;
