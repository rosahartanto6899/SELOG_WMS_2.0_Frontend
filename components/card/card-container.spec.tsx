import { render } from "@testing-library/react";

import CardContainer from "./card-container";

describe("Card Container", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<CardContainer />);
    expect(baseElement).toBeTruthy();
  });
});
