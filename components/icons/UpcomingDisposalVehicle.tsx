import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgUpcomingDisposalVehicle = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 14 14"
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
      d="M1.5 6a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h5.25a.5.5 0 0 1 0 1H1.5A1.5 1.5 0 0 1 0 9.5v-3A1.5 1.5 0 0 1 1.5 5h7.75a.5.5 0 0 1 0 1H1.5Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 8a1 1 0 1 1 2 0 1 1 0 0 1-2 0ZM2.485 1.33a.5.5 0 0 1 .47-.33h5.09a.5.5 0 0 1 .47.33l1.455 4A.5.5 0 0 1 9.5 6h-8a.5.5 0 0 1-.47-.67l1.455-4Zm.82.67L2.214 5h6.572l-1.09-3H3.304ZM1.5 10a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2a.5.5 0 0 1 .5-.5ZM11.5 9a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="m11 13.5.396.306a.5.5 0 0 1-.792 0l-.002-.003-.006-.008-.022-.029a23.39 23.39 0 0 1-.37-.5c-.238-.33-.556-.784-.875-1.282a14.932 14.932 0 0 1-.89-1.565C8.202 9.92 8 9.379 8 8.923c0-.78.32-1.525.884-2.072A3.04 3.04 0 0 1 11 6c.79 0 1.552.304 2.116.85.564.548.884 1.293.884 2.073 0 .456-.202.997-.44 1.496a14.933 14.933 0 0 1-.889 1.565 28.007 28.007 0 0 1-1.245 1.782l-.022.03-.006.007-.002.002L11 13.5ZM11 7a2.04 2.04 0 0 0-1.42.569c-.373.362-.58.85-.58 1.354 0 .215.11.58.342 1.066.222.465.522.976.83 1.456.299.468.599.898.828 1.215.229-.317.53-.747.829-1.215.307-.48.607-.99.829-1.456.231-.486.342-.851.342-1.066 0-.505-.207-.992-.58-1.354A2.04 2.04 0 0 0 11 7Zm-.396 6.806L11 13.5l-.396.306Z"
      fill="currentColor"
    />
  </svg>
);
export default SvgUpcomingDisposalVehicle;
