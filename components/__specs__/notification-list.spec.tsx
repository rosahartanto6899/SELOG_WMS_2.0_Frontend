import { render } from "../../utils/test-utils";
import NotificationList from "../notification-list";

describe("NotificationList", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should render successfully", () => {
    const { container } = render(<NotificationList />);
    expect(container).toBeInTheDocument();
  });
});
