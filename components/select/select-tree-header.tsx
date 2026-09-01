import { Checkbox, Col, Row, TreeSelectProps, Typography } from "antd";
import React from "react";

export interface SelectTreeHeaderProps extends TreeSelectProps {
  onSelectAll: () => void;
  onClearSelection: () => void;
  selectAll: { indeterminate: boolean; checked: boolean };
}

const SelectTreeHeader = (props: SelectTreeHeaderProps) => {
  const { onSelectAll, onClearSelection, selectAll } = props;

  return (
    <div className="sera-select-tree-header">
      <Row justify="space-between" align="middle">
        <Col>
          <Checkbox
            id="select-all"
            indeterminate={selectAll.indeterminate}
            onChange={() => onSelectAll()}
            checked={selectAll.checked}
          >
            Select All
          </Checkbox>
        </Col>
        <Col>
          <Typography.Link
            type="danger"
            onClick={() => onClearSelection()}
            disabled={!selectAll.indeterminate && !selectAll.checked}
          >
            Clear
          </Typography.Link>
        </Col>
      </Row>
    </div>
  );
};

export default SelectTreeHeader;
