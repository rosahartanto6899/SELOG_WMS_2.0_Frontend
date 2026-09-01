import { render } from "@testing-library/react";

import ModalConfirm from "./modal-confirm";

describe("ModalConfirm", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<ModalConfirm />);
    expect(baseElement).toBeTruthy();
  });
});
