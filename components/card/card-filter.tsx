import { Card } from "antd";

const CardFilter = ({ children }: { children: React.ReactNode }) => {
  return (
    <Card
      style={{
        zIndex: 10, // ponytail: cukup di atas konten sticky; JANGAN >1000 (mask Modal antd), dulu 1002 bikin filter nembus modal
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
