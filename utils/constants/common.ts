/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from "dayjs";

export const COMMON_CONST = {
  URL_SUBJECT_RESET_PASSWORD: "Reset%20Password",
  URL_SUBJECT_CONTACT_US: "Login%20Customer%20Problem",
};

export const DEFAULT_FORMAT_DATE = "YYYY-MM-DD";
export const FORMAT_DATE_TIME = "YYYY-MM-DD HH:mm";

export const NUMBER_FORMAT = (_value?: string | number) => {
  let _number;

  if (typeof _value === "string") {
    _number = parseFloat(_value.replace(/[^0-9.-]+/g, ""));
  } else if (typeof _value === "number") {
    _number = _value;
  }

  if (!_number || isNaN(_number)) return "0";

  return Math.floor(_number).toLocaleString("id-ID");
};

export const DATE_FORMAT = (
  _value?: string,
  _format = DEFAULT_FORMAT_DATE,
  _fallback = "",
) => {
  if (!_value) return _fallback;
  return dayjs(_value)?.format(_format);
};

export const DATE_TO_FORM = (_value?: string) => {
  if (!_value) return undefined;
  return dayjs(_value);
};

export const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const WEEKS = ["W1", "W2", "W3", "W4", "W5"];

export const DEFAULT_STATE = (_default: any) => ({
  isLoading: false,
  error: null,
  data: _default,
});

export const DEFAULT_STATE_OPTIONS = (_default: any) => ({
  ...DEFAULT_STATE(_default),
  options: {
    page: 1,
    limit: 10,
    totalData: 0,
    totalPage: 0,
    order: null,
    sort: null,
    searchBy: null,
    search: null,
  },
});

export const BRANCH_ORDER = [
  "Head Office",
  "Jakarta",
  "Surabaya",
  "Semarang",
  "Balikpapan",
  "Banjarmasin",
  "Makassar",
  "Intracity",
];

export const AREA_KEY_ORDER = [
  "sumatera",
  "barat",
  "tengah",
  "timur",
  "balnus",
  "kalimantan",
  "sulawesi",
  "papuaMaluku",
];

export const AREA_ORDER = [
  "Sumatera",
  "Barat",
  "Tengah",
  "Timur",
  "Bali Nusra",
  "Kalimantan",
  "Sulawesi",
  "Papua Maluku",
];
