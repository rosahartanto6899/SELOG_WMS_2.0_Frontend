import * as React from "react";
import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgVehicleTypeOutlined = ({
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
      d="M12.857 2.571a.857.857 0 1 0-1.714 0v2.572H8.969a2.571 2.571 0 0 0-2.547 1.75l-1.053 3.393H2.57A2.572 2.572 0 0 0 0 12.857v3.429a2.572 2.572 0 0 0 1.776 2.445 4.287 4.287 0 0 0 8.424.126h3.6a4.287 4.287 0 0 0 8.424-.126A2.57 2.57 0 0 0 24 16.286v-3.429a2.571 2.571 0 0 0-2.571-2.571h-1.953l-1.125-3.39-.001-.003a2.571 2.571 0 0 0-2.547-1.75h-2.946V2.57Zm-.863 4.286h3.829l.044-.001a.857.857 0 0 1 .858.583l1.319 3.974c.116.35.444.587.813.587h2.572a.857.857 0 0 1 .857.857v3.429c0 .186-.06.366-.17.513a4.288 4.288 0 0 0-8.316.344h-3.6a4.287 4.287 0 0 0-8.315-.344.857.857 0 0 1-.17-.513v-3.429A.857.857 0 0 1 2.57 12H6a.857.857 0 0 0 .819-.603l1.23-3.966a.857.857 0 0 1 .9-.574h3.045ZM18 20.571a2.571 2.571 0 1 1 0-5.142 2.571 2.571 0 0 1 0 5.142ZM6 15.43a2.571 2.571 0 1 1 0 5.142 2.571 2.571 0 0 1 0-5.142Z"
      fill="#3A8DDB"
    />
  </svg>
);
export default SvgVehicleTypeOutlined;
