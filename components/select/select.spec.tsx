import { render } from "@testing-library/react";

import Select from ".";

describe("Select", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<Select id="select" />);
    expect(baseElement).toBeTruthy();
  });
});
