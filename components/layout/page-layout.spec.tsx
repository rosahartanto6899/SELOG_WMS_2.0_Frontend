import { render } from "@testing-library/react";

import PageLayout from "./page-layout";

describe("PageLayout", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const DEFAULT_PROPS = {
    content: "",
    header: "",
  };

  it("renders empty component", () => {
    const { container } = render(<PageLayout />);
    expect(container).toBeInTheDocument();
  });

  it("renders component with default props", () => {
    const { container } = render(<PageLayout {...DEFAULT_PROPS} />);
    expect(container).toBeInTheDocument();
  });

  it("renders component with default props, heightAuto and withTab", () => {
    const { container } = render(<PageLayout {...DEFAULT_PROPS} withTab />);
    expect(container).toBeInTheDocument();
  });
});
