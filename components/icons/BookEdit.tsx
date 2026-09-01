import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgBookEdit = ({
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
      d="M6.857 1.714v20.572h6.857a.857.857 0 0 1 0 1.714H2.571A2.571 2.571 0 0 1 0 21.429V2.57A2.571 2.571 0 0 1 2.571 0H15.43a.857.857 0 1 1 0 1.714H6.857Zm-4.286 0a.857.857 0 0 0-.857.857V21.43a.857.857 0 0 0 .857.857h2.572V1.714H2.57ZM20.571 0c.325 0 .622.183.767.474l2.572 5.143c.059.119.09.25.09.383v14.571a3.429 3.429 0 1 1-6.857 0V6c0-.133.03-.264.09-.383L19.805.474A.857.857 0 0 1 20.57 0Zm-1.714 17.143v3.428a1.715 1.715 0 0 0 3.429 0v-3.428h-3.429Zm0-1.714V6.202l1.714-3.428 1.715 3.428v9.227h-3.429Z"
      fill="currentColor"
    />
    <path
      d="M10.286 6a.857.857 0 0 0 0 1.714h3.428a.857.857 0 0 0 0-1.714h-3.428Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgBookEdit;
