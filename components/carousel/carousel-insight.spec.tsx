import { render } from "@testing-library/react";

import CarouselInsightSkeleton from "./carousel-insights";

describe("CarouselInsightSkeleton", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders empty component", () => {
    const { container } = render(
      <CarouselInsightSkeleton>
        <div />
      </CarouselInsightSkeleton>,
    );
    expect(container).toBeInTheDocument();
  });
});
