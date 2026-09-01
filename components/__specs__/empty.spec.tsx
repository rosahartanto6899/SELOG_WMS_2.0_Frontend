import { render } from "@testing-library/react";

import Empty from "../empty";

describe("Empty", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders empty component", () => {
    const { container } = render(<Empty>Content</Empty>);
    expect(container).toBeInTheDocument();
  });
});
