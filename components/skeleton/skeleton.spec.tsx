import { render } from "@testing-library/react";

import Skeleton from ".";

describe("Skeleton", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<Skeleton />);
    expect(baseElement).toBeTruthy();
  });
});
