import MessageHandler from "@sera-libraries/message-handler";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface VisibilityContextProps {
  isHidden: boolean;
  setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
  enterFullscreen: () => void;
}

export const VisibilityContext = createContext<VisibilityContextProps>({
  isHidden: false,
  setIsHidden: () => false,
  enterFullscreen: () => false,
});

export const useVisibility = (): VisibilityContextProps =>
  useContext(VisibilityContext);

interface VisibilityProviderProps {
  children: ReactNode;
}

export const VisibilityProvider: React.FC<VisibilityProviderProps> = ({
  children,
}) => {
  const errorHandler = MessageHandler().error;
  const { sendErrorHandler } = useErrorHandler(
    "components/layout/layout-context",
  );
  const [isHidden, setIsHidden] = useState<boolean>(false);

  const enterFullscreen = () => {
    if (typeof document !== "undefined") {
      const doc: Document = window.document;
      if (doc.fullscreenEnabled) {
        // which element will be fullscreen
        const iframe = doc.querySelector("body");
        const antdLayoutContent: HTMLElement | null = doc.querySelector(
          ".ant-layout-content",
        );
        if (antdLayoutContent)
          antdLayoutContent.style.setProperty("padding-top", "0");

        // Do fullscreen
        if (iframe) {
          iframe.style.background = "#f6fafd";
          if (iframe.requestFullscreen) iframe.requestFullscreen();
        }
      } else {
        sendErrorHandler(
          "enterFullscreen",
          28,
          "Your browser is not supported",
          errorHandler,
        );
      }
    }
  };

  useEffect(() => {
    const doc: Document = window.document;

    const handleFullscreenChange = () => {
      if (!doc) return;
      if (!doc.fullscreenElement) {
        const antdLayoutContent: HTMLElement | null = doc.querySelector(
          ".ant-layout-content",
        );
        if (antdLayoutContent)
          antdLayoutContent.style.setProperty("padding-top", "6.8rem");
        // Exiting fullscreen
        setIsHidden(false);
      } else setIsHidden(true);
    };
    doc.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      doc.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const contextValue: VisibilityContextProps = useMemo(
    () => ({
      isHidden,
      setIsHidden,
      enterFullscreen,
    }),
    [isHidden, setIsHidden],
  );

  return (
    <VisibilityContext.Provider value={contextValue}>
      {children}
    </VisibilityContext.Provider>
  );
};
