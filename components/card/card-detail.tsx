/* eslint-disable react/no-array-index-key */
import { CopyOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import StatusTag from "@sera-components/status-tag";
import Typography from "@sera-components/typography";
import {
  Flex,
  Input,
  List,
  Space,
  Tooltip,
  Typography as AntTypography,
} from "antd";
import { isArray } from "lodash";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import styles from "./card-detail.module.scss";

const DynamicIcon = dynamic(
  () => import("@sera-components/icons/DynamicIcon"),
  {
    ssr: false,
  },
);

type DataValue = string | React.ReactNode;

export interface CardDetailDataProps {
  label: string;
  value: DataValue | DataValue[];
  subValue?: string;
  type?: "default" | "link" | "tag" | "copyable";
  subType?: "default" | "link";
}

interface CardDetailProps {
  icon?: string;
  title?: string;
  data?: CardDetailDataProps[];
  grid?: {
    gutter?: number;
    column?: number;
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    xxl?: number;
  };
}

interface DetailItemProps extends Omit<CardDetailDataProps, "label"> {
  secondary?: boolean;
}

export const CopiedItem = ({ link }: { link: string }) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "xenditLink.defaultTooltip",
  });
  const [title, setTitle] = useState<string>(t("0"));

  const handleCopyClick = () => {
    navigator.clipboard.writeText(link);
    setTitle(t("1"));
  };

  return (
    <Space.Compact block>
      <Input id="input-copy" value={link} readOnly />
      <Tooltip title={title}>
        <Button
          id="button-copy"
          icon={<CopyOutlined />}
          onClick={() => handleCopyClick()}
          onMouseLeave={() => {
            setTimeout(() => {
              setTitle(t("0"));
            }, 200);
          }}
        />
      </Tooltip>
    </Space.Compact>
  );
};

export const DetailItem = ({
  value,
  type = "default",
  secondary = false,
}: DetailItemProps) => {
  const valueRef = useRef<HTMLDivElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (valueRef.current && value) {
        setIsTruncated(
          valueRef.current.scrollHeight > valueRef.current.clientHeight,
        );
      }
    }, 0);
  }, [valueRef, value]);

  return (
    <Tooltip title={isTruncated ? value : ""}>
      <AntTypography.Text
        ref={valueRef}
        className={`${styles.truncate} ${type === "link" ? styles["typography-link"] : styles["typography-default"]} ${secondary ? styles["text-secondary"] : styles["text-primary"]}`}
      >
        {value}
      </AntTypography.Text>
    </Tooltip>
  );
};

const CardDetail = ({ icon, title, data, grid }: CardDetailProps) => (
  <>
    <Typography.Title level={5}>
      <Flex align="center" gap={8}>
        {icon ? <DynamicIcon type={icon} /> : null} {title}
      </Flex>
    </Typography.Title>

    <List
      grid={grid ?? { gutter: 16, xs: 1, sm: 2, md: 2, lg: 2, xl: 4, xxl: 4 }}
      dataSource={data}
      locale={{ emptyText: "-" }}
      renderItem={(_item) => (
        <List.Item>
          <Flex vertical>
            <Typography.Text type="secondary" fontSize={14}>
              {_item?.label}
            </Typography.Text>

            {isArray(_item?.value) ? (
              _item?.value?.map((_list, _index) => (
                <DetailItem key={_index} value={_list} />
              ))
            ) : _item?.type === "tag" ? (
              <span>
                {_item?.value ? (
                  <StatusTag value={_item?.value as string} />
                ) : (
                  "-"
                )}
              </span>
            ) : _item?.type === "copyable" ? (
              <CopiedItem link={_item?.value?.toString() ?? ""} />
            ) : (
              <DetailItem value={_item?.value} type={_item?.type} />
            )}

            {_item?.subValue ? (
              <DetailItem
                value={_item?.subValue}
                type={_item?.subType}
                secondary
              />
            ) : null}
          </Flex>
        </List.Item>
      )}
    />
  </>
);

export default CardDetail;
