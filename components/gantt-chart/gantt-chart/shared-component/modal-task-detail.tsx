import Modal from "@sera-components/modal";
import Typography from "@sera-components/typography";
import { Col, Row, Tag } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTask: any;
  getContainer?: () => HTMLElement;
}

const TaskDetailModal = ({
  isOpen,
  onClose,
  selectedTask,
  getContainer,
}: TaskDetailModalProps) => {
  return (
    <Modal
      title="Status Details"
      centered
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={600}
      getContainer={getContainer || (() => document.body)}
    >
      {selectedTask && (
        <div>
          <Row gutter={[0, 0]}>
            <Col
              span={24}
              style={{ background: "#fafafa", padding: "8px 16px" }}
            >
              <Row>
                <Col span={8}>
                  <Typography.Text type="secondary">
                    Driver Name
                  </Typography.Text>
                </Col>
                <Col span={16}>
                  <Typography.Text>
                    {selectedTask.driverName || "-"}
                  </Typography.Text>
                </Col>
              </Row>
            </Col>
            <Col span={24} style={{ padding: "8px 16px" }}>
              <Row>
                <Col span={8}>
                  <Typography.Text type="secondary">
                    Personal ID
                  </Typography.Text>
                </Col>
                <Col span={16}>
                  <Typography.Text>
                    {selectedTask.employeeId || "-"}
                  </Typography.Text>
                </Col>
              </Row>
            </Col>
            <Col
              span={24}
              style={{ background: "#fafafa", padding: "8px 16px" }}
            >
              <Row>
                <Col span={8}>
                  <Typography.Text type="secondary">NRP</Typography.Text>
                </Col>
                <Col span={16}>
                  <Typography.Text>{selectedTask.vkvd || "-"}</Typography.Text>
                </Col>
              </Row>
            </Col>
            <Col span={24} style={{ padding: "8px 16px" }}>
              <Row>
                <Col span={8}>
                  <Typography.Text type="secondary">
                    Contract Type
                  </Typography.Text>
                </Col>
                <Col span={16}>
                  <Typography.Text>
                    {selectedTask.employeeStatus || "-"}
                  </Typography.Text>
                </Col>
              </Row>
            </Col>
            <Col
              span={24}
              style={{ background: "#fafafa", padding: "8px 16px" }}
            >
              <Row>
                <Col span={8}>
                  <Typography.Text type="secondary">Status</Typography.Text>
                </Col>
                <Col span={16}>
                  <Tag
                    color={
                      selectedTask.status?.toUpperCase() === "ABSENCE"
                        ? "red"
                        : selectedTask.status?.toUpperCase() === "COACHING"
                          ? "purple"
                          : selectedTask.status?.toUpperCase() === "STAND BY"
                            ? "default"
                            : selectedTask.status?.toUpperCase() === "RESIGN"
                              ? "default"
                              : "green"
                    }
                  >
                    {selectedTask.status || "-"}
                  </Tag>
                </Col>
              </Row>
            </Col>
            <Col span={24} style={{ padding: "8px 16px" }}>
              <Row>
                <Col span={8}>
                  <Typography.Text type="secondary">
                    Description
                  </Typography.Text>
                </Col>
                <Col span={16}>
                  <Typography.Text>{selectedTask.label || "-"}</Typography.Text>
                </Col>
              </Row>
            </Col>
            {selectedTask.status?.toUpperCase() === "ON JOURNEY" ? (
              <>
                <Col span={24} style={{ padding: "8px 16px" }}>
                  <Row>
                    <Col span={8}>
                      <Typography.Text type="secondary">ETD</Typography.Text>
                    </Col>
                    <Col span={16}>
                      <Typography.Text>
                        {dayjs
                          .utc(selectedTask.startDate || undefined)
                          .isValid() && selectedTask.startDate
                          ? dayjs
                              .utc(selectedTask.startDate)
                              .format("DD MMMM YYYY HH:mm") + " WIB"
                          : "-"}
                      </Typography.Text>
                    </Col>
                  </Row>
                </Col>
                <Col
                  span={24}
                  style={{ background: "#fafafa", padding: "8px 16px" }}
                >
                  <Row>
                    <Col span={8}>
                      <Typography.Text type="secondary">ETA</Typography.Text>
                    </Col>
                    <Col span={16}>
                      {selectedTask.endDate ? (
                        <Typography.Text>
                          {dayjs
                            .utc(selectedTask.endDate)
                            .format("DD MMMM YYYY HH:mm")}{" "}
                          WIB
                        </Typography.Text>
                      ) : (
                        "-"
                      )}
                    </Col>
                  </Row>
                </Col>
              </>
            ) : (
              <>
                <Col
                  span={24}
                  style={{ background: "#fafafa", padding: "8px 16px" }}
                >
                  <Row>
                    <Col span={8}>
                      <Typography.Text type="secondary">
                        Start Date
                      </Typography.Text>
                    </Col>
                    <Col span={16}>
                      <Typography.Text>
                        {dayjs
                          .utc(selectedTask.startDate)
                          .format("DD MMMM YYYY HH:mm")}{" "}
                        WIB
                      </Typography.Text>
                    </Col>
                  </Row>
                </Col>
                <Col span={24} style={{ padding: "8px 16px" }}>
                  <Row>
                    <Col span={8}>
                      <Typography.Text type="secondary">
                        End Date
                      </Typography.Text>
                    </Col>
                    <Col span={16}>
                      {selectedTask.endDate ? (
                        <Typography.Text>
                          {dayjs
                            .utc(selectedTask.endDate)
                            .format("DD MMMM YYYY HH:mm")}{" "}
                          WIB
                        </Typography.Text>
                      ) : (
                        "-"
                      )}
                    </Col>
                  </Row>
                </Col>
              </>
            )}
          </Row>
        </div>
      )}
    </Modal>
  );
};

export default TaskDetailModal;
