import { useTranslation } from "react-i18next";

export const UNCHECK_LIST = [
  "B",
  "H",
  "J",
  "K",
  "M",
  "N",
  "O",
  "Q",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "AA",
  "BB",
  "CC",
];

export const ColumnsList = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "emptyMiles.table.column",
  });

  return [
    {
      key: "no",
      dataIndex: "no",
      title: "No",
      fixed: "left",
      width: 60,
      align: "center",
      exception: true,
    },
    {
      key: "A",
      dataIndex: "A",
      title: t("A"),
      fixed: "left",
    },
    {
      key: "B",
      dataIndex: "B",
      title: t("B"),
      fixed: "left",
    },
    {
      key: "C",
      dataIndex: "C",
      title: t("C"),
      fixed: "left",
    },
    {
      key: "D",
      dataIndex: "D",
      title: t("D"),
      fixed: "left",
    },
    {
      key: "E",
      dataIndex: "E",
      title: t("E"),
    },
    {
      key: "F",
      dataIndex: "F",
      title: t("F"),
      align: "left",
    },
    {
      key: "G",
      dataIndex: "G",
      title: t("G"),
      align: "left",
    },
    {
      key: "H",
      dataIndex: "H",
      title: t("H"),
      align: "left",
    },
    {
      key: "I",
      dataIndex: "I",
      title: t("I"),
      align: "left",
    },
    {
      key: "J",
      dataIndex: "J",
      title: t("J"),
      align: "left",
    },
    {
      key: "K",
      dataIndex: "K",
      title: t("K"),
      align: "left",
    },
    {
      key: "L",
      dataIndex: "L",
      title: t("L"),
      align: "left",
    },
    {
      key: "M",
      dataIndex: "M",
      title: t("M"),
      align: "left",
    },
    {
      key: "N",
      dataIndex: "N",
      title: t("N"),
      align: "left",
    },
    {
      key: "O",
      dataIndex: "O",
      title: t("O"),
      align: "left",
    },
    {
      key: "P",
      dataIndex: "P",
      title: t("P"),
      align: "left",
    },
    {
      key: "Q",
      dataIndex: "Q",
      title: t("Q"),
      align: "left",
    },
    {
      key: "R",
      dataIndex: "R",
      title: t("R"),
      align: "left",
    },
    {
      key: "S",
      dataIndex: "S",
      title: t("S"),
      align: "left",
    },
    {
      key: "T",
      dataIndex: "T",
      title: t("T"),
      align: "left",
    },
    {
      key: "U",
      dataIndex: "U",
      title: t("U"),
      align: "left",
    },
    {
      key: "V",
      dataIndex: "V",
      title: t("V"),
      align: "left",
    },
    {
      key: "W",
      dataIndex: "W",
      title: t("W"),
      align: "left",
    },
    {
      key: "X",
      dataIndex: "X",
      title: t("X"),
      align: "left",
    },
    {
      key: "Y",
      dataIndex: "Y",
      title: t("Y"),
      align: "left",
    },
    {
      key: "AA",
      dataIndex: "AA",
      title: t("AA"),
      align: "left",
    },
    {
      key: "BB",
      dataIndex: "BB",
      title: t("BB"),
      align: "left",
    },
    {
      key: "CC",
      dataIndex: "CC",
      title: t("CC"),
      align: "left",
    },
  ];
};

export const DriversSearchByOptions = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "emptyMiles.table.options",
  });

  return [
    { label: t("0"), value: "A" },
    { label: t("1"), value: "B" },
    { label: t("2"), value: "C" },
    { label: t("3"), value: "D" },
    { label: t("4"), value: "E" },
  ];
};
