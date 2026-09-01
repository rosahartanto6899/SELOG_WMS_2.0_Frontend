/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Card from "@sera-components/card";
import MessageHandler from "@sera-libraries/message-handler";
import { RootState } from "@sera-redux";
import { vodActions } from "@sera-redux/slices/voice-of-driver.slice";
import { ListParams, VoDState } from "@sera-types/voice-of-driver.type";
import { Flex } from "antd";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import VodFilters from "./vod-filters";
import VodSummary from "./vod-summary";
import VodTable from "./vod-table";

const DEFAULT_PARAMS: ListParams = {
  branchId: [],
  status: [],
  voiceType: [],
};

interface VoDInitialPageProps {
  vod: VoDState;
  createVoDClear: typeof vodActions.createVoDClear;
  detailVoDClear: typeof vodActions.detailVoDClear;
  updateVoDClear: typeof vodActions.updateVoDClear;
}

const VoDInitialPage = ({
  vod,
  createVoDClear,
  detailVoDClear,
  updateVoDClear,
}: VoDInitialPageProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "vod",
  });

  const [params, setParams] = useState<ListParams>(DEFAULT_PARAMS);

  const onChangeFilter = (_value: ListParams) => {
    setParams((_prev) => ({ ..._prev, ..._value }));
  };

  useEffect(() => {
    detailVoDClear();
  }, []);

  useEffect(() => {
    if (isEmpty(vod?.createVoD?.data)) return;

    const _ticketNumber = vod?.createVoD?.data?.ticketNumber;
    MessageHandler().success(
      t("toast.create", { ticketNumber: _ticketNumber }),
    );

    createVoDClear();
  }, [vod?.createVoD?.data]);

  useEffect(() => {
    if (isEmpty(vod?.updateVoD?.data)) return;

    const _ticketNumber = vod?.updateVoD?.payload?.ticketNumber;
    MessageHandler().success(
      t("toast.update", { ticketNumber: _ticketNumber }),
    );

    updateVoDClear();
  }, [vod?.updateVoD?.data]);

  return (
    <Flex gap={24} vertical>
      <Card.Filter>
        <VodFilters params={params} onChangeFilter={onChangeFilter} />
      </Card.Filter>

      <Card>
        <VodSummary params={params} />
      </Card>

      <Card>
        <VodTable params={params} />
      </Card>
    </Flex>
  );
};

const mapStateToProps = (state: RootState) => ({
  vod: state.vod,
});

const mapDispatchToProps = {
  createVoDClear: vodActions.createVoDClear,
  detailVoDClear: vodActions.detailVoDClear,
  updateVoDClear: vodActions.updateVoDClear,
};

export default connect(mapStateToProps, mapDispatchToProps)(VoDInitialPage);
