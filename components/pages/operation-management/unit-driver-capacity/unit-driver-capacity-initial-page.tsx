import { CarOutlined, UserOutlined } from "@ant-design/icons";
import Card from "@sera-components/card";
import {
  getDropdownBusinessAreasClear,
  getDropdownBusinessAreasFetch,
  useAppDispatch,
} from "@sera-redux";
import { unitDriverCapacityActions } from "@sera-redux/slices/unit-driver-capacity.slice";
import { Col, Flex, Grid, Row, Tabs } from "antd";
import React, { useEffect, useState } from "react";

import DriverCapacityForecast from "./driver-capacity/driver-capacity-forecast";
// import { useTranslation } from "react-i18next";
import DriverCapacityList from "./driver-capacity/driver-capacity-initial-page";
import DriverCapacitySummary from "./driver-capacity/driver-capacity-summary";
import UnitCapacityForecast from "./unit-capacity/unit-capacity-forecast";
import UnitCapacityList from "./unit-capacity/unit-capacity-initial-page";
import UnitCapacitySummary from "./unit-capacity/unit-capacity-summary";
import UnitDriverCapacityFilters from "./unit-driver-capacity-filters";

export interface UnitDriverCapacityFilterProps {
  branchId?: string[];
  shipmentType?: string[];
}

const UnitDriverCapacityList = () => {
  const dispatch = useAppDispatch();
  // const [tab, setTab] = useState<"unit" | "driver">("unit");
  const [filter, setFilter] = useState<UnitDriverCapacityFilterProps>({
    branchId: undefined,
    shipmentType: undefined,
  });

  const onChangeFilter = (val: string[], type: string) => {
    setFilter((prev) => {
      const _filter = {
        ...prev,
        [type]: val?.length ? val : undefined,
      };
      return _filter;
    });
  };

  useEffect(() => {
    dispatch(getDropdownBusinessAreasFetch({}));
    dispatch(unitDriverCapacityActions.getUnitCapacityStatusesFetch());
    dispatch(unitDriverCapacityActions.getEmployeeStatusesFetch());

    return () => {
      dispatch(getDropdownBusinessAreasClear());
      dispatch(unitDriverCapacityActions.getUnitCapacityStatusesClear());
      dispatch(unitDriverCapacityActions.getEmployeeStatusesClear());
    };
  }, []);

  const { sm } = Grid.useBreakpoint();

  return (
    <>
      <Flex gap={16} vertical>
        {!sm && (
          <UnitDriverCapacityFilters
            onChangeFilter={onChangeFilter}
            filter={filter}
          />
        )}
        <Tabs
          size="middle"
          // onChange={(v) => setTab(v as "unit" | "driver")}
          animated
          tabBarExtraContent={
            sm
              ? {
                  left: (
                    <UnitDriverCapacityFilters
                      onChangeFilter={onChangeFilter}
                      filter={filter}
                    />
                  ),
                }
              : undefined
          }
          items={[
            {
              label: "Unit",
              key: "unit",
              icon: <CarOutlined />,
              children: (
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Card noShadow>
                      <UnitCapacitySummary filter={filter} />
                    </Card>
                  </Col>
                  <Col span={24}>
                    <Card noShadow>
                      <UnitCapacityList filter={filter} />
                    </Card>
                  </Col>
                  <Col span={24}>
                    <Card noShadow>
                      <UnitCapacityForecast filter={filter} />
                    </Card>
                  </Col>
                </Row>
              ),
            },
            {
              label: "Driver",
              key: "driver",
              icon: <UserOutlined />,
              children: (
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Card noShadow>
                      <DriverCapacitySummary filter={filter} />
                    </Card>
                  </Col>
                  <Col span={24}>
                    <Card noShadow>
                      <DriverCapacityList filter={filter} />
                    </Card>
                  </Col>
                  <Col span={24}>
                    <Card noShadow>
                      <DriverCapacityForecast filter={filter} />
                    </Card>
                  </Col>
                </Row>
              ),
            },
          ]}
        />
      </Flex>
    </>
  );
};

export default UnitDriverCapacityList;
