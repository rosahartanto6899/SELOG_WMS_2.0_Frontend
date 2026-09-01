import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import SeraButton from "@sera-components/button";
import { IFatigueDetailsResponseQuestion } from "@sera-types/driver-fatigue.type";
import { ROUTE } from "@sera-utils/constants/routes";
import useCheckPermission from "@sera-utils/hooks/useCheckPermission";
import { Col, Radio, Row, Switch } from "antd";
import dayjs from "dayjs";
import { isEmpty, isNil } from "lodash";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import FatigueStatus, { TStatusType } from "./FatigueStatus";
import useDriverFatigue from "./hooks/useDriverFatigue";

export const DRIVER_FATIGUE_DEFAULT_UNCHECK = [
  "updatedFrom",
  "updatedBy",
  "updatedDate",
];

export const Columns = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "driverFatigue.table",
  });

  const { isRead, isUpdate } = useCheckPermission({
    menuLink: ROUTE.DRIVER_MANAGEMENT.DRIVER_FATIGUE,
  });

  const {
    events: { clearDetailsData },
  } = useDriverFatigue();

  return [
    {
      title: "No",
      key: "no",
      render: (_: never, record: any) => (
        <Row justify="center">
          <Col>{record.no}</Col>
        </Row>
      ),
      width: 60,
      fixed: "left",
      exception: true,
    },
    {
      title: t("column.branchId"),
      dataIndex: "branchName",
      key: "branchName",
      truncate: true,
      align: "left",
      fixed: "left",
    },
    {
      title: t("column.shipmentType"),
      dataIndex: "shipmentType",
      key: "shipmentType",
      truncate: true,
      align: "left",
      fixed: "left",
    },
    {
      title: t("column.driverId"),
      dataIndex: "driverId",
      key: "driverId",
      truncate: true,
      align: "left",
      fixed: "left",
    },
    {
      title: t("column.driverName"),
      dataIndex: "driverName",
      key: "driverName",
      truncate: true,
      align: "left",
      fixed: "left",
    },
    {
      title: t("column.fatigueLevel"),
      dataIndex: "fatigueLevel",
      key: "fatigueLevel",
      sorter: true,
      align: "center",
      render: (value: "low" | "medium" | "high" | null) => {
        if (isNil(value)) return "-";
        return <FatigueStatus value={value.toLowerCase() as TStatusType} />;
      },
    },
    {
      title: t("column.lastShipment"),
      dataIndex: "lastShipment",
      key: "lastShipment",
      truncate: true,
      align: "left",
    },
    {
      title: t("column.numberOfTrip"),
      dataIndex: "numberOfTrip",
      key: "numberOfTrip",
      truncate: true,
      sorter: true,
      align: "center",
    },
    {
      title: t("column.hoursDriven"),
      dataIndex: "hoursDriven",
      key: "hoursDriven",
      sorter: true,
      truncate: true,
      align: "center",
    },
    {
      title: t("column.healthResult"),
      dataIndex: "healthResult",
      key: "healthResult",
      sorter: true,
      align: "center",
      render: (value: TStatusType | null) => {
        if (isNil(value) || isEmpty(value)) return "";
        return <FatigueStatus value={value as TStatusType} width={110} />;
      },
    },

    {
      title: t("column.recommendation"),
      dataIndex: "recommendation",
      key: "recommendation",
      truncate: true,
      align: "left",
      sorter: true,
    },
    {
      title: t("column.updatedFrom"),
      dataIndex: "updatedFrom",
      key: "updatedFrom",
      truncate: true,
      align: "center",
    },
    {
      title: t("column.updatedBy"),
      dataIndex: "updatedBy",
      key: "updatedBy",
      truncate: true,
      align: "center",
    },
    {
      title: t("column.updatedDate"),
      dataIndex: "updatedDate",
      key: "updatedDate",
      truncate: true,
      align: "center",
      render: (value: string) => dayjs(value).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      key: "actions",
      dataIndex: "id",
      title: t("column.actions"),
      fixed: "right",
      align: "center",
      exception: true,
      render: (_record: any) => (
        <Row justify="center" gutter={[8, 4]}>
          {isRead && (
            <Col>
              <Link
                id="link-detail-unit-activities"
                href={`${ROUTE.DRIVER_MANAGEMENT.DRIVER_FATIGUE}/${_record}`}
                passHref
              >
                <SeraButton
                  id="detail-button"
                  size="small"
                  tooltip={t("button.detail.tooltip")}
                  type="link"
                  icon={<EyeOutlined />}
                  onClick={() => clearDetailsData()}
                />
              </Link>
            </Col>
          )}

          {isUpdate && (
            <Col>
              <Link
                id="link-edit-unit-activities"
                href={`${ROUTE.DRIVER_MANAGEMENT.DRIVER_FATIGUE}/edit/${_record}`}
                passHref
              >
                <SeraButton
                  id="edit-button"
                  size="small"
                  tooltip={t("button.update.tooltip")}
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => clearDetailsData()}
                />
              </Link>
            </Col>
          )}
        </Row>
      ),
    },
  ]?.map((_column) => ({ ..._column, hidden: false }));
};

