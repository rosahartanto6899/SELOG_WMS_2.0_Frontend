import Form from "./jmp-form";
import InitialPage from "./jmp-initial-page";

interface JMPProps {
  children: React.ReactNode;
}

const JMP = ({ children }: JMPProps) => ({
  children,
});

JMP.InitialPage = InitialPage;
JMP.Form = Form;

export default JMP;
