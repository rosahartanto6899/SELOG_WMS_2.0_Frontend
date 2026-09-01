import "@testing-library/jest-dom";

import { act, render } from "@testing-library/react";

import RecoverPasswordForm from "./recover-password-form";

describe("RecoverPasswordForm", () => {
  beforeAll(() => {
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
  });

  it("should render correctly <RecoverPasswordForm>", async () => {
    let wrapper = null;
    act(() => {
      wrapper = render(<RecoverPasswordForm />);
    });

    expect(wrapper).toBeTruthy();
  });
});
