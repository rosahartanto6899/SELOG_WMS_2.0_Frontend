/* eslint-disable jsx-a11y/no-autofocus */
import { DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

/**
 * Parse toleran: coba tiap format kandidat dulu (strict) — baris yang belum
 * pernah diedit masih tersimpan format kanonik "YYYY-MM-DD" dari hasil parse
 * Excel awal, sedangkan baris yang sudah diedit lewat picker ini tersimpan
 * "DD-MON-YYYY" — lalu biarkan dayjs coba deteksi sendiri sebagai fallback
 * terakhir. Kalau semua gagal → undefined (field kosong), bukan menampilkan
 * "Invalid Date" yang membingungkan.
 */
function parseLenient(value: string, formats: string[]) {
  if (!value) return undefined;
  for (const fmt of formats) {
    const strict = dayjs(value, fmt, true);
    if (strict.isValid()) return strict;
  }
  const fallback = dayjs(value);
  return fallback.isValid() ? fallback : undefined;
}

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
  // time-only → TimePicker HH:mm; date+time → gabungan; date → DD-MON-YYYY
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
          // UI cuma pilih jam:menit (tanpa kolom detik) — detik selalu :00.
          onSave(_value?.format("HH:mm:ss"));
        }}
        onOpenChange={(open) => {
          if (!open) onBlur();
        }}
      />
    );
  }

  // Format yang ditampilkan & disimpan saat pilih tanggal lewat picker ini —
  // "DD-MON-YYYY" (mis. 07-NOV-2022), bukan "YYYY-MM-DD".
  const _timeSuffix = isTime ? " HH:mm" : "";
  const _displayFormat = `DD-MMM-YYYY${_timeSuffix}`;
  const _legacyCanonicalFormat = `YYYY-MM-DD${_timeSuffix}`;

  return (
    <DatePicker
      id="table-editable-datepicker"
      style={{ width: 200 }}
      value={parseLenient(value, [_displayFormat, _legacyCanonicalFormat])}
      format={_displayFormat}
      showTime={!!isDate && !!isTime}
      open
      autoFocus
      onChange={(_value) => {
        onSave(_value?.format(_displayFormat)?.toUpperCase() ?? undefined);
      }}
      onOpenChange={(open) => {
        if (!open) onBlur();
      }}
    />
  );
}
