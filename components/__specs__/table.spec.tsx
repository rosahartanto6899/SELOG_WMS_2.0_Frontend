import { render } from "@testing-library/react";

import Table from "../table";

describe("Table", () => {
  const DEFAULT_PROPS = {
    autoCompleteItems: [],
    className: "",
    columns: [],
    current: 1,
    dataSource: [],
    loadingRows: 1,
    pageSize: 1,
    rowClassName: "",
    scroll: {},
    searchByOptions: [],
    searchByPlaceholder: "",
    rowKey: "",
    total: 1,
    title: "",

    // customSearch: any,
    defaultExpandAllRows: true,
    isCustomSearch: true,
    loading: true,
    loadingRender: true,
    multipleDelete: true,
    search: true,
    showActions: true,
    showHeader: true,
    showPagination: true,
    showSearch: true,
    showTitle: true,

    // actions: ReactNode,
    // additionalHeader: ReactNode,

    getCheckboxProps: jest.fn(),
    onClearAutoComplete: jest.fn(),
    onClearSearch: jest.fn(),
    onDeleteSelectedRows: jest.fn(),
    onPageChange: jest.fn(),
    onShowSizeChange: jest.fn(),
    onSearchChange: jest.fn(),
    onSearching: jest.fn(),
    onSelectedRowsChange: jest.fn(),
    onTableChange: jest.fn(),
  };

  const EMPTY_PROPS = {};
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders empty component without loading", () => {
    const { container } = render(<Table {...EMPTY_PROPS} />);
    const skeleton = container.querySelector(".sera-skeleton-table");
    expect(skeleton).not.toBeInTheDocument();
    expect(container).toBeInTheDocument();
  });

  it("renders empty component with loading", () => {
    const { container } = render(<Table {...EMPTY_PROPS} loading />);

    const skeleton = container.querySelector(".sera-skeleton-table");
    expect(skeleton).toBeInTheDocument();
  });

  it("renders component with defaultProps", () => {
    const { container } = render(<Table {...DEFAULT_PROPS} />);
    expect(container).toBeInTheDocument();
  });
});
