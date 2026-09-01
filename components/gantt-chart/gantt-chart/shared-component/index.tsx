/* eslint-disable @typescript-eslint/no-explicit-any */
import { DetailOutlined } from "@sera-components/icons";
import Table from "@sera-components/table";
import Typography from "@sera-components/typography";
import {
  IDriverGanttChartData,
  IDriverGanttChartState,
} from "@sera-types/driver-gantt-chart.type";
import { IDriverStockState } from "@sera-types/driver-stock.type";
import { Col, Row, Tag } from "antd";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useEffect, useState } from "react";

import styles from "./index.module.scss";
import DriverDetailModal from "./modal-driver-detail";
import TaskDetailModal from "./modal-task-detail";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

interface props {
  loading?: boolean;
  driver?: IDriverStockState;
  driverGantCharts: IDriverGanttChartState;
  onPageChange?: (current: number, pageSize: number) => void;
  getContainer?: () => HTMLElement;
  onDriverSelect?: (driver: any) => void;
  viewType?: "biweek" | "week" | "day" | "custom";
  selectedDate?: any;
  selectedRange?: [any, any];
}

const GantChart = ({
  loading,
  driver,
  driverGantCharts,
  onPageChange,
  getContainer,
  onDriverSelect,
  viewType,
  selectedDate,
  selectedRange,
}: props) => {
  const drivers = driverGantCharts.data;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const handleOpenModal = (driver: any) => {
    setIsModalOpen(true);
    if (onDriverSelect) {
      onDriverSelect(driver);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDriver(null);
  };

  const handleOpenTaskModal = (task: any) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
    setSelectedTask(null);
  };

  // Generate calendar dates based on props or default to current month
  const referenceDate = dayjs();

  let start: dayjs.Dayjs;
  let end: dayjs.Dayjs;

  // Use selectedRange for biweek and custom view
  if (
    (viewType === "biweek" || viewType === "custom") &&
    selectedRange &&
    selectedRange[0] &&
    selectedRange[1]
  ) {
    start = dayjs(selectedRange[0]);
    end = dayjs(selectedRange[1]);
  }
  // Use selectedDate for week/day view
  else if ((viewType === "week" || viewType === "day") && selectedDate) {
    const date = dayjs(selectedDate);
    if (viewType === "week") {
      start = date.startOf("week");
      end = date.endOf("week");
    } else {
      start = date;
      end = date;
    }
  }
  // Default to current month if no date selected
  else {
    start = referenceDate.startOf("month");
    end = referenceDate.endOf("month");
  }

  const totalDays = end.diff(start, "day") + 1;
  const calendarDates = Array.from({ length: totalDays }, (_, i) =>
    start.add(i, "day"),
  );

  const addOneDay = (dateStr: string) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0];
  };

  const isUtilizationInRange = (
    utilization: any,
    rangeStart: dayjs.Dayjs,
    rangeEnd: dayjs.Dayjs,
  ) => {
    const utilStart =
      utilization.startJourneyDate &&
      utilization.status?.toUpperCase() === "ON JOURNEY"
        ? dayjs(utilization.startJourneyDate)
        : dayjs(utilization.startDate);

    let utilEnd: dayjs.Dayjs | null;
    if (
      utilization.status?.toUpperCase() === "ON JOURNEY" &&
      !utilization.endJourneyDate
    ) {
      // Ongoing journey — effective end is max(plannedEndDate, today)
      const today = dayjs();
      const plannedEnd = utilization.endDate
        ? dayjs(utilization.endDate)
        : today;
      utilEnd = plannedEnd.isAfter(today, "day") ? plannedEnd : today;
    } else {
      utilEnd = utilization.endDate ? dayjs(utilization.endDate) : null;
    }

    return (
      utilStart.isSameOrBefore(rangeEnd, "day") &&
      (!utilEnd || utilEnd.isSameOrAfter(rangeStart, "day"))
    );
  };

  const mappedDrivers = drivers?.map((driver: IDriverGanttChartData) => {
    const baseUtilizations = (driver.utilizations || []).map(
      (utilization: any) => ({
        ...utilization,
        driverName: driver.driverName,
        employeeId: driver.employeeId || "",
        vkvd: driver.vkvd || "",
        employeeStatus: driver.employeeStatus,
      }),
    );

    // ➕ Tambah utilization Resign
    if (driver.contractStatus === "Non-Active") {
      let startDate: string | null = null;

      if (driver.resignDate) {
        startDate = addOneDay(driver.resignDate);
      } else if (driver.endDate) {
        startDate = addOneDay(driver.endDate);
      }

      if (startDate) {
        baseUtilizations.push({
          id: `resign-${driver.id}`,
          status: "Resign",
          startDate,
          endDate: null, // atau "9999-12-31"
          driverName: driver.driverName,
          employeeId: driver.employeeId || "",
          vkvd: driver.vkvd || "",
          employeeStatus: driver.employeeStatus,
        });
      }
    }

    const filteredUtilizations = baseUtilizations.filter((utilization) =>
      isUtilizationInRange(utilization, start, end),
    );

    return {
      id: driver.id,
      no: driver.no,
      driverName: driver.driverName,
      employeeId: driver.employeeId || "",
      vkvd: driver.vkvd || "",
      branchName: driver.branchName,
      employeeStatus: driver.employeeStatus,
      utilizations: filteredUtilizations,
    };
  });

  // Calculate effective start/end dates for a task (special logic for On Journey)
  const getEffectiveDates = (
    task: any,
  ): { taskStart: dayjs.Dayjs; taskEnd: dayjs.Dayjs } => {
    const today = dayjs();
    let taskStart: dayjs.Dayjs;
    let taskEnd: dayjs.Dayjs;

    if (task.status?.toUpperCase() === "ON JOURNEY") {
      // Use actual journey start if available, fallback to planned startDate
      taskStart = task.startJourneyDate
        ? dayjs(task.startJourneyDate)
        : dayjs(task.startDate);

      if (task.endJourneyDate) {
        // Journey completed — use actual end
        taskEnd = dayjs(task.endJourneyDate);
      } else {
        // Journey still ongoing — extend to max(plannedEndDate, today)
        const plannedEnd = task.endDate ? dayjs(task.endDate) : today;
        taskEnd = plannedEnd.isAfter(today, "day") ? plannedEnd : today;
      }
    } else {
      taskStart = dayjs(task.startDate);
      taskEnd = task.endDate ? dayjs(task.endDate) : end;
    }

    return { taskStart, taskEnd };
  };

  // Calculate task position and width based on dates
  const calculateTaskStyle = (task: any) => {
    let { taskStart, taskEnd } = getEffectiveDates(task);

    // If endDate is before startDate (invalid data), treat as same-day task
    if (taskEnd.isBefore(taskStart, "day")) {
      taskEnd = taskStart;
    }

    // Clamp task start to month start if before
    if (taskStart.isBefore(start, "day")) {
      taskStart = start;
    }

    // Clamp task end to month end if after
    if (taskEnd.isAfter(end, "day")) {
      taskEnd = end;
    }

    const startOffset = taskStart
      .startOf("day")
      .diff(start.startOf("day"), "day");
    const duration =
      taskEnd.startOf("day").diff(taskStart.startOf("day"), "day") + 1;

    return {
      left: `${(startOffset / totalDays) * 100}%`,
      width: `${(duration / totalDays) * 100}%`,
    };
  };

  // Dynamic cell width based on total days
  const cellWidth =
    totalDays === 1
      ? 600 // Extra wide for single day view
      : totalDays <= 7
        ? 120 // Wider for daily/weekly view
        : totalDays <= 14
          ? 120 // Medium for 2-week view
          : 80; // Standard for monthly view

  // Assign overlapping tasks into separate vertical lanes
  const assignLanes = (
    tasks: any[],
  ): { assignments: number[]; maxLanes: number } => {
    if (tasks.length === 0) return { assignments: [], maxLanes: 1 };

    const indexed = tasks
      .map((t, i) => ({ task: t, originalIdx: i }))
      .sort((a, b) => dayjs(a.task.startDate).diff(dayjs(b.task.startDate)));

    const laneEndDates: dayjs.Dayjs[] = [];
    const assignments: number[] = new Array(tasks.length).fill(0);

    for (const { task, originalIdx } of indexed) {
      let { taskStart, taskEnd } = getEffectiveDates(task);

      // Fix invalid data: if endDate is before startDate, treat as same-day task
      if (taskEnd.isBefore(taskStart, "day")) {
        taskEnd = taskStart;
      }

      if (taskStart.isBefore(start, "day")) taskStart = start;
      if (taskEnd.isAfter(end, "day")) taskEnd = end;

      // Find a lane where this task doesn't overlap (start > laneEnd)
      let assignedLane = laneEndDates.findIndex((laneEnd) =>
        taskStart.isAfter(laneEnd, "day"),
      );

      if (assignedLane === -1) {
        assignedLane = laneEndDates.length;
        laneEndDates.push(taskEnd);
      } else {
        laneEndDates[assignedLane] = taskEnd;
      }

      assignments[originalIdx] = assignedLane;
    }

    return { assignments, maxLanes: Math.max(1, laneEndDates.length) };
  };

  // Timeline component for table column
  const TimelineCell = ({ driver }: { driver: any }) => {
    const today = dayjs();
    const laneHeight = 36;
    const taskHeight = 28;
    const taskPaddingTop = 4;

    const { assignments, maxLanes } = assignLanes(driver.utilizations);
    // Minimum height of 80px even when only 1 lane
    const containerHeight = Math.max(
      80,
      maxLanes * laneHeight + taskPaddingTop * 2,
    );

    return (
      <div
        className="timeline-cell"
        style={{
          position: "relative",
          height: containerHeight,
          minWidth: cellWidth * totalDays,
          transition: "background-color 0.2s",
        }}
      >
        {/* Grid cells */}
        <Row style={{ height: "100%" }}>
          {calendarDates.map((date, idx) => {
            const isToday = date.isSame(today, "day");
            return (
              <Col
                key={idx}
                style={{
                  width: cellWidth,
                  borderRight:
                    idx < calendarDates.length - 1
                      ? "1px solid #f0f0f0"
                      : "none",
                  height: "100%",
                  background: isToday
                    ? "#d6e4ff"
                    : idx % 2 === 0
                      ? "#fafafa"
                      : "white",
                }}
              />
            );
          })}
        </Row>

        {/* Task bars overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          {driver.utilizations.map((task: any, idx: number) => {
            const taskStyle = calculateTaskStyle(task);
            const lane = assignments[idx];
            const topOffset =
              maxLanes === 1
                ? (containerHeight - taskHeight) / 2
                : lane * laneHeight + taskPaddingTop;

            // Determine styling based on status
            const getStatusStyle = (status: string) => {
              switch (status?.toUpperCase()) {
                case "RESIGN":
                  return {
                    background: "#8c8c8c",
                    border: "none",
                    color: "white",
                  };
                case "ABSENCE":
                  return {
                    background: "#fff1f0",
                    border: "1.5px solid #ff4d4f",
                    color: "#ff4d4f",
                  };
                case "COACHING":
                  return {
                    background: "#f9f0ff",
                    border: "1.5px solid #722ed1",
                    color: "#722ed1",
                  };
                case "STAND BY":
                  return {
                    background: "#ffffff",
                    border: "1.5px solid #262626",
                    color: "#262626",
                  };
                case "ON JOURNEY":
                default:
                  return {
                    background: "#f6ffed",
                    border: "1.5px solid #73d13d",
                    color: "#73d13d",
                  };
              }
            };

            const statusStyle = getStatusStyle(task.status);

            return (
              <div
                key={idx}
                role="button"
                tabIndex={0}
                style={{
                  position: "absolute",
                  ...taskStyle,
                  top: topOffset,
                  height: taskHeight,
                  background: statusStyle.background,
                  border: statusStyle.border,
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: statusStyle.color,
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  boxSizing: "border-box",
                }}
                onClick={() => handleOpenTaskModal(task)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleOpenTaskModal(task);
                  }
                }}
              >
                {task.status || "Delivery"}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Custom calendar header
  const CalendarHeader = () => {
    const today = dayjs();
    const isSameMonth = start.isSame(end, "month");
    const headerText = isSameMonth
      ? start.format("MMM YYYY")
      : `${start.format("MMM YYYY")} - ${end.format("MMM YYYY")}`;

    return (
      <div style={{ textAlign: "center", padding: "8px 0" }}>
        <Typography.Text>{headerText}</Typography.Text>
        <Row style={{ marginTop: 8 }}>
          {calendarDates.map((date, idx) => {
            const isToday = date.isSame(today, "day");
            return (
              <Col
                key={idx}
                style={{
                  width: cellWidth,
                  textAlign: "center",
                  borderRight:
                    idx < calendarDates.length - 1
                      ? "1px solid #f0f0f0"
                      : "none",
                  padding: "4px 0",
                  background: isToday ? "#d6e4ff" : "transparent",
                }}
              >
                <div style={{ fontSize: 12, color: "#666" }}>
                  {date.format("ddd")}
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>
                  {date.format("D")}
                </div>
              </Col>
            );
          })}
        </Row>
      </div>
    );
  };

  const columns = [
    {
      title: "No",
      dataIndex: "no",
      fixed: "left" as const,
    },
    {
      title: "Drivers",
      dataIndex: "driverName",
      fixed: "left" as const,
      render: (_: any, record: any) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ flex: 1 }}>
            <Typography.Text>{record.driverName}</Typography.Text>
            {record.employeeId && (
              <div>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  {record.vkvd} - {record.employeeId}
                </Typography.Text>
              </div>
            )}
          </div>
          <DetailOutlined
            style={{ fontSize: 16, cursor: "pointer" }}
            onClick={() => handleOpenModal(record)}
          />
        </div>
      ),
    },
    {
      title: "Branch",
      dataIndex: "branchName",
      fixed: "left" as const,
    },
    {
      title: "Driver Type",
      dataIndex: "employeeStatus",
      fixed: "left" as const,
      align: "center",
      render: (v: string) => <Tag color="blue">{v}</Tag>,
    },
    {
      title: <CalendarHeader />,
      dataIndex: "timeline",
      width: cellWidth * totalDays,
      render: (_: any, record: any) => <TimelineCell driver={record} />,
    },
  ];

  useEffect(() => {
    if (driver?.getDetails?.data) {
      setSelectedDriver(driver.getDetails.data);
    }
  }, [driver?.getDetails?.data]);

  const legendItems = [
    {
      label: "Stand By",
      background: "#ffffff",
      border: "1.5px solid #262626",
      color: "#262626",
    },
    {
      label: "On Journey",
      background: "#f6ffed",
      border: "1.5px solid #73d13d",
      color: "#73d13d",
    },
    {
      label: "Absence",
      background: "#fff1f0",
      border: "1.5px solid #ff4d4f",
      color: "#ff4d4f",
    },
    {
      label: "Coaching",
      background: "#f9f0ff",
      border: "1.5px solid #722ed1",
      color: "#722ed1",
    },
  ];

  return (
    <div className={styles["gantt-container"]}>
      {/* TABLE */}
      <Table
        columns={columns}
        dataSource={mappedDrivers}
        scroll={{ x: "max-content" }}
        current={driverGantCharts.options?.page}
        total={driverGantCharts.options?.totalData ?? 0}
        rowKey={(row: any) => `${row.no}`}
        pageSize={driverGantCharts.options?.limit}
        onPageChange={onPageChange}
        loading={loading}
      />

      {/* LEGEND */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginTop: 12,
          flexWrap: "wrap",
        }}
      >
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          Legend:
        </Typography.Text>
        {legendItems.map((item) => (
          <div
            key={item.label}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <div
              style={{
                width: 32,
                height: 16,
                background: item.background,
                border: item.border,
                borderRadius: 4,
              }}
            />
            <Typography.Text style={{ fontSize: 12, color: "#595959" }}>
              {item.label}
            </Typography.Text>
          </div>
        ))}
      </div>

      <DriverDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedDriver={selectedDriver}
        getContainer={getContainer}
      />

      <TaskDetailModal
        isOpen={isTaskModalOpen}
        onClose={handleCloseTaskModal}
        selectedTask={selectedTask}
        getContainer={getContainer}
      />
    </div>
  );
};

export default GantChart;
