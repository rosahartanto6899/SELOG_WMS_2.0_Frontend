/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Card from "@sera-components/card";
import MessageHandler from "@sera-libraries/message-handler";
import { RootState } from "@sera-redux";
import { jmpActions } from "@sera-redux/slices/jmp.slice";
import { FilterParams, JMPState } from "@sera-types/jmp.type";
import { Flex } from "antd";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import JmpFilters from "./jmp-filters";
import JmpSummary from "./jmp-summary";
import JmpTable from "./jmp-table";

const DEFAULT_PARAMS: FilterParams = {
  specificCustomer: [],
  tollUsage: [],
};

interface JMPInitialPageProps {
  jmp: JMPState;
  createJMPClear: typeof jmpActions.createJMPClear;
  detailJMPClear: typeof jmpActions.detailJMPClear;
  updateJMPClear: typeof jmpActions.updateJMPClear;
}

const JMPInitialPage = ({
  jmp,
  createJMPClear,
  detailJMPClear,
  updateJMPClear,
}: JMPInitialPageProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "jmp",
  });

  const [params, setParams] = useState<FilterParams>(DEFAULT_PARAMS);

  const onChangeFilter = (_value: FilterParams) => {
    setParams((_prev) => ({ ..._prev, ..._value }));
  };

  useEffect(() => {
    detailJMPClear();
  }, []);

  useEffect(() => {
    if (isEmpty(jmp?.createJMP?.data)) return;

    MessageHandler().success(t("toast.create"));
    createJMPClear();
  }, [jmp?.createJMP?.data]);

  useEffect(() => {
    if (isEmpty(jmp?.updateJMP?.data)) return;

    MessageHandler().success(t("toast.update"));
    updateJMPClear();
  }, [jmp?.updateJMP?.data]);

  return (
    <Flex gap={24} vertical>
      <Card.Filter>
        <JmpFilters params={params} onChangeFilter={onChangeFilter} />
      </Card.Filter>

      <Card>
        <JmpSummary params={params} />
      </Card>

      <Card>
        <JmpTable params={params} />
      </Card>
    </Flex>
  );
};

const mapStateToProps = (state: RootState) => ({
  jmp: state.jmp,
});

const mapDispatchToProps = {
  createJMPClear: jmpActions.createJMPClear,
  detailJMPClear: jmpActions.detailJMPClear,
  updateJMPClear: jmpActions.updateJMPClear,
};

export default connect(mapStateToProps, mapDispatchToProps)(JMPInitialPage);
