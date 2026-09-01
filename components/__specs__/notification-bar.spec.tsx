import { render } from "../../utils/test-utils";
import NotificationBar from "../notification-bar";

describe("NotificationBar", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const onClose = jest.fn();
  it("should render successfully", () => {
    const { container } = render(
      <NotificationBar onClose={onClose} open={false} />,
    );
    expect(container).toBeInTheDocument();
  });
});
