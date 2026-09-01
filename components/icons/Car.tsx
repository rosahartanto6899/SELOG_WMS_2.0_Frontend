import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgCar = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 22"
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
      d="M12.857 1.571a.857.857 0 1 0-1.714 0v2.572H8.969a2.571 2.571 0 0 0-2.547 1.75L5.369 9.286H2.57A2.571 2.571 0 0 0 0 11.857v3.429a2.571 2.571 0 0 0 1.776 2.445 4.287 4.287 0 0 0 8.424.126h3.6a4.287 4.287 0 0 0 8.424-.126A2.57 2.57 0 0 0 24 15.286v-3.429a2.571 2.571 0 0 0-2.571-2.571h-1.953l-1.125-3.39-.001-.003a2.571 2.571 0 0 0-2.547-1.75h-2.946V1.572Zm-.863 4.286h3.829l.044-.001a.857.857 0 0 1 .858.583l1.319 3.974c.116.35.444.587.813.587h2.572a.858.858 0 0 1 .857.857v3.429c0 .186-.06.366-.17.513a4.288 4.288 0 0 0-8.316.344h-3.6a4.287 4.287 0 0 0-8.315-.344.857.857 0 0 1-.17-.513v-3.429A.857.857 0 0 1 2.57 11H6a.857.857 0 0 0 .819-.603l1.23-3.966a.857.857 0 0 1 .9-.574h3.045ZM18 19.572a2.571 2.571 0 1 1 0-5.143 2.571 2.571 0 0 1 0 5.143ZM6 14.428a2.571 2.571 0 1 1 0 5.143 2.571 2.571 0 0 1 0-5.143Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCar;
