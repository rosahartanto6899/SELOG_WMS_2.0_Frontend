import { render } from "@testing-library/react";

import Tag from "../tag";

describe("Tag", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const DEFAULT_PROPS = {
    color: "",
    icon: "",
    text: "",
  };

  it("renders empty component", () => {
    const { container } = render(<Tag {...DEFAULT_PROPS} />);
    expect(container).toBeInTheDocument();
  });
});
