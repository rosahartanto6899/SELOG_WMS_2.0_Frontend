import * as React from "react";
import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const DeleteUndoIcon = ({
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
    className="sera-icon"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.8326 0.167384C15.9923 0.327064 16.043 0.565806 15.9619 0.776576L10.2476 15.6337C10.161 15.8588 9.94244 16.0053 9.70131 15.9999C9.46018 15.9944 9.24846 15.8381 9.17218 15.6093L6.97682 9.0232L0.390728 6.82784C0.161913 6.75156 0.00562587 6.53984 0.000148478 6.29871C-0.00532892 6.05758 0.141183 5.83897 0.366299 5.75239L15.2234 0.0381047C15.4342 -0.0429607 15.673 0.00770371 15.8326 0.167384ZM2.26316 6.2473L7.60928 8.02934C7.77991 8.08622 7.9138 8.22011 7.97068 8.39074L9.75272 13.7369L14.4337 1.56633L2.26316 6.2473Z"
      fill="currentColor"
    />
  </svg>
);

export default DeleteUndoIcon;
