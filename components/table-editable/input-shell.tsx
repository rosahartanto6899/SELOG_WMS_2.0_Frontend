/* eslint-disable jsx-a11y/no-autofocus */
import Input from "@sera-components/input";

interface InputShellProps {
  value: string;
  onSave: (_value: string) => void;
}

export default function InputShell({ value, onSave }: InputShellProps) {
  return (
    <Input
      id="table-editable-input"
      style={{ width: 200 }}
      value={value}
      autoFocus
      onBlur={(_event) => {
        _event?.preventDefault();
        onSave(_event?.target?.value ?? "");
      }}
      onKeyDown={(_event) => {
        if (_event.key === "Enter") {
          _event.currentTarget.blur();
        }
      }}
    />
  );
}
