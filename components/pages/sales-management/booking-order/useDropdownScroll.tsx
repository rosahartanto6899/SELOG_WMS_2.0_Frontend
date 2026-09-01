import { isEmpty, isEqual } from "lodash";
import { useEffect, useRef, useState } from "react";
interface DropdownProps {
  label: string;
  value: string;
  [key: string]: any;
}

interface DropdownHookProps {
  getData: (payload: { page: number; limit: number }) => void;
  sourceData: DropdownProps[];
  sourceOptions: {
    page?: number;
    totalData?: number;
  };
  dropdownPayload: {
    page: number;
    limit: number;
    [key: string]: any;
  };
  prevent?: boolean;
}

const useDropdownScroll = (props: DropdownHookProps) => {
  const {
    getData,
    dropdownPayload,
    sourceData,
    sourceOptions,
    prevent = false,
  } = props;

  const [dropdown, setDropdown] = useState<DropdownProps[]>([]);
  const prevSourceData = useRef<DropdownProps[] | null>(null);

  useEffect(() => {
    if (prevent) return;
    getData(dropdownPayload);
  }, [dropdownPayload]);

  useEffect(() => {
    if (prevent) return;
    if (isEmpty(sourceData)) return;
    if (isEqual(prevSourceData.current, sourceData)) return;

    setDropdown((prev) => {
      if (sourceOptions?.page === 1) return sourceData;
      return prev.concat(sourceData);
    });

    prevSourceData.current = sourceData;
  }, [sourceOptions?.page, sourceData]);

  return { dropdown };
};

export default useDropdownScroll;
