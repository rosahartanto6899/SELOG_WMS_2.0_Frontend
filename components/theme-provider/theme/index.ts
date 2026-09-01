import { ThemeConfig } from "antd";

import { colorScheme } from "./color-scheme";

export const defaultTheme: ThemeConfig = {
  token: {
    fontFamily: "var(--font-roboto-sans), sans-serif",
  },
  components: {
    Layout: {
      bodyBg: colorScheme.ESSENTIALS.BACKGROUND,
      siderBg: colorScheme.ESSENTIALS.WHITE,
      headerBg: colorScheme.PRIMARY.MAIN,
      algorithm: true,
    },
    Button: {
      colorPrimary: colorScheme.PRIMARY.MAIN,
      colorPrimaryHover: colorScheme.PRIMARY.MAIN,
      colorPrimaryText: colorScheme.ESSENTIALS.WHITE,
      colorText: colorScheme.PRIMARY.MAIN,
      defaultBorderColor: colorScheme.PRIMARY.MAIN,
      algorithm: true,
    },
    Radio: {
      buttonBg: colorScheme.TEXT.LIGHT,
      buttonSolidCheckedBg: colorScheme.PRIMARY.MAIN,
      buttonSolidCheckedHoverBg: colorScheme.PRIMARY.MAIN,
      algorithm: true,
    },
    Switch: {
      colorPrimary: colorScheme.PRIMARY.MAIN,
      algorithm: true,
    },
    Checkbox: {
      colorPrimary: colorScheme.PRIMARY.MAIN,
      algorithm: true,
    },
    Input: {
      colorBorder: colorScheme.PRIMARY.MAIN,
      colorError: colorScheme.DANGER.MAIN,
      colorTextPlaceholder: colorScheme.TEXT.PLACEHOLDER,
      algorithm: true,
    },
    Select: {
      colorBorder: colorScheme.PRIMARY.MAIN,
      colorTextPlaceholder: colorScheme.TEXT.PLACEHOLDER,
      algorithm: true,
    },
    DatePicker: {
      colorBorder: colorScheme.PRIMARY.MAIN,
      colorError: colorScheme.DANGER.MAIN,
      colorTextPlaceholder: colorScheme.TEXT.PLACEHOLDER,
      algorithm: true,
    },
    Card: {
      headerBg: colorScheme.PRIMARY.MAIN,
      colorTextHeading: colorScheme.TEXT.LIGHT,
      algorithm: true,
    },
    Table: {
      headerBg: colorScheme.TABLE.HEADER.LIGHT.BACKGROUND,
      headerFilterHoverBg: colorScheme.TABLE.HEADER.LIGHT.BACKGROUND,
      headerSortActiveBg: colorScheme.TABLE.HEADER.LIGHT.BACKGROUND,
      headerSortHoverBg: colorScheme.TABLE.HEADER.LIGHT.BACKGROUND,
      headerColor: colorScheme.TABLE.HEADER.LIGHT.COLOR,
    },
  },
};
