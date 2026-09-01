/* eslint-disable jsx-a11y/no-autofocus */
import { InputNumber } from "antd";

interface InputShellProps {
  value: number;
  onSave: (_value: number) => void;
  isCurrency?: boolean;
}

export default function InputNumberShell({
  value,
  onSave,
  isCurrency,
}: InputShellProps) {
  return (
    <InputNumber
      type="number"
      id="table-editable-input-number"
      style={{ width: 200, border: "1px solid #3A8DDB" }}
      value={value}
      controls={false}
      prefix={isCurrency ? "Rp." : undefined}
      autoFocus
      onBlur={(_event) => {
        _event?.preventDefault();
        onSave(Number(_event?.target?.value) ?? 0);
      }}
      onKeyDown={(_event) => {
        if (_event.key === "Enter") {
          _event.currentTarget.blur();
        }
      }}
    />
  );
}
