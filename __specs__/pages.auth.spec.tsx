import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import {
  MOCK_USE_ROUTER,
  MOCK_USE_SESSION,
} from "../utils/test-utils/commons/redux";

jest.mock("next-auth/react", () => ({
  ...jest.requireActual("next-auth/react"),
  useSession: jest.fn(),
}));
jest.mock("next/router", () => ({
  ...jest.requireActual("next/router"),
  useRouter: jest.fn(),
}));

describe("Page auth", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(MOCK_USE_ROUTER);
    (useSession as jest.Mock).mockReturnValue(MOCK_USE_SESSION);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
