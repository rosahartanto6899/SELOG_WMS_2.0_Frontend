interface RibbonProps {
  label: string;
  type: "success" | "danger";
  variant?: "light";
}

export const Ribbon = ({ label, type, variant }: RibbonProps) => {
  function getBackgroundColor() {
    if (type === "success") return variant === "light" ? "#D5F5E3" : "";
    if (type === "danger") return variant === "light" ? "#FADBD8" : "";
    return "";
  }

  return (
    <div
      style={{
        width: "max-content",
        padding: "2px 8px",
        background: getBackgroundColor(),
        borderRadius: "4px",
      }}
    >
      {label}
    </div>
  );
};
