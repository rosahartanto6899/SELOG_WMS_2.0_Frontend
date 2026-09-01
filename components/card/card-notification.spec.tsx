import { render } from "@testing-library/react";

import CardNotification from "./card-notification";

describe("CardNotification", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const today = new Date();
  const DEFAULT_PROPS = {
    description: "Card description",
    title: "Card title",
    timestamp: today.toISOString(),
    onClick: jest.fn(),
  };

  const TYPE_LIST = [
    "alert",
    "announcement",
    "approval",
    "system",
    "transaction",
  ];

  it("renders component with empty props value", () => {
    const emptyProps = {
      title: "",
      timestamp: "",
      description: "",
    };

    TYPE_LIST.forEach((type) => {
      const { container } = render(
        <CardNotification {...emptyProps} type={type as any} />,
      );
      expect(container).toBeInTheDocument();
    });
  });

  it("renders component with filled props value", () => {
    TYPE_LIST.forEach((type) => {
      const { container } = render(
        <CardNotification {...DEFAULT_PROPS} type={type as any} />,
      );
      expect(container).toBeInTheDocument();
    });

    // Reset duration mock
    today.setDate(today.getDate() + 1);
    DEFAULT_PROPS.timestamp = today.toISOString();
    TYPE_LIST.forEach((type) => {
      const { container } = render(
        <CardNotification {...DEFAULT_PROPS} type={type as any} />,
      );
      expect(container).toBeInTheDocument();
    });
  });
});
