import { TreeSelect, TreeSelectProps } from "antd";

import SelectTreeHeader from "./select-tree-header";

export interface SelectTreeProps extends TreeSelectProps {
  onSelectAll: () => void;
  onClearSelection: () => void;
  dataSource: {
    title: string;
    value: number | string;
    key: number;
    className: string;
  }[];
  selectAll: { indeterminate: boolean; checked: boolean };
}

const SelectTree = (props: SelectTreeProps) => {
  const { onChange, dataSource, onSelectAll, onClearSelection, selectAll } =
    props;

  return (
    <TreeSelect
      {...props}
      className="sera-select-tree"
      treeNodeFilterProp="title"
      showSearch
      treeDefaultExpandAll
      treeCheckable
      maxTagCount={0}
      onChange={onChange}
      maxTagPlaceholder={(omittedValues) => `${omittedValues.length} Selected`}
      dropdownRender={(menu) => (
        <>
          <SelectTreeHeader
            selectAll={selectAll}
            onSelectAll={onSelectAll}
            onClearSelection={onClearSelection}
          />
          {menu}
        </>
      )}
      treeData={dataSource}
    />
  );
};

export default SelectTree;
