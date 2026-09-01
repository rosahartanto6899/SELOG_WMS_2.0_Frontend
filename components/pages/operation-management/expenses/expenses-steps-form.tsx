import Button from "@sera-components/button";
import Card from "@sera-components/card";
import { ROUTE } from "@sera-utils/constants/routes";
import { Row, Space, Steps } from "antd";
import { FormInstance } from "antd/lib";
import { useRouter } from "next/router";
import React, { FC, useState } from "react";
import { useTranslation } from "react-i18next";

import DistanceFuelForm from "./expenses-form-component/distance-fuel-form";
import ExpensesMainForm from "./expenses-form-component/expenses-main-form";
import IncentiveForm from "./expenses-form-component/incentive-form";
import OperationalCostsForm from "./expenses-form-component/operational-costs-form";
import TotalExpensesForm from "./expenses-form-component/total-expenses-form";

interface ExpensesFormProps {
  form: FormInstance;
  type: "edit" | "create" | "detail";
  onSubmit?: (val: any) => void;
}

const ExpensesForm: FC<ExpensesFormProps> = ({ form, type, onSubmit }) => {
  const { t } = useTranslation(undefined, { keyPrefix: "expenses.form" });
  const router = useRouter();
  const [current, setCurrent] = useState(0);

  const isDetail = type === "detail";

  const steps = [
    {
      title: t("title.create"), // Re-using create title or maybe a generic "Basic Info"
      content: <ExpensesMainForm form={form} disabled={isDetail} />,
    },
    {
      title: t("section.distanceFuel"),
      content: <DistanceFuelForm form={form} disabled={isDetail} />,
    },
    {
      title: t("section.operational"),
      content: <OperationalCostsForm form={form} disabled={isDetail} />,
    },
    {
      title: t("section.incentive"),
      content: <IncentiveForm form={form} disabled={isDetail} />,
    },
    {
      title: t("section.totalExpenses"),
      content: <TotalExpensesForm form={form} disabled={isDetail} />,
    },
  ];

  const next = async () => {
    try {
      await form.validateFields(); // This validates EVERYTHING. Might block if next steps are empty.
      setCurrent(current + 1);
    } catch (error) {
      console.log(error);
      setCurrent(current + 1);
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  return (
    <Card title={t(`title.${type}`)}>
      <Steps current={current}>
        {steps.map((item) => (
          <Steps.Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div style={{ marginTop: 24 }}>{steps[current].content}</div>

      {!isDetail && (
        <Row justify={"end"}>
          <Space style={{ marginTop: "1rem" }} align="end" wrap>
            {current > 0 && (
              <Button onClick={() => prev()}>
                {t("button.previous") || "Previous"}
              </Button>
            )}

            {current < steps.length - 1 && (
              <Button type="primary" onClick={() => next()}>
                {t("button.next") || "Next"}
              </Button>
            )}

            {current === steps.length - 1 && (
              <Space>
                <Button
                  onClick={() =>
                    router.push(ROUTE.OPERATION_MANAGEMENT.EXPENSES)
                  }
                >
                  {t("button.cancel")}
                </Button>
                <Button type="primary" onClick={onSubmit}>
                  {t("button.save")}
                </Button>
              </Space>
            )}
          </Space>
        </Row>
      )}

      {isDetail && (
        <Row justify={"end"}>
          <Space style={{ marginTop: "1rem" }} align="end" wrap>
            <Button
              onClick={() => router.push(ROUTE.OPERATION_MANAGEMENT.EXPENSES)}
            >
              {t("button.back") || "Back"}
            </Button>
            {current > 0 && (
              <Button onClick={() => prev()}>
                {t("button.previous") || "Previous"}
              </Button>
            )}
            {current < steps.length - 1 && (
              <Button type="primary" onClick={() => setCurrent(current + 1)}>
                {t("button.next") || "Next"}
              </Button>
            )}
          </Space>
        </Row>
      )}
    </Card>
  );
};

export default ExpensesForm;
