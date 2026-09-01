import React from "react";

import {
  AddDetailsIcon,
  AddLocAdHocIcon,
  AddLocCheckPointIcon,
  AddLocCicoPoolIcon,
  AddLocSubPoolIcon,
  AddLocVendorIcon,
  Approval,
  ArrowLeftFill,
  ArrowRight,
  ArrowRightFill,
  ArrowUpToRight,
  Attendance,
  BarChartOutlined,
  BlockClipboard,
  BookEdit,
  BookShelf,
  BrowserSecurity,
  Building,
  Calendar,
  Car,
  CarOutlined,
  CheckIcon,
  ClockIcon,
  CloseIcon,
  ColumnIcon,
  CustomerManagement,
  CustomerOrder,
  Dashboard,
  DataGraph,
  Delete,
  DeleteOutlined,
  DeleteUndoIcon,
  DetailMapView,
  Device,
  Download,
  DriversData,
  Edit,
  EditOutlined,
  EditPencilIcon,
  ExpeditionOrder,
  File,
  FileCheckedIcon,
  FileCopiedIcon,
  FileDelete,
  FileDeleted,
  FileRemoveIcon,
  Gear,
  Headset,
  History,
  HistoryLogIcon,
  IdHumanIcon,
  ImageLandscape,
  Internet,
  JourneyMonitoring,
  LayerIcon,
  LoadingCircle,
  LogisArchive,
  LogisCurvy,
  LogisDashboard,
  LogisFile,
  LogisTarget,
  LogisTruck,
  LogisUserMultiple,
  LogisWallet,
  MapIcon,
  MapPin,
  MapPoi,
  MarkerIcon,
  MoreHorizontal,
  NotificationOutlined,
  Order,
  OrgHierarchy,
  Pin,
  PinPointIcon,
  Plus,
  PointOfInterest,
  PopupIcon,
  Product,
  ProfileOutlined,
  Recruitment,
  Report,
  RestrictedAccessIcon,
  Search,
  Setting,
  Sleep,
  StockManagement,
  Storage,
  Store,
  StoreMenu,
  Support,
  ThirdPartyManagement,
  TrainingManagement,
  TriangleWarning,
  TriangleWarningFilledIcon,
  TripExpense,
  UserBlock,
  UserCheck,
  UserFrameIcon,
  UserHome,
  UserLocationIcon,
  UserPlacementIcon,
  Users,
  UserSignal,
  UserSquare,
  Vehicle,
  VehicleBreakdown,
  VehicleFree,
  VehicleMissing,
  VehicleOnContract,
  VehicleOnDuty,
  Vehicles,
  VehicleUnavailable,
  Wallet,
  Wrench,
  ZoomInIcon,
  ZoomOutIcon,
} from ".";

type DynamicIconProps = {
  type: string;
  style?: any;
};

