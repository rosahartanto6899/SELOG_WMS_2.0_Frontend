import { render } from "@testing-library/react";

import TypographyText from "./typography-text";

describe("TypographyText", () => {
  const DEFAULT_PROPS = { loading: false };
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders default component", () => {
    const { container } = render(<TypographyText {...DEFAULT_PROPS} />);
    expect(container).toBeInTheDocument();
  });
});
