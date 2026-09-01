import { render } from "@testing-library/react";

import Tabs from "../tabs";

describe("Typography", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders without loading", () => {
    const { container } = render(<Tabs items={[]} />);
    expect(container).toBeInTheDocument();
  });
});
