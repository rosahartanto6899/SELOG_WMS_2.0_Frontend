import { Result, Typography } from "antd";
import React, { ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import RestrictedAccessIcon from "../icons/RestrictedAccessIcon";

export interface PbacGuardHocProps {
  requiredPermission: string;
  permissions: {
    id: string;
    permission: {
      enable: boolean;
      visible: boolean;
    };
  }[];
  children: ReactNode;
}

const { Text } = Typography;
// eslint-disable-next-line no-undef
const PbacGuardHoc = (props: PbacGuardHocProps): JSX.Element => {
  const { t } = useTranslation();

  const { permissions, requiredPermission, children } = props;
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    if (permissions && permissions.length > 0 && requiredPermission) {
      setHasPermission(
        // utils.hasPermission(permissions, requiredPermission).enable &&
        //   utils.hasPermission(permissions, requiredPermission).visible
        true,
      );
      setIsReady(true);
    }
  }, [permissions, requiredPermission]);

  if (!isReady) {
    return <div />;
  }

  return (
    <>
      {hasPermission && children}
      {!hasPermission && (
        <Result
          icon={<RestrictedAccessIcon />}
          title={
            <Text strong style={{ fontSize: "16px" }}>
              {t("global.hoc.restricted.title")}
            </Text>
          }
          subTitle={t("global.hoc.restricted.subtitle")}
        />
      )}
    </>
  );
};

export default PbacGuardHoc;
