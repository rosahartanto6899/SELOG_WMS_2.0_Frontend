import {
  DeviceStatusType,
  DriverStatusType,
  UserLogsType,
  UserStatusType,
  VehicleStatusType,
} from "./types";

const SettingsUtils = () => {
  function getUserStatus(status: UserStatusType) {
    if (status) {
      return "Active";
    }
    if (!status) {
      return "Non Active";
    }

    return "";
  }

  function getUserStatusColor(status: UserStatusType) {
    if (status) {
      return "#0EC642";
    }
    if (!status) {
      return "#FF4D4F";
    }
    return "#000";
  }

  function getGeofenceStatus(status: number) {
    if (status === 0) {
      return "normal";
    }
    if (status === 1) {
      return "red zone";
    }

    return status;
  }

  function getGeofenceStatusColor(status: number) {
    if (status === 0) {
      return "#808080";
    }
    if (status === 1) {
      return "#DB223D";
    }
    return "#000";
  }

  function getGeofenceStatusName(status: number) {
    if (status === 0) {
      return "low";
    }
    if (status === 1) {
      return "medium";
    }
    if (status === 2) {
      return "high";
    }

    return status;
  }

  function getGeofenceLevelBorder(status: string | number) {
    if (status === 0) {
      return "#FFD600";
    }
    if (status === 1) {
      return "#F47920";
    }
    if (status === 2) {
      return "#BE1E2D";
    }
    return "";
  }

  function getVehiclePairingName(status: number) {
    if (status === 0) {
      return "-";
    }
    if (status === 1) {
      return "vehicle";
    }

    return status;
  }

  function getVehiclePairingColor(status: number) {
    if (status === 0) {
      return "nonpairing";
    }
    if (status >= 1) {
      return "paired";
    }
    return "";
  }

  function getRoleStatus(status: number) {
    if (status === 0) {
      return "Deleted";
    }
    if (status === 1) {
      return "In-Progress";
    }
    if (status === 2) {
      return "Completed";
    }
    if (status === 3) {
      return "Fail";
    }
    if (status === 4) {
      return "Draft";
    }

    return "";
  }

  function getUserLogsColor(activity: UserLogsType) {
    switch (activity) {
      case "add":
        return "#1CA841";
      case "edit":
        return "#FFD600";
      case "delete":
        return "#F52C48";

      default:
        return "#B7B5B5";
    }
  }

  function getDeviceStatusColor(status: DeviceStatusType) {
    switch (status) {
      case "active":
        return "#1CA841";
      case "inactive":
        return "#BE1E2D";
      case "retire":
        return "#B7B5B5";
      case "deletion":
        return "#000";

      default:
        return "#B7B5B5";
    }
  }

  function getDeviceTagStatusColor(status: DeviceStatusType) {
    switch (status) {
      case "active":
        return "success";
      case "pending":
      case "unasigned":
        return "default";
      default:
        return "default";
    }
  }

  function getDeviceStatusText(status: string | number | undefined) {
    switch (status) {
      case 0:
      case "0":
        return "deactive";
      case 1:
      case "1":
        return "active";
      case 2:
      case "2":
        return "deletion";
      case 3:
      case "3":
        return "retire";
      default:
        return "no status";
    }
  }

  function getVehicleStatusColor(status: VehicleStatusType) {
    switch (status) {
      case false:
        return "error";
      case true:
        return "success";
      default:
        return "error";
    }
  }

  function getVehicleStatusText(status: VehicleStatusType) {
    switch (status) {
      case false:
        return "Inactive";
      case true:
        return "Active";
      default:
        return "Inactive";
    }
  }

  function getImeiOBDStatusColor(status: boolean) {
    if (status === true) {
      return "success";
    }

    if (status === false) {
      return "error";
    }

    return "default";
  }

  function getDriverStatusColor(status: DriverStatusType) {
    if (status === "Active" || status === "Yes") {
      return "#0EC642";
    }

    return "#FF4D4F";
  }

  function getVehicleAssociateStatusColor(imeiOBDNumber: string) {
    if (imeiOBDNumber) {
      return "success";
    }

    return "error";
  }

  function getVehicleAssociateStatusText(imeiOBDNumber: string) {
    if (imeiOBDNumber) {
      return "Associate";
    }

    return "Disassociate";
  }

  function getVehicleOBDStatusColor(statusOBD: string) {
    if (statusOBD === "Activated") {
      return "success";
    }

    return "error";
  }

  return {
    getUserStatus,
    getUserStatusColor,
    getRoleStatus,
    getUserLogsColor,
    getDeviceStatusColor,
    getDeviceTagStatusColor,
    getVehicleStatusColor,
    getVehicleStatusText,
    getDeviceStatusText,
    getGeofenceStatus,
    getGeofenceStatusColor,
    getGeofenceLevelBorder,
    getGeofenceStatusName,
    getVehiclePairingName,
    getVehiclePairingColor,
    getImeiOBDStatusColor,
    getDriverStatusColor,
    getVehicleAssociateStatusColor,
    getVehicleAssociateStatusText,
    getVehicleOBDStatusColor,
  };
};

export default SettingsUtils;
