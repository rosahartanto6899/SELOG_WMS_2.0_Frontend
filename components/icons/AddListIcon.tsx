import * as React from "react";
import { SVGProps } from "react";

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const AddListIcon = ({
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
      d="M1.14286 0.714844C0.511675 0.714844 0 1.22652 0 1.8577C0 2.48888 0.511675 3.00056 1.14286 3.00056C1.77404 3.00056 2.28571 2.48888 2.28571 1.8577C2.28571 1.22652 1.77404 0.714844 1.14286 0.714844Z"
      fill="black"
      fillOpacity="0.85"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.14286 1.28627C4.82727 1.28627 4.57143 1.54211 4.57143 1.8577C4.57143 2.17329 4.82727 2.42913 5.14286 2.42913H15.4286C15.7442 2.42913 16 2.17329 16 1.8577C16 1.54211 15.7442 1.28627 15.4286 1.28627H5.14286Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 7.00056C0 6.36938 0.511675 5.8577 1.14286 5.8577C1.77404 5.8577 2.28571 6.36938 2.28571 7.00056C2.28571 7.63174 1.77404 8.14341 1.14286 8.14341C0.511675 8.14341 0 7.63174 0 7.00056Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.14286 6.42913C4.82727 6.42913 4.57143 6.68497 4.57143 7.00056C4.57143 7.31615 4.82727 7.57199 5.14286 7.57199H15.4286C15.7442 7.57199 16 7.31615 16 7.00056C16 6.68497 15.7442 6.42913 15.4286 6.42913H5.14286Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 12.1434C0 11.5122 0.511675 11.0006 1.14286 11.0006C1.77404 11.0006 2.28571 11.5122 2.28571 12.1434C2.28571 12.7746 1.77404 13.2863 1.14286 13.2863C0.511675 13.2863 0 12.7746 0 12.1434Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.14286 11.572C4.82727 11.572 4.57143 11.8278 4.57143 12.1434C4.57143 12.459 4.82727 12.7148 5.14286 12.7148H15.4286C15.7442 12.7148 16 12.459 16 12.1434C16 11.8278 15.7442 11.572 15.4286 11.572H5.14286Z"
      fill="currentColor"
    />
  </svg>
);

export default AddListIcon;
