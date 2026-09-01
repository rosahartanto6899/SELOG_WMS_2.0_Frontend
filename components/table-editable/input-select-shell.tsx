/* eslint-disable jsx-a11y/no-autofocus */
import Select from "@sera-components/select";

interface InputSelectShellProps {
  value: string;
  dropdown: { id?: string; name?: string }[];
  onBlur: () => void;
  onSave: (_value: string) => void;
}

export default function InputSelectShell({
  value,
  dropdown,
  onBlur,
  onSave,
}: InputSelectShellProps) {
  return (
    <Select
      id="table-editable-select"
      style={{ width: 200 }}
      value={value}
      open
      autoFocus
      onChange={(_value) => {
        onSave(_value ?? undefined);
      }}
      onBlur={(_event) => {
        _event?.preventDefault();
        onBlur();
      }}
      allowClear={false}
    >
      {dropdown.map(({ id, name }) => (
        <Select.Option key={id} value={name}>
          {name}
        </Select.Option>
      ))}
    </Select>
  );
}
