import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgWrench = ({
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
      d="M13.949.47a7.371 7.371 0 0 1 4.047-.334 2.16 2.16 0 0 1 1.444 1.242.857.857 0 0 1-.183.942l-3.425 3.425a.857.857 0 0 0-.014 1.181l1.279 1.144a.848.848 0 0 1 .045.044.857.857 0 0 0 1.235 0l.01-.012 3.43-3.428a.857.857 0 0 1 1.054-.125 2.16 2.16 0 0 1 .994 1.446 7.39 7.39 0 0 1-9.869 8.305l-8.948 8.932a2.571 2.571 0 0 1-3.67 0l-.61-.611a2.571 2.571 0 0 1 .004-3.674l8.934-8.853A7.372 7.372 0 0 1 13.95.47Zm9.073 5.684-.321.06-.003.003.324-.063Zm-.784.522L19.605 9.31a2.571 2.571 0 0 1-3.673.018l-1.281-1.146a2.571 2.571 0 0 1-.04-3.639l.005-.006 2.768-2.767A5.657 5.657 0 0 0 11.497 9.9c.166.332.1.733-.163.994L1.97 20.172a.856.856 0 0 0 0 1.226l.007.006.624.624a.855.855 0 0 0 1.226 0l.007-.007 9.36-9.343a.857.857 0 0 1 .974-.167 5.674 5.674 0 0 0 8.07-5.836Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgWrench;
