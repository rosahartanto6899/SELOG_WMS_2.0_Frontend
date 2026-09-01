import PageHeader from "@sera-components/page-header";
import OperationManagement from "@sera-components/pages/operation-management";
import { useAppDispatch } from "@sera-redux";
import { unitDriverCapacityActions } from "@sera-redux/slices/unit-driver-capacity.slice";
import { ROUTE } from "@sera-utils/constants/routes";
import { Form } from "antd";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

const UnitDriverDetailPage = () => {
  const router = useRouter();
  const { type, id: _id } = router.query;

  const id = _id as string;
  const isDriver = type === "driver";
  const { t } = useTranslation(undefined, { keyPrefix: "unitDriverCapacity" });
  const dispatch = useAppDispatch();

  const [form] = Form.useForm();

  const titleDetail = isDriver
    ? t("breadcrumb.2.detailDriver")
    : t("breadcrumb.2.detailUnit");

  useEffect(() => {
    if (!id) return;
    if (type === "unit") {
      dispatch(unitDriverCapacityActions.getUnitCapacityDetailFetch({ id }));
    } else {
      dispatch(unitDriverCapacityActions.getDriverCapacityDetailFetch({ id }));
    }
  }, [id]);
  return (
    <>
      <PageHeader
        title={t("title")}
        breadcrumb={[
          { title: t("breadcrumb.0") },
          {
            title: t("breadcrumb.1"),
            url: ROUTE.OPERATION_MANAGEMENT.UNIT_DRIVER_CAPACITY,
          },
          { title: titleDetail },
        ]}
        backUrl={ROUTE.OPERATION_MANAGEMENT.UNIT_DRIVER_CAPACITY}
        isDirectToURL
      />
      <OperationManagement.UnitDriverForm form={form} />
    </>
  );
};

export default UnitDriverDetailPage;
