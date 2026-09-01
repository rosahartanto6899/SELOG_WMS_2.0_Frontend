export interface FieldData {
  name: string | number | (string | number)[];
  value?: any;
  touched?: boolean;
  validating?: boolean;
  errors?: string[];
}

export type RequiredMark = boolean | "optional";
export type ActionMode = "view" | "add" | "edit";
