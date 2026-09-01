import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgUserLocationIcon = ({
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
      d="M2.571 3.143a3.143 3.143 0 1 1 6.286 0 3.143 3.143 0 0 1-6.286 0ZM8.277 7.513c.16.087.315.181.466.284-.48.74-.743 1.61-.743 2.51 0 .717.307 1.568.67 2.351.334.725.763 1.49 1.195 2.2H.571A.571.571 0 0 1 0 14.285v-1.247c0-1.624.591-3.19 1.657-4.353.439-.48.945-.874 1.494-1.173l.006-.002a5.343 5.343 0 0 1 2.558-.653 5.344 5.344 0 0 1 2.557.653l.005.002Z"
      fill="currentColor"
    />
    <path
      d="m12.571 15.429.453.349a.571.571 0 0 1-.905 0l.452-.35Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="m12.571 15.429-.452.349-.002-.004-.007-.008-.025-.033-.093-.123a32.106 32.106 0 0 1-1.33-1.914 17.089 17.089 0 0 1-1.017-1.789c-.272-.57-.502-1.188-.502-1.71 0-.891.366-1.743 1.01-2.368a3.475 3.475 0 0 1 2.418-.972c.904 0 1.774.348 2.418.972A3.298 3.298 0 0 1 16 10.198c0 .52-.23 1.14-.502 1.71-.282.592-.653 1.22-1.017 1.788a31.943 31.943 0 0 1-1.423 2.037l-.025.033-.007.008-.002.003-.453-.348Zm.572-5.143a.571.571 0 1 1-1.143 0 .571.571 0 0 1 1.143 0Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgUserLocationIcon;
