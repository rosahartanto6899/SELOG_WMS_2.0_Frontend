import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgUploadIcon = ({
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
      d="M1.05 5.478c.213-.215.504-.335.807-.335H3a.571.571 0 0 1 0 1.143H1.857v8.571h10.286V6.286H11a.571.571 0 1 1 0-1.143h1.143a1.143 1.143 0 0 1 1.143 1.143v8.571A1.143 1.143 0 0 1 12.143 16H1.857a1.143 1.143 0 0 1-1.143-1.143V6.286c0-.303.12-.594.335-.808Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7 10.857a.571.571 0 0 0 .572-.571V2.523l1.31 1.31a.571.571 0 0 0 .808-.808L7.404.739a.57.57 0 0 0-.4-.167h-.007a.57.57 0 0 0-.401.167L4.31 3.025a.571.571 0 0 0 .808.808l1.31-1.31v7.763c0 .315.256.571.572.571Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgUploadIcon;
