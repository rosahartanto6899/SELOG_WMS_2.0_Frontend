import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgTopLogin = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 177 166"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="fms-icon"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      d="M-87 135.402h38.906c6.753 0 13.507-1.156 19.894-3.665 15.012-5.903 24.583-16.724 30.497-43.556 8.41-38.145 37.788-39.35 37.788-39.35h53.273c4.71 0 9.377-.91 13.743-2.878 12.904-5.829 36.024-22.626 36.024-67.953H22.148C6.642-22-8.757-18.262-22.694-10.465c-.839.467-1.7.959-2.56 1.475-20.065 12.002-34.583 33.374-40.69 58.313L-87 135.402Z"
      fill="url(#top-login_svg__a)"
    />
    <path
      d="M-53 165.903h38.738c6.724 0 13.448-1.152 19.808-3.652 14.947-5.884 24.476-16.671 30.364-43.419 8.373-38.024 37.625-39.225 37.625-39.225h53.042c4.69 0 9.336-.908 13.683-2.869 12.849-5.81 35.869-22.555 35.869-67.738H55.676c-15.44 0-30.772 3.726-44.648 11.498-.836.466-1.692.956-2.549 1.471C-11.5 33.933-25.954 55.237-32.036 80.097L-53 165.903Z"
      fill="url(#top-login_svg__b)"
    />
    <defs>
      <linearGradient
        id="top-login_svg__a"
        x1={17.969}
        y1={-13.667}
        x2={-54.199}
        y2={128.051}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#759EFA" stopOpacity={0.3} />
        <stop offset={1} stopColor="#A5CAFA" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="top-login_svg__b"
        x1={50}
        y1={71}
        x2={-15.032}
        y2={159.223}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#759EFA" stopOpacity={0.3} />
        <stop offset={1} stopColor="#A5CAFA" stopOpacity={0} />
      </linearGradient>
    </defs>
  </svg>
);
export default SvgTopLogin;
