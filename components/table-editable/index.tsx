/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Table, { TableProps } from "@sera-components/table";
import FormatUtils from "@sera-utils/format";
import { TableColumn } from "@sera-utils/types";
import { isNull } from "lodash";
import { useEffect, useState } from "react";

import InputDateShell from "./input-date-shell";
import InputNumberShell from "./input-number-shell";
import InputSelectShell from "./input-select-shell";
import InputShell from "./input-shell";

export type ActiveEdit = { key: string; index: number };

interface TableEditableProps extends TableProps {
  onSaveAction: (_arg: ActiveEdit & { value: any }) => void;
}

export default function TableEditable({
  onSaveAction,
  columns,
  ...args
}: TableEditableProps) {
  const [newColumns, setNewColumns] = useState<TableColumn | null>(null);
  const [activeEdit, setActiveEdit] = useState<ActiveEdit | null>(null);

  useEffect(() => {
    setNewColumns(
      columns?.map(
        ({
          key,
          render,
          isEditable,
          relatedTo,
          isDate,
          isNumber,
          isTime,
          isCurrency,
          ..._args
        }: any) => ({
          ..._args,
          render: (..._payload: any[]) => {
            if (
              activeEdit?.key === key &&
              activeEdit?.index === _payload?.[2]
            ) {
              if (relatedTo) {
                return (
                  <InputSelectShell
                    value={_payload?.[0]}
                    dropdown={relatedTo ?? []}
                    onSave={(_value) => {
                      setActiveEdit(null);
                      onSaveAction({
                        ...(activeEdit as ActiveEdit),
                        value: _value,
                      });
                    }}
                    onBlur={() => setActiveEdit(null)}
                  />
                );
              }

              if (isDate || isTime) {
                return (
                  <InputDateShell
                    value={_payload?.[0]}
                    onSave={(_value) => {
                      setActiveEdit(null);
                      onSaveAction({
                        ...(activeEdit as ActiveEdit),
                        value: _value,
                      });
                    }}
                    onBlur={() => setActiveEdit(null)}
                    isDate={isDate}
                    isTime={isTime}
                  />
                );
              }

              if (isNumber) {
                return (
                  <InputNumberShell
                    isCurrency={isCurrency}
                    value={_payload?.[0]}
                    onSave={(_value) => {
                      setActiveEdit(null);
                      onSaveAction({
                        ...(activeEdit as ActiveEdit),
                        value: _value,
                      });
                    }}
                  />
                );
              }

              return (
                <InputShell
                  value={_payload?.[0]}
                  onSave={(_value) => {
                    setActiveEdit(null);
                    onSaveAction({
                      ...(activeEdit as ActiveEdit),
                      value: _value,
                    });
                  }}
                />
              );
            }

            const _renderValue = render ? render(..._payload) : _payload?.[0];

            if (isEditable) {
              return (
                <div
                  role="button"
                  tabIndex={0}
                  style={{
                    height: "100%",
                    display: "grid",
                    placeItems: "center",
                  }}
                  onClick={() => {
                    setActiveEdit(
                      isEditable
                        ? {
                            key: key,
                            index: _payload?.[2],
                          }
                        : null,
                    );
                  }}
                >
                  {isCurrency
                    ? FormatUtils().formatCurrency(_renderValue)
                    : _renderValue}
                </div>
              );
            }

            return isCurrency
              ? FormatUtils().formatCurrency(_renderValue)
              : _renderValue;
          },
        }),
      ),
    );
  }, [columns, activeEdit]);

  if (isNull(newColumns)) return null;
  return <Table {...args} columns={newColumns} />;
}
