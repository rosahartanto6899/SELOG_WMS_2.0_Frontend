import { fireEvent, render } from "@testing-library/react";

import InputSearch from "./search";

const DEFAULT_PROPS = {
  loading: false,
  placeholder: "test",
};
describe("InputSearch", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders empty component without props", () => {
    const { container } = render(<InputSearch {...DEFAULT_PROPS} />);
    expect(container).toBeInTheDocument();
  });

  it("renders with props defaultValue", () => {
    const { container } = render(
      <InputSearch {...DEFAULT_PROPS} defaultValue="Test" />,
    );
    expect(container).toBeInTheDocument();
  });

  it("renders with props value", () => {
    const { container } = render(
      <InputSearch {...DEFAULT_PROPS} value="Test" />,
    );
    expect(container).toBeInTheDocument();
  });

  it("render", () => {
    const options = [
      {
        label: "Test",
        value: "test",
      },
      {
        label: "Test2",
        value: "test2",
      },
    ];
    const { container } = render(
      <InputSearch {...DEFAULT_PROPS} searchByOptions={options} />,
    );
    expect(container).toBeInTheDocument();
  });

  it("click searchByOptions", () => {
    const options = [
      {
        label: "Test",
        value: "test",
      },
      {
        label: "Test2",
        value: "test2",
      },
    ];
    const { container } = render(
      <InputSearch {...DEFAULT_PROPS} searchByOptions={options} />,
    );
    expect(container).toBeInTheDocument();
  });

  it("calls onSearch when search button is clicked", () => {
    const onSearchMock = jest.fn();
    const { container } = render(
      <InputSearch {...DEFAULT_PROPS} onSearch={onSearchMock} />,
    );
    const searchButton = container.querySelector(
      "#button-search",
    ) as HTMLButtonElement;
    fireEvent.click(searchButton);

    expect(onSearchMock).toHaveBeenCalled();
  });
});
