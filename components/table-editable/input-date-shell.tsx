/* eslint-disable jsx-a11y/no-autofocus */
import { DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

interface InputDateShellProps {
  isDate?: boolean;
  isTime?: boolean;
  value: string;
  onBlur: () => void;
  onSave: (_value: string) => void;
}

export default function InputDateShell({
  isDate,
  isTime,
  value,
  onBlur,
  onSave,
}: InputDateShellProps) {
  // time-only → TimePicker HH:mm; date+time → gabungan; date → YYYY-MM-DD
  if (isTime && !isDate) {
    const _parsed = value ? dayjs(value, ["HH:mm:ss", "HH:mm"]) : undefined;
    return (
      <TimePicker
        format="HH:mm"
        value={_parsed?.isValid() ? _parsed : undefined}
        open
        autoFocus
        needConfirm
        onOk={(_value) => {
          onSave(_value?.format("HH:mm"));
        }}
        onOpenChange={(open) => {
          if (!open) onBlur();
        }}
      />
    );
  }

  const _format = `YYYY-MM-DD${isTime ? " HH:mm" : ""}`;

  return (
    <DatePicker
      id="table-editable-datepicker"
      style={{ width: 200 }}
      value={value ? dayjs(value, _format, true) : undefined}
      format={_format}
      showTime={!!isDate && !!isTime}
      open
      autoFocus
      onChange={(_value) => {
        onSave(_value?.format(_format) ?? undefined);
      }}
      onOpenChange={(open) => {
        if (!open) onBlur();
      }}
    />
  );
}
