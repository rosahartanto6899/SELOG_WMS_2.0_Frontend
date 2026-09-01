import { LoadingOutlined } from "@ant-design/icons";
import logoImage from "@sera-public/images/logo.svg";
import { Col, Row, Spin } from "antd";
import Image from "next/image";
import React from "react";

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
          <Spin
            indicator={
              <LoadingOutlined style={{ fontSize: 40, fontWeight: 900 }} spin />
            }
          />
        </Col>
      </Row>
    </>
  );
};

export default LoadingPage;
