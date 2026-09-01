import { render } from "@testing-library/react";

import LoadingPage from "./loading-page";

describe("LoadingPage", () => {
  const DEFAULT_PROPS = { height: "" };
  const EMPTY_PROPS = {};
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders default component", () => {
    const { container } = render(<LoadingPage {...DEFAULT_PROPS} />);
    expect(container).toBeInTheDocument();
  });

  it("renders empty component", () => {
    const { container } = render(<LoadingPage {...EMPTY_PROPS} />);
    expect(container).toBeInTheDocument();
  });
});
