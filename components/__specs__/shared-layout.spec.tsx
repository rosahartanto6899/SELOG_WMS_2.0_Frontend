import { useRouter } from "next/router";

import { render } from "../../utils/test-utils";
import { MOCK_USE_ROUTER } from "../../utils/test-utils/commons/redux";
import SharedLayout from "../shared-layout";

jest.mock("next/router", () => ({
  ...jest.requireActual("next/router"),
  useRouter: jest.fn(),
}));

describe("SharedLayout", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should render successfully", () => {
    (useRouter as jest.Mock).mockReturnValue(MOCK_USE_ROUTER);
    const { container } = render(
      <SharedLayout>
        <span />
      </SharedLayout>,
    );
    expect(container).toBeInTheDocument();
  });
});
