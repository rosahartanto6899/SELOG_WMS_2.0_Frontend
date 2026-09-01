import { render } from "@testing-library/react";

import CardContainerFormAction from "./card-container-form-action";

describe("CardContainerFormAction", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders component with empty props value", () => {
    const { container } = render(<CardContainerFormAction />);
    expect(container).toBeInTheDocument();
  });

  it("renders component with empty props values", () => {
    const { container } = render(
      <CardContainerFormAction>
        <span>Test</span>
      </CardContainerFormAction>,
    );

    expect(container).toBeInTheDocument();
  });
});
