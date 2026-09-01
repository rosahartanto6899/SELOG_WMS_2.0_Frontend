import { render } from "@testing-library/react";

import HeaderMenu from "./header-menu";

describe("HeaderMenu", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const DEFAULT_PROPS = {
    menuData: [],
  };

  it("renders empty component", () => {
    const { container } = render(<HeaderMenu />);
    expect(container).toBeInTheDocument();
  });

  it("renders component with default props", () => {
    const { container } = render(<HeaderMenu {...DEFAULT_PROPS} />);
    expect(container).toBeInTheDocument();
  });
});
