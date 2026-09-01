/* eslint-disable jsx-a11y/no-autofocus */
import { DatePicker } from "antd";
import dayjs from "dayjs";

interface InputDateShellProps {
  isTime?: boolean;
  value: string;
  onBlur: () => void;
  onSave: (_value: string) => void;
}

export default function InputDateShell({
  isTime,
  value,
  onBlur,
  onSave,
}: InputDateShellProps) {
  const _formatDate = `YYYY-MM-DD${isTime ? " HH:mm" : ""}`;

  return (
    <DatePicker
      id="table-editable-datepicker"
      style={{ width: 200 }}
      value={dayjs(value) ?? undefined}
      format={_formatDate}
      showTime={isTime}
      open
      autoFocus
      onChange={(_value) => {
        onSave(_value?.format(_formatDate) ?? undefined);
      }}
      onOpenChange={(open) => {
        if (!open) onBlur();
      }}
    />
  );
}
