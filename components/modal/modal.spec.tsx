import { render } from "@testing-library/react";

import Modal from ".";

describe("Modal", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<Modal id="modal" />);
    expect(baseElement).toBeTruthy();
  });
});
