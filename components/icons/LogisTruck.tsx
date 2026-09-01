import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgLogisTruck = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1.25em"
    height="1.25em"
    viewBox="0 0 24 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="'logis-icon'"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <circle
      cx="14.2741"
      cy="15.8743"
      r="1.66667"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <ellipse
      cx="5.94059"
      cy="15.8743"
      rx="1.66667"
      ry="1.66667"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M9.27393 15.041H12.6073M11.3573 6.70764H12.143C13.235 6.70764 13.7811 6.70764 14.244 6.96974C14.7069 7.23184 15.0156 7.71574 15.6329 8.68353C16.0658 9.36216 16.5201 9.85474 17.1591 10.293C17.8024 10.7342 18.1083 10.9498 18.278 11.296C18.4406 11.6275 18.4406 12.0201 18.4406 12.8054C18.4406 13.8407 18.4406 14.3583 18.1498 14.6872C18.1373 14.7014 18.1245 14.7151 18.1113 14.7285C17.8052 15.041 17.3234 15.041 16.3598 15.041H15.9406"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.9409 6.70764L11.7694 8.77894C12.1754 9.79378 12.3783 10.3012 12.8016 10.5878C13.2248 10.8743 13.7713 10.8743 14.8644 10.8743H17.6076"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.16523 15.041C3.03796 15.041 2.47432 15.041 2.12412 14.6749C1.77393 14.3087 1.77393 13.7195 1.77393 12.541V6.70764C1.77393 5.52913 1.77393 4.93987 2.12412 4.57376C2.47432 4.20764 3.03796 4.20764 4.16523 4.20764H8.54929C9.67656 4.20764 10.2402 4.20764 10.5904 4.57376C10.9406 4.93987 10.9406 5.52913 10.9406 6.70764V15.041H7.35364"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default SvgLogisTruck;
