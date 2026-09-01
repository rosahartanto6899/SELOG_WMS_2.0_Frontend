import { Card } from "antd";

const CardFilter = ({ children }: { children: React.ReactNode }) => {
  return (
    <Card
      style={{
        zIndex: 1002,
        position: "sticky",
        top: 0,
        maxWidth: "max-content",
      }}
    >
      {children}
    </Card>
  );
};

export default CardFilter;
