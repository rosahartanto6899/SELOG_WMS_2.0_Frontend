import { render } from "@testing-library/react";

import Card from "../card";

describe("Card", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders empty component", () => {
    const { container } = render(<Card>Content</Card>);
    expect(container).toBeInTheDocument();
  });
});
