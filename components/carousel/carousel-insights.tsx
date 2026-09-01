import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Carousel, CarouselProps } from "antd";

interface CarouselSkeleton extends CarouselProps {
  isCurrency?: boolean;
}

const breakPoints = (isCurrency?: boolean) =>
  Boolean(isCurrency) ? 4.75 : 6.25;

const generateResponsiveBreakpoints = (
  minSlides: number,
  maxSlides: number,
  minWidth: number,
  maxWidth: number,
  step: number = 50,
) => {
  const breakpoints = [];
  const slideRange = maxSlides - minSlides;
  const widthRange = maxWidth - minWidth;

  for (let width = maxWidth; width >= minWidth; width -= step) {
    const ratio = (width - minWidth) / widthRange;
    const slidesToShow = parseFloat(
      (minSlides + ratio * slideRange).toFixed(2),
    );

    breakpoints.push({
      breakpoint: width,
      settings: {
        slidesToShow,
        slidesToScroll: 1,
      },
    });
  }

  return breakpoints;
};

const CarouselInsightSkeletons = (props: CarouselSkeleton) => {
  const { children, isCurrency } = props;

  const responsiveBreakpoints = generateResponsiveBreakpoints(
    0.25,
    breakPoints(isCurrency),
    300,
    2560,
    50,
  );

  return (
    <div className="carousel-custom-wrapper">
      <Carousel
        slidesToShow={breakPoints(isCurrency)}
        slidesToScroll={1}
        infinite={false}
        dots={false}
        swipe
        draggable
        touchMove
        arrows
        nextArrow={
          <div>
            <Button
              id="next"
              type="default"
              shape="circle"
              icon={<RightOutlined />}
            />
          </div>
        }
        prevArrow={
          <div>
            <Button
              id="prev"
              type="default"
              shape="circle"
              icon={<LeftOutlined />}
            />
          </div>
        }
        responsive={responsiveBreakpoints}
        {...props}
      >
        {children}
      </Carousel>
    </div>
  );
};

export default CarouselInsightSkeletons;
