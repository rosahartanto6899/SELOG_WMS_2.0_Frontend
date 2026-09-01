import { render } from "../../utils/test-utils";
import Layout from "../layout";

describe("NotificationList", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should render successfully", () => {
    const { container } = render(
      <Layout selectedKeys={[]} defaultOpenKeys={[]}>
        <p>Test</p>
      </Layout>,
    );
    expect(container).toBeInTheDocument();
  });
});
