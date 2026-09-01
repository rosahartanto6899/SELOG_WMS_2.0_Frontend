import {
  BankOutlined,
  CalendarOutlined,
  CarOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  IdcardOutlined,
  PhoneOutlined,
  TruckOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Modal from "@sera-components/modal";
import Typography from "@sera-components/typography";
import { useAppSelector } from "@sera-redux";
import { Col, Divider, Row, Skeleton } from "antd";
import dayjs from "dayjs";
import Link from "next/link";

interface DriverDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDriver: any;
  getContainer?: () => HTMLElement;
}

const DriverDetailModal = ({
  isOpen,
  onClose,
  selectedDriver,
  getContainer,
}: DriverDetailModalProps) => {
  const { getDetails } = useAppSelector((state) => state.driverStock);
  return (
    <Modal
      title="Driver Profile"
      centered
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={900}
      getContainer={getContainer || (() => document.body)}
    >
      <div>
        {/* Header Section */}
        <div
          style={{
            display: "flex",
            gap: 24,
            marginBottom: 32,
            borderBottom: "1px solid #f0f0f0",
            paddingBottom: 24,
          }}
        >
          <div
            style={{
              width: 140,
              height: 140,
              background: "#f5f5f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 4,
            }}
          >
            <UserOutlined style={{ fontSize: 64, color: "#bfbfbf" }} />
          </div>
          <div style={{ flex: 1 }}>
            <Row gutter={[24, 12]}>
              <Col span={6}>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  Driver&apos;s Name
                </Typography.Text>
                <div>
                  {selectedDriver?.employeeName ? (
                    <Typography.Text strong style={{ fontSize: 16 }}>
                      {selectedDriver.employeeName}
                    </Typography.Text>
                  ) : (
                    <Skeleton.Input
                      active
                      size="small"
                      style={{ width: 120, height: 24 }}
                    />
                  )}
                </div>
                {selectedDriver?.id && (
                  <Link
                    href={`/driver-management/driver-stock/${selectedDriver.id}`}
                    id="detail-driver-profile-link"
                    passHref
                  >
                    See Full Driver Profile
                  </Link>
                )}
              </Col>
              <Col span={6}>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  Personal ID
                </Typography.Text>
                <div>
                  {selectedDriver?.employeeId ? (
                    <Typography.Text strong style={{ fontSize: 16 }}>
                      {selectedDriver.employeeId}
                    </Typography.Text>
                  ) : (
                    <Skeleton.Input
                      active
                      size="small"
                      style={{ width: 100, height: 24 }}
                    />
                  )}
                </div>
              </Col>
              <Col span={6}>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  NRP
                </Typography.Text>
                <div>
                  {selectedDriver?.vkvd ? (
                    <Typography.Text strong style={{ fontSize: 16 }}>
                      {selectedDriver.vkvd}
                    </Typography.Text>
                  ) : (
                    <Skeleton.Input
                      active
                      size="small"
                      style={{ width: 80, height: 24 }}
                    />
                  )}
                </div>
              </Col>
              <Col span={6}>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  Branch
                </Typography.Text>
                <div>
                  {selectedDriver?.branchName ? (
                    <Typography.Text strong style={{ fontSize: 16 }}>
                      {selectedDriver.branchName}
                    </Typography.Text>
                  ) : (
                    <Skeleton.Input
                      active
                      size="small"
                      style={{ width: 100, height: 24 }}
                    />
                  )}
                </div>
              </Col>
            </Row>
          </div>
        </div>

        {/* Content Sections */}
        <div style={{ display: "flex", gap: 0 }}>
          {/* General Section */}
          <div style={{ flex: 1, paddingRight: 24 }}>
            <Typography.Title level={5}>General</Typography.Title>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", gap: 12 }}>
                <PhoneOutlined
                  style={{ fontSize: 16, color: "#8c8c8c", marginTop: 2 }}
                />
                <div style={{ flex: 1 }}>
                  <Typography.Text
                    type="secondary"
                    style={{ fontSize: 12, display: "block" }}
                  >
                    Phone Number
                  </Typography.Text>
                  {selectedDriver?.mobilePhone ? (
                    <Typography.Text>
                      {selectedDriver.mobilePhone}
                    </Typography.Text>
                  ) : (
                    <Skeleton.Input
                      active
                      size="small"
                      style={{ width: 120, height: 22 }}
                    />
                  )}
                </div>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <IdcardOutlined
                  style={{ fontSize: 16, color: "#8c8c8c", marginTop: 2 }}
                />
                <div style={{ flex: 1 }}>
                  <Typography.Text
                    type="secondary"
                    style={{ fontSize: 12, display: "block" }}
                  >
                    Driver&apos;s License
                  </Typography.Text>
                  {selectedDriver?.licenseType ? (
                    <Typography.Text>
                      {selectedDriver.licenseType}
                    </Typography.Text>
                  ) : (
                    <Skeleton.Input
                      active
                      size="small"
                      style={{ width: 80, height: 22 }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <Divider type="vertical" style={{ height: "auto" }} />

          {/* Contract Section */}
          <div style={{ flex: 1, paddingLeft: 24, paddingRight: 24 }}>
            <Typography.Title level={5}>Contract</Typography.Title>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", gap: 12 }}>
                <FileTextOutlined
                  style={{ fontSize: 16, color: "#8c8c8c", marginTop: 2 }}
                />
                <div style={{ flex: 1 }}>
                  <Typography.Text
                    type="secondary"
                    style={{ fontSize: 12, display: "block" }}
                  >
                    Contract Type
                  </Typography.Text>
                  {selectedDriver?.employeeStatus ? (
                    <Typography.Text>
                      {selectedDriver.employeeStatus}
                    </Typography.Text>
                  ) : (
                    <Skeleton.Input
                      active
                      size="small"
                      style={{ width: 100, height: 22 }}
                    />
                  )}
                </div>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <CalendarOutlined
                  style={{ fontSize: 16, color: "#8c8c8c", marginTop: 2 }}
                />
                <div style={{ flex: 1 }}>
                  <Typography.Text
                    type="secondary"
                    style={{ fontSize: 12, display: "block" }}
                  >
                    Contract Duration
                  </Typography.Text>
                  {selectedDriver?.startDate && selectedDriver?.endDate ? (
                    <Typography.Text>
                      {dayjs(selectedDriver.startDate).format("YYYY-MM-DD")} -{" "}
                      {dayjs(selectedDriver.endDate).format("YYYY-MM-DD")}
                    </Typography.Text>
                  ) : (
                    <Skeleton.Input
                      active
                      size="small"
                      style={{ width: 150, height: 22 }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <Divider type="vertical" style={{ height: "auto" }} />

          {/* Placement Section */}
          <div style={{ flex: 1, paddingLeft: 24, paddingRight: 24 }}>
            <Typography.Title level={5}>Placement</Typography.Title>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", gap: 12 }}>
                <BankOutlined
                  style={{ fontSize: 16, color: "#8c8c8c", marginTop: 2 }}
                />
                <div style={{ flex: 1 }}>
                  <Typography.Text
                    type="secondary"
                    style={{ fontSize: 12, display: "block" }}
                  >
                    Branch
                  </Typography.Text>
                  {selectedDriver?.branchName ? (
                    <Typography.Text>
                      {selectedDriver.branchName}
                    </Typography.Text>
                  ) : (
                    <Skeleton.Input
                      active
                      size="small"
                      style={{ width: 100, height: 22 }}
                    />
                  )}
                </div>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <CarOutlined
                  style={{ fontSize: 16, color: "#8c8c8c", marginTop: 2 }}
                />
                <div style={{ flex: 1 }}>
                  <Typography.Text
                    type="secondary"
                    style={{ fontSize: 12, display: "block" }}
                  >
                    Shipment Type
                  </Typography.Text>
                  {selectedDriver?.shipmentType ? (
                    <Typography.Text>
                      {selectedDriver.shipmentType}
                    </Typography.Text>
                  ) : (
                    <Skeleton.Input
                      active
                      size="small"
                      style={{ width: 100, height: 22 }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <Divider type="vertical" style={{ height: "auto" }} />

          {/* Ability Section */}
          <div style={{ flex: 1, paddingLeft: 24 }}>
            <Typography.Title level={5}>Ability</Typography.Title>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", gap: 12 }}>
                <EnvironmentOutlined
                  style={{ fontSize: 16, color: "#8c8c8c", marginTop: 2 }}
                />
                <div style={{ flex: 1 }}>
                  <Typography.Text
                    type="secondary"
                    style={{ fontSize: 12, display: "block" }}
                  >
                    Area
                  </Typography.Text>
                  {selectedDriver?.abilityAreas &&
                  selectedDriver?.abilityAreas?.length > 0 ? (
                    <Typography.Text>
                      {selectedDriver.abilityAreas.join(", ")}
                    </Typography.Text>
                  ) : Boolean(getDetails?.isLoading) ? (
                    <Skeleton.Input
                      active
                      size="small"
                      style={{ width: 120, height: 22 }}
                    />
                  ) : (
                    "-"
                  )}
                </div>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <TruckOutlined
                  style={{ fontSize: 16, color: "#8c8c8c", marginTop: 2 }}
                />
                <div style={{ flex: 1 }}>
                  <Typography.Text
                    type="secondary"
                    style={{ fontSize: 12, display: "block" }}
                  >
                    Vehicle
                  </Typography.Text>
                  {selectedDriver?.abilityUnits &&
                  selectedDriver?.abilityUnits?.length > 0 ? (
                    <Typography.Text>
                      {selectedDriver.abilityUnits.join(", ")}
                    </Typography.Text>
                  ) : Boolean(getDetails?.isLoading) ? (
                    <Skeleton.Input
                      active
                      size="small"
                      style={{ width: 120, height: 22 }}
                    />
                  ) : (
                    "-"
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DriverDetailModal;
