import { Carousel as AntdCarousel, CarouselProps } from "antd";

import CarouselInsightSkeletons from "./carousel-insights";

const Carousel = (props: CarouselProps) => {
  const { children } = props;
  return <AntdCarousel {...props}>{children}</AntdCarousel>;
};

Carousel.Insights = CarouselInsightSkeletons;

export default Carousel;
