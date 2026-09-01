import Empty from "@sera-components/empty";
import FilterDropdown from "@sera-components/filter-dropdown";
import { LocationData } from "@sera-components/leaflet_maps/cluster-maps";
import LoadingPage from "@sera-components/loading/loading-page";
import Modal from "@sera-components/modal";
import Select from "@sera-components/select";
import StatusTag from "@sera-components/status-tag";
import {
  DATE_FORMAT,
  FORMAT_DATE_TIME,
  NUMBER_FORMAT,
} from "@sera-utils/constants/common";
import { Col, Descriptions, Divider, Row, Spin } from "antd";
import { isEmpty } from "lodash";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import usePairingMatchingOps from "./hooks/usePairingMatchingOps";

const ClusterMap = dynamic(
  () => import("@sera-components/leaflet_maps/cluster-maps"),
  {
    ssr: false,
    loading: () => <LoadingPage />,
  },
);

const DEFAULT_PARAMS = {
  capacityStatus: [] as string[],
};

const PairingMatchingMaps = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "pairingMatchingOps.maps",
  });

  const {
    queries: { fetchUnitPosition, fetchUnitDetail },
    data: { unitCapacityStatusList, unitPosition, unitDetail },
    loading: { loadingUnitCapacityStatus, loadingUnitDetail },
    events: { clearUnitDetail },
  } = usePairingMatchingOps();

  const [params, setParams] = useState(DEFAULT_PARAMS);
  const [selectedMaps, setSelectedMaps] = useState<LocationData | null>(null);
  const [selectedData, setSelectedData] = useState<string | null>(null);

  const DATA = useMemo(() => {
    if (isEmpty(unitPosition)) return [];

    return unitPosition?.flatMap((_item) => _item?.items ?? []);
  }, [unitPosition]);

  const SELECTED_DATA = useMemo(() => {
    const _data = unitDetail;

    return [
      {
        label: t("field.bookingNo"),
        value: _data?.bookingNo,
      },
      {
        label: t("field.shipmentNo"),
        value: _data?.shipmentNo,
      },
      {
        label: t("field.customer"),
        value: _data?.customer,
      },
      {
        label: t("field.status"),
        value: _data?.status ? <StatusTag value={_data?.status} /> : "",
      },
      {
        label: t("field.branchName"),
        value: _data?.branchName,
      },
      {
        label: t("field.shipmentType"),
        value: _data?.shipmentType,
      },
      {
        label: t("field.origin"),
        value: _data?.origin,
      },
      {
        label: t("field.destination"),
        value: _data?.destination,
      },
      {
        label: t("field.pickupDate"),
        value: DATE_FORMAT(_data?.pickupDate, FORMAT_DATE_TIME),
      },
      {
        label: t("field.revenue"),
        value: `Rp ${NUMBER_FORMAT(_data?.revenue)}`,
      },
      {
        label: t("field.unitType"),
        value: _data?.unitType,
      },
      {
        label: t("field.licensePlate"),
        value: _data?.licensePlate,
      },
      {
        label: t("field.driverId1"),
        value: _data?.driverId1,
      },
      {
        label: t("field.phoneNumber1"),
        value: _data?.phoneNumber1,
      },
      {
        label: t("field.driverId2"),
        value: _data?.driverId2,
      },
      {
        label: t("field.phoneNumber2"),
        value: _data?.phoneNumber2,
      },
    ];
  }, [unitDetail]);

  useEffect(() => {
    fetchUnitPosition({ ...params });
    clearUnitDetail();
  }, [params]);

  useEffect(() => {
    clearUnitDetail();
    if (selectedData) fetchUnitDetail({ id: selectedData });
  }, [selectedData]);

  return (
    <>
      <Row gutter={[8, 4]}>
        <Col>
          <FilterDropdown
            buttonLabel={t("filters.0")}
            options={
              unitCapacityStatusList?.map((_item) => ({
                value: _item?.name,
                label: _item?.name,
              })) ?? []
            }
            selectedValues={params?.capacityStatus}
            onChange={(_value: string[]) => {
              setParams({ capacityStatus: _value });
            }}
            loading={loadingUnitCapacityStatus}
            disabled={loadingUnitCapacityStatus}
          />
        </Col>
      </Row>

      <Divider />

      <ClusterMap
        locations={DATA}
        onClick={(_value) => {
          setSelectedMaps(_value);
          setSelectedData(_value?.data?.[0]?.id ?? null);
        }}
      />

      <Modal
        open={Boolean(selectedMaps)}
        onCancel={() => {
          setSelectedMaps(null);
          setSelectedData(null);
        }}
        closable
      >
        <h3 style={{ fontWeight: 600 }}>{t("title")}</h3>

        {selectedMaps?.data && selectedMaps?.data?.length > 1 ? (
          <>
            <Select
              options={
                selectedMaps?.data?.map((_item) => ({
                  value: _item?.id,
                  label: _item?.licensePlate,
                })) ?? []
              }
              value={selectedData}
              onSelect={(_value) => setSelectedData(_value)}
            />

            <Divider />
          </>
        ) : (
          <React.Fragment />
        )}

        <Spin spinning={loadingUnitDetail}>
          {!isEmpty(unitDetail) ? (
            <Descriptions
              layout="vertical"
              column={2}
              labelStyle={{ paddingBottom: 0 }}
              contentStyle={{ fontWeight: "bold", marginTop: "-8px" }}
              size="small"
            >
              {SELECTED_DATA?.map((_item, _key) => (
                <Descriptions.Item key={_key} label={_item?.label}>
                  {_item?.value || "-"}
                </Descriptions.Item>
              ))}
            </Descriptions>
          ) : (
            <Empty />
          )}
        </Spin>
      </Modal>
    </>
  );
};

export default PairingMatchingMaps;
