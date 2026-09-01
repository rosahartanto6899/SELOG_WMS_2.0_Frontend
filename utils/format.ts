import CryptoJS from "crypto-js";
import moment from "moment";

const FormatUtils = () => {
  function stringToTitleCase(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function dateTransform(dateStr: string, format?: string) {
    if (!dateStr) return "-";
    return moment(dateStr).format(format ?? "DD MMM YYYY");
  }

  function dateTimeTransform(dateStr: string, format?: string) {
    if (!dateStr) return "-";
    return moment(dateStr).format(format ?? "DD MMM YYYY HH:mm");
  }

  function camelCaseToTitleCase(str: string) {
    return (
      str
        .replace(/([A-Z])/g, " $1")
        .charAt(0)
        .toUpperCase() + str.replace(/([A-Z])/g, " $1").slice(1)
    );
  }

  function reverseDateDMY(dateStr: string) {
    try {
      if (dateStr === undefined) return "-";
      const parseDate = dateStr.split("/");
      const day = parseDate[0];
      const month = parseDate[1];
      const year = parseDate[2];

      return `${year}-${month}-${day}`;
    } catch {
      return "";
    }
  }

  function setToFixed(value: number) {
    if (!value) {
      return 0;
    }

    return value % 1 !== 0
      ? value.toLocaleString("id", { maximumFractionDigits: 2 })
      : value;
  }

  function createRandomInteger() {
    const randomNumber = CryptoJS.lib.WordArray.random(4);
    const randomHex = CryptoJS.enc.Hex.stringify(randomNumber);
    return parseInt(randomHex, 16);
  }

  function formatCurrency(str: string | number, nom: boolean = true) {
    // return `Rp${str.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')}`;
    const result = [];
    const numStr = str.toString();
    for (let i = numStr.length - 1, j = 0; i >= 0; i--, j++) {
      if (j > 0 && j % 3 === 0) {
        result.unshift(".");
      }
      result.unshift(numStr[i]);
    }
    return `${nom ? "" : "-"}Rp. ${result.join("")}`;
  }

  function formatInputCurrency(_value: string) {
    if (!_value) return "";

    const parts = _value.toString().split(",");
    let numStr = parts[0].replace(/\./g, "");

    if (numStr.length > 1 && numStr.startsWith("0")) {
      numStr = numStr.slice(1);
    }

    const result = [];
    for (let i = numStr.length - 1, j = 0; i >= 0; i--, j++) {
      if (j > 0 && j % 3 === 0) {
        result.unshift(".");
      }
      result.unshift(numStr[i]);
    }

    return parts.length > 1
      ? result.join("") + "," + parts[1].slice(0, 2)
      : result.join("");
  }

  function formatNumberPlain(value: number | string) {
    const str = String(value);

    if (str.includes(",")) return str;

    const n = Math.round(Number(str));
    if (Number.isNaN(n)) return str;

    const sign = n < 0 ? "-" : "";
    let s = String(Math.abs(n));
    const parts: string[] = [];

    while (s.length > 3) {
      parts.unshift(s.slice(-3));
      s = s.slice(0, -3);
    }
    if (s.length) parts.unshift(s);

    return sign + parts.join(".");
  }

  return {
    stringToTitleCase,
    dateTransform,
    dateTimeTransform,
    camelCaseToTitleCase,
    reverseDateDMY,
    setToFixed,
    createRandomInteger,
    formatCurrency,
    formatInputCurrency,
    formatNumberPlain,
  };
};

export default FormatUtils;
