import Form from "./vod-form";
import InitialPage from "./vod-initial-page";

interface VoDProps {
  children: React.ReactNode;
}

const VoD = ({ children }: VoDProps) => ({
  children,
});

VoD.InitialPage = InitialPage;
VoD.Form = Form;

export default VoD;
