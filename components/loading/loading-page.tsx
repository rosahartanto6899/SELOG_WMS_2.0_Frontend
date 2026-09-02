import logoImage from "@sera-public/images/logo.svg";
import { Col, Row } from "antd";
import Image from "next/image";
import React from "react";

import WarehouseSpinner from "./warehouse-spinner";

interface LoadingPageProps {
  height?: string;
}

const LoadingPage = (props: LoadingPageProps) => {
  const { height } = props;

  return (
    <>
      <Row justify="center" align="bottom" style={{ height: height || "50vh" }}>
        <Col>
          <div style={{ position: "relative", width: "200px", height: "60px" }}>
            <Image alt="SELOG" src={logoImage} fill sizes="200px" priority />
          </div>
        </Col>
      </Row>
      <Row
        justify="center"
        align="top"
        style={{ height: height || "50vh", paddingTop: "2.5rem" }}
      >
        <Col>
          <WarehouseSpinner size={96} />
        </Col>
      </Row>
    </>
  );
};

export default LoadingPage;
