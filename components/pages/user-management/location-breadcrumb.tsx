import { Breadcrumb } from "antd";

import styles from "./base-layout.module.scss";

interface LocationBreadcumbProps {
  locationUrlList: {
    title: string;
    href?: string;
  }[];
}

const LocationBreadcumb = ({ locationUrlList }: LocationBreadcumbProps) => (
  <Breadcrumb
    className={styles["breadcrumb-container"]}
    items={locationUrlList.map((url, idx: number) => {
      if (idx === 0 || idx === locationUrlList.length - 1)
        return { title: url.title };
      return {
        title: url.title,
        href:
          url.href ??
          `/${locationUrlList
            .slice(0, -1)
            .map((u) => u.title)
            .join("/")
            .split(" ")
            .join("-")
            .toLowerCase()}`,
      };
    })}
  />
);

export default LocationBreadcumb;
