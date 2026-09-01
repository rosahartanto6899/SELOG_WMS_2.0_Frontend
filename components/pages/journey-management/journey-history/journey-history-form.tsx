/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import Card from "@sera-components/card";
import RsFormBuilder from "@sera-components/rs-form-builder";
import { ChildConfig } from "@sera-libraries/types/formBuilderType";
import { RootState } from "@sera-redux";
import {
  JourneyHistoryState,
  journeyHistoryType,
} from "@sera-types/journey-history.type";
import { LoadingState } from "@sera-types/loading.type";
import { DATE_FORMAT, FORMAT_DATE_TIME } from "@sera-utils/constants/common";
import { FormConfigHandler } from "@sera-utils/data-manipulator";
import { Form } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface JourneyHistoryFormProps {
  loading: LoadingState;
  journeyHistory: JourneyHistoryState;
}

const JourneyHistoryForm = ({
  loading,
  journeyHistory,
}: JourneyHistoryFormProps) => {
  const [form] = Form.useForm();

  const { t } = useTranslation(undefined, {
    keyPrefix: "journeyHistory.detail.shipment",
  });

  const FORM_CONFIG = [
    {
      type: "text",
      id: "status",
      name: "status",
      label: t("field.status"),
    },
    {
      type: "text",
      id: "bookingNumber",
      name: "bookingNumber",
      label: t("field.bookingNumber"),
    },
    {
      type: "text",
      id: "createdDate",
      name: "createdDate",
      label: t("field.createdDate"),
    },
    {
      type: "text",
      id: "finishedDate",
      name: "finishedDate",
      label: t("field.finishedDate"),
    },
    {
      type: "text",
      id: "salesDealing",
      name: "salesDealing",
      label: t("field.salesDealing"),
    },
    {
      type: "text",
      id: "salesServicing",
      name: "salesServicing",
      label: t("field.salesServicing"),
    },

    {
      type: "text",
      id: "shipmentNumber",
      name: "shipmentNumber",
      label: t("field.shipmentNumber"),
    },
    {
      type: "text",
      id: "shipmentType",
      name: "shipmentType",
      label: t("field.shipmentType"),
    },
    {
      type: "text",
      id: "customerName",
      name: "customerName",
      label: t("field.customerName"),
    },
    {
      type: "text",
      id: "serviceType",
      name: "serviceType",
      label: t("field.serviceType"),
    },
    {
      type: "text",
      id: "branchName",
      name: "branchName",
      label: t("field.branchName"),
    },
    {
      type: "text",
      id: "unitType",
      name: "unitType",
      label: t("field.unitType"),
    },
    {
      type: "text",
      id: "origin",
      name: "origin",
      label: t("field.origin"),
    },
    {
      type: "text",
      id: "destination",
      name: "destination",
      label: t("field.destination"),
    },
    {
      type: "text",
      id: "driver1",
      name: "driver1",
      label: t("field.driver1"),
    },
    {
      type: "text",
      id: "driver1PhoneNumber",
      name: "driver1PhoneNumber",
      label: t("field.driver1PhoneNumber"),
    },
    {
      type: "text",
      id: "driver2",
      name: "driver2",
      label: t("field.driver2"),
    },
    {
      type: "text",
      id: "driver2PhoneNumber",
      name: "driver2PhoneNumber",
      label: t("field.driver2PhoneNumber"),
    },
    {
      type: "text",
      id: "licensePlate",
      name: "licensePlate",
      label: t("field.licensePlate"),
    },
  ] as ChildConfig[];

  useEffect(() => {
    const _data = journeyHistory?.getJourneyDetail?.data;

    form.setFieldsValue({
      ..._data,
      createdDate: DATE_FORMAT(_data?.createdDate, FORMAT_DATE_TIME),
      finishedDate: DATE_FORMAT(_data?.finishedDate, FORMAT_DATE_TIME),
    });
  }, [journeyHistory?.getJourneyDetail?.data]);

  return (
    <Card title={t("title")}>
      <RsFormBuilder
        name="form-journey-history"
        layout="vertical"
        form={form}
        type="detail"
        configs={FormConfigHandler(FORM_CONFIG, true)}
        onFinish={() => {}}
        loading={loading[journeyHistoryType.GET_JOURNEY_DETAIL]}
        disabled={loading[journeyHistoryType.GET_JOURNEY_DETAIL]}
        hideCancel
        isHideFormButton
      />
    </Card>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  journeyHistory: state.journeyHistory,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(JourneyHistoryForm);
