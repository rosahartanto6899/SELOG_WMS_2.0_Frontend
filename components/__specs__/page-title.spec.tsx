import { useRouter } from "next/router";

import { render } from "../../utils/test-utils";
import { MOCK_USE_ROUTER } from "../../utils/test-utils/commons/redux";
import PageTitle from "../page-title";

jest.mock("next/router", () => ({
  ...jest.requireActual("next/router"),
  useRouter: jest.fn(),
}));

describe("PageTitle", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const DEFAULT_PROPS = {};

  it("renders empty component", () => {
    (useRouter as jest.Mock).mockReturnValue(MOCK_USE_ROUTER);
    const { container } = render(<PageTitle {...DEFAULT_PROPS} />);
    expect(container).toBeInTheDocument();
  });
});
