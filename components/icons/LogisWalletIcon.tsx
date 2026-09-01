import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const LogisWalletIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1.25em"
    height="1.25em"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="logis-wallet-icon"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      d="M10.1406 10.4983C10.1406 11.0506 10.5883 11.4983 11.1406 11.4983C11.6929 11.4983 12.1406 11.0506 12.1406 10.4983C12.1406 9.94601 11.6929 9.49829 11.1406 9.49829C10.5883 9.49829 10.1406 9.94601 10.1406 10.4983Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M10.1431 5.70004C6.52475 5.44931 3.54376 4.91239 2.14062 4.49817V10.5391C2.14062 11.8687 2.14062 12.5335 2.55368 13.0757C2.96673 13.6179 3.53345 13.7711 4.66687 14.0773C6.49811 14.5721 8.42296 14.8668 10.1477 15.0353C11.9352 15.21 12.829 15.2973 13.4848 14.698C14.1406 14.0987 14.1406 13.1359 14.1406 11.2103V9.86791C14.1406 7.99799 14.1406 7.06304 13.6026 6.48276C13.0645 5.90248 12.0907 5.835 10.1431 5.70004Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.8912 5.83166C12.1429 4.88282 12.3708 3.15714 11.692 2.30028C11.2617 1.75718 10.6222 1.80936 9.99514 1.8645C6.69923 2.15437 4.37092 2.7432 3.0693 3.14325C2.50961 3.31526 2.14062 3.86181 2.14062 4.47196"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);
export default LogisWalletIcon;
