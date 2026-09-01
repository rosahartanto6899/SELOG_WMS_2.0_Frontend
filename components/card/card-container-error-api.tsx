import { Refresh as IconRefresh } from "@sera-components/icons";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

type CardContainerErrorApiHandlerProps = {
  children: ReactNode;
  display?: "flex" | "grid";
  id?: string;
  isError?: boolean;
  isLoading?: boolean;
  onClose?: () => void;
};

const CardContainerErrorApiHandler = ({
  children,
  display = "grid",
  id = "card-container-error-api-handler",
  isError = false,
  isLoading = false,
  onClose,
}: CardContainerErrorApiHandlerProps) => {
  const { t } = useTranslation();

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {children}
      <button
        id={id}
        onClick={onClose}
        style={{
          alignContent: "center",
          backgroundColor: "rgba(50, 50, 50, 0.55)",
          border: "none",
          cursor: "pointer",
          display: isError && !isLoading ? "grid" : "none",
          height: "100%",
          justifyItems: "center",
          left: 0,
          padding: "1rem",
          position: "absolute",
          top: 0,
          width: "100%",
        }}
        type="button"
      >
        {display === "grid" ? (
          <>
            <p
              style={{
                color: "white",
                textAlign: "center",
              }}
            >
              {t("global.error.cardContainer.message")}
            </p>
            <div style={{ margin: "1rem 0" }}>
              <IconRefresh color="white" width="32px" />
            </div>
            <h3
              style={{
                color: "white",
                textAlign: "center",
              }}
            >
              {t("global.error.cardContainer.button")}
            </h3>
          </>
        ) : (
          <p
            style={{
              color: "white",
              margin: "1rem",
              textAlign: "center",
            }}
          >
            {t("global.error.cardContainer.button")}
          </p>
        )}
      </button>
    </div>
  );
};

export default CardContainerErrorApiHandler;
