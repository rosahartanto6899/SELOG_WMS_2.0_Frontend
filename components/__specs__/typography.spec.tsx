import { render } from "@testing-library/react";

import Typography from "../typography";

describe("Typography", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders without loading", () => {
    const { container } = render(<Typography>Content</Typography>);
    const typography = container.querySelector(".ant-typography");
    expect(typography).toBeInTheDocument();
  });

  it("renders with loading", () => {
    const { container } = render(<Typography loading>Content</Typography>);
    const skeleton = container.querySelector(".ant-skeleton");
    expect(skeleton).toBeInTheDocument();
  });
});
