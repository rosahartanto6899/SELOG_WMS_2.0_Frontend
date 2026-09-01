import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgDocumentIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 42 42"
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
      d="M16.714 21a.857.857 0 0 0 0 1.714h8.572a.857.857 0 0 0 0-1.714h-8.572ZM15.857 27c0-.473.384-.857.857-.857h8.572a.857.857 0 1 1 0 1.714h-8.572a.857.857 0 0 1-.857-.857ZM16.714 15.857a.857.857 0 0 0 0 1.714h1.715a.857.857 0 1 0 0-1.714h-1.715Z"
      fill="#3A8DDB"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M31.286 18.429c0 .022-.001.043-.003.065.002.025.003.05.003.077v11.858A2.571 2.571 0 0 1 28.714 33H13.286a2.571 2.571 0 0 1-2.572-2.571V11.57A2.571 2.571 0 0 1 13.286 9h8.43c.025 0 .05 0 .076.002a.855.855 0 0 1 .716.296l.056.053 8.37 8.371.053.056c.183.157.299.39.299.65Zm-18-7.715a.857.857 0 0 0-.857.857V30.43c0 .473.383.857.857.857h15.428a.857.857 0 0 0 .858-.857V19.286H22.2a1.2 1.2 0 0 1-1.2-1.2v-7.372h-7.714Zm15.073 6.857-5.645-5.645v5.645h5.645Z"
      fill="#3A8DDB"
    />
  </svg>
);
export default SvgDocumentIcon;
