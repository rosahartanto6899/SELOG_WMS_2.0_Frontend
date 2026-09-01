import { render } from "@testing-library/react";

import Carousel from ".";

describe("Carousel", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders empty component", () => {
    const { container } = render(
      <Carousel>
        <div />
      </Carousel>,
    );
    expect(container).toBeInTheDocument();
  });
});
