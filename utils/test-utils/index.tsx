import { render, RenderOptions } from "@testing-library/react";
import { SessionProvider, useSession } from "next-auth/react";
import React, { ReactElement } from "react";
import { Provider } from "react-redux";

import { makeStore } from "../../redux";
import { MOCK_USE_SESSION } from "./commons/redux";

jest.mock("../permission-utils", () => ({
  __esModule: true,
  ...jest.requireActual("../permission-utils"),
  default: jest.fn(() => ({
    getAccessMenuPermission: jest.fn(() => ({
      data: {
        isCreate: true,
        isDelete: true,
        isUpdate: true,
      },
    })),
    getAccessMenuPermissionRead: jest.fn(),
    getAccessMenus: jest.fn(),
  })),
}));

jest.mock("firebase/firestore", () => ({
  ...jest.requireActual("firebase/firestore"),
  collection: jest.fn(),
  doc: jest.fn(),
  getFirestore: jest.fn(),
  limit: jest.fn(),
  onSnapshot: jest.fn(),
  orderBy: jest.fn(),
  query: jest.fn(),
}));

jest.mock("firebase/app", () => ({
  ...jest.requireActual("firebase/app"),
  initializeApp: jest.fn(),
}));

jest.mock("next-auth/react", () => ({
  ...jest.requireActual("next-auth/react"),
  useSession: jest.fn(),
}));

// Define AllTheProviders component
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const store = makeStore();

  (useSession as jest.Mock).mockReturnValue(MOCK_USE_SESSION);
  return (
    <Provider store={store}>
      <SessionProvider>{children}</SessionProvider>
    </Provider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
