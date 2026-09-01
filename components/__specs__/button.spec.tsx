import { render } from "@testing-library/react";

import Button from "../button";

describe("Button", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("scene-sera-button-1 : renders a button without variant", () => {
    const { getByText } = render(
      <Button id="scene-sera-button-1">Click me</Button>,
    );
    const button = getByText("Click me");
    expect(button).toBeInTheDocument();
  });

  it("scene-sera-button-2 : renders a primary-outlined button with tooltip", () => {
    const { getByText } = render(
      <Button
        id="scene-sera-button-2"
        variant="primary-outlined"
        tooltip="Tooltip Text"
      >
        Click me
      </Button>,
    );
    const button = getByText("Click me");
    expect(button).toBeInTheDocument();
  });

  it("scene-sera-button-3 : renders an icon-blue button with tooltip", () => {
    const { getByText } = render(
      <Button
        id="scene-sera-button-3"
        variant="icon-blue"
        tooltip="Tooltip Text"
      >
        Click me
      </Button>,
    );
    const button = getByText("Click me");
    expect(button).toBeInTheDocument();
  });

  it("scene-sera-button-4 : renders a warning button with tooltip", () => {
    const { getByText } = render(
      <Button id="scene-sera-button-4" warning tooltip="Tooltip Text">
        Click me
      </Button>,
    );
    const button = getByText("Click me");
    expect(button).toBeInTheDocument();
  });
});
