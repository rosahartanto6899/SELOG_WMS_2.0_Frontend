import Table, { TableProps } from "@sera-components/table";
import MessageHandler from "@sera-libraries/message-handler";
import {
  DriverRecord,
  LicensePlateRecord,
} from "@sera-types/booking-order.type";
import { Modal } from "antd";
import { TableRowSelection } from "antd/es/table/interface";
import { isNil } from "lodash";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { ModalFormProps } from "./booking-form";
import styles from "./booking-order.module.scss";
import { DriverColumns, LicensePlateColumns } from "./booking-props-table";

interface BookingFormModalProps {
  type: "driver" | "licensePlate" | null;
  open: boolean;
  index?: number;
  setModalForm: Dispatch<SetStateAction<ModalFormProps>>;
  value?: string;
  disabledValue?: string[];
  onChange?: (v: React.Key) => void;
}

interface TableConfigProps {
  licensePlate: TableProps;
  driver: TableProps;
}

export const DUMMY_LICENSE_PLATE = [
  {
    no: 1,
    licensePlate: "B 3819 KKA",
    vehicleYear: "2029",
    maintenanceStatus: "In Progress",
    shipmentStatus: "On Shipment",
  },
  {
    no: 2,
    licensePlate: "B 7732 LZP",
    vehicleYear: "2028",
    maintenanceStatus: "Completed",
    shipmentStatus: "Available",
  },
  {
    no: 3,
    licensePlate: "B 9123 YTR",
    vehicleYear: "2030",
    maintenanceStatus: "Pending",
    shipmentStatus: "Awaiting Dispatch",
  },
  {
    no: 4,
    licensePlate: "B 4451 QWE",
    vehicleYear: "2027",
    maintenanceStatus: "Scheduled",
    shipmentStatus: "Idle",
  },
  {
    no: 5,
    licensePlate: "B 6677 HJK",
    vehicleYear: "2026",
    maintenanceStatus: "Completed",
    shipmentStatus: "Delivered",
  },
  {
    no: 6,
    licensePlate: "B 5298 MNB",
    vehicleYear: "2029",
    maintenanceStatus: "In Progress",
    shipmentStatus: "In Transit",
  },
];

export const DUMMY_DRIVER = [
  {
    no: 1,
    driverName: "Danang Eko Nuryanto",
    driverId: "DEK_2025",
    driverStatus: "Available",
    shipmentStatus: "On Shipment",
  },
  {
    no: 2,
    driverName: "Andi Pratama",
    driverId: "APR_2025",
    driverStatus: "Unavailable",
    shipmentStatus: "Completed",
  },
  {
    no: 3,
    driverName: "Budi Santoso",
    driverId: "BST_2025",
    driverStatus: "Available",
    shipmentStatus: "Pending",
  },
  {
    no: 4,
    driverName: "Cahyo Nugroho",
    driverId: "CNG_2025",
    driverStatus: "Available",
    shipmentStatus: "On Shipment",
  },
  {
    no: 5,
    driverName: "Eko Riyadi",
    driverId: "ERY_2025",
    driverStatus: "Unavailable",
    shipmentStatus: "Completed",
  },
  {
    no: 6,
    driverName: "Fajar Hidayat",
    driverId: "FHD_2025",
    driverStatus: "Available",
    shipmentStatus: "Pending",
  },
];

const BookingFormModal = ({
  type,
  open,
  index,
  setModalForm,
  value,
  onChange,
  disabledValue,
}: BookingFormModalProps) => {
  type RecordType = DriverRecord | LicensePlateRecord;
  const { t } = useTranslation(undefined, { keyPrefix: "bookingOrder.table" });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const disabledVal = disabledValue?.filter(Boolean) ?? [];
  const rowSelection: TableRowSelection<RecordType> = {
    type: "radio",
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      if (type === "driver") {
        const driver = selectedRows as DriverRecord[];
        console.log(
          `selectedRowKeys: ${selectedRowKeys}`,
          "selectedRows: ",
          driver,
        );
      }

      if (type === "licensePlate") {
        const license = selectedRows as LicensePlateRecord[];
        console.log(
          `selectedRowKeys: ${selectedRowKeys}`,
          "selectedRows: ",
          license,
        );
      }
    },
    getCheckboxProps: (r: RecordType) => {
      if (type === "driver") {
        let disable = false;
        const row = r as DriverRecord;
        const _disabledVal = disabledVal.filter((o) => o !== value);
        disable = _disabledVal.includes(row.driverName);
        return {
          disabled: disable,
        };
      }
      return {
        disabled: false,
      };
    },
  };

  const TABLE_CONFIG: TableConfigProps = {
    licensePlate: {
      rowKey: "licensePlate",
      columns: LicensePlateColumns(),
      dataSource: DUMMY_LICENSE_PLATE,
    },
    driver: {
      rowKey: "driverName",
      columns: DriverColumns(),
      dataSource: DUMMY_DRIVER,
    },
  };

  const handleClose = () => {
    setModalForm({ open: false, type: null });
    setSelectedRowKeys([]);
  };

  const handleChange = () => {
    if (isNil(index))
      return MessageHandler().error(
        "An error has occured please close and open it again",
      );

    if (onChange) {
      const v = selectedRowKeys[0];
      onChange(v);
    }
    // form.setFieldValue(["detailOrder", index, type], selectedRowKeys[0]);
    // form.validateFields([["detailOrder", index, "licensePlate"]]);
    handleClose();
  };

  useEffect(() => {
    if (!isNil(value) && open && type) {
      setSelectedRowKeys([value]);
    }
  }, [value, open, type]);

  return (
    <Modal
      open={open}
      centered
      width={"80%"}
      onOk={handleChange}
      okButtonProps={{ disabled: !selectedRowKeys.length }}
      onCancel={handleClose}
      closable
      {...(type === "licensePlate"
        ? { title: t("licensePlate.title") }
        : { title: t("driver.title") })}
    >
      <Table
        key={`${type}-${open ? "open" : "closed"}`}
        multipleSelect
        rowSelectionType="radio"
        scroll={{ x: 1000 }}
        rowSelectionCheck={rowSelection}
        rowClassName={(record) => {
          if (type === "driver") {
            const row = record as DriverRecord;
            const _disabledVal = disabledVal.filter((o) => o !== value);
            const disable = _disabledVal.includes(row.driverName);
            if (disable) return styles["table-row-disabled"];
          }
          return "";
        }}
        {...TABLE_CONFIG[type ?? "licensePlate"]}
      />
    </Modal>
  );
};
export default BookingFormModal;
