/* eslint-disable @typescript-eslint/no-explicit-any */
import Table from "@sera-components/table";
import { RootState } from "@sera-redux";
import { LoadingState } from "@sera-types/loading.type";
import {
  UnitActivityState,
  unitActivityTypes,
} from "@sera-types/unit-activity";
import { BRANCH_ORDER, NUMBER_FORMAT } from "@sera-utils/constants/common";
import { sum } from "lodash";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import {
  ColumnsMaintenanceStatus,
  MAINTENANCE_LEVEL,
} from "./unit-activities-props-table";

interface TableMaintenanceStatusProps {
  loading: LoadingState;
  unitActivity: UnitActivityState;
}

const TableMaintenanceStatus = ({
  loading,
  unitActivity,
}: TableMaintenanceStatusProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "unitActivities.table.maintenanceStatus",
  });

  const DATA_COLUMNS = useMemo(() => {
    const _branches = unitActivity?.getSummary?.data?.branchNames;
    const _categories = unitActivity?.getSummary?.data?.categories;
    const _data = unitActivity?.getSummary?.data?.maintenanceStatus;

    return _categories?.map((_category) => ({
      category: _category,
      ..._branches
        ?.flatMap((_branch) => {
          return MAINTENANCE_LEVEL?.map((_level) => [_branch, _level]);
        })
        ?.reduce((_prev: any, _item) => {
          const _branch = _item[0];
          const _level = _item[1];
          const _key = _item[0] + _item[1];

          _prev[_key as string] = NUMBER_FORMAT(
            _data?.[_branch]?.[_category]?.[_level?.toLowerCase()],
          );

          return _prev;
        }, {}),
      total: NUMBER_FORMAT(
        sum(_branches?.map((_item) => _data?.[_item]?.[_category]?.total)),
      ),
    }));
  }, [unitActivity?.getSummary?.data]);

  return (
    <Table
      title={t("title")}
      columns={ColumnsMaintenanceStatus({
        branches: BRANCH_ORDER?.map((_branchName) =>
          unitActivity?.getSummary?.data?.branchNames?.find(
            (_item) => _item === _branchName,
          ),
        )?.filter((_item) => _item !== undefined),
      })}
      dataSource={DATA_COLUMNS ?? []}
      rowKey={(row: { category?: string }) => `${row.category}`}
      scroll={{ x: "max-content" }}
      loading={loading[unitActivityTypes.GET_SUMMARY]}
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  unitActivity: state.unitActivity,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TableMaintenanceStatus);