const DynamicIcon = (props: DynamicIconProps) => {
  const { type, style } = props;

  switch (type) {
    case "LayerIcon":
      return <LayerIcon style={style} />;
    case "AddDetailsIcon":
      return <AddDetailsIcon style={style} />;
    case "AddLocAdHocIcon":
      return <AddLocAdHocIcon style={style} />;
    case "AddLocCheckPointIcon":
      return <AddLocCheckPointIcon style={style} />;
    case "AddLocCicoPoolIcon":
      return <AddLocCicoPoolIcon style={style} />;
    case "AddLocSubPoolIcon":
      return <AddLocSubPoolIcon style={style} />;
    case "AddLocVendorIcon":
      return <AddLocVendorIcon style={style} />;
    case "Approval":
      return <Approval style={style} />;
    case "ArrowLeftFill":
      return <ArrowLeftFill style={style} />;
    case "ArrowRightFill":
      return <ArrowRightFill style={style} />;
    case "ArrowRight":
      return <ArrowRight style={style} />;
    case "ArrowUpToRight":
      return <ArrowUpToRight style={style} />;
    case "Attendance":
      return <Attendance style={style} />;
    case "BarChartOutlined":
      return <BarChartOutlined style={style} />;
    case "BlockClipboard":
      return <BlockClipboard style={style} />;
    case "BookEdit":
      return <BookEdit style={style} />;
    case "BookShelf":
      return <BookShelf style={style} />;
    case "BrowserSecurity":
      return <BrowserSecurity style={style} />;
    case "Building":
      return <Building style={style} />;
    case "Calendar":
      return <Calendar style={style} />;
    case "Car":
      return <Car style={style} />;
    case "CarOutlined":
      return <CarOutlined style={style} />;
    case "CheckIcon":
      return <CheckIcon style={style} />;
    case "ClockIcon":
      return <ClockIcon style={style} />;
    case "CloseIcon":
      return <CloseIcon style={style} />;
    case "ColumnIcon":
      return <ColumnIcon style={style} />;
    case "CustomerManagement":
      return <CustomerManagement style={style} />;
    case "CustomerOrder":
      return <CustomerOrder style={style} />;
    case "Dashboard":
      return <Dashboard style={style} />;
    case "DataGraph":
      return <DataGraph style={style} />;
    case "DeleteOutlined":
      return <DeleteOutlined style={style} />;
    case "DeleteUndoIcon":
      return <DeleteUndoIcon style={style} />;
    case "DetailMapView":
      return <DetailMapView style={style} />;
    case "Device":
      return <Device style={style} />;
    case "Delete":
      return <Delete style={style} />;
    case "Download":
      return <Download style={style} />;
    case "DriversData":
      return <DriversData style={style} />;
    case "EditOutlined":
      return <EditOutlined style={style} />;
    case "Edit":
      return <Edit style={style} />;
    case "EditPencilIcon":
      return <EditPencilIcon style={style} />;
    case "ExpeditionOrder":
      return <ExpeditionOrder style={style} />;
    case "FileCheckedIcon":
      return <FileCheckedIcon style={style} />;
    case "FileCopiedIcon":
      return <FileCopiedIcon style={style} />;
    case "FileDelete":
      return <FileDelete style={style} />;
    case "FileDeleted":
      return <FileDeleted style={style} />;
    case "FileRemoveIcon":
      return <FileRemoveIcon style={style} />;
    case "File":
      return <File style={style} />;
    case "Gear":
      return <Gear style={style} />;
    case "Headset":
      return <Headset style={style} />;
    case "History":
      return <History style={style} />;
    case "HistoryLogIcon":
      return <HistoryLogIcon style={style} />;
    case "IdHumanIcon":
      return <IdHumanIcon style={style} />;
    case "ImageLandscape":
      return <ImageLandscape style={style} />;
    case "Internet":
      return <Internet style={style} />;
    case "JourneyMonitoring":
      return <JourneyMonitoring style={style} />;
    case "LoadingCircle":
      return <LoadingCircle style={style} />;
    case "MapPin":
      return <MapPin style={style} />;
    case "MapPoi":
      return <MapPoi style={style} />;
    case "MapIcon":
      return <MapIcon style={style} />;
    case "MarkerIcon":
      return <MarkerIcon style={style} />;
    case "MoreHorizontal":
      return <MoreHorizontal style={style} />;
    case "NotificationOutlined":
      return <NotificationOutlined style={style} />;
    case "Order":
      return <Order style={style} />;
    case "OrgHierarchy":
      return <OrgHierarchy style={style} />;
    case "Pin":
      return <Pin style={style} />;
    case "PinPointIcon":
      return <PinPointIcon style={style} />;
    case "Plus":
      return <Plus style={style} />;
    case "PointOfInterest":
      return <PointOfInterest style={style} />;
    case "PopupIcon":
      return <PopupIcon style={style} />;
    case "Product":
      return <Product style={style} />;
    case "ProfileOutlined":
      return <ProfileOutlined style={style} />;
    case "Recruitment":
      return <Recruitment style={style} />;
    case "Report":
      return <Report style={style} />;
    case "RestrictedAccessIcon":
      return <RestrictedAccessIcon style={style} />;
    case "Search":
      return <Search style={style} />;
    case "Setting":
      return <Setting style={style} />;
    case "Sleep":
      return <Sleep style={style} />;
    case "StockManagement":
      return <StockManagement style={style} />;
    case "StoreMenu":
      return <StoreMenu style={style} />;
    case "Storage":
      return <Storage style={style} />;
    case "Store":
      return <Store style={style} />;
    case "Support":
      return <Support style={style} />;
    case "ThirdPartyManagement":
      return <ThirdPartyManagement style={style} />;
    case "TrainingManagement":
      return <TrainingManagement style={style} />;
    case "TriangleWarningFilledIcon":
      return <TriangleWarningFilledIcon style={style} />;
    case "TriangleWarning":
      return <TriangleWarning style={style} />;
    case "TripExpense":
      return <TripExpense style={style} />;
    case "UserBlock":
      return <UserBlock style={style} />;
    case "UserCheck":
      return <UserCheck style={style} />;
    case "UserFrameIcon":
      return <UserFrameIcon style={style} />;
    case "UserHome":
      return <UserHome style={style} />;
    case "UserLocationIcon":
      return <UserLocationIcon style={style} />;
    case "UserPlacementIcon":
      return <UserPlacementIcon style={style} />;
    case "Users":
      return <Users style={style} />;
    case "UserSignal":
      return <UserSignal style={style} />;
    case "UserSquare":
      return <UserSquare style={style} />;
    case "Vehicle":
      return <Vehicle style={style} />;
    case "VehicleBreakdown":
      return <VehicleBreakdown style={style} />;
    case "VehicleFree":
      return <VehicleFree style={style} />;
    case "VehicleMissing":
      return <VehicleMissing style={style} />;
    case "VehicleOnContract":
      return <VehicleOnContract style={style} />;
    case "VehicleOnDuty":
      return <VehicleOnDuty style={style} />;
    case "VehicleUnavailable":
      return <VehicleUnavailable style={style} />;
    case "Vehicles":
      return <Vehicles style={style} />;
    case "Wallet":
      return <Wallet style={style} />;
    case "Wrench":
      return <Wrench style={style} />;
    case "ZoomInIcon":
      return <ZoomInIcon style={style} />;
    case "ZoomOutIcon":
      return <ZoomOutIcon style={style} />;
    case "LogisDashboard":
      return <LogisDashboard style={style} />;
    case "LogisTruck":
      return <LogisTruck style={style} />;
    case "LogisFile":
      return <LogisFile style={style} />;
    case "LogisUserMultiple":
      return <LogisUserMultiple style={style} />;
    case "LogisCurvy":
      return <LogisCurvy style={style} />;
    case "LogisTarget":
      return <LogisTarget style={style} />;
    case "LogisWallet":
      return <LogisWallet style={style} />;
    case "LogisArchive":
      return <LogisArchive style={style} />;

    default:
      return <ArrowUpToRight style={style} />;
  }
};

export default DynamicIcon;
