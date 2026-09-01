"use client";

import { Breadcrumb } from "antd";
import Link from "next/link";
import { connect } from "react-redux";

interface HeaderProps {
  id: string;
  breadcrumb: BreadcrumbProps[];
}

interface BreadcrumbProps {
  title: string;
  href?: string;
}

const Header = ({ id, breadcrumb }: HeaderProps) => (
  <Breadcrumb
    className="custom-breadcrumb"
    items={[
      { title: breadcrumb?.[0]?.title },
      ...breadcrumb.slice(1, breadcrumb.length - 1).map((item, index) => ({
        title: item?.href ? (
          <Link id={`${id}-${index + 1}`} href={item?.href} passHref>
            {item?.title}
          </Link>
        ) : (
          item?.title
        ),
      })),
      { title: breadcrumb?.[breadcrumb.length - 1]?.title },
    ]}
  />
);

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
