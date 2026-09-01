import Card from "@sera-components/card";
import RsFormBuilder from "@sera-components/rs-form-builder";
import StatusTag from "@sera-components/status-tag";
import Table from "@sera-components/table";
import MessageHandler from "@sera-libraries/message-handler";
import { ChildConfig } from "@sera-libraries/types/formBuilderType";
import {
  journeySupportActions,
  locationActions,
  useAppDispatch,
  useAppSelector,
} from "@sera-redux";
import {
  JourneySupportActivity,
  journeySupportTypes,
  UpdateJourneySupportActivtyPayload,
} from "@sera-types/journey-support.type";
import Utils from "@sera-utils/utils";
import { Divider, Flex, Form, Modal } from "antd";
import dayjs from "dayjs";
import { isNull } from "lodash";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { ColumnsActivityLog } from "./journey-support-props-table";

const JourneySupportForm = () => {
  const [form] = Form.useForm();
  const { t } = useTranslation(undefined, {
    keyPrefix: "journeySupport.form",
  });
  const dispatch = useAppDispatch();
  const router = useRouter();
  const id = router.query.id as string;

  const loading = useAppSelector((state) => state.loading);

  const requiredMessage = t("message");
  const messageCordinate = t("messageCoordinate");
  const validCoordinate = t("messageValidCoordinate");

  const isLoadingUpdate = loading[journeySupportTypes.UPDATE_ACTIVITY];

  const {
    detail: { data: journeyDetail },
  } = useAppSelector((state) => state.journeySupport);

  const {
    dropdownLocations: { data: dropdownLocationsData },
  } = useAppSelector((state) => state.locations);

  const { withDash } = Utils();

  const [modalData, setModalData] = useState<{
    data: JourneySupportActivity | null;
    show: boolean;
  }>({
    data: null,
    show: false,
  });

  const SHIPMENT_INFO_CONFIG: ChildConfig[] = [
    {
      id: "status",
      type: "text",
      name: "status",
      label: t("shipmentInformation.status.label"),
      placeholder: t("shipmentInformation.status.placeholder"),
      // rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "shipmentNumber",
      type: "text",
      name: "shipmentNumber",
      label: t("shipmentInformation.shipmentNumber.label"),
      placeholder: t("shipmentInformation.shipmentNumber.placeholder"),
      // rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "customerName",
      type: "text",
      name: "customerName",
      label: t("shipmentInformation.customerName.label"),
      placeholder: t("shipmentInformation.customerName.placeholder"),
      // rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "shipmentType",
      type: "text",
      name: "shipmentType",
      label: t("shipmentInformation.shipmentType.label"),
      placeholder: t("shipmentInformation.shipmentType.placeholder"),
      // rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "branchName",
      type: "text",
      name: "branchName",
      label: t("shipmentInformation.branchName.label"),
      placeholder: t("shipmentInformation.branchName.placeholder"),
      // rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "lastUpdate",
      type: "text",
      name: "lastUpdate",
      label: t("shipmentInformation.lastUpdate.label"),
      placeholder: t("shipmentInformation.lastUpdate.placeholder"),
      // rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "lastLocation",
      type: "text",
      name: "lastLocation",
      label: t("shipmentInformation.lastLocation.label"),
      placeholder: t("shipmentInformation.lastLocation.placeholder"),
      // rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "statusOBD",
      type: "text",
      name: "statusOBD",
      label: t("shipmentInformation.statusOBD.label"),
      placeholder: t("shipmentInformation.statusOBD.placeholder"),
      // rules: [{ required: true, message: requiredMessage }],
    },
  ];

  const UNIT_DRIVER_INFO_CONFIG: ChildConfig[] = [
    {
      id: "licensePlate",
      type: "text",
      name: "licensePlate",
      label: t("unitDriverInformation.licensePlate.label"),
      placeholder: t("unitDriverInformation.licensePlate.placeholder"),
      // rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "unitType",
      type: "text",
      name: "unitType",
      label: t("unitDriverInformation.unitType.label"),
      placeholder: t("unitDriverInformation.unitType.placeholder"),
      // rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "driver1",
      type: "text",
      name: "driver1",
      label: t("unitDriverInformation.driver1.label"),
      placeholder: t("unitDriverInformation.driver1.placeholder"),
      // rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "phoneNumber1",
      type: "text",
      name: "phoneNumber1",
      label: t("unitDriverInformation.phoneNumber.label"),
      placeholder: t("unitDriverInformation.phoneNumber.placeholder"),
      // rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "driver2",
      type: "text",
      name: "driver2",
      label: t("unitDriverInformation.driver2.label"),
      placeholder: t("unitDriverInformation.driver2.placeholder"),
      // rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "phoneNumber2",
      type: "text",
      name: "phoneNumber2",
      label: t("unitDriverInformation.phoneNumber.label"),
      placeholder: t("unitDriverInformation.phoneNumber.placeholder"),
      // rules: [{ required: true, message: requiredMessage }],
    },
  ];

  const LOCATION_TYPE_CONFIG: ChildConfig = {
    id: "location",
    type: "select",
    options: dropdownLocationsData.map((v) => ({
      label: v.name,
      value: v.id,
    })),
    onChange(value) {
      if (!value) {
        form.resetFields(["opsCoordinate", "opsAddress"]);
      }
      const { coordinate = "", address = "" } =
        dropdownLocationsData.find((o) => o.id === value) || {};

      form.setFieldsValue({
        opsCoordinate: coordinate,
        opsAddress: address,
      });
    },
    name: "location",
    label: t("activityLog.location.label"),
    placeholder: t("activityLog.location.placeholder"),
    rules: [
      {
        required: modalData?.data?.activity?.includes("Free"),
        message: requiredMessage,
      },
    ],
  };

  const ACTIVITY_LOG_CONFIG: ChildConfig[] = [
    {
      id: "shipmentNumber",
      type: "text",
      name: "shipmentNumber",
      label: t("activityLog.shipmentNumber.label"),
      placeholder: t("activityLog.shipmentNumber.placeholder"),
      disabled: true,
    },
    {
      id: "activityStatus",
      type: "text",
      name: "activityStatus",
      label: t("activityLog.activityStatus.label"),
      placeholder: t("activityLog.activityStatus.placeholder"),
      disabled: true,
      render: () => {
        return <StatusTag value={form.getFieldValue("activityStatus")} />;
      },
    },
    {
      id: "origin",
      type: "text",
      name: "origin",
      label: t("activityLog.origin.label"),
      placeholder: t("activityLog.origin.placeholder"),
      disabled: true,
    },
    {
      id: "destination",
      type: "text",
      name: "destination",
      label: t("activityLog.destination.label"),
      placeholder: t("activityLog.destination.placeholder"),
      disabled: true,
    },
    {
      id: "licensePlate",
      type: "text",
      name: "licensePlate",
      label: t("activityLog.licensePlate.label"),
      placeholder: t("activityLog.licensePlate.placeholder"),
      disabled: true,
    },
    {
      id: "driverName",
      type: "text",
      name: "driverName",
      label: t("activityLog.driverName.label"),
      placeholder: t("activityLog.driverName.placeholder"),
      disabled: true,
    },
    {
      id: "opsActualDate",
      type: "date",
      name: "opsActualDate",
      label: t("activityLog.opsActualDate.label"),
      placeholder: t("activityLog.opsActualDate.placeholder"),
      format: "YYYY-MM-DD HH:mm:ss",
      rules: [{ required: true, message: requiredMessage }],
    },
    ...(modalData.data?.activity === "Free" ? [LOCATION_TYPE_CONFIG] : []),
    {
      id: "opsCoordinate",
      type: "text",
      name: "opsCoordinate",
      label: t("activityLog.opsCoordinate.label"),
      placeholder: t("activityLog.opsCoordinate.placeholder"),
      rules: [
        {
          validator: async (_: never, _value = "") => {
            const _val = _value.split(",").filter((v) => v.trim() !== "");

            if (_val.length !== 2) {
              return Promise.reject(new Error(messageCordinate));
            }

            const lat = Number(_val?.[0]);
            const lng = Number(_val?.[1]);

            if (Number.isNaN(lat) || Number.isNaN(lng)) {
              return Promise.reject(new Error(validCoordinate));
            }

            return Promise.resolve();
          },
          required: true,
        },
      ],
    },
    {
      id: "opsAddress",
      type: "text",
      name: "opsAddress",
      label: t("activityLog.opsAddress.label"),
      placeholder: t("activityLog.opsAddress.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
  ];

  const [dataActivityLog, setDataActivityLog] = useState<
    JourneySupportActivity[]
  >([]);

  const handleModal = (record: JourneySupportActivity) => {
    setModalData({
      data: record,
      show: true,
    });
  };

  const handleUpdateDataActivityLog = (
    index: number,
    updatedData: JourneySupportActivity,
  ) => {
    setDataActivityLog((prev) => {
      const _data = [...prev];
      _data[index] = {
        ..._data[index],
        ...updatedData,
      };

      return _data;
    });
  };

  const handleRefreshActivty = (record: JourneySupportActivity) => {
    const { no } = record || {};
    const index = (no || 0) - 1;

    const idActivity = record?.id as string;

    // loading api
    handleUpdateDataActivityLog(index, {
      obdActualDate: "Loading...",
      obdCoordinate: "Loading...",
      obdAddress: "Loading...",
    });

    //callback to manipulate data when data is available
    const callback = (data: JourneySupportActivity) => {
      const _updatedData = {
        obdActualDate: data.obdActualDate,
        obdCoordinate: data.obdCoordinate,
        obdAddress: data.obdAddress,
      };
      handleUpdateDataActivityLog(index, _updatedData);
    };

    //call refresh activty api
    dispatch(
      journeySupportActions.updateActivitySkywardFetch({
        id: idActivity,
        callback,
      }),
    );
  };

  const handleUpdateActivityLogs = async () => {
    const callback = () => {
      MessageHandler().success(
        t("updateSuccess", { location: modalData.data?.locationName ?? "-" }),
      );
      setModalData({ data: null, show: false });

      dispatch(journeySupportActions.getDetailJourneySupportFetch({ id }));
      dispatch(journeySupportActions.updateActivityClear());
    };
    try {
      const validate = await form.validateFields();

      const payload: UpdateJourneySupportActivtyPayload = {
        id: modalData?.data?.id ?? "",
        opsActualDate: dayjs(validate?.opsActualDate).format(
          "YYYY-MM-DD HH:mm:ss",
        ),
        opsCoordinate: validate?.opsCoordinate,
        opsAddress: validate?.opsAddress,
        locationId: validate?.location || undefined,
        callback,
      };

      dispatch(journeySupportActions.updateActivityFetch(payload));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (Object.keys(journeyDetail).length) {
      form.setFieldsValue({
        ...withDash(journeyDetail),
        phoneNumber1: journeyDetail?.driver1PhoneNumber || "-",
        phoneNumber2: journeyDetail?.driver2PhoneNumber || "-",
        lastUpdate: journeyDetail?.lastUpdate
          ? dayjs(journeyDetail?.lastUpdate).format("YYYY-MM-DD HH:mm")
          : "-",
        lastLocation: journeyDetail?.lastPosition || "-",
        statusOBD: journeyDetail?.statusOBD || "-",
        driverName: journeyDetail?.driver1 || "-",
        driver2: journeyDetail?.driver2 || "-",
        driver1: journeyDetail?.driver1 || "-",
      });
    }

    return () => {
      form.resetFields();
    };
  }, [journeyDetail]);

  useEffect(() => {
    if (isNull(modalData.data) || !modalData.show) return;

    form.setFieldsValue({
      activityStatus: modalData.data.activity ?? "-",
      opsActualDate:
        modalData.data.opsActualDate !== "-" && modalData.data.opsActualDate
          ? dayjs(modalData.data.opsActualDate)
          : "",
      opsCoordinate: modalData.data.opsCoordinate || "-",
      opsAddress: modalData.data.opsAddress || "-",
      location: modalData.data.locationId || undefined,
    });

    return () => {
      form.resetFields([
        "opsActualDate",
        "opsCoordinate",
        "opsAddress",
        "activityStatus", // only for clean-up
      ]);
    };
  }, [modalData.data]);

  useEffect(() => {
    dispatch(locationActions.getDropdownLocationsFetch({ type: "Pool" }));

    return () => {
      dispatch(locationActions.getDropdownLocationsClear());
    };
  }, []);

  useEffect(() => {
    if (journeyDetail?.activities?.length) {
      const reorderedActivityLog = [...(journeyDetail?.activities || [])]
        ?.sort((a, b) => (a?.ordinal ?? 0) - (b?.ordinal ?? 0))
        ?.map((v, i) => ({
          ...v,
          no: i + 1,
        }));

      setDataActivityLog(reorderedActivityLog);
    }

    return () => {
      setDataActivityLog([]);
    };
  }, [journeyDetail?.activities]);

  return (
    <>
      <Flex vertical gap={16}>
        <Card title={t("shipmentInformation.title")}>
          <RsFormBuilder
            type={"create"}
            layout="vertical"
            name={"shipmentInfo"}
            form={form}
            onFinish={() => {}}
            onCancel={() => {}}
            configs={SHIPMENT_INFO_CONFIG}
            isHideFormButton
            loading={true}
            disabled={true}
          />
        </Card>
        <Card title={t("unitDriverInformation.title")}>
          <RsFormBuilder
            type={"create"}
            layout="vertical"
            name={"unitDriverInfo"}
            form={form}
            onFinish={() => {}}
            onCancel={() => {}}
            configs={UNIT_DRIVER_INFO_CONFIG}
            isHideFormButton
            loading={true}
            disabled={true}
          />
        </Card>

        <Card title={t("activityLogTable.title")}>
          <Table
            showTitle={false}
            showActions={false}
            bordered
            columns={ColumnsActivityLog({
              onEdit: handleModal,
              onRefresh: handleRefreshActivty,
            })}
            dataSource={dataActivityLog}
            showPagination={false}
            loading={loading[journeySupportTypes.GET_DETAIL_JOURNEY_SUPPORT]}
            rowKey="id"
            scroll={{ x: "max-content" }}
          />
        </Card>
      </Flex>

      <Modal
        open={modalData.show}
        centered
        width={"85%"}
        onOk={handleUpdateActivityLogs}
        onCancel={() => {
          if (!isLoadingUpdate) {
            setModalData({ data: null, show: false });
          }
        }}
        okButtonProps={{
          disabled: isLoadingUpdate,
        }}
        cancelButtonProps={{
          disabled: isLoadingUpdate,
        }}
        closable={false}
        destroyOnClose
        okText="Submit"
        title={
          <Divider orientationMargin={0} orientation="left">
            <h3>{t("activityLog.title")}</h3>
          </Divider>
        }
      >
        <RsFormBuilder
          type={"create"}
          layout="vertical"
          name={"shipmentInfo"}
          form={form}
          onFinish={() => {}}
          onCancel={() => {}}
          configs={ACTIVITY_LOG_CONFIG}
          isHideFormButton
          disabled={isLoadingUpdate}
          loading={isLoadingUpdate}
        />
      </Modal>
    </>
  );
};

export default JourneySupportForm;
