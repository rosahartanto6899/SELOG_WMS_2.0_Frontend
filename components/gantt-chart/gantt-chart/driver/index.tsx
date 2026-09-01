import Button from "@sera-components/button";
import GanttChart from "@sera-components/gantt-chart/gantt-chart/shared-component";
import { ExitFullscreen, FullscreenOutlined } from "@sera-components/icons";
import Input from "@sera-components/input";
import { IDriverGanttChartState } from "@sera-types/driver-gantt-chart.type";
import { Col, DatePicker, Radio, Row, Space } from "antd";
import { Dayjs } from "dayjs";
import { useEffect, useRef, useState } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

import styles from "./gantt-chart.module.scss";

const { RangePicker } = DatePicker;

interface DriverGanttChartProps {
  loading?: boolean;
  driverGanttCharts: IDriverGanttChartState;
  driver?: any;
  onPageChange?: (current: number, pageSize: number) => void;
  onDateChange?: (
    viewType: "biweek" | "week" | "day" | "custom",
    startDate: Dayjs,
    endDate?: Dayjs,
    selectedDate?: Dayjs,
    selectedRange?: [Dayjs, Dayjs],
  ) => void;
  onSearch?: (value: string) => void;
  onDriverSelect?: (driver: any) => void;
  searchValue?: string;
  viewType?: "biweek" | "week" | "day" | "custom";
  selectedDate?: Dayjs;
  selectedRange?: [Dayjs, Dayjs];
}
const DriverGanttChart = ({
  loading,
  driverGanttCharts,
  driver,
  onPageChange,
  onDateChange,
  onSearch,
  onDriverSelect,
  searchValue,
  viewType: controlledViewType,
  selectedDate: controlledSelectedDate,
  selectedRange: controlledSelectedRange,
}: DriverGanttChartProps) => {
  const fullScreenHandle = useFullScreenHandle();
  const fullScreenRef = useRef<HTMLDivElement>(null);

  const [viewType, setViewType] = useState<
    "biweek" | "week" | "day" | "custom" | undefined
  >(controlledViewType);
  const [selectedDate, setSelectedDate] = useState<Dayjs | undefined>(
    controlledSelectedDate,
  );
  const [selectedRange, setSelectedRange] = useState<
    [Dayjs, Dayjs] | undefined
  >(controlledSelectedRange);

  // Sync with controlled props
  useEffect(() => {
    if (controlledViewType !== undefined) setViewType(controlledViewType);
  }, [controlledViewType]);

  useEffect(() => {
    if (controlledSelectedDate !== undefined)
      setSelectedDate(controlledSelectedDate);
  }, [controlledSelectedDate]);

  useEffect(() => {
    if (controlledSelectedRange !== undefined)
      setSelectedRange(controlledSelectedRange);
  }, [controlledSelectedRange]);

  const handleViewTypeChange = (
    value: "biweek" | "week" | "day" | "custom",
  ) => {
    setViewType(value);
    // Clear selected values when switching tabs
    setSelectedDate(undefined);
    setSelectedRange(undefined);
  };

  const handleDateChange = (date: Dayjs | null) => {
    if (date && viewType) {
      setSelectedDate(date);
      if (onDateChange) {
        onDateChange(viewType, date, undefined, date, undefined);
      }
    }
  };

  const handleRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1] && viewType) {
      const startDate = dates[0].startOf("week");
      const endDate = dates[1].endOf("week");

      // Validate max 14 days range
      const daysDiff = endDate.diff(startDate, "day") + 1;
      if (daysDiff > 14) {
        // If range exceeds 14 days, auto-adjust to 14 days
        const adjustedEnd = startDate.add(13, "day");
        const newRange: [Dayjs, Dayjs] = [startDate, adjustedEnd];
        setSelectedRange(newRange);
        if (onDateChange) {
          onDateChange(viewType, startDate, adjustedEnd, undefined, newRange);
        }
      } else {
        const newRange: [Dayjs, Dayjs] = [startDate, endDate];
        setSelectedRange(newRange);
        if (onDateChange) {
          onDateChange(viewType, startDate, endDate, undefined, newRange);
        }
      }
    }
  };

  const handleCustomRangeChange = (
    dates: [Dayjs | null, Dayjs | null] | null,
  ) => {
    if (dates && dates[0] && dates[1] && viewType) {
      const startDate = dates[0];
      const endDate = dates[1];

      // Validate max 14 days range
      const daysDiff = endDate.diff(startDate, "day") + 1;
      if (daysDiff > 14) {
        // If range exceeds 14 days, auto-adjust to 14 days
        const adjustedEnd = startDate.add(13, "day");
        const newRange: [Dayjs, Dayjs] = [startDate, adjustedEnd];
        setSelectedRange(newRange);
        if (onDateChange) {
          onDateChange(viewType, startDate, adjustedEnd, undefined, newRange);
        }
      } else {
        const newRange: [Dayjs, Dayjs] = [startDate, endDate];
        setSelectedRange(newRange);
        if (onDateChange) {
          onDateChange(viewType, startDate, endDate, undefined, newRange);
        }
      }
    }
  };

  return (
    <FullScreen
      handle={fullScreenHandle}
      className={styles["fullscreen-wrapper"]}
    >
      <div ref={fullScreenRef} className={`${styles["gantt-chart-container"]}`}>
        <Row gutter={[16, 8]} align="middle">
          {/* LEFT */}
          <Col flex="none">
            <Radio.Group
              className={styles["custom-grup-radiodriver"]}
              options={[
                { label: "2 Week", value: "biweek" },
                { label: "Week", value: "week" },
                { label: "Day", value: "day" },
                { label: "Custom", value: "custom" },
              ]}
              value={viewType}
              onChange={(e) => handleViewTypeChange(e.target.value)}
              optionType="button"
              buttonStyle="solid"
            />
          </Col>

          {/* CENTER */}
          <Col flex="auto">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Space size={12}>
                {!viewType ? null : viewType === "biweek" ? (
                  <RangePicker
                    value={selectedRange}
                    onChange={handleRangeChange}
                    format="DD MMM YYYY"
                    placeholder={["Start week", "End week"]}
                    style={{ borderRadius: 20 }}
                    allowClear={false}
                    picker="week"
                    getPopupContainer={() =>
                      fullScreenRef.current || document.body
                    }
                  />
                ) : viewType === "custom" ? (
                  <RangePicker
                    value={selectedRange}
                    onChange={handleCustomRangeChange}
                    format="DD MMM YYYY"
                    placeholder={["Start date", "End date"]}
                    style={{ borderRadius: 20 }}
                    allowClear={false}
                    disabledDate={(current, { from }) => {
                      if (from) {
                        // When start date is selected, only allow dates within 14 days
                        const maxDate = from.add(13, "day");
                        return current.isAfter(maxDate, "day");
                      }
                      return false;
                    }}
                    getPopupContainer={() =>
                      fullScreenRef.current || document.body
                    }
                  />
                ) : (
                  <DatePicker
                    picker={viewType === "week" ? "week" : undefined}
                    value={selectedDate}
                    onChange={handleDateChange}
                    format={viewType === "week" ? undefined : "DD MMM YYYY"}
                    placeholder={
                      viewType === "week" ? "Select week" : "Select date"
                    }
                    style={{ borderRadius: 20 }}
                    getPopupContainer={() =>
                      fullScreenRef.current || document.body
                    }
                  />
                )}
              </Space>
            </div>
          </Col>

          {/* RIGHT */}
          <Col flex="none">
            <Space size={12}>
              <Input.Search
                loading={false}
                placeholder="Search driver"
                style={{ width: 240 }}
                value={searchValue}
                onChange={(e) => onSearch?.(e.target.value)}
                onSearch={(value) => onSearch?.(value || "")}
                onPressEnter={(e) =>
                  onSearch?.((e.target as HTMLInputElement).value || "")
                }
                allowClear
              />
              <Button
                icon={
                  fullScreenHandle.active ? (
                    <ExitFullscreen />
                  ) : (
                    <FullscreenOutlined />
                  )
                }
                onClick={
                  fullScreenHandle.active
                    ? fullScreenHandle.exit
                    : fullScreenHandle.enter
                }
              >
                {fullScreenHandle.active ? "Exit Full Screen" : "Full Screen"}
              </Button>
            </Space>
          </Col>
        </Row>

        <GanttChart
          loading={loading}
          driver={driver}
          driverGantCharts={driverGanttCharts}
          onPageChange={onPageChange}
          getContainer={() => fullScreenRef.current || document.body}
          onDriverSelect={onDriverSelect}
          viewType={viewType}
          selectedDate={selectedDate}
          selectedRange={selectedRange}
        />
      </div>
    </FullScreen>
  );
};
export default DriverGanttChart;
