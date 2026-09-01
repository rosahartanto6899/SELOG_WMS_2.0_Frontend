import { render } from "@testing-library/react";

import CardMenu from "./card-menu";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe("Card Menu", () => {
  it("should render successfully", () => {
    const { baseElement } = render(
      <CardMenu title="" description="" icon="" />,
    );
    expect(baseElement).toBeTruthy();
  });
});
