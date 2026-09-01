import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgLoadingCircle = ({
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
      d="M8 .434c.316 0 .571.256.571.572v2.857a.571.571 0 0 1-1.142 0V1.006c0-.316.255-.572.571-.572ZM1.865 3.476a.571.571 0 0 1 .807-.034l2.103 1.931a.571.571 0 0 1-.773.842L1.899 4.284a.571.571 0 0 1-.034-.808ZM4.108 9.656a.571.571 0 1 0-.399-1.072L.944 9.613a.571.571 0 0 0 .398 1.071l2.766-1.028ZM6.54 11.922c.282.14.398.483.258.766l-1.269 2.56a.571.571 0 0 1-1.024-.507l1.269-2.56a.571.571 0 0 1 .765-.259ZM14.1 4.284a.571.571 0 0 0-.772-.842l-2.103 1.931a.571.571 0 1 0 .773.842L14.1 4.284ZM11.556 8.92a.571.571 0 0 1 .735-.336l2.765 1.029a.571.571 0 0 1-.398 1.071l-2.766-1.028a.571.571 0 0 1-.336-.735ZM10.226 12.18a.571.571 0 1 0-1.024.508l1.269 2.56a.572.572 0 0 0 1.024-.507l-1.269-2.56Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgLoadingCircle;
