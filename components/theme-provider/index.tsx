import { ConfigProvider, ThemeConfig } from "antd";
import { createContext, ReactNode, useContext, useMemo } from "react";

import Empty from "../empty";
import { defaultTheme } from "./theme";

type IThemeProviderProps = {
  children?: ReactNode;
};

const ThemeContext = createContext({});
const ThemeProvider = (props: IThemeProviderProps) => {
  const { children } = props;
  const providerValue = useMemo(() => ({}), []);
  const theme: ThemeConfig = useMemo(() => defaultTheme, []);

  return (
    <ThemeContext.Provider value={providerValue}>
      <ConfigProvider theme={theme} renderEmpty={() => <Empty />}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeProvider = () => useContext(ThemeContext);

export default ThemeProvider;
