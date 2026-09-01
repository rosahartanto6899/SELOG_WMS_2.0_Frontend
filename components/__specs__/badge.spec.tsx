import { render } from "@testing-library/react";

import Badge from "../badge";

describe("Badge", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders without loading", () => {
    const { container } = render(<Badge count={5}>Content</Badge>);
    const badge = container.querySelector(".ant-badge");
    expect(badge).toBeInTheDocument();
  });

  it("renders with loading", () => {
    const { container } = render(
      <Badge loading count={5}>
        Content
      </Badge>,
    );
    const skeleton = container.querySelector(".ant-skeleton");
    expect(skeleton).toBeInTheDocument();
  });

  // Add more test cases as needed
});
