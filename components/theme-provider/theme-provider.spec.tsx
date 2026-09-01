import { render } from "@testing-library/react";

import ThemeProvider from ".";

describe("ThemeProvider", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<ThemeProvider />);
    expect(baseElement).toBeTruthy();
  });
});
