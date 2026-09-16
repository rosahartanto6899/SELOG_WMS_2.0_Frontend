/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FilterStateProps {
  warehouseCodes?: string[];
}

interface FilterProps {
  filter?: FilterStateProps;
  onChangeFilter: (v: any, type: string) => void;
}

/** Filter layar Actual Incoming — placeholder; scope warehouse kini dari
 *  token aktif (Switch Warehouse) di backend, bukan pilihan user. */
const ActualIncomingFilter = (_props: FilterProps) => null;

export default ActualIncomingFilter;
