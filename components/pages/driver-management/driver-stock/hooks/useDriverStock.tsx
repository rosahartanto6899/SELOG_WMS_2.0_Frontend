"use client";

import {
  businessAreaActions,
  useAppDispatch,
  useAppSelector,
} from "@sera-redux";
import { driverStockActions } from "@sera-redux/slices/driver-stock.slice";
import { shipmentTypesActions } from "@sera-redux/slices/shipment-types.slice";
import {
  ISummaryResponseDriverBranch,
  ISummaryResponseDriverInOutData,
  ISummaryResponseDriverTotal,
  IUpdateNotePayload,
} from "@sera-types/driver-stock.type";
import { NUMBER_FORMAT } from "@sera-utils/constants/common";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

const useDriverStock = () => {
  const dispatch = useAppDispatch();

  const router = useRouter();

  const {
    getSummary,
    data: listData,
    isLoading,
    options,
    getDetails,
    getFilterOption,
    updateNote,
  } = useAppSelector((state) => state.driverStock);

  const { dropdownBusinessAreas, isLoading: loadingBranch } = useAppSelector(
    (state) => state.businessAreas,
  );
  const { data: shipmentTypeData, isLoading: loadingShipmentType } =
    useAppSelector((state) => state.shipmentTypes);

  const RemapSummary = () => {
    const DATA_COLUMNS = useMemo(() => {
      const _data = getSummary.data.driverData ?? {};
      const _branches = _data?.driverBranches ?? [];
      const _total = _data?.driverTotal ?? {};

      return [
        { key: "pkwt", indicator: "PKWT" },
        { key: "mitra", indicator: "Mitra" },
        { key: "total", indicator: "Total" },
        { key: "ratioPkwt", indicator: "Ratio PKWT" },
      ]?.map((_item) => ({
        indicator: _item?.indicator,
        ..._branches.reduce((_prev: { [_key: string]: string }, _branch) => {
          if (_branch?.branchName) {
            _prev[_branch.branchName] =
              _item?.key === "ratioPkwt"
                ? `${Math.round(Number(_branch?.ratioPkwt) || 0)}%`
                : NUMBER_FORMAT(
                    _branch?.[_item?.key as keyof ISummaryResponseDriverBranch],
                  );
          }

          return _prev;
        }, {}),
        total: NUMBER_FORMAT(
          _total?.[_item?.key as keyof ISummaryResponseDriverTotal],
        ),
      }));
    }, [getSummary.data.driverData]);

    return DATA_COLUMNS;
  };

  const RemapInAndOut = () => {
    const DATA_COLUMNS = useMemo(() => {
      const _inOut = getSummary.data.driverInOutData ?? {};

      const months = Array.from({ length: 12 }, (_, i) => {
        return dayjs().month(i).format("MMM");
      });

      return [
        { key: "pkwtIn", indicator: "PKWT In" },
        { key: "pkwtOut", indicator: "PKWT Out" },
        { key: "mitraIn", indicator: "Mitra In" },
        { key: "mitraOut", indicator: "Mitra Out" },
        { key: "total", indicator: "Total" },
      ]?.map((_item) => ({
        indicator: _item?.indicator,
        ..._inOut.reduce((_prev: { [_key: string]: string }, _inout) => {
          if (_inout?.month) {
            _prev[months[_inout.month - 1]] = NUMBER_FORMAT(
              _inout?.[_item?.key as keyof ISummaryResponseDriverInOutData],
            );
          }

          return _prev;
        }, {}),
      }));
    }, [getSummary.data.driverInOutData]);

    return DATA_COLUMNS;
  };

  const goBack = () => router.push("/driver-management/driver-stock/");

  const fetchBranch = () => {
    dispatch(businessAreaActions.getDropdownBusinessAreasFetch({}));
  };

  const fetchShipmentType = () => {
    dispatch(shipmentTypesActions.getShipmentTypesFetch());
  };

  const fetchSummary = (payload: any) => {
    dispatch(driverStockActions.getSummaryFetch(payload));
  };

  const fetchList = (payload: any) => {
    dispatch(driverStockActions.getListFetch(payload));
  };

  const fetchById = (id: string) => {
    dispatch(driverStockActions.getByIdFetch({ id }));
  };

  const fetchFilter = () => dispatch(driverStockActions.getFilterFetch());

  const updateNotes = (payload: IUpdateNotePayload, callback?: () => void) =>
    dispatch(driverStockActions.updateNoteByIdFetch({ payload, callback }));

  return {
    queries: {
      fetchSummary,
      fetchBranch,
      fetchShipmentType,
      fetchList,
      fetchFilter,
      fetchById,
      updateNotes,
    },
    data: {
      listData,
      rawSummary: getSummary.data,
      summary: RemapSummary(),
      inAndOut: RemapInAndOut(),
      detailsData: getDetails.data,
      dropdownBusinessAreas,
      shipmentTypeData,
      filterOption: getFilterOption.data,
    },
    loading: {
      loadingList: isLoading,
      loadingSummary: getSummary.isLoading,
      loadingBranch,
      loadingShipmentType,
      loadingFilterOption: getFilterOption.isLoading,
      loadingDetails: getDetails.isLoading,
      loadingUpdateNote: updateNote?.isLoading,
    },
    pagination: options,
    events: {
      goBack,
    },
  };
};

export default useDriverStock;
