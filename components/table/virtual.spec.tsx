import { render } from "@testing-library/react";

import VirtualTable from "./virtual";

describe("VirtualTable", () => {
  const DEFAULT_PROPS = {
    bordered: true,
    columns: [],
    dropdownPrefixCls: "",
    handleRetryCreate: jest.fn(),
    onChange: jest.fn(),
    onSubmitEdit: jest.fn(),
    showSorterTooltip: true,
    upperCaseValue: true,
    onSubmitting: false,
  };

  const EMPTY_PROPS = {
    columns: [],
    handleRetryCreate: jest.fn(),
    onSubmitEdit: jest.fn(),
    onSubmitting: false,
  };
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders empty component", () => {
    const { container } = render(<VirtualTable {...EMPTY_PROPS} />);
    const skeleton = container.querySelector(".sera-skeleton-table");
    expect(skeleton).not.toBeInTheDocument();
    expect(container).toBeInTheDocument();
  });

  it("renders component with defaultProps", () => {
    const { container } = render(<VirtualTable {...DEFAULT_PROPS} />);
    expect(container).toBeInTheDocument();
  });
});