export const ColumnDeclaration = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "driverFatigue.tableHealth",
  });
  return [
    {
      title: "No",
      key: "no",
      render: (_: never, record: any) => (
        <Row justify="center">
          <Col>{record.no}</Col>
        </Row>
      ),
      fixed: "left",
      exception: true,
    },
    {
      title: t("column.question"),
      dataIndex: "question",
      key: "question",
    },
    // {
    //   title: t("column.answer"),
    //   dataIndex: "answer",
    //   key: "answer",
    //   width: 160,
    //   align: "center",
    //   render: (value: boolean, record: any) => {
    //     if (record.isStatement) {
    //       return (
    //         <div style={{ pointerEvents: "none" }}>
    //           <Radio.Group
    //             size="small"
    //             defaultValue={Boolean(value)}
    //             buttonStyle="solid"
    //           >
    //             <Radio.Button value={true}>Yes</Radio.Button>
    //             <Radio.Button value={false}>No</Radio.Button>
    //           </Radio.Group>
    //         </div>
    //       );
    //     }
    //   },
    // },
  ]?.map((_column) => ({ ..._column, hidden: false }));
};

export const ColumnHealth = (
  isEditable: boolean,
  handleChange: (
    value: boolean | null,
    record: IFatigueDetailsResponseQuestion,
  ) => void,
) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "driverFatigue.tableHealth",
  });
  return [
    {
      title: "No",
      key: "no",
      render: (_: never, record: any) => (
        <Row justify="center">
          <Col>{record.no}</Col>
        </Row>
      ),
      width: 10,
      fixed: "left",
      exception: true,
    },
    {
      title: t("column.question"),
      dataIndex: "question",
      key: "question",
      width: 160,
      render: (val: string) => (
        <Col style={{ textJustify: "auto", fontWeight: "bold" }}>{val}</Col>
      ),
    },
    {
      title: t("column.answer"),
      dataIndex: "answer",
      key: "answer",
      width: 160,
      align: "center",
      render: (
        value: boolean | null,
        record: IFatigueDetailsResponseQuestion,
      ) => {
        if (isEditable) {
          return (
            // <Radio.Group
            //   size="small"
            //   value={Boolean(
            //     dataSource.find((e) => e.id === record.id)?.answer,
            //   )}
            //   buttonStyle="solid"
            //   onChange={(e) => handleChange(e.target.value, record)}
            //   options={[
            //     { label: "Yes", value: true },
            //     { label: "No", value: false },
            //   ]}
            //   optionType="button"
            // />
            <Switch
              checkedChildren="Yes"
              unCheckedChildren="No"
              defaultChecked={Boolean(value)}
              onChange={(e) => handleChange(e, record)}
            />
          );
        } else {
          return (
            <div style={{ pointerEvents: "none" }}>
              <Radio.Group
                size="small"
                defaultValue={Boolean(value)}
                buttonStyle="solid"
              >
                <Radio.Button value={true}>Yes</Radio.Button>
                <Radio.Button value={false}>No</Radio.Button>
              </Radio.Group>
            </div>
          );
        }
      },
    },
  ]?.map((_column) => ({ ..._column, hidden: false }));
};

export const summarySwipeConfig = [
  {
    breakpoint: 1250,
    settings: {
      slidesToShow: 4,
      slidesToScroll: 1,
    },
  },
  {
    breakpoint: 1130,
    settings: {
      slidesToShow: 3.15,
      slidesToScroll: 1,
    },
  },
  {
    breakpoint: 875,
    settings: {
      slidesToShow: 2.5,
      slidesToScroll: 1,
    },
  },
  {
    breakpoint: 700,
    settings: {
      slidesToShow: 2.25,
      slidesToScroll: 1,
    },
  },
  {
    breakpoint: 600,
    settings: {
      slidesToShow: 1.25,
      slidesToScroll: 1,
    },
  },
  {
    breakpoint: 480,
    settings: {
      slidesToShow: 1.25,
      slidesToScroll: 1,
    },
  },
];

export const LOCAL_DECLARATION_QUESTIONS = [
  {
    id: "local_1",
    text: "Saya sudah cukup tidur minimal 6 jam",
    fontWeight: "regular",
    isStatement: false,
  },
  {
    id: "local_2",
    text: "Saya tidak mengkonsumsi alkohol dan narkoba",
    fontWeight: "regular",
    isStatement: false,
  },
  {
    id: "local_3",
    text: "Saya tidak memiliki kondisi mata merah/berair atau kering/pandangan kabur",
    fontWeight: "regular",
    isStatement: false,
  },
  {
    id: "local_4",
    text: "Saya tidak merasakan keluhan sakit seperti sakit kepala, vertigo, demam, lemas",
    fontWeight: "regular",
    isStatement: false,
  },
  {
    id: "local_5",
    text: "Saya tidak memiliki riwayat penyakit kronis (misalnya tekanan darah tinggi/tekanan darah rendah, diabetes, penyakit jantung, gangguan pernapasan, atau penyakit lainnya)?",
    fontWeight: "regular",
    isStatement: false,
  },
  // {
  //   id: "local_6",
  //   text: "Dengan ini saya menyatakan bahwa seluruh informasi kesehatan yang saya berikan dalam Form Deklarasi Kesehatan ini adalah benar, jujur, dan dapat dipertanggungjawabkan. Saya menyadari bahwa memberikan keterangan yang tidak benar, tidak lengkap, atau menutupi kondisi kesehatan yang dapat membahayakan keselamatan berkendara dapat mengakibatkan risiko kecelakaan yang membahayakan diri saya, kendaraan, muatan, serta pihak lain dan saya bersedia bertanggung jawab dan menerima konsekuensi sesuai dengan ketentuan perusahaan yang berlaku.",
  //   fontWeight: "bold",
  //   isStatement: true,
  // },
];
