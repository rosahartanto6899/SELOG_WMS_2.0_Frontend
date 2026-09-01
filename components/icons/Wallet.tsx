import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgWallet = ({
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
      d="M16.518 1.721 6.8 4.258a.857.857 0 1 1-.433-1.659L16.08.064a1.697 1.697 0 0 1 2.101 1.242l.48 1.915a.857.857 0 1 1-1.664.416l-.479-1.916Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M.753 7.61a2.571 2.571 0 0 1 1.818-.753h16.286A2.571 2.571 0 0 1 21.43 9.43V12h.857c.947 0 1.714.768 1.714 1.714v2.572c0 .947-.767 1.714-1.714 1.714h-.857v3.429A2.571 2.571 0 0 1 18.857 24H2.571A2.572 2.572 0 0 1 0 21.43v-12c0-.682.27-1.336.753-1.819Zm21.533 8.676v-2.572H18v2.572h4.286ZM19.714 12H18c-.947 0-1.714.768-1.714 1.714v2.572c0 .947.767 1.714 1.714 1.714h1.714v3.429a.857.857 0 0 1-.857.857H2.571a.857.857 0 0 1-.857-.857v-12a.857.857 0 0 1 .857-.857h16.286a.857.857 0 0 1 .857.857V12Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgWallet;
