import { useRouter } from "next/router";

import { render, waitFor } from "../../utils/test-utils";
import { MOCK_USE_ROUTER } from "../../utils/test-utils/commons/redux";
import LoginForm from "./login-form";

jest.mock("next/router", () => ({
  ...jest.requireActual("next/router"),
  useRouter: jest.fn(),
}));

describe("LoginForm", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should render successfully", async () => {
    (useRouter as jest.Mock).mockReturnValue(MOCK_USE_ROUTER);
    const { container } = render(<LoginForm />);
    await waitFor(() => {
      expect(container).toBeInTheDocument();
    });
  });
});
