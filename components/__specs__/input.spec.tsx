import { fireEvent, render } from "@testing-library/react";

import Input from "../input";

describe("Input", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders empty component without props", () => {
    const { container } = render(<Input id="input" />);
    expect(container).toBeInTheDocument();
  });

  it("renders with loading", () => {
    const { container } = render(<Input id="input-with-loading" loading />);
    const skeleton = container.querySelector(".ant-skeleton");
    expect(skeleton).toBeInTheDocument();
  });

  it("renders with props suffixInner", () => {
    const { container } = render(
      <Input id="input-with-suffix-inner" suffixInner />,
    );
    expect(container).toBeInTheDocument();
  });

  it("renders with props defaultValue", () => {
    const { container } = render(
      <Input id="input-with-default-value" defaultValue="Test" />,
    );
    expect(container).toBeInTheDocument();
  });

  it("renders with props value", () => {
    const { container } = render(<Input id="input-with-value" value="Test" />);
    expect(container).toBeInTheDocument();
  });

  it("change value input", () => {
    const { getByRole } = render(
      <Input id="input-with-on-change" onChange={jest.fn} />,
    );
    const input = getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "This is value" } });
    expect(input.value).toEqual("This is value");
  });

  it("change value input on onlyNumber", () => {
    const { getByRole } = render(<Input id="input-only-number" onlyNumber />);
    const input = getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "abc" } });
    expect(input.value).toEqual("");
    fireEvent.change(input, { target: { value: 123 } });
    expect(input.value).toEqual("123");
  });

  it("change value input on onlyNumber2", () => {
    const { getByRole } = render(<Input id="input-only-number-2" onlyNumber />);
    const input = getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "abc" } });
    expect(input.value).toEqual("");
    fireEvent.change(input, { target: { value: 123 } });
    expect(input.value).toEqual("123");
  });
});
